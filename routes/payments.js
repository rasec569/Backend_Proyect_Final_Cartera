import { Router } from "express";
import {ensureAuth} from "../middlewares/auth.js";
import {
    createPayment,
    getPayments,
    getPaymentById,
    updatePayment,
    deletePayment,
    getPaymentsByContract,
    getIncomeReport
  } from "../controllers/payment.js";

const router=Router();
// Crear un nuevo pago
router.post("/registrar", createPayment);

// Obtener todos los pagos
router.get("/all/:page?", ensureAuth, getPayments);
// Obtener pago por ID
router.get("/:id", ensureAuth, getPaymentById);
// Obtener pago por ID del contrato
router.get("/contrato/:id", ensureAuth, getPaymentsByContract);
// Reporte de ingresos mensuales/anuales
router.get("/reporte-ingresos?periodo=mensual", ensureAuth,);//GET /api/payments/reporte-ingresos?periodo=mensual o GET /api/payments/reporte-ingresos?periodo=anual

// Actualizar pago por ID
router.put("/:id", ensureAuth, updatePayment);

// Eliminar pago por ID
router.patch("/:id", ensureAuth, deletePayment);

export default router;