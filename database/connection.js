import mongoose from "mongoose"; // Importa mongoose como un objeto completo
import dotenv from "dotenv";

dotenv.config();

const connection = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Conectado correctamente a CarteraConstructora");
    } catch (error) {
        console.log("Error al conectar BD", error);
        throw new Error("¡No se ha podido conectar a la base de datos!");
    }
};

// Cerrar la conexión
const endconnection = async () => {
    try {
        await mongoose.connection.close(); // Usa la conexión de mongoose directamente
        console.log("Conexión cerrada");
    } catch (error) {
        console.log("Error al desconectar BD", error);
        throw new Error("¡No se ha podido desconectar a la base de datos!");
    }
};

export { connection, endconnection };