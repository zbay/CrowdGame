const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');

const GroupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "A group must be named!"]
    },
    description: {
        type: String,
        required: [true, "A group must have a description!"]
    },
    admins: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    members: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    requesters: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    public: {
        type: Boolean,
        default: false
    }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

mongoose.model('Group', GroupSchema);