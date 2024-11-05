import { Router } from "express";
import {ensureAuth} from "../middlewares/auth.js";
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
router.post("/registrar", ensureAuth, createProperty);

// Obtener todas las propiedades
router.get("/all/:page?", ensureAuth, getProperties);

// Obtener propiedad por ID
router.get("/:id", ensureAuth, getPropertyById);

// Actualizar propiedad por ID
router.put("/:id", ensureAuth, updateProperty);

// Eliminar propiedad por ID
router.patch("/:id", ensureAuth, deleteProperty);

export default router;