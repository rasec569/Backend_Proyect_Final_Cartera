import Contract from "../models/contracts.js";

// Crear contrato
export const createContract = async (req, res) => {
  try {
    const contract = new Contract(req.body);
    await contract.save();
    res.status(201).json(contract);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtener todos los contratos
export const getContracts = async (req, res) => {
  try {
    const contracts = await Contract.find().populate("cliente_id propiedad_id");
    res.json(contracts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener contrato por ID
export const getContractById = async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id).populate("cliente_id propiedad_id");
    if (!contract) return res.status(404).json({ message: "Contrato no encontrado" });
    res.json(contract);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar contrato
export const updateContract = async (req, res) => {
  try {
    const contract = await Contract.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!contract) return res.status(404).json({ message: "Contrato no encontrado" });
    res.json(contract);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar contrato
export const deleteContract = async (req, res) => {
  try {
    const contract = await Contract.findByIdAndDelete(req.params.id);
    if (!contract) return res.status(404).json({ message: "Contrato no encontrado" });
    res.json({ message: "Contrato eliminado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};