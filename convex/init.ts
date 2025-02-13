import { internal } from './_generated/api';
import { DatabaseReader, MutationCtx, mutation } from './_generated/server';
import { insertInput } from './aiTown/insertInput';
import { Id } from './_generated/dataModel';
import { createEngine } from './aiTown/main';
import { ENGINE_ACTION_DURATION } from './constants';
import { assertApiKey } from './util/llm';
import { loadAvailableMaps,loadSelectedMapData } from './mapLoader';


const init = mutation({
  handler: async (ctx, args) => {
    console.log(`start to init the world...`)
    assertApiKey();
    

    // 1. create world and load maps
    const mapConfigObj = loadAvailableMaps();
    const chosenId = args.mapId||mapConfigObj.defaultMap;
    const mapdata = await loadSelectedMapData(chosenId);
    console.log(`${chosenId} was selected as the new map...`)
    
    const { worldStatus, engine } = await getOrCreateDefaultWorld(ctx,mapdata);
    if (worldStatus.status !== 'running') {
      console.warn(`Engine ${engine._id} is not active!`);
      return;
    }

    // 2. then agents
    const shouldCreate = await shouldCreateAgents(
      ctx.db,
      worldStatus.worldId,
      worldStatus.engineId,
    );

    if (shouldCreate) {
      // 3. get selected agents
      const selectedAgentDoc = await ctx.db
        .query("selectedAgents")
        .order("desc")
        .first();
      
        console.log("Selected agents doc:", selectedAgentDoc); 

      if (!selectedAgentDoc || !selectedAgentDoc.agentIds.length) {
        console.log("No agents selected, creating empty world");
        return;
      }

      console.log("Selected agent IDs:", selectedAgentDoc.agentIds);

      const selectedAgents = await Promise.all(
        selectedAgentDoc.agentIds.map(async (id: Id<"agents">) => {
          const agent = await ctx.db.get(id);
          console.log("Found agent for ID:", id, agent); 
          if (!agent) {
            throw new Error(`Selected agent ${id} not found`);
          }
          return agent;
        })
      );

      // 4. create selected agents
      for (const agent of selectedAgents) {
        console.log('Creating agent:', agent.name);
        await insertInput(ctx, worldStatus.worldId, 'createAgent', {
          agent: {
            name: agent.name,
            character: agent.character,
            identity: agent.identity,
            plan: agent.plan
          }
        });
      }
    }
  },
});
export default init;

async function getOrCreateDefaultWorld(ctx: MutationCtx,mapdata:any) {
  console.log('getOrCreateDefaultWorld is called')
  const now = Date.now();

  let worldStatus = await ctx.db
    .query('worldStatus')
    .filter((q) => q.eq(q.field('isDefault'), true))
    .unique();

    // if world exists stop current engine
    if (worldStatus) {
      // stop engine
      const engine = (await ctx.db.get(worldStatus.engineId))!;
      console.log(`Stopping existing engine: ${engine._id}`);
      // clear it
      await ctx.db.patch(worldStatus.engineId, {
        generationNumber: 0,
        status: 'stopped'
      });
      // make a new one
      const newEngineId = await createEngine(ctx);
      // update worldStatus
      await ctx.db.patch(worldStatus._id, {
        engineId: newEngineId,
        status: 'running'
      });
      worldStatus = await ctx.db.get(worldStatus._id);
      return { worldStatus, engine: await ctx.db.get(newEngineId) };
    }

  const engineId = await createEngine(ctx);
  console.log(`engineId is ${engineId}`)
  const engine = (await ctx.db.get(engineId))!;
  const worldId = await ctx.db.insert('worlds', {
    nextId: 0,
    agents: [],
    conversations: [],
    players: [],
  });
  console.log(`worldId is ${worldId}`)
  const worldStatusId = await ctx.db.insert('worldStatus', {
    engineId: engineId,
    isDefault: true,
    lastViewed: now,
    status: 'running',
    worldId: worldId,
  });
  console.log(`worldStatusId is ${worldStatusId}`)
  worldStatus = (await ctx.db.get(worldStatusId))!;
  // await ctx.db.insert('maps', {
  //   worldId,
  //   width: map.mapwidth,
  //   height: map.mapheight,
  //   tileSetUrl: map.tilesetpath,
  //   tileSetDimX: map.tilesetpxw,
  //   tileSetDimY: map.tilesetpxh,
  //   tileDim: map.tiledim,
  //   bgTiles: map.bgtiles,
  //   objectTiles: map.objmap,
  //   animatedSprites: map.animatedsprites,
  // });
  await ctx.db.insert('maps', {
    worldId,
    width: mapdata.mapwidth,
    height: mapdata.mapheight,
    tileSetUrl: mapdata.tilesetpath,
    tileSetDimX: mapdata.tilesetpxw,
    tileSetDimY: mapdata.tilesetpxh,
    tileDim: mapdata.tiledim,
    bgTiles: mapdata.bgtiles,
    objectTiles: mapdata.objmap,
    animatedSprites: mapdata.animatedsprites,
  });
  
  await ctx.scheduler.runAfter(0, internal.aiTown.main.runStep, {
    worldId,
    generationNumber: engine.generationNumber,
    maxDuration: ENGINE_ACTION_DURATION,
  });
  console.log("getorcreatedefault world is completed");
  return { worldStatus, engine };
}

async function shouldCreateAgents(
  db: DatabaseReader,
  worldId: Id<'worlds'>,
  engineId: Id<'engines'>,
) {
  const world = await db.get(worldId);
  if (!world) {
    throw new Error(`Invalid world ID: ${worldId}`);
  }
  if (world.agents.length > 0) {
    // clear current agents
    world.agents = [];
    world.conversations = [];
    await ctx.db.replace(worldId, world);
  }
  // const unactionedJoinInputs = await db
  //   .query('inputs')
  //   .withIndex('byInputNumber', (q) => q.eq('engineId', engineId))
  //   .order('asc')
  //   .filter((q) => q.eq(q.field('name'), 'createAgent'))
  //   .filter((q) => q.eq(q.field('returnValue'), undefined))
  //   .collect();
  // if (unactionedJoinInputs.length > 0) {
  //   return false;
  // }
  return true;
}