import { Router } from "express";
import {
    createPerson,
    getPeople,
    getPersonById,
    updatePerson,
    deletePerson, 
    testPerson
  } from "../controllers/person.js";
import {ensureAuth} from "../middlewares/auth.js";

const router=Router();
router.get("/test", testPerson);
// Crear una nueva persona
router.post("/registrar", ensureAuth, createPerson);

// Obtener todas las personas
router.get("/all/:page?", ensureAuth, getPeople);

// Obtener persona por ID
router.get("/:id", ensureAuth, getPersonById);

// Actualizar persona por ID
router.put("/:id", ensureAuth, updatePerson);

// Eliminar persona por ID
router.patch("/:id", ensureAuth, deletePerson);

export default router;