const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GameSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "A game must be named!"]
    },
    details: {
        type: String,
        required: [true, "A description is required!"]
    },
    size: {
        type: Number,
        required: [true, "A game size is required!"]
    },
    location: {
        type: String,
        required: [true, "A game must have a location!"]
    },
    time: {
        type: String,
        required: [true, "An approximate game time is required!"]
    },
    open: {
        type: Boolean,
        default: true
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "A game must have a creator!"]
    },
    players: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

mongoose.model('Game', GameSchema);