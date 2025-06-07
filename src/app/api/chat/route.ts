import { NextResponse } from "next/server";
import OpenAI from "openai";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface ConversationData {
  id: string;
  title: string;
  timestamp: Date;
  preview: string;
  messages: Array<{
    role: "user" | "assistant";
    content: string;
  }>;
  completions: string[];
}

interface CompletionWithMetadata {
  metadata?: {
    original_conversation_id?: string;
    continuing_conversation?: string;
    new_conversation?: string;
  };
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages, conversationId, model = "gpt-4o" } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages are required and must be an array" },
        { status: 400 }
      );
    }

    // Add metadata to indicate if this is continuing an existing conversation
    const metadata: Record<string, string> = conversationId
      ? {
          continuing_conversation: "true",
          original_conversation_id: conversationId.toString(),
        }
      : {
          new_conversation: "true",
        };

    const completion = await openai.chat.completions.create({
      model: model,
      messages: messages.map((msg: ChatMessage) => ({
        role: msg.role,
        content: msg.content,
      })),
      temperature: 0.7,
      max_tokens: 500,
      store: true,
      metadata: metadata,
    });

    const message = completion.choices[0]?.message?.content;

    if (!message) {
      throw new Error("No response from OpenAI");
    }

    return NextResponse.json({
      message,
      completionId: completion.id,
      isContinuation: !!conversationId,
      originalConversationId: conversationId,
      modelUsed: model,
    });
  } catch (error) {
    console.error("OpenAI API error:", error);
    return NextResponse.json(
      { error: "Failed to get response from OpenAI" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const order = searchParams.get("order") || "desc";
    const after = searchParams.get("after") || undefined;

    // Retrieve stored chat completions from OpenAI
    const completionsList = await openai.chat.completions.list({
      limit,
      order: order as "asc" | "desc",
      ...(after && { after }),
    });

    // Group completions by conversation
    const conversationMap = new Map<string, ConversationData>();
    const completionToConversation = new Map<string, string>();

    for (const completion of completionsList.data) {
      try {
        // Get the messages for each completion
        const messages = await openai.chat.completions.messages.list(
          completion.id
        );

        // Determine conversation ID
        let conversationId = completion.id; // Default to completion ID

        // Check metadata for conversation grouping
        const completionWithMeta = completion as typeof completion &
          CompletionWithMetadata;
        if (completionWithMeta.metadata?.original_conversation_id) {
          conversationId = completionWithMeta.metadata.original_conversation_id;
        }

        // Try to group by first user message if no metadata
        if (conversationId === completion.id && messages.data.length > 0) {
          const firstUserMessage = messages.data.find(
            (msg) => String(msg.role) === "user"
          );
          if (firstUserMessage?.content) {
            // Look for existing conversation with same first message
            for (const [existingId, convData] of conversationMap.entries()) {
              const firstExistingMsg = convData.messages.find(
                (msg) => String(msg.role) === "user"
              );
              if (firstExistingMsg?.content === firstUserMessage.content) {
                conversationId = existingId;
                break;
              }
            }
          }
        }

        // Store mapping for future reference
        completionToConversation.set(completion.id, conversationId);

        // Get or create conversation entry
        if (!conversationMap.has(conversationId)) {
          conversationMap.set(conversationId, {
            id: conversationId,
            title:
              messages.data[0]?.content?.slice(0, 30) +
                (messages.data[0]?.content &&
                messages.data[0].content.length > 30
                  ? "..."
                  : "") || "Untitled Chat",
            timestamp: new Date(completion.created * 1000),
            preview:
              completion.choices[0]?.message?.content?.slice(0, 50) +
                (completion.choices[0]?.message?.content &&
                completion.choices[0].message.content.length > 50
                  ? "..."
                  : "") || "No content",
            messages: [],
            completions: [],
          });
        }

        const conversation = conversationMap.get(conversationId)!;

        // Add messages from this completion
        const completionMessages = [
          ...messages.data.map((msg) => ({
            role: msg.role as "user" | "assistant",
            content: msg.content || "",
          })),
          {
            role: "assistant" as const,
            content: completion.choices[0]?.message?.content || "",
          },
        ];

        // Merge messages, avoiding duplicates
        for (const newMsg of completionMessages) {
          const isDuplicate = conversation.messages.some(
            (existingMsg) =>
              existingMsg.role === newMsg.role &&
              existingMsg.content === newMsg.content
          );
          if (!isDuplicate) {
            conversation.messages.push(newMsg);
          }
        }

        // Update timestamp to latest
        const completionTime = new Date(completion.created * 1000);
        if (completionTime > conversation.timestamp) {
          conversation.timestamp = completionTime;
        }

        // Track completion IDs
        if (!conversation.completions.includes(completion.id)) {
          conversation.completions.push(completion.id);
        }
      } catch (error) {
        console.error(`Error processing completion ${completion.id}:`, error);
      }
    }

    // Convert map to array and sort by timestamp
    const chatHistory = Array.from(conversationMap.values()).sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return NextResponse.json({
      data: chatHistory,
      hasMore: completionsList.has_more,
    });
  } catch (error) {
    console.error("Error retrieving chat completions:", error);
    return NextResponse.json(
      { error: "Failed to retrieve chat history from OpenAI" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get("id");

    if (!conversationId) {
      return NextResponse.json(
        { error: "Conversation ID is required" },
        { status: 400 }
      );
    }

    // Get all completions to find ones belonging to this conversation
    const completionsList = await openai.chat.completions.list({
      limit: 100, // Increase limit to ensure we get all related completions
    });

    const completionsToDelete: string[] = [];

    // Find all completions that belong to this conversation
    for (const completion of completionsList.data) {
      const completionWithMeta = completion as typeof completion &
        CompletionWithMetadata;

      // Check if this completion belongs to the conversation to delete
      if (
        completion.id === conversationId ||
        completionWithMeta.metadata?.original_conversation_id === conversationId
      ) {
        completionsToDelete.push(completion.id);
      }
    }

    // Delete all related completions
    const deletePromises = completionsToDelete.map((completionId) =>
      openai.chat.completions.delete(completionId)
    );

    await Promise.all(deletePromises);

    return NextResponse.json({
      success: true,
      deletedCount: completionsToDelete.length,
      message: "Conversation deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting conversation:", error);
    return NextResponse.json(
      { error: "Failed to delete conversation" },
      { status: 500 }
    );
  }
}
