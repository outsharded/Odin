const { ShardingManager } = require('discord.js');
const { token } = require("./config.json");

const manager = new ShardingManager('./bot_deploy.js', { token: token });

manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));

manager.spawn();