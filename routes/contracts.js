import { Router } from "express";
import {
    createContract,
    getContracts,
    getContractById,
    updateContract,
    deleteContract
  } from "../controllers/contract.js";

const router=Router();
// Crear un nuevo contrato
router.post("/", createContract);

// Obtener todos los contratos
router.get("/", getContracts);

// Obtener contrato por ID
router.get("/:id", getContractById);

// Actualizar contrato por ID
router.put("/:id", updateContract);

// Eliminar contrato por ID
router.delete("/:id", deleteContract);

export default router;