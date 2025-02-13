import { mutation } from "../_generated/server";
import { MutationCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";



export const createAgent = mutation({
 handler: async (ctx: MutationCtx, args: { 
   name: string; 
   character: string; 
   identity: string; 
   plan: string 
 }) => {
   return await ctx.db.insert("agents", {
     name: args.name,
     character: args.character,
     identity: args.identity,
     plan: args.plan,
     createdAt: Date.now(),
   });
 },
});

export const updateAgent = mutation({
 handler: async (ctx: MutationCtx, args: {
   id: Id<"agents">;
   name: string;
   character: string;
   identity: string;
   plan: string;
 }) => {
   await ctx.db.patch(args.id, {
     name: args.name,
     character: args.character,
     identity: args.identity,
     plan: args.plan,
   });
 },
});

export const deleteAgent = mutation({
 handler: async (ctx: MutationCtx, args: { id: Id<"agents"> }) => {
   await ctx.db.delete(args.id);
 },
});

export const selectAgentForWorld = mutation({
 handler: async (ctx: MutationCtx, args: { agentIds: Id<"agents">[] }) => {
   return await ctx.db.insert("selectedAgents", {
     agentIds: args.agentIds,
     createdAt: Date.now(),
   });
 },
});

export const removeAgentFromWorld = mutation({
 handler: async (ctx: MutationCtx, args: { agentId: Id<"agents"> }) => {
   const selected = await ctx.db.query("selectedAgents").order("desc").first();
   if (!selected) return;

   const updatedAgents = selected.agentIds.filter(id => id !== args.agentId);
   await ctx.db.insert("selectedAgents", { 
     agentIds: updatedAgents, 
     createdAt: Date.now() 
   });
 },
});
