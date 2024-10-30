//Importar dependencias
import express from "express";
import connection from "./database/connection.js";
import cors from "cors";
import bodyParser from "body-parser";
import CustomerRoutes from "./routes/clients.js";
import ContractRoutes from "./routes/contracts.js";
import PaymentRoutes from "./routes/payments.js";
import PersonRoutes from "./routes/people.js";
import ProjectRoutes from "./routes/projects.js";
import PropertyRoutes from "./routes/properties.js";
import UserRoutes from "./routes/users.js";

// mensaje de Bienvenida 
console.log("API Node en ejecucion");

// Conexion a la Base de datos
connection();

// Crear el servidor de node
const app=express();
const puerto=process.env.PORT||3900;

// Configurar cors para que acepte peticiones del frontend
app.use(cors({
    origin: '*',
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
    preflightContinue:false,
    optionsSuccessStatus:204
}));

//Decodificar los datos de los formularios en objetos de javaScript
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//Configurar rutas del aplicativo
app.use('/api/clients', CustomerRoutes);
app.use('/api/contracts', ContractRoutes);
app.use('/api/payments', PaymentRoutes);
app.use('/api/people', PersonRoutes);
app.use('/api/projects', ProjectRoutes);
app.use('/api/properties', PropertyRoutes);
app.use('/api/user', UserRoutes);

// Configurar ek servidor de Node
app.listen(puerto, ()=>{
    console.log("Servidor de Node se ejecuta en el puerto", puerto);
})