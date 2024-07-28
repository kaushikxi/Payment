const express = require("express");
const app = express();
const uuid = require('uuid');
const {userModel} = require('./models/user');
const expenseModel = require('./models/expense');
const _ = require('lodash');

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.listen(3000);

module.exports = {app, userModel, _, expenseModel, uuid};