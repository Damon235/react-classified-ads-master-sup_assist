const mongoose = require('mongoose')

const ChatSchema = new mongoose.Schema(
    {
      members: { type: Array },
    },
    {
      timestamps: true,
    }
);
  
// export default mongoose.model('ChatModel', ChatSchema)

const ChatModel = mongoose.model("ChatModel", ChatSchema);
module.exports = ChatModel
