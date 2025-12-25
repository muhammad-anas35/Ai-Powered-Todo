import { db } from "@/db";
import { todos } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { createTodoSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

// AI-Specific wrappers for DB operations
// These functions assume the USER ID is already verified by the caller (the Agent/Route)

export const toolsImplementation = (userId: string) => ({
  createTodo: async ({ content, priority = "low" }: { content: string, priority?: string }) => {
    // Validate using the same Zod schema as the main app
    const parsed = createTodoSchema.safeParse({ content, priority });
    
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0].message };
    }

    const { content: validContent, priority: validPriority } = parsed.data;

    const [newTodo] = await db.insert(todos).values({
      userId,
      content: validContent,
      priority: validPriority,
    }).returning();

    revalidatePath("/dashboard");
    return { success: true, todo: newTodo };
  },

  deleteTodo: async ({ id }: { id: string }) => {
    const [deleted] = await db
      .delete(todos)
      .where(and(eq(todos.id, id), eq(todos.userId, userId)))
      .returning();

    revalidatePath("/dashboard");
    
    if (!deleted) {
      return { success: false, error: "Todo not found or unauthorized" };
    }
    return { success: true, id };
  },

  updateTodo: async ({ id, isCompleted }: { id: string, isCompleted: boolean }) => {
    const [updated] = await db
      .update(todos)
      .set({ isCompleted })
      .where(and(eq(todos.id, id), eq(todos.userId, userId)))
      .returning();

    revalidatePath("/dashboard");

    if (!updated) {
      return { success: false, error: "Todo not found or unauthorized" };
    }
    return { success: true, todo: updated };
  },

  getTodos: async () => {
    const data = await db
        .select()
        .from(todos)
        .where(eq(todos.userId, userId))
        .orderBy(desc(todos.createdAt))
        .limit(50); // Reasonable limit for context window
    
    return { success: true, count: data.length, todos: data };
  }
});
