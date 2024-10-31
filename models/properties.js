import { Schema,model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const PropertySchema=Schema({
    proyecto: { 
        type: Schema.ObjectId, 
        ref: "Project", 
        required: true },
    tipo:{
        type:String,
        require:true
    },
    precio:{
        type:Double,
        require:true
    },
    descripcion: { 
        type: String 
    },
});
PropertySchema.plugin(mongoosePaginate);
export default model("Property", PropertySchema,"properties");