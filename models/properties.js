import { Schema,model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const PropertySchema=Schema({
    tipo:{
        type:String,
        require:true
    },
    precio:{
        type:Double,
        require:true
    },
    proyecto_id:{
        type:int,
        require:true
    }
});
PropertySchema.plugin(mongoosePaginate);
export default model("Property", PropertySchema,"properties");