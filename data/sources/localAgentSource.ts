// import { promises as fs } from 'fs';
// import { AgentConfig, AgentDataSource } from "../interfaces/agentSource";
// import { invalidateCache as charactersInvalidateCache } from '../characters';
// export class LocalAgentSource implements AgentDataSource {
//     constructor(
//         private templatesPath: string = "./data/agent_templates.json",
//         private selectedPath: string = "./data/selected_agents.json"
//     ) {}
//     async getTemplates(): Promise<AgentConfig[]> {
//         try {
//             const data = await fs.readFile(this.templatesPath, "utf-8");
//             return JSON.parse(data);
//         } catch (error) {
//             console.error("Error reading templates:", error);
//             return [];
//         }
//     }
//     async getSelectedAgents(): Promise<AgentConfig[]> {
//         try {
//             const data = await fs.readFile(this.selectedPath, "utf-8");
//             return JSON.parse(data);
//         } catch (error) {
//             console.error("Error reading selected agents:", error);
//             return [];
//         }
//     }
//     async saveToTemplates(agent: AgentConfig): Promise<void> {
//         const templates = await this.getTemplates();
//         templates.push(agent);
//         await fs.writeFile(this.templatesPath, JSON.stringify(templates, null, 2));
//         this.invalidateCache();
//     }
//     async saveToSelected(agent: AgentConfig): Promise<void> {
//         const selected = await this.getSelectedAgents();
//         if (!selected.some(a => a.name === agent.name)) {
//             selected.push(agent);
//             await fs.writeFile(this.selectedPath, JSON.stringify(selected, null, 2));
//             this.invalidateCache();
//         }
//     }
//     async removeFromSelected(agentName: string): Promise<void> {
//         const selected = await this.getSelectedAgents();
//         const index = selected.findIndex(a => a.name === agentName);
//         if (index > -1) {
//             selected.splice(index, 1);
//             await fs.writeFile(this.selectedPath, JSON.stringify(selected, null, 2));
//             this.invalidateCache();
//         }
//     }
//     private invalidateCache() {
//         charactersInvalidateCache();
//     }
// }




import { AgentConfig, AgentDataSource } from "../interfaces/agentSource";
import { invalidateCache as charactersInvalidateCache } from '../characters';

export class LocalAgentSource implements AgentDataSource {
    // 定义存储的键名
    private readonly TEMPLATES_KEY = 'agent_templates';
    private readonly SELECTED_KEY = 'selected_agents';

    constructor() {
        this.initializeStorage();
    }

    private initializeStorage() {
        if (!localStorage.getItem(this.TEMPLATES_KEY)) {
            localStorage.setItem(this.TEMPLATES_KEY, JSON.stringify([
                { name: "Boss", 
                    character: "f5", 
                    identity: "A zombie died of AIDs. Talks in jagged lines.", 
                    plan: "Wants to eat everyone in this town." },
                { name: "Labatorian", 
                    character: "f8", 
                    identity: "A desprate human researcher from out of town, doesn't know what happened in this town.", 
                    plan: "Wants to find out what happened in the town." }
            ]));
        }

        if (!localStorage.getItem(this.SELECTED_KEY)) {
            localStorage.setItem(this.SELECTED_KEY, JSON.stringify([
                { name: "Boss", 
                    character: "f5", 
                    identity: "A zombie died of AIDs. Talks in jagged lines.", 
                    plan: "Wants to eat everyone in this town." },
                { name: "Labatorian", 
                    character: "f8", 
                    identity: "A desprate human researcher from out of town, doesn't know what happened in this town.", 
                    plan: "Wants to find out what happened in the town." }
            ]));
        }
    }

    // getTemplates: 从 fs.readFile 改为 localStorage.getItem
    async getTemplates(): Promise<AgentConfig[]> {
        try {
            const data = localStorage.getItem(this.TEMPLATES_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error("Error reading templates:", error);
            return [];
        }
    }

    // getSelectedAgents: 从 fs.readFile 改为 localStorage.getItem
    async getSelectedAgents(): Promise<AgentConfig[]> {
        try {
            const data = localStorage.getItem(this.SELECTED_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error("Error reading selected agents:", error);
            return [];
        }
    }

    // saveToTemplates: 从 fs.writeFile 改为 localStorage.setItem
    async saveToTemplates(agent: AgentConfig): Promise<void> {
        const templates = await this.getTemplates();
        templates.push(agent);
        localStorage.setItem(this.TEMPLATES_KEY, JSON.stringify(templates, null, 2));
        this.invalidateCache();
    }

    // saveToSelected: 从 fs.writeFile 改为 localStorage.setItem
    async saveToSelected(agent: AgentConfig): Promise<void> {
        const selected = await this.getSelectedAgents();
        if (!selected.some(a => a.name === agent.name)) {
            selected.push(agent);
            localStorage.setItem(this.SELECTED_KEY, JSON.stringify(selected, null, 2));
            this.invalidateCache();
        }
    }

    // removeFromSelected: 从 fs.writeFile 改为 localStorage.setItem
    async removeFromSelected(agentName: string): Promise<void> {
        const selected = await this.getSelectedAgents();
        const index = selected.findIndex(a => a.name === agentName);
        if (index > -1) {
            selected.splice(index, 1);
            localStorage.setItem(this.SELECTED_KEY, JSON.stringify(selected, null, 2));
            this.invalidateCache();
        }
    }

    private invalidateCache() {
        charactersInvalidateCache();
    }
}