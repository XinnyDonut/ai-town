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

// /data/characters.ts
import { api } from "../convex/_generated/api";
import { Doc } from "../convex/_generated/dataModel";

/** 前端/游戏中需要的 agent 描述结构 */
export interface AgentDescription {
  name: string;
  character: string;
  identity: string;
  plan: string;
}

/** 用于给游戏层读取（或全局共享） */
export let Descriptions: AgentDescription[] = [];

/**
 * 从数据库中拉取 agents + selectedAgents，
 * 把「选中的」那部分映射成 Descriptions，
 * 存到全局的 Descriptions 变量里。
 */
export async function updateDescriptions() {
  try {
    // 1) 拿到 “当前选中的 agents” id 列表
    const selectedAgentsData = await api.customizeAgents.getSelectedAgents();
    if (!selectedAgentsData) {
      // 如果没有任何选中的，就清空
      Descriptions = [];
      return;
    }

    // 2) 拉取所有 agents
    const agents = await api.customizeAgents.getAgents();
    if (!agents) {
      Descriptions = [];
      return;
    }

    // 3) 只保留在 selectedAgentsData.agentIds 里的那部分
    const selectedAgents = agents.filter((agent: Doc<"agents">) =>
      selectedAgentsData.agentIds.includes(agent._id)
    );

    // 4) 映射成你的前端需要的结构
    Descriptions = selectedAgents.map((agent: Doc<"agents">) => ({
      name: agent.name,
      character: agent.character,
      identity: agent.identity,
      plan: agent.plan,
    }));

    console.log("Descriptions updated:", Descriptions);
  } catch (error) {
    console.error("Error updating descriptions:", error);
  }
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


// // test 
// const createAgent = useMutation(api.createAgent);
// createAgent({ 
//     name: "TestAgent1", 
//     character: "f1", 
//     identity: "A test character", 
//     plan: "To exist in AI town"
// });
// createAgent({ 
//     name: "TestAgent2", 
//     character: "f2", 
//     identity: "Another test character", 
//     plan: "To interact with others"
// });
// export const Descriptions = useQuery(api.getSelectedAgents) || [];
