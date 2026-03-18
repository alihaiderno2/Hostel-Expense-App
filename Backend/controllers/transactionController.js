const Transaction = require('../models/Transaction');

const createTransaction = async (req, res) => {
    try {
        const { groupId, description, totalAmount, payers, splits, visibility, type} = req.body;

        const sumPaid = payers.reduce((sum, payer) => sum + payer.amount, 0);
        if(sumPaid !== totalAmount) {
            return res.status(400).json({ msg: "Total amount paid by payers must equal the transaction amount" });
        }

        const sumShares = splits.reduce((sum, split) => sum + split.share,0);
        if(sumShares !== totalAmount) {
            return res.status(400).json({ msg: "Total shares in splits must equal the transaction amount" });
        }

        const involvedUsers = [
            ...new Set([
                ...payers.map(p => p.user),
                ...splits.map(s => s.user)
            ])
        ]

        const newTransaction = new Transaction({
            groupId,
            payers,
            description,
            amount: totalAmount,
            splits,
            involvedUsers,
            visibility,
            approvals: [req.user.id],
            type

        });
        const savedTransaction = await newTransaction.save();
        res.status(201).json(savedTransaction);
    }
    catch (err) {
        console.error("TRANSACTION ERROR:", err.message);
        res.status(500).json({ error: "Failed to record transaction." });
    }
};

const updateTransactionStatus = async (req,res)=>{
    try{
        const {action} = req.body;
        const transactionId = req.params.id;
        const userId = req.user.id;

        const transaction = await Transaction.findById(transactionId);
        if(!transaction) {
            return res.status(404).json({ msg: "Transaction not found" });
        }

        if(!transaction.involvedUsers.includes(userId)) {
            return res.status(403).json({ msg: "You are not involved in this transaction" });
        }

        if(action === 'accept'){
            if (!transaction.approvals.includes(userId)) {
                transaction.approvals.push(userId);
            }

            if (transaction.approvals.length === transaction.involvedUsers.length) {
                transaction.status = 'accepted';
            }
        }
        else if(action === 'reject'){
            transaction.status = 'disputed';
        }

        await transaction.save();
        res.json({ msg: `Transaction ${action}ed`, transaction });
    }
    catch(err){
        console.error("STATUS UPDATE ERROR:", err.message);
        res.status(500).json({ error: "Failed to update transaction status." });
    }
};

const getGroupTransactions = async (req,res) =>{
    try{
        const {groupId} = req.params;
        const transactions = await Transaction.find({ groupId }).sort({ createdAt: -1 })
        .populate('payers.user','name')
        .populate('splits.user','name');

        res.json(transactions);
    }catch(err){
        console.error("FETCH TRANSACTIONS ERROR:", err.message);
        res.status(500).json({ error: "Failed to fetch transactions." });
    }
};

module.exports = { createTransaction, updateTransactionStatus, getGroupTransactions};