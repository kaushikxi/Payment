const json2csv = require('json2csv').parse;
const fs = require('fs');

class BalanceSheet {

    constructor(userModel, helperLibrary, expenseModel){
        this.userModel = userModel;
        this.expenseModel = expenseModel;
        this.helperLibrary = helperLibrary;
    }

    async getBalanceSheet(mobileNumber){
        try{
            let message, file=[], expenseParentData;

            let user = await this.userModel.findOne({mobile_number:mobileNumber});
            if(this.helperLibrary.isEmpty(this.helperLibrary.get(user,'_doc',''))){
                return{
                    message: "No such data"
                }
            }

            let nodeLength = user._doc.node.split('.');
            let nodeId = nodeLength[0];
            let noOfUsers = user._doc.numberOfUsers;

            if(!noOfUsers){
                let parentUser = await this.userModel.findOne({node: nodeId});
                noOfUsers = parentUser._doc.numberOfUsers;
                expenseParentData = await this.expenseModel.findOne({user_id: parentUser._doc._id});
            }else{
                expenseParentData = await this.expenseModel.findOne({user_id: user._doc._id});
            }

            for(let i=0;i<noOfUsers;i++){
                let expenseChildData = await this.expenseModel.findOne({node: `${nodeId.concat(`.${i+1}`)}`});

                let output = {
                    overall_expense: expenseParentData._doc.expense,
                    individual_expense: expenseChildData._doc.expense
                }

                file.push(output);
            }

            const fields = ['individual_expense', 'overall_expense']

            fs.writeFileSync(`${__dirname}/output.csv`, json2csv(file, {fields}));

        }catch(e){
            console.log(e.message);
            throw e;
        }
    }
}


module.exports = BalanceSheet;