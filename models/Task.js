const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true // Title lekunda task create avvakunda check chestundi
  },
  description: {
    type: String
  },
  completed: { 
    type: Boolean, 
    default: false 
  }
});

module.exports = mongoose.exports = mongoose.model("Task", TaskSchema);