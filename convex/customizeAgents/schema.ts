import { defineSchema, defineTable, v } from "convex/schema";

export default defineSchema({
  agents: defineTable({
    name: v.string(),
    character: v.string(), // f1-f8，前端选的 sprite 样式
    identity: v.string(),
    plan: v.string(),
    createdAt: v.number(),
  }),
  selectedAgents: defineTable({
    agentIds: v.array(v.id("agents")), // 选中的 Agents ID
    createdAt: v.number(),
  }),
});
