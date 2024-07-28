class ExactSplit{

    constructor(expenseModel, nodeId){
        this.expenseModel = expenseModel;
        this.nodeId = nodeId;
    }

    async exactExpenses(number_of_users, exactAmount, totalExpense){
        try{

            let i=0, percentageExpenses=[];
            while(i<number_of_users){
                let percentageExpense = (exactAmount[i]/totalExpense)*100;
                i++;
                percentageExpenses.push(percentageExpense);
            }

            for(let i=0;i<number_of_users;i++){
                await this.expenseModel.findOneAndUpdate({node: `${this.nodeId.concat(`.${i+1}`)}`},{expense_percentage: `${(percentageExpenses[i].toString()).concat("%")}`,expense:exactAmount[i]},{new:true});
            }

            return{
                message: "Successfully implemented exact expense for all users"
            }

        } catch(err){

            console.log(err);
            throw err;
        }
    }


}




module.exports = ExactSplit;