import { Document, model, models, Schema } from "mongoose";


export interface IUser extends Document {
    clerkId: string;
    name:string;
    username:string;
    email:string;
    password?:string;
    picture:string;
    location?:string;
    bio?:string;
    portfolioWebsite?:string;
    reputation?:number;
    saved:Schema.Types.ObjectId[];
    onboarded:boolean;
    joinedAt:Date;
}


const UserSchema = new Schema({
    clerkId:{type:String,required:true},
    name:{type:String,required:true},
    username:{type:String,required:true,unique:true},
    email:{type:String,required:true,unique:true},
    password:{type:String},
    bio:{type:String},
    picture:{type:String,required:true},
    location:{type:String},
    portfolioWebsite:{type:String},
    reputation:{type:Number,default:0},
    saved:[{type:Schema.Types.ObjectId,ref:"Question"}],
    onboarded:{type:Boolean,default:false},
    joinedAt:{type:Date,default:Date.now}
})

const User = models.User || model("User",UserSchema)

export default User;