class Equal {

    constructor(expenseModel, nodeId){
        this.expenseModel = expenseModel;
        this.nodeId = nodeId
    }

    async equalExpenses(totalExpense, numberOfUsers){
        try{
            let i=0, individualExpenses=[], percentageExpenses = [];

            while(i<numberOfUsers){
                let individualExpense = Math.round(totalExpense/numberOfUsers);
                individualExpenses.push(individualExpense);

                let percentageExpense = (individualExpense/totalExpense)*100;
                percentageExpenses.push(percentageExpense);

                i++;
            }

            for(let i=0; i<numberOfUsers; i++){
                await this.expenseModel.findOneAndUpdate({node: `${this.nodeId.concat(`.${i+1}`)}`},{expense_percentage: `${(percentageExpenses[i].toString()).concat("%")}`, expense:individualExpenses[i]}, {new:true});
            }


            return {
                message: 'Successfully updated expense data for remaning users'
            }
        }catch(err){
            console.log(err.message);
            throw err;
        }
    }
}

module.exports = Equal;