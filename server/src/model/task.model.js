const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    description : {
        type : String,
    },
    tags: [String],
    priority : {
        type : String,
        enum : ["High", "Medium", "Low"],
        default : "Medium",
    },
    user: {
        type: String,
        enum: ['user1', 'user2', 'user3', 'user4', 'user5'],
        required: true,
    },
    notes: [{ 
        text: String,
        createdAt: { type: Date, default: Date.now },
    }],
    createdAt: {
        type: Date,
        default: Date.now,
  },
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;