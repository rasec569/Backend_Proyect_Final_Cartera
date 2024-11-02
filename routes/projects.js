import { Router } from "express";
import {
    createProject,
    getProjects,
    getProjectById,
    updateProject,
    deleteProject,
    tesProject
  } from "../controllers/project.js";

const router=Router();
router.get("/test", tesProject)
// Crear un nuevo proyecto
router.post("/", createProject);

// Obtener todos los proyectos
router.get("/", getProjects);

// Obtener proyecto por ID
router.get("/:id", getProjectById);

// Actualizar proyecto por ID
router.put("/:id", updateProject);

// Eliminar proyecto por ID
router.delete("/:id", deleteProject);

export default router;