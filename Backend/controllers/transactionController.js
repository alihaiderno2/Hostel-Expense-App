const Transaction = require('../models/Transaction');

const createTransaction = async (req, res) => {
    try {
        const { groupId, description, totalAmount, payers, splits, visibility, type, receiptImage} = req.body;

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
            type,
            receiptImage
        });
        const savedTransaction = await newTransaction.save();
        res.status(201).json(savedTransaction);
    }
    catch (err) {
        console.error("TRANSACTION ERROR:", err.message);
        res.status(500).json({ error: "Failed to record transaction." });
    }
};

const updateTransactionStatus = async (req, res) => {
    try {
        const { action } = req.body;
        const transactionId = req.params.id;
        const userId = req.user.id;

        const transaction = await Transaction.findById(transactionId);
        if (!transaction) return res.status(404).json({ msg: "Transaction not found" });

        // Convert ObjectIds to strings for a proper check
        const isInvolved = transaction.involvedUsers.some(id => id.toString() === userId);
        if (!isInvolved) return res.status(403).json({ msg: "Not involved in this bill" });

        if (action === 'accept') {

            const currentApprovals = transaction.approvals.map(id => id.toString());

            if (!currentApprovals.includes(userId)) {
                transaction.approvals.push(userId);
            }

            console.log(`Approvals: ${transaction.approvals.length} / Involved: ${transaction.involvedUsers.length}`);

            // 4. The Flip
            if (transaction.approvals.length === transaction.involvedUsers.length) {
                transaction.status = 'accepted';
            }
    } else if (action === 'reject') {
            transaction.status = 'disputed';
        }

        await transaction.save();
        res.json({ msg: `Transaction ${action}ed`, status: transaction.status, transaction });
    } catch (err) {
        res.status(500).json({ error: "Failed to update status" });
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

const recordSettlement = async (req,res) => {
    try{
        const {groupId , paidTo, amount} = req.body;
        const paidBy = req.user.id;

        if(paidBy === paidTo) {
            return res.status(400).json({ msg: "You cannot settle a debt with yourself." });
        }

        const newTransaction = new Transaction({
            groupId,
            description: 'Debt settlement',
            amount: amount,
            type : 'settlement',
            payers: [{ user: paidBy, amount: amount }],
            splits: [{ user: paidTo, share: amount }],
            involvedUsers : [paidBy, paidTo],
            visibility : 'group',
            approvals: [paidBy]
        });

        const savedSettlement = await newTransaction.save();
        res.status(201).json(savedSettlement);

    }catch(err){
        console.error("RECORD SETTLEMENT ERROR:", err.message);
        res.status(500).json({ error: "Failed to record settlement." });
    }
};

const deleteTransaction = async (req,res) => {
    try{
        const transactionId = req.params.id;
        const userId = req.user.id;

        const transaction = await Transaction.findById(transactionId); 

        if(!transaction){
            return res.status(404).json({ msg: "Transaction not found" });
        }

        if(transaction.status !== 'pending'){
            return res.status(400).json({ 
                msg: "Cannot delete an accepted transaction. Please record a settlement to reverse the balances instead." 
            });
        }

        const isPayer = transaction.payers.some(p => p.user.toString() === userId);

        if (!isPayer) {
            return res.status(403).json({ 
                msg: "Only the person who paid for this expense can delete it." 
            });
        }

        await transaction.deleteOne();
        res.json({ msg: "Transaction deleted successfully." });
    }
    catch(err){
        console.error("DELETE TRANSACTION ERROR:", err.message);
        res.status(500).json({ error: "Failed to delete transaction." });
    }
};

module.exports = { createTransaction, updateTransactionStatus, getGroupTransactions,recordSettlement, deleteTransaction
 };