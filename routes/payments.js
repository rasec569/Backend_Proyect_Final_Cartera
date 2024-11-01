import { Router } from "express";
import {
    createPayment,
    getPayments,
    getPaymentById,
    updatePayment,
    deletePayment
  } from "../controllers/payment.js";

const router=Router();
// Crear un nuevo pago
router.post("/", createPayment);

// Obtener todos los pagos
router.get("/", getPayments);

// Obtener pago por ID
router.get("/:id", getPaymentById);

// Actualizar pago por ID
router.put("/:id", updatePayment);

// Eliminar pago por ID
router.delete("/:id", deletePayment);

export default router;