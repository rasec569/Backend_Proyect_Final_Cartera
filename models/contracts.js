import { Schema,model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const ContractSchema=new Schema({
    cliente: { 
        type: Schema.ObjectId, 
        ref: "Customer", 
        required: true 
    },
    propiedad: { 
        type: Schema.ObjectId, 
        ref: "Property", 
        required: true 
    },
    fecha_contrato: { 
        type: Date, 
        required: true 
    },
    numero_cuotas: { 
        type: Number, 
        required: true 
    },
    monto_cuota: { 
        type: Number, 
        required: true 
    },
    total:{
        type:Number,
        required:true,
    },
    estado:{
        type: Boolean,
        require:true,
        default: true
    }
});

ContractSchema.plugin(mongoosePaginate);
export default model("Contract",ContractSchema,"contracts");
export { ContractSchema };