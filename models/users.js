import { Schema,model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const UserSchema=new Schema({
    persona: { 
        type: Schema.ObjectId, 
        ref: "Person", 
        required: true 
    },
    nickname:{
        type:String,
        require:true,
        unique:true
    },
    contraseña:{
        type:String,
        require:true,
    },
    rol:{
        type:String,
        require:true,
    },
    estado: { 
        type: Boolean, 
        required: true 
    }    
});

UserSchema.plugin(mongoosePaginate);
export default model("User",UserSchema,"users");
export { UserSchema };