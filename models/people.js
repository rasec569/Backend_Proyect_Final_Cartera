import { Schema,model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const PersonSchema =new Schema({
    tip_doc: { 
        type: String, 
        required: true 
    },
    doc_identificacion: { 
        type: String, 
        required: true, 
        unique: true 
    },    
    nombres: { 
        type: String, 
        required: true 
    },
    apellidos: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String 
    },
    telefono: { 
        type: String,
        require:true
    },
    dirección:{
        type:String
    },
    estado: { 
        type: Boolean, 
        required: true,
        default: true 
    }   
});

PersonSchema.plugin(mongoosePaginate);
export default model("Person",PersonSchema ,"people");
export { PersonSchema };