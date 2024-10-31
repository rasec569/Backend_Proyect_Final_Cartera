import {connect} from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connection = async()=>{
    try{
        await connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Conectado correctamente a CarteraConstructora");
    }catch(error){
        console.log( "Error al conectar BD" ,error);
        throw new Error("¡No se ha podido conectar a la base de datos!");
    }    
};

export default connection;
