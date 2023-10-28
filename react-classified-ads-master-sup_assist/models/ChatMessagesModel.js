const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema(
    {
      chatId: {
        type: String,
      },
      senderId: {
        type: String,
      },
      message: {
        type: String,
      },
    },
    {
      timestamps: true,
    }
);

// export default mongoose.model("ChatMessage", ChatMessageSchema);
  
const ChatMessages = mongoose.model("ChatMessage", chatMessageSchema);
module.exports = ChatMessages