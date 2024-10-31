import mongoose from "mongoose";
import Customer from "../models/clients.js"; 
import Contract from "../models/contracts.js"; 
import Payment from "../models/payments.js"; 
import Person from "../models/people.js"; 
import Proyect from "../models/projects.js"; 
import Property from "../models/properties.js"; 
import User from "../models/users.js"; 
import dotenv from "dotenv";

dotenv.config();

const initDatabase = async () => {
    try {
        // Conectar a MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Conectado a MongoDB");

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

        // Crear la vista cartera
        const carteraPipeline = [
            {
                $lookup: {
                    from: "people",
                    localField: "persona",
                    foreignField: "_id",
                    as: "persona_info"
                }
            },
            {
                $unwind: "$persona_info"
            },
            {
                $lookup: {
                    from: "contracts",
                    localField: "_id",
                    foreignField: "cliente",
                    as: "contratos"
                }
            },
            {
                $unwind: "$contratos"
            },
            {
                $lookup: {
                    from: "properties",
                    localField: "contratos.propiedad",
                    foreignField: "_id",
                    as: "propiedad_info"
                }
            },
            {
                $unwind: "$propiedad_info"
            },
            {
                $lookup: {
                    from: "payments",
                    localField: "contratos._id",
                    foreignField: "contrato",
                    as: "pagos"
                }
            },
            {
                $group: {
                    _id: {
                        cliente_id: "$_id",
                        nombre_cliente: { $concat: ["$persona_info.nombres", " ", "$persona_info.apellidos"] },
                        propiedad_id: "$propiedad_info._id",
                        tipo_propiedad: "$propiedad_info.tipo",
                        precio_propiedad: "$propiedad_info.precio",
                        contrato_id: "$contratos._id",
                        fecha_contrato: "$contratos.fecha_contrato",
                        numero_cuotas: "$contratos.numero_cuotas",
                        monto_cuota: "$contratos.monto_cuota"
                    },
                    total_contrato: { $sum: "$contratos.total" },
                    total_pagado: { $sum: { $ifNull: ["$pagos.monto", 0] } },
                    ultimo_pago: { $max: "$pagos.fecha_pago" },
                }
            },
            {
                $project: {
                    cliente_id: "$_id.cliente_id",
                    nombre_cliente: "$_id.nombre_cliente",
                    propiedad_id: "$_id.propiedad_id",
                    tipo_propiedad: "$_id.tipo_propiedad",
                    precio_propiedad: "$_id.precio_propiedad",
                    contrato_id: "$_id.contrato_id",
                    fecha_contrato: "$_id.fecha_contrato",
                    numero_cuotas: "$_id.numero_cuotas",
                    monto_cuota: "$_id.monto_cuota",
                    total_contrato: "$total_contrato",
                    total_pagado: "$total_pagado",
                    ultimo_pago: "$ultimo_pago",
                    saldo_pendiente: {
                        $subtract: [
                            "$total_contrato",
                            "$total_pagado"
                        ]
                    }
                }
            }
        ];

        // Ejecutar la agregación y crear la vista
        const cartera = await Customer.aggregate(carteraPipeline);
        console.log("Vista 'cartera' creada", cartera);

        // Cerrar la conexión
        await mongoose.connection.close();
        console.log("Conexión cerrada");
    } catch (error) {
        console.error("Error al conectar a MongoDB:", error);
    }
};

// Ejecutar la función de inicialización
initDatabase();
