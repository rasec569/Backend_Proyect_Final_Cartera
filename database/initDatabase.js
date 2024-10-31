import Customer from "../models/clients.js"; 
import Contract from "../models/contracts.js"; 
import Payment from "../models/payments.js"; 
import Person from "../models/people.js"; 
import Proyect from "../models/projects.js"; 
import Property from "../models/properties.js"; 
import User from "../models/users.js"; 
import dotenv from "dotenv";
import { connection, endconnection } from "./database/connection.js";

dotenv.config();

const initDatabase = async () => {
    try {
        // Conectar a MongoDB
        await connection();

        // Crear los modelos
        const models = {
            Customer,
            Contract,
            Payment,
            Person,
            Proyect,
            Property,
            User
        };
        console.log("Modelos creados");        

        // Cerrar la conexión
        await endconnection();
    } catch (error) {
        console.error("Error al conectar a MongoDB:", error);
    }
};

// Ejecutar la función de inicialización
initDatabase();
//node database/initDatabase.js