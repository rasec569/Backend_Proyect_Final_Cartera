import { Router } from "express";
import {
    createProperty,
    getProperties,
    getPropertyById,
    updateProperty,
    deleteProperty
  } from "../controllers/propertyController.js";

const router=Router();
// Crear una nueva propiedad
router.post("/", createProperty);

// Obtener todas las propiedades
router.get("/", getProperties);

// Obtener propiedad por ID
router.get("/:id", getPropertyById);

// Actualizar propiedad por ID
router.put("/:id", updateProperty);

// Eliminar propiedad por ID
router.delete("/:id", deleteProperty);

export default router;