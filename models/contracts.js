import { Schema,model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const ContractSchema=Schema({
    cliente_id:{
        type:Schema.ObjectId,
        ref:"Customer", 
        required:true
    },
    propiedad_id:{
        type:int,
        required:true,
    },
    cuotas:{
        type:int,
        required:true,
    },
    total:{
        type:Double,
        required:true,
    }
});

UserSchema.plugin(mongoosePaginate);
export default model("Contract",ContractSchema,"contracts");