import { Schema,model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const ProyectSchema=Schema({
    nombre:{
        type:String,
        require:true,
        unique:true
    },
    ubicación:{
        type:String,
        require:true
    }
});
ProyectSchema.plugin(mongoosePaginate);
export default model("Proyect", ProyectSchema, "proyects")