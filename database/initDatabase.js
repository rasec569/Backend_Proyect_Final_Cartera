import Customer from "../models/clients.js"; 
import Contract from "../models/contracts.js"; 
import Payment from "../models/payments.js"; 
import Person from "../models/people.js"; 
import Proyect from "../models/projects.js"; 
import Property from "../models/properties.js"; 
import User from "../models/users.js"; 
import dotenv from "dotenv";
import { connection, endconnection } from "./connection.js";

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

        // Agregar el campo 'estado' a las colecciones existentes
        await updateContracts();
        await updatePayments();
        await updateProperties();
        await updatePersons(); 
        await updatePropertyNames();

        // Cerrar la conexión
        await endconnection();
    } catch (error) {
        console.error("Error al conectar a MongoDB:", error);
    }
};

// Función para agregar el campo 'estado' en la colección de contratos
const updateContracts = async () => {
    const contractUpdateResult = await Contract.updateMany(
        { estado: { $exists: false } }, // Solo actualiza los documentos que no tienen el campo
        { $set: { estado: true } } // Establece el campo 'estado' a true
    );
    console.log(`Documentos de contrato actualizados: ${contractUpdateResult.modifiedCount}`);
};

// Función para agregar el campo 'estado' en la colección de pagos
const updatePayments = async () => {
    const paymentUpdateResult = await Payment.updateMany(
        { estado: { $exists: false } }, // Solo actualiza los documentos que no tienen el campo
        { $set: { estado: true } } // Establece el campo 'estado' a true
    );
    console.log(`Documentos de pago actualizados: ${paymentUpdateResult.modifiedCount}`);
};

// Función para agregar el campo 'estado' en la colección de propiedades
const updateProperties = async () => {
    const propertyUpdateResult = await Property.updateMany(
        { estado: { $exists: false } }, // Solo actualiza los documentos que no tienen el campo
        { $set: { estado: true } } // Establece el campo 'estado' a true
    );
    console.log(`Documentos de propiedad actualizados: ${propertyUpdateResult.modifiedCount}`);
};
const updatePersons = async () => {
    const count = await Person.countDocuments(); // Contar documentos
    console.log(`Total de documentos en la colección de personas: ${count}`);

    // Obtener documentos para verificar su contenido
    const persons = await Person.find({ estado: { $exists: false } });
    console.log(`Documentos sin campo 'estado': ${JSON.stringify(persons, null, 2)}`);

    const personUpdateResult = await Person.updateMany(
        { estado: { $exists: false } },
        { $set: { estado: true } }
    );

    if (personUpdateResult.modifiedCount !== undefined) {
        console.log(`Documentos de persona actualizados: ${personUpdateResult.modifiedCount}`);
    } else {
        console.log("No se pudieron actualizar los documentos de persona.");
    }
};
// Función para actualizar los nombres de las propiedades
const updatePropertyNames = async () => {
    const properties = await Property.find(); // Obtener todas las propiedades
    let counter = 1; // Contador para nombres únicos

    for (const property of properties) {
        const newName = `Propiedad ${counter}`; // Crear un nuevo nombre
        await Property.findByIdAndUpdate(property._id, { nombre: newName }); // Actualizar el documento
        counter++; // Incrementar el contador
    }

    console.log(`Nombres de propiedades actualizados a: ${counter - 1}`);
};


// Ejecutar la función de inicialización
initDatabase();
//node database/initDatabase.js