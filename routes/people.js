import { Router } from "express";
import {
    createPerson,
    getPeople,
    getPersonById,
    updatePerson,
    deletePerson, 
    testPerson
  } from "../controllers/person.js";

const router=Router();
router.get("/test", testPerson);
// Crear una nueva persona
router.post("/registrar", createPerson);

// Obtener todas las personas
router.get("/", getPeople);

// Obtener persona por ID
router.get("/:id", getPersonById);

// Actualizar persona por ID
router.put("/:id", updatePerson);

// Eliminar persona por ID
router.delete("/:id", deletePerson);

export default router;