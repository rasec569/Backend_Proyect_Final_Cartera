//Importar dependencias
import express from "express";
import dotenv from "dotenv";
import connection from "./database/connection.js";
// mensaje de Bienvenida 
console.log("API Node en ejecucion");
// Conexion a la Base de datos
connection();
// Crear el servidor de node
const app=express();
const puerto=process.env.PORT||3900;
// Configurar cors para que acepte peticiones del frontend

// Configurar ek servidor de Node
app.listen(puerto, ()=>{
    console.log("Servidor de Node se ejecuta en el puerto", puerto);
})