const { deleteChatString } = require('../controllers/chatController');
const { addMessage, getMessages } = require('../controllers/messageController');

const router = require('express').Router();

router.post('/', addMessage);
router.get('/:chatId', getMessages);
router.delete('/:messageId', deleteChatString);

module.exports = router;
