// convex/customizeAgents/test.ts
import { MutationCtx, QueryCtx, mutation, query } from "../_generated/server";
import { Id } from "../_generated/dataModel";
import { Descriptions } from "../../data/characters";

// Test creating and selecting agents
export const testCustomAgents = mutation({
  handler: async (ctx: MutationCtx) => {
    // Step 1: Create test agents
    const testAgents = [
      {
        name: "Test Agent 1",
        character: "Friendly villager",
        identity: "Local farmer",
        plan: "Tend to crops and trade with neighbors"
      },
      {
        name: "Test Agent 2",
        character: "Wandering merchant",
        identity: "Traveling trader",
        plan: "Visit different towns to sell goods"
      }
    ];

    const createdAgentIds: Id<"agents">[] = [];

    // Create agents
    for (const agent of testAgents) {
      const agentId = await ctx.db.insert("agents", {
        ...agent,
        createdAt: Date.now()
      });
      createdAgentIds.push(agentId);
    }

    // Step 2: Select agents for world
    await ctx.db.insert("selectedAgents", {
      agentIds: createdAgentIds,
      createdAt: Date.now()
    });

    return {
      success: true,
      message: "Test agents created and selected",
      agentIds: createdAgentIds
    };
  }
});

// Verify agents were created and selected correctly
export const verifyTestAgents = query({
  handler: async (ctx: QueryCtx) => {
    const agents = await ctx.db.query("agents").collect();
    const selectedAgents = await ctx.db.query("selectedAgents").order("desc").first();

    return {
      agents,
      selectedAgents,
      descriptionsLength: Descriptions.length
    };
  }
});

// Clean up test data
export const cleanupTestAgents = mutation({
  handler: async (ctx: MutationCtx) => {
    const agents = await ctx.db.query("agents").collect();
    for (const agent of agents) {
      await ctx.db.delete(agent._id);
    }

    const selectedAgents = await ctx.db.query("selectedAgents").collect();
    for (const selected of selectedAgents) {
      await ctx.db.delete(selected._id);
    }

    return {
      success: true,
      message: "Test data cleaned up"
    };
  }
});