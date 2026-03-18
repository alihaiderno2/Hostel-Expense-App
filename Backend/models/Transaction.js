const { mongoose } = require("mongoose");

const TransactionSchema = new mongoose.Schema({
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        required: true
    },
    payers: [{
        user: {
             type: mongoose.Schema.Types.ObjectId, ref: 'User'
        },
        amount: {
            type: Number,
            required: true
        }
    }],
    description: {
        type: String,
        required: [true, "The 'Cause' for this expense is mandatory"],
        trim: true
    },
    amount: {
        type: Number,
        required: true
    },
    splits: [{
        user: {
             type: mongoose.Schema.Types.ObjectId, ref: 'User'
            },
        share: {
            type: Number,
            required: true
        }
    }],
    involvedUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    visibility: {
        type: String,
        enum: ['group', 'private'],
        default: 'group'
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'disputed', 'void'],
        default: 'pending'
    },
    approvals: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    type: {
        type: String,
        enum: ['expense', 'settlement'],
        default: 'expense'
    },
    receiptImage: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Transaction', TransactionSchema);