import { Schema,model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const UserSchema=Schema({
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
    }
});

UserSchema.plugin(mongoosePaginate);
export default model("User",UserSchema,"users");