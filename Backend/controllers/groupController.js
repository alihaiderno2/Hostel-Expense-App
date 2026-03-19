const Group = require('../models/Group')
const Transaction = require('../models/Transaction')
const User = require('../models/User')
const crypto = require('crypto')

const mongoose = require('mongoose');

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

const getGroupBalances = async (req, res) => {
    try {
        const { groupId } = req.params;

        // Force cast to ObjectId to ensure the query hits
        const transactions = await Transaction.find({ 
            groupId: new mongoose.Types.ObjectId(groupId), 
            status: 'accepted' 
        });

        const balances = {};
        transactions.forEach(tx => {
            tx.payers.forEach(payer => {
                const uid = payer.user.toString();
                balances[uid] = (balances[uid] || 0) + payer.amount;
            });
            tx.splits.forEach(split => {
                const uid = split.user.toString();
                balances[uid] = (balances[uid] || 0) - split.share;
            });
        });

        const result = Object.keys(balances).map(uid => ({
            userId: uid,
            netBalance: balances[uid]
        }));

        res.json(result);
    } catch (err) {
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

        if (!group) {
            return res.status(404).json({ msg: "Group not found" });
        }

        if (group.admin.toString() !== req.user.id) {
            return res.status(401).json({ msg: "Only the admin can delete this group" });
        }

        await group.deleteOne();
        res.json({ msg: "Group deleted successfully" });
    }catch(err){
        res.status(500).json({ error: "Server Error" });
    }
};

const leaveGroup = async (req,res) => {
    try{
        const {groupId} = req.params;
        const userId = req.user.id;
        const mongoose = require('mongoose');

        const group = await Group.findById(groupId);
        if(!group){
            return res.status(404).json({ msg: "Group not found" });
        }

        if(!group.members.includes(userId)){
            return res.status(400).json({ msg: "You are not a member of this group" });
        }
        // if person tries to leave but has pending transactions, block them until they settle or delete the transactions
        const pendingTx = await Transaction.findOne({
            groupId: new mongoose.Types.ObjectId(groupId),
            status: 'pending',
            involvedUsers: userId
        });

        if (pendingTx) {
            return res.status(400).json({ 
                msg: "You have pending bills. Please accept or dispute them before leaving." 
            });
        }

        const transactions = await Transaction.find({
            groupId: new mongoose.Types.ObjectId(groupId),
            status: 'accepted'
        });

        let myBalance = 0;
        transactions.forEach(tx => {
            tx.payers.forEach(payer => {
                if (payer.user.toString() === userId) myBalance += payer.amount;
            });
            tx.splits.forEach(split => {
                if (split.user.toString() === userId) myBalance -= split.share;
            });
        });

        if (myBalance !== 0) {
            return res.status(400).json({ 
                msg: `Cannot leave group. Your balance must be exactly 0, but it is ${myBalance}. Please settle up first.` 
            });
        }

        // if group admin leaves 
        if(group.admin.toString() === userId){
            if(group.members.length > 1){
                const nextAdmin = group.members.find(id => id.toString() !== userId);
                group.admin = nextAdmin;
            }
            else{
                await group.deleteOne();
                await User.findByIdAndUpdate(userId, { $pull: { groups: groupId } });
                return res.json({ msg: "You were the last member. Group closed." });
            }
        }

        // Making the group leave for the user
        group.members = group.members.filter(id => id.toString() !== userId);
        await group.save();

        await User.findByIdAndUpdate(userId, { $pull: { groups: groupId } });

        res.json({ msg: "Successfully left the group." });

    }catch(err){
        console.error("LEAVE GROUP ERROR:", err.message);
        res.status(500).json({ error: "Failed to leave group." });
    }
};

module.exports = {createGroup, joinGroup,getGroupBalances,getGroupInfo, deleteGroup, leaveGroup};