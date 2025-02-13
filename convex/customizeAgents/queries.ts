import { query } from "../_generated/server";
import { QueryCtx } from "../_generated/server"; 

export const getSelectedAgents = query({
  handler: async (ctx: QueryCtx) => { 
    return await ctx.db.query("selectedAgents").order("desc").first();
  },
});

export const getAgents = query({
  handler: async (ctx: QueryCtx) => { 
    return await ctx.db.query("agents").collect();
  },
});

