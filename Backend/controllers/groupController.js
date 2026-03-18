const Group = require('../models/Group')
const Transaction = require('../models/Transaction')
const User = require('../models/User')
const crypto = require('crypto')

const createGroup = async (req, res) => {
    try {
        const {name} = req.body;
        const adminId = req.user.id;
        const joinCode = crypto.randomBytes(3).toString('hex').toUpperCase();

        const newGroup = new Group({
            name,
            joinCode,
            admin: adminId,
            members: [adminId]
        });

        const group = await newGroup.save();

        await User.findByIdAndUpdate(adminId, { $push: { groups: group._id } });
        res.status(201).json(group);
    }
    catch (err) {
        console.error("GROUP CREATE ERROR:", err.message);
        res.status(500).json({ error: "Server Error creating group" });
    }
}

const joinGroup = async (req, res) => {
    try {
        const { joinCode } = req.body;
        const userId = req.user.id;

        const group = await Group.findOne({ joinCode: joinCode.toUpperCase() });
        if (!group) {
            return res.status(404).json({ msg: "Group not found. Check the code!" });
        }

        if (group.members.includes(userId)) {
            return res.status(400).json({ msg: "You are already in this group" });
        }

        group.members.push(userId);
        await group.save();

        await User.findByIdAndUpdate(userId, { $push: { groups: group._id } });

        res.json({ msg: "Successfully joined the group!", group });
    }
    catch (err) {
        res.status(500).json({ error: "Server Error joining group" });
    }
}

const getGroupBalances = async (req,res) =>{
    try{
        const {groupId} = req.params;

        const transactions = await Transaction.find({ groupId, status: 'accepted' });

        const balances = {};

        transactions.forEach(tx=>{
            tx.payers.forEach(payer=>{
                const userId = payer.user.toString();
                if(!balances[userId]){
                    balances[userId] = 0;
                }
                balances[userId] += payer.amount;
            })

            tx.splits.forEach(split=>{
                const userId = split.user.toString();
                if(!balances[userId]){
                    balances[userId] = 0;
                }
                balances[userId] -= split.share;
            })
        });

        const result = Object.keys(balances).map(userId => ({
            userId,
            netBalance: balances[userId]
        }));

        res.json(result);

    }catch(err){
        console.error("BALANCE CALC ERROR:", err.message);
        res.status(500).json({ error: "Server Error calculating balance" });
    }
};

const getGroupInfo = async (req,res) =>{
    try{
        const {groupId} = req.params;
        const group = await Group.findById(groupId).populate('members', 'name email')
        .populate('admin', 'name email');

        if(!group){
            return res.status(404).json({ msg: "Group not found" });
        }

        res.json(group);
    }
    catch(err){
        console.error("GROUP INFO ERROR:", err.message);
        res.status(500).json({ error: "Error fetching group details" });
    }
};

const deleteGroup = async (req,res)=>{
    try{
        const {groupId} = req.params;

        const group = await Group.findById(groupId);

        if (group.admin.toString() !== req.user.id) {
            return res.status(401).json({ msg: "Only the admin can delete this group" });
        }

        await group.deleteOne();
        res.json({ msg: "Group deleted successfully" });
    }catch(err){
        res.status(500).json({ error: "Server Error" });
    }
};

module.exports = {createGroup, joinGroup,getGroupBalances,getGroupInfo, deleteGroup};