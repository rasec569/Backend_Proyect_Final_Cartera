import Contract from "../models/contracts.js";

// Metodo de prueba
export const testContract = (req, res) => { 
  return res.status(200).send({ 
      message: "Mensaje enviado desde el controlador de Contratos" 
  }); 
};

// Crear contrato
export const createContract = async (req, res) => {
  const contractData = req.body;

  try {
    // Validación de campos requeridos
    const requiredFields = ["cliente", "propiedad", "fecha_contrato", "numero_cuotas", "monto_cuota", "total"];
    for (const field of requiredFields) {
      if (!contractData[field]) {
        return res.status(400).send({
          status: "error",
          message: `El campo ${field} es requerido.`,
        });
      }
    }

    // Validar que no exista un contrato activo con la misma propiedad
    const existingContract = await Contract.findOne({ propiedad: contractData.propiedad });
    if (existingContract) {
      return res.status(409).send({
        status: "error",
        message: "Ya existe un contrato activo para esta propiedad.",
      });
    }

    // Crear y guardar el nuevo contrato
    const contract_to_save = new Contract(contractData);
    await contract_to_save.save();

    res.status(201).json({
      status: "created",
      message: "Contrato creado con éxito.",
      contract: contract_to_save,
    });
  } catch (error) {
    console.error("Error al crear el contrato:", error);
    res.status(500).json({
      status: "error",
      message: "Error al crear el contrato.",
      error: error.message,
    });
  }
};

// Obtener todos los contratos
export const getContracts = async (req, res) => {
  let page = req.params.page ? parseInt(req.params.page, 10) : 1;
  let itemsPerPage = req.params.limit ? parseInt(req.params.limit, 10) : 10;

  try {
    const contracts = await Contract.find()
      .populate("cliente propiedad")
      .sort({ _id: 1 })
      .skip((page - 1) * itemsPerPage)
      .limit(itemsPerPage);

    const totalDocs = await Contract.countDocuments();
    const totalPages = Math.ceil(totalDocs / itemsPerPage);

    if (!contracts || contracts.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No hay contratos para mostrar",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Contratos encontrados",
      contracts,
      totalDocs,
      totalPages,
      currentPage: page,
      itemsPerPage,
    });
  } catch (error) {
    console.error("Error al obtener los contratos:", error);
    res.status(500).json({
      status: "error",
      message: "Error al obtener los contratos",
      error: error.message,
    });
  }
};

// Obtener contrato por ID
export const getContractById = async (req, res) => {
  const { id } = req.params;

  try {
    const contract = await Contract.findById(id).populate("cliente propiedad");
    if (!contract) {
      return res.status(404).json({
        status: "error",
        message: "Contrato no encontrado",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Contrato encontrado",
      contract,
    });
  } catch (error) {
    console.error("Error al obtener el contrato:", error);
    res.status(500).json({
      status: "error",
      message: "Error al obtener el contrato",
      error: error.message,
    });
  }
};

// Actualizar contrato
export const updateContract = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const contract = await Contract.findByIdAndUpdate(id, updatedData, { new: true });
    if (!contract) {
      return res.status(404).json({
        status: "error",
        message: "Contrato no encontrado",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Contrato actualizado con éxito",
      contract,
    });
  } catch (error) {
    console.error("Error al actualizar el contrato:", error);
    res.status(400).json({
      status: "error",
      message: "Error al actualizar el contrato",
      error: error.message,
    });
  }
};

// Obtener propiedades de un cliente
export const getPropertiesByClient = async (req, res) => {
  const { clienteId } = req.params;

  try {
    const contracts = await Contract.find({ cliente: clienteId }).populate("propiedad");
    if (contracts.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No se encontraron propiedades para este cliente.",
      });
    }
    res.json({
      status: "success",
      message: "Propiedades encontradas para el cliente.",
      properties: contracts.map(contract => contract.propiedad),
    });
  } catch (error) {
    console.error("Error al obtener propiedades del cliente:", error);
    res.status(500).json({
      status: "error",
      message: "Error al obtener propiedades del cliente.",
      error: error.message,
    });
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