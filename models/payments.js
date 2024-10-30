import { Schema,model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const PaymentSchema=Schema({
    contrato_id:{
        type:int,
        require:true
    },
    monto:{
        type:Double,
        require:true,
    },
    fecha:{
        type:Date,
        require:true,
    }
});

UserSchema.plugin(mongoosePaginate);
export default model("Payment",PaymentSchema,"payments");