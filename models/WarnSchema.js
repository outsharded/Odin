const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const warnSchema = new Schema({
    author: ObjectId,
    guildId: String,
    modId: String,
    userId: String,
    reason: String
  });

  const Warn = module.exports = mongoose.model('Warn', warnSchema);