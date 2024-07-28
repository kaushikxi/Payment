const mongoose = require("mongoose");
mongoose.connect(`mongodb://127.0.0.1:27017/Expenses`);

const userSchema = mongoose.Schema({
    email: String,
    name: String,
    mobile_number: Number,
    node: String,
    numberOfUsers: Number
});

module.exports = {userModel: mongoose.model("user",userSchema), mongoose}