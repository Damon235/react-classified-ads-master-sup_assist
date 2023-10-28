const ChatMessage = require("../models/ChatMessagesModel");

const addMessage = async (req, res) => {
  const { chatId, senderId, message } = req.body;
  const chatMessage = new ChatMessage({ chatId, senderId, message });
  try {
    const result = await chatMessage.save();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

const getMessages = async (req, res) => {
    const { chatId } = req.params
    try {
    const result = await ChatMessage.find({ chatId });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
}

module.exports = { addMessage, getMessages };