import { Schema,model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const PropertySchema=new Schema({
    proyecto: { 
        type: Schema.ObjectId, 
        ref: "Project", 
        required: true },
    tipo:{
        type:String,
        require:true
    },
    precio:{
        type:Number,
        require:true
    },
    descripcion: { 
        type: String 
    },
    estado:{
        type: Boolean,
        require:true
    }
});
PropertySchema.plugin(mongoosePaginate);
export default model("Property", PropertySchema,"properties");
export { PropertySchema };