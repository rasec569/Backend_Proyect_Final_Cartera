import { Router } from "express";
import {ensureAuth} from "../middlewares/auth.js";
import {
    createContract,
    getContracts,
    getContractById,
    updateContract,
    deleteContract,
    getContractsByClient,
    getPendingBalanceByContract ,
    getContractsDueSoon ,

    testContract
  } from "../controllers/contract.js";

const router=Router();

// Prueba de contrato
router.get("/test", testContract);

// Crear un nuevo contrato
router.post("/registrar", ensureAuth, createContract);

// Definir la ruta para obtener todos los contratos con paginación
router.get("/all/:page?", ensureAuth, getContracts);

// Ruta para obtener contratos de un cliente
router.get('/contract/:id', ensureAuth, getContractsByClient); //validar que no trae la informacion de todas las propiedades

// Ruta para obtener saldo pendiente por contrato
router.get('/pendiente/:id', ensureAuth, getPendingBalanceByContract);//Terminar y validar

// Ruta para obtener contratos próximos a vencer o con pagos atrasados
router.get('/:vencimientos', ensureAuth, getContractsDueSoon );//Coregir error Terminar y validar

// Definir la ruta para obtener un contrato por ID
router.get("/:id", ensureAuth, getContractById);

// Actualizar contrato por ID
router.put("/:id", ensureAuth, updateContract);

// Eliminar contrato por ID
router.patch("/:id", ensureAuth, deleteContract);



export default router;