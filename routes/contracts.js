import { Router } from "express";
import {ensureAuth} from "../middlewares/auth.js";
import {
    createContract,
    getContracts,
    getContractById,
    updateContract,
    deleteContract,
    getPropertiesByClient,
    testContract
  } from "../controllers/contract.js";

const router=Router();

// Prueba de contrato
router.get("/test", testContract);

// Crear un nuevo contrato
router.post("/", ensureAuth, createContract);

// Obtener todos los contratos
router.get("/all/:page?:", ensureAuth, getContracts);

// Obtener contrato por ID
router.get("/:id", ensureAuth, getContractById);

// Actualizar contrato por ID
router.put("/:id", ensureAuth, updateContract);

// Eliminar contrato por ID
router.delete("/:id", ensureAuth, deleteContract);

// Ruta para obtener propiedades de un cliente
router.get('/:clienteId/properties', ensureAuth, getPropertiesByClient);

export default router;