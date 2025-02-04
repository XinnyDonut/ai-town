import { createAgent, updateAgent, deleteAgent, selectAgentForWorld, removeAgentFromWorld } from "./mutations";
// import { getAgents, getSelectedAgents } from "./queries";
import { getSelectedAgents, getAgents } from "./queries";

export const api = {
    createAgent,
    updateAgent,
    deleteAgent,
    selectAgentForWorld,
    removeAgentFromWorld,
    getAgents,
    getSelectedAgents
};
