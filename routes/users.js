import { Router } from "express";
import {
    createdUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    tesUser
  } from "../controllers/user.js";

const router=Router();

router.get("/test", tesUser);
// Crear una nueva persona y usuario
router.post("/", createdUser);

// Obtener todos los usuarios
router.get("/", getAllUsers);

// Obtener usuario por ID
router.get("/:id", getUserById);

// Actualizar usuario por ID
router.put("/:id", updateUser);

// Cambiar el estado del usuario (marcar como eliminado)
router.patch("/:id", deleteUser);

export default router;