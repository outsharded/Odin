const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const settingSchema = new Schema({
    author: ObjectId,
    type: Number,
    value: String,
    guildId: String,
  });

  const Setting = module.exports = mongoose.model('Setting', settingSchema);

  // Types:

  // 1: Warns DM: Store as boolean (true/false)
  // 2: Warns DM level: Store as integer (1,2,3)
  // 3: Report channel: as ID