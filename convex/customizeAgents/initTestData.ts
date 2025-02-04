import { mutation } from "../_generated/server";
import { MutationCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";

// 创建测试数据
export const initializeTestData = mutation({
  handler: async (ctx: MutationCtx) => {
    try {
      // 创建一个测试 agent
      const testAgentId = await ctx.db.insert("agents", {
        name: "zombie",
        character: "f1",
        identity: "You are a patient math teacher who loves to explain mathematical concepts using real-world examples.",
        plan: "Help students understand mathematics through interactive discussions.",
        createdAt: Date.now(),
      });

      // 把这个 agent 添加到 selectedAgents
      await ctx.db.insert("selectedAgents", {
        agentIds: [testAgentId],
        createdAt: Date.now(),
      });

      return { success: true, message: "Test data initialized", agentId: testAgentId };
    } catch (error) {
      console.error("Failed to initialize test data:", error);
      throw error;
    }
  },
});