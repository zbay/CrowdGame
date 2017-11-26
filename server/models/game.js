const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');

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
    date: { // why include date and time? aren't they redundant? Yes, but they're convenient to have for editing forms. Maybe refactor to get rid of datetime field, actually
        type: String,
        required: true,
        validate: [
            {
                validator: function(d){
                    return moment(d).isValid();
                },
                message: "The submitted date is not valid!"
            }
        ]
    },
    time: {
        type: String,
        required: true
    },
    datetime: {
        type: Date,
        required: [true, "A datetime is required!"],
        validate: [
            {
                validator: function(dt){
                    return dt.getTime() > new Date().getTime();
                },
                message: "The date/time must be set in the future!"
            }
        ]
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