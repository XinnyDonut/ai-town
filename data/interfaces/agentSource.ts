export interface AgentConfig {
    name: string;
    character: string;
    identity: string;
    plan: string;
}

export interface AgentDataSource {
    getTemplates(): Promise<AgentConfig[]>;
    getSelectedAgents(): Promise<AgentConfig[]>;
    saveToTemplates(agent: AgentConfig): Promise<void>;
    saveToSelected(agent: AgentConfig): Promise<void>;
    removeFromSelected(agentName: string): Promise<void>;
}