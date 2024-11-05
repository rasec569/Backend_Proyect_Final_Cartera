import { Router } from "express";
import {ensureAuth} from "../middlewares/auth.js";
import {
    createCustomer,
    getClients,
    getClientById,
    updateClient,
    deleteClient, 
    getPaymentHistoryByClient,
    getPendingPaymentsByClient,
    testCustomer
  } from "../controllers/customer.js";

const router=Router();

router.get("/test", testCustomer);
// Crear un nuevo cliente y persona
router.post("/registrar", ensureAuth, createCustomer);

// Obtener todos los clientes
router.get("/all/:page?", ensureAuth, getClients);

// Obtener cliente por ID
router.get("/:id", ensureAuth, getClientById);

// Obtener historial de pagos por cliente
router.get("/pagos/:id", ensureAuth, getPaymentHistoryByClient);//Terminar y validar

//Obtener pagos pendientes por cliente
router.get("/pendientes/:id", ensureAuth, getPendingPaymentsByClient);//Terminar y validar

//Obtener clientes con contratos impagos o saldo vencido
router.get("/vencido/:id", ensureAuth, getPendingPaymentsByClient);//Terminar y validar

// Actualizar cliente por ID
router.put("/:id", ensureAuth, updateClient);

// Cambiar el estado del cliente (marcar como eliminado)
router.patch("/:id", ensureAuth, deleteClient);
export default router;