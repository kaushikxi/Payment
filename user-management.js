const expense = require("./models/expense");
class UserManagement {

    constructor(userModel, lodash, expenseModel, uuid){
        this.userModel = userModel;
        this.helperLibrary = lodash;
        this.expenseModel = expenseModel;
        this.uuid = uuid;
    }

    async registerUser(email, name, mobile_number, number_of_users){
        let childIds = [];
        try {
            let parentEmail = email[0];
            let parentName = name[0];
            let parentMobile = mobile_number[0];

            let user = await this.userModel.findOne({parentMobile});
            if(!this.helperLibrary.isEmpty(this.helperLibrary.get(user, '_doc',''))){
                return "User already exists";
            }

            // parent user creation
            let registeredUser = await this.userModel.create({
                email: parentEmail,
                name: parentName,
                mobile_number: parentMobile,
                node: this.uuid.v4(),
                numberOfUsers: number_of_users
            });

            // create child users
            for(let i=0; i<number_of_users; i++){
                let childId = await this.userModel.create({
                    email: email[i], 
                    name: name[i],
                    mobile_number: mobile_number[i],
                    node: `${registeredUser._doc.node}.${i+1}`
                })
                childIds.push(childId._doc._id);
            }
    
            // parent expense creation
            await this.expenseModel.create({
                user_id: registeredUser._doc._id,
                expense: 0,
                node: this.uuid.v4()
            })

            // create child expense creation
            for(let i=0; i<childIds.length; i++){
                await this.expenseModel.create({
                    user_id: childIds[i],
                    expense: 0,
                    node: `${registeredUser._doc.node}.${i+1}`
                });
            }

         return `Successfully registered and given permission to user ${parentName}`
        }catch (err){
            console.log(err.message);
            throw err;
        };
    }

    async getUserDetails(payload){
        try{
            let {mobile_number} = payload;
            let user = await this.userModel.findOne({mobile_number});
            if(!this.helperLibrary.isEmpty(this.helperLibrary.get(user, '_doc',''))){
                user._doc = this.helperLibrary.omit(user, ['_doc.node'], ['_doc._id'], ['_doc.__v'], ['_doc.numberOfUsers']);
                return {
                    message: "Successfully retrieved data", 
                    user_details: user._doc
                }
            }
            return {
                message: "Couldn't find data associated to mobile number."
            };
        } catch(err){
            console.log(err.message);
            throw err;
        }
    }
}

module.exports = UserManagement;