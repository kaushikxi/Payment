const mongoose = require("mongoose");
mongoose.connect(`mongodb://127.0.0.1:27017/Expenses`);

const expenseSchema = mongoose.Schema({
    
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    expense: Number,
    node: String,
    expense_percentage: String
});

module.exports = mongoose.model("expense",expenseSchema);