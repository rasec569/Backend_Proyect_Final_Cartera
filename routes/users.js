import { Router } from "express";
import {
    createdUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    tesUser,
    login
  } from "../controllers/user.js";
import {ensureAuth} from "../middlewares/auth.js";

const router=Router();

router.get("/test", tesUser);
// login
router.post("/login", login);
// Crear una nueva persona y usuario
router.post("/registrar", ensureAuth, createdUser);

// Obtener todos los usuarios
router.get("/:page?", ensureAuth, getAllUsers);

// Obtener usuario por ID
router.get("/:id", ensureAuth, getUserById);

// Actualizar usuario por ID
router.put("/:id", ensureAuth, updateUser);

// Cambiar el estado del usuario (marcar como eliminado)
router.patch("/:id", ensureAuth, deleteUser);

export default router;