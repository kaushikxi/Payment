const EqualSplit = require('./splitType/equal');
const ExactSplit = require(`./splitType/exact`);
const PercentageSplit = require(`./splitType/percentage`)

class ExpenseManagement {

    constructor(userModel, lodash, expenseModel){
        this.userModel = userModel;
        this.helperLibrary = lodash;
        this.expenseModel = expenseModel;
    }

    // add expense to the parent node
    async addExpense(payload){
        try{
            let {mobileNumber, expense} = payload;
            let users = await this.userModel.find({mobile_number:mobileNumber});

           for(let user of users){
                if(!this.helperLibrary.isEmpty(this.helperLibrary.get(user, '_doc',''))){
                    let nodeLength = user._doc.node.split('.');
 
                    if(nodeLength.length === 1){
                        let expenseData = await this.expenseModel.findOne({user_id:user._doc._id});
                        let totalExpense = expenseData._doc.expense + parseInt(expense);
                        await this.expenseModel.findOneAndUpdate({user_id:user._doc._id},{expense:totalExpense},{new:true});
                        return 'expense added';
                    }else{
                        return 'cannot add expense to another users/child users'
                    }
                }
           }
           return 'Data not present.'
        }catch(err){
            console.log(err.message);
            throw err
        }
    }

    async getOverallExpenses(mobileNumber){
        try{
            let user = await this.userModel.findOne({mobile_number:mobileNumber});
            if(!this.helperLibrary.isEmpty(this.helperLibrary.get(user,'_doc', ''))){
                let expenseData = await this.expenseModel.findOne({user_id: user._doc._id});
                return{
                    message: `total expense: ${this.helperLibrary.get(expenseData,'_doc.expense')}`
                }
            }
            return{
                message: "No such data"
            } 
        }catch(err){
            console.log(err.message);
            throw err;
        }
    }

    async splitType(mobileNumber, splitType,exactAmount){
        try{
            
            let message;
            let user = await this.userModel.findOne({mobile_number:mobileNumber});
            if(this.helperLibrary.isEmpty(this.helperLibrary.get(user,'_doc',''))){
                return{
                    message: "No such data"
                }
            }

            let nodeLength = user._doc.node.split('.');

            if(nodeLength.length === 1){
                let expenseData = await this.expenseModel.findOne({user_id:user._doc._id});
                let expenseTotal = expenseData._doc.expense;
                let noOfUsers = user._doc.numberOfUsers;
                let nodeId = nodeLength[0];

                switch(splitType){
                    case "Equal":{
                        let equalSplit = new EqualSplit(this.expenseModel, nodeId);
                        message = await equalSplit.equalExpenses(expenseTotal, noOfUsers);
                        return message;
                    }
                    
                    case "Exact":{
                        let exactSplit = new ExactSplit(this.expenseModel,nodeId);
                        message = await exactSplit.exactExpenses(noOfUsers,exactAmount, expenseTotal);
                        return message;
                    }

                    case "Percentage":{
                        let percentageSplit = new PercentageSplit(this.expenseModel,nodeId);
                        message = await percentageSplit.percentageExpenses(expenseTotal, noOfUsers, exactAmount);
                        return message;
                    }

                    default:
                        return `No split type found, please check again ${splitType}`;
                }                
            }else{
                return 'cannot get indiviual expense since it is not a parent user'
            }
        }catch(err){
            console.log(err.message);
            throw err;
        }
    }
}

module.exports = ExpenseManagement;