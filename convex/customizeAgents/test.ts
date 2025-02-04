// // convex/customizeAgents/test.ts
// import { api } from './api';

// async function testAgentSystem() {
//     console.log("Starting test...");

//     // 创建测试 agent
//     const testAgent = {
//         name: "Math Teacher",
//         character: "f1",
//         identity: "Test math teacher identity",
//         plan: "Help students learn math"
//     };

//     try {
//         // 1. 创建 agent
//         const agentId = await api.createAgent(testAgent);
//         console.log("Agent created:", agentId);

//         // 2. 选择 agent
//         await api.selectAgentForWorld([agentId]);
//         console.log("Agent selected");

//         // 3. 验证选择
//         const selected = await api.getSelectedAgents();
//         console.log("Selected agents:", selected);

//         // 4. 更新 Descriptions
//         await updateDescriptions();
//         console.log("Descriptions updated");

//     } catch (error) {
//         console.error("Test failed:", error);
//     }
// }

// testAgentSystem();


// convex/customizeAgents/test.ts
import { mutation } from "../_generated/server";
import { MutationCtx } from "../_generated/server";
import { updateDescriptions } from "../../data/characters";

// 因为是在 Convex 环境中，我们需要把测试也写成一个 mutation
export const testAgentSystem = mutation({
    handler: async (ctx: MutationCtx) => {
        console.log("Starting test...");

        const testAgent = {
            name: "zombie",
            character: "f5",
            identity: "this is a zombie, was a math teacher before he died",
            plan: "Help students learn math"
        };

        try {
            // 1. 创建 agent
            const agentId = await ctx.db.insert("agents", {
                ...testAgent,
                createdAt: Date.now()
            });
            console.log("Agent created:", agentId);

            // 2. 选择 agent
            await ctx.db.insert("selectedAgents", {
                agentIds: [agentId],
                createdAt: Date.now()
            });
            console.log("Agent selected");

            // 3. 验证选择
            const selected = await ctx.db.query("selectedAgents").order("desc").first();
            console.log("Selected agents:", selected);

            // 4. 更新 Descriptions
            await updateDescriptions();
            console.log("Descriptions updated");

            return "Test completed successfully";
        } catch (error) {
            console.error("Test failed:", error);
            throw error;
        }
    }
});