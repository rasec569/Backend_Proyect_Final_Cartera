import { Router } from "express";
import {ensureAuth} from "../middlewares/auth.js";
import {
    createCustomer,
    getClients,
    getClientById,
    updateClient,
    deleteClient, 
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

// Actualizar cliente por ID
router.put("/:id", ensureAuth, updateClient);

// Cambiar el estado del cliente (marcar como eliminado)
router.patch("/:id", ensureAuth, deleteClient);
export default router;