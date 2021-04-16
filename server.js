// Include discord.js ShardingManger
const { ShardingManager } = require('discord.js');
require('dotenv-flow').config();
// Create your ShardingManger instance
const manager = new ShardingManager('./manager.js', {
    // for ShardingManager options see:
    // https://discord.js.org/#/docs/main/v11/class/ShardingManager

    // 'auto' handles shard count automatically
    totalShards: 'auto',

    // your bot token
    token: 'Mzc4ODM2OTQxMDYxMjI2NDk4.XwwgGg.Z-oV_z51_Nkl7dkvgLoXiX2YclM'
});

// Spawn your shards
manager.spawn();

// The shardCreate event is emitted when a shard is created.
// You can use it for something like logging shard launches.
manager.on('shardCreate', (shard) => console.log(`Shard ${shard.id} launched`));