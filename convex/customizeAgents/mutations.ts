import { mutation } from "../_generated/server";

export const createAgent = mutation(async ({ db }, { name, character, identity, plan }) => {
  await db.insert("agents", {
    name,
    character,
    identity,
    plan,
    createdAt: Date.now(),
  });
});

export const updateAgent = mutation(async ({ db }, { id, name, character, identity, plan }) => {
    await db.patch(id, {
      name,
      character,
      identity,
      plan,
    });
  });
  
  export const deleteAgent = mutation(async ({ db }, { id }) => {
    await db.delete(id);
  });

  export const selectAgentForWorld = mutation(async ({ db }, { agentIds }) => {
    await db.insert("selectedAgents", {
      agentIds,
      createdAt: Date.now(),
    });
  });
  
  export const removeAgentFromWorld = mutation(async ({ db }, { agentId }) => {
    const selected = await db.query("selectedAgents").order("desc").first();
    if (!selected) return;
    
    const updatedAgents = selected.agentIds.filter(id => id !== agentId);
    await db.insert("selectedAgents", { agentIds: updatedAgents, createdAt: Date.now() });
  });
  