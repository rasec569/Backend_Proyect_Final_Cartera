import { Router } from "express";
import {
    createCustomer,
    getClients,
    getClientById,
    updateClient,
    deleteClient
  } from "../controllers/customer.js";

const router=Router();
// Crear un nuevo cliente y persona
router.post("/", createCustomer);

// Obtener todos los clientes
router.get("/", getClients);

// Obtener cliente por ID
router.get("/:id", getClientById);

// Actualizar cliente por ID
router.put("/:id", updateClient);

// Cambiar el estado del cliente (marcar como eliminado)
router.patch("/:id", deleteClient);
export default router;