import { Schema,model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const ProyectSchema=new Schema({
    nombre:{
        type:String,
        require:true,
        unique:true
    },
    ubicación:{
        type:String,
        require:true
    }, 
    fecha_inicio:{
        type:String,
        require:true
    },
    fecha_fin: { 
        type: Date 
    },
    estado: { 
        type: Boolean, 
        required: true,
        default: true 
    }
});
ProyectSchema.plugin(mongoosePaginate);
export default model("Proyect", ProyectSchema, "proyects");
export { ProyectSchema };