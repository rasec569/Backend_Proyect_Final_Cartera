import { Router } from "express";
import {
    createProperty,
    getProperties,
    getPropertyById,
    updateProperty,
    deleteProperty,
    tesProperty
  } from "../controllers/property.js";

const router=Router();
router.get("/test", tesProperty);
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