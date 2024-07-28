
class PercentageSplit{

    constructor(expenseModel, nodeId){
        this.expenseModel = expenseModel;
        this.nodeId = nodeId;
    }

    async percentageExpenses(totalExpense,numberOfUsers,exactAmount){
        
        try{
            let i=0, individualExpenses=[];
            while(i<numberOfUsers){
                let individualExpense = (exactAmount[i]/totalExpense)*100;
                i++;
                individualExpenses.push(individualExpense);
            }

            for(let i=0;i<numberOfUsers;i++){

                await this.expenseModel.findOneAndUpdate({node:`${this.nodeId.concat(`.${i+1}`)}`},{expense_percentage: `${(individualExpenses[i].toString()).concat("%")}`, expense: exactAmount[i]},{new:true});
            }

            return{
                message: "Successfully added the percentage expense for all users"
            }

        }catch(err){
            console.log(err);
            throw err;
        }
    }


}


module.exports = PercentageSplit;