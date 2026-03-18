const express = require('express');
const router = express.Router();
const {createGroup, joinGroup,getGroupBalances,getGroupInfo, deleteGroup} = require('../controllers/groupController');
const auth = require('../middleware/authMiddleware');

router.post('/create', auth, createGroup);
router.post('/join', auth, joinGroup);
router.get('/:groupId/balances', auth, getGroupBalances);
router.get('/:groupId', auth, getGroupInfo);
router.delete('/:groupId', auth, deleteGroup);

module.exports = router;