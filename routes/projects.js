import { Router } from "express";
import {
    createProject,
    getProjects,
    getProjectById,
    updateProject,
    deleteProject
  } from "../controllers/projectController.js";

const router=Router();
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