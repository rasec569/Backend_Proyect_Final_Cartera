import { Schema,model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const PaymentSchema=new Schema({
    contrato: { 
        type: Schema.ObjectId, 
        ref: "Contract", 
        required: true },
    fecha_pago: { 
        type: Date, 
        required: true 
    },
    monto: { 
        type: Number, 
        required: true 
    },
});

PaymentSchema.plugin(mongoosePaginate);
export default model("Payment",PaymentSchema,"payments");
export { PaymentSchema };