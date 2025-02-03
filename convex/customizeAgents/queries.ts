import { query } from "../_generated/server";

export const getAgents = query(async ({ db }) => {
  return await db.query("agents").collect();
});

export const getSelectedAgents = query(async ({ db }) => {
    return await db.query("selectedAgents").order("desc").first();
  });
  
  