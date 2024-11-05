import { Router } from "express";
import {
    createProject,
    getProjects,
    getProjectById,
    updateProject,
    deleteProject,
    testProject
  } from "../controllers/project.js";

const router=Router();
router.get("/test", testProject)
// Crear un nuevo proyecto
router.post("/registrar", createProject);

// Obtener todos los proyectos
router.get("/all/:page?", getProjects);

// Obtener proyecto por ID
router.get("/:id", getProjectById);

// Actualizar proyecto por ID
router.put("/:id", updateProject);

// Eliminar proyecto por ID
router.patch("/:id", deleteProject);

export default router;