const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new mongoose.Schema({
    author: {
        type: String,
        required: [true, "A comment must have an author"]
    },
    message: {
        type: String,
        required: [true, "A comment cannot be blank!"]
    }
}, { timestamps: { createdAt: 'createdAt' } });

mongoose.model('Comment', CommentSchema);