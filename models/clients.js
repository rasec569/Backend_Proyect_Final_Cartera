import { Schema,model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const CustomerSchema=Schema({
    persona_id:{
        type:int,
        require:true,
    },
    dirección:{
        type:String,
        require:true
    }    
});

CustomerSchema.plugin(mongoosePaginate);
export default model("Customer",CustomerSchema,"clients");