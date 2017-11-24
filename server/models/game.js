const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GameSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "A game must be named!"]
    },
    details: {
        type: String,
        required: false
    },
    size: {
        type: Number,
        min: [2, "A game must have at least two players!"],
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
        type: Object,
        required: [true, "A game must have a creator!"]
    },
    players: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    comments: [{
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }],
    category: {
        type: String,
        enum: ["Sport", "Game", "Collaboration", "Gathering", "Online game", "Online collaboration", "Online gathering"],
        required: [true, "A game must be categorized!"]
    }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

GameSchema.index({"name": 'text', "details": 'text', "location": 'text'}, {default_language: 'none'});
mongoose.model('Game', GameSchema);