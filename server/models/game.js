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
    date: { // why include date and time? aren't they redundant? Yes, but they're useful for editing forms
        type: String
    },
    time: {
        type: String
    },
    datetime: {
        type: Date,
        required: [true, "A datetime is required!"],
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
        required: [true, "A game must possess a valid category!"]
    }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

GameSchema.index({"name": 'text', "details": 'text', "location": 'text'}, {default_language: 'none'});
mongoose.model('Game', GameSchema);