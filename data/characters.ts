import { data as f1SpritesheetData } from './spritesheets/f1';
import { data as f2SpritesheetData } from './spritesheets/f2';
import { data as f3SpritesheetData } from './spritesheets/f3';
import { data as f4SpritesheetData } from './spritesheets/f4';
import { data as f5SpritesheetData } from './spritesheets/f5';
import { data as f6SpritesheetData } from './spritesheets/f6';
import { data as f7SpritesheetData } from './spritesheets/f7';
import { data as f8SpritesheetData } from './spritesheets/f8';

// import { customAgentConfigs } from './customAgents';

// export const Descriptions = customAgentConfigs.map(config => ({
//     name: config.name,
//     character: config.character,
//     identity: config.identity,
//     plan: config.plan
// }));


// import { LocalAgentSource } from './sources/localAgentSource';
// import { AgentConfig } from './interfaces/agentSource';

// let cachedDescriptions: AgentConfig[] | null = null;

// export async function getDescriptions(): Promise<AgentConfig[]> {
//     if (!cachedDescriptions) {
//         const source = new LocalAgentSource();
//         cachedDescriptions = await source.getSelectedAgents();
//     }
//     return cachedDescriptions;
// }

// export function invalidateCache() {
//     cachedDescriptions = null;
// }

// let Descriptions: AgentConfig[] = [];
// (async () => {
//     Descriptions = await getDescriptions();
// })();

// export { Descriptions };

import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

export function useDescriptions() {
    const selected = useQuery(api.getSelectedAgents) || null;
    const allAgents = useQuery(api.getAgents) || [];

    if (!selected) return [];

    return selected.agentIds
        .map(id => allAgents.find(agent => agent._id === id))
        .filter(Boolean); // 过滤掉 undefined
}



export const characters = [
  {
    name: 'f1',
    textureUrl: '/ai-town/assets/32x32folk.png',
    spritesheetData: f1SpritesheetData,
    speed: 0.1,
  },
  {
    name: 'f2',
    textureUrl: '/ai-town/assets/32x32folk.png',
    spritesheetData: f2SpritesheetData,
    speed: 0.1,
  },
  {
    name: 'f3',
    textureUrl: '/ai-town/assets/32x32folk.png',
    spritesheetData: f3SpritesheetData,
    speed: 0.1,
  },
  {
    name: 'f4',
    textureUrl: '/ai-town/assets/32x32folk.png',
    spritesheetData: f4SpritesheetData,
    speed: 0.1,
  },
  {
    name: 'f5',
    textureUrl: '/ai-town/assets/32x32folk.png',
    spritesheetData: f5SpritesheetData,
    speed: 0.1,
  },
  {
    name: 'f6',
    textureUrl: '/ai-town/assets/32x32folk.png',
    spritesheetData: f6SpritesheetData,
    speed: 0.1,
  },
  {
    name: 'f7',
    textureUrl: '/ai-town/assets/32x32folk.png',
    spritesheetData: f7SpritesheetData,
    speed: 0.1,
  },
  {
    name: 'f8',
    textureUrl: '/ai-town/assets/32x32folk.png',
    spritesheetData: f8SpritesheetData,
    speed: 0.1,
  },
];

// Characters move at 0.75 tiles per second.
export const movementSpeed = 0.75;
