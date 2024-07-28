const {app,userModel, _, expenseModel, uuid} = require('./app');
const UserManagement = require('./user-management');
const ExpenseManagement = require('./expense-management');
const BalanceSheet = require('./balanceSheet');


//User Endpoints

app.post("/register",async (req,res)=>{
    try{
        let {email,name,mobile_number, number_of_users} = req.body;
        let userManagement = new UserManagement(userModel, _, expenseModel, uuid);
        let message = await userManagement.registerUser(email, name, mobile_number, number_of_users);
        return res.send(message);
    }catch(err){
        console.log(err.message);
        throw err;
    }
});


app.get("/userdetails",async (req,res)=>{
    try{
        let {mobile_number} = req.body;
        let userManagement = new UserManagement(userModel, _, expenseModel);
        let {message, user_details} = await userManagement.getUserDetails({ mobile_number});
        return res.send({message, user_details});
    }catch(err){
        console.log(err.message);
        throw err;
    }
});



//Expense Endpoints

app.post("/add/expense/:mobileNumber",async (req,res)=>{
    try{
        let mobileNumber = req.params.mobileNumber;
        let expense = req.body.expense;
        let expenseManagement = new ExpenseManagement(userModel, _, expenseModel);
        let message = await expenseManagement.addExpense({mobileNumber, expense})
        return res.send({message});
    }catch(err){
        console.log(err.message);
        throw err;
    }
});

app.post("/retrieve/individual/expense",async (req,res)=>{
    try{
        let mobileNumber = req.body.mobile_number;
        let splitType = req.body.split_type;
        let exactAmount = req.body.exact_amount;
        let expenseManagement = new ExpenseManagement(userModel, _, expenseModel);
        let message = await expenseManagement.splitType(mobileNumber, splitType,exactAmount);
        return res.send(message);
    }catch(err){
        console.log(err.message);
        throw err;
    }
});

app.get("/retrieve/overall/expense/:mobilenumber", async (req,res)=>{

    try{
        let mobileNumber = req.params.mobilenumber;
        let expenseManagement = new ExpenseManagement(userModel, _, expenseModel);
        let {message} = await expenseManagement.getOverallExpenses(mobileNumber);
        return res.send(message);
    } catch(err){
        console.log(err.message);
        throw err;
    }
})

// Balance sheet

app.get("/balance/sheet/:mobileNumber", async (req,res)=>{
    try{
        let mobileNumber = req.params.mobileNumber;
        let balanceSheet = new BalanceSheet(userModel, _, expenseModel);
        let message = await balanceSheet.getBalanceSheet(mobileNumber);
        return res.send(message);
    }catch(err){
        console.log(err.message);
        throw err;
    }
})