import { Schema,model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const ContractSchema=Schema({
    cliente_id:{
        type:int,
        require:true
    },
    propiedad_id:{
        type:int,
        require:true,
    },
    cuotas:{
        type:int,
        require:true,
    },
    total:{
        type:Double,
        require:true,
    }
});

UserSchema.plugin(mongoosePaginate);
export default model("Contract",ContractSchema,"contracts");