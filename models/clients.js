import { Schema,model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const CustomerSchema=new Schema({
    persona: { 
        type: Schema.ObjectId, 
        ref: "Person", 
        required: true 
    },
    conctacto:{
        type: String
    },
    estado: { 
        type: Boolean, 
        required: true 
    }     
});

CustomerSchema.plugin(mongoosePaginate);
export default model("Customer",CustomerSchema,"clients");
export { CustomerSchema }; 