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

    return res.status(201).json({
      status: "created",
      message: "Contrato creado con éxito.",
      contract: contract_to_save,
    });
  } catch (error) {
    console.error("Error al crear el contrato:", error);
    return res.status(500).json({
      status: "error",
      message: "Error al crear el contrato.",
      error: error.message,
    });
  }
};

// Obtener todos los contratos
export const getContracts = async (req, res) => {
  // Validar el parámetro de página, usa 1 como valor predeterminado si no se especifica
  let page = req.params.page && !isNaN(req.params.page) ? parseInt(req.params.page, 10) : 1;
  // Definir el límite predeterminado de elementos por página
  let itemsPerPage = req.query.limit ? parseInt(req.query.limit, 10) : 10;

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
    return res.status(500).json({
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

    return res.status(200).json({
      status: "success",
      message: "Contrato encontrado",
      contract,
    });
  } catch (error) {
    console.error("Error al obtener el contrato:", error);
    return res.status(500).json({
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
    // validar que los campos requeridos no esten vacios o nulos
    const requiredFields = ["cliente", "propiedad", "fecha_contrato", "numero_cuotas", "monto_cuota", "total"];
    for (const field of requiredFields) {
      if (!updatedData[field]) {
        return res.status(400).send({
          status: "error",
          message: `El campo ${field} es requerido.`,
        });
      }
    }
    // Validar que no exista un contrato activo con la misma propiedad
    const existingContract = await Contract.findOne({ propiedad: updatedData.propiedad, _id: { $ne: id } });
    if (existingContract) {
      return res.status(409).send({
        status: "error",
        message: "Ya existe un contrato activo para esta propiedad.",
      });
    }

    const updateContract = await Contract.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updateContract) {
      return res.status(404).json({
        status: "error",
        message: "Contrato no encontrado",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Contrato actualizado con éxito",
      updateContract,
    });
  } catch (error) {
    console.error("Error al actualizar el contrato:", error);
    return res.status(400).json({
      status: "error",
      message: "Error al actualizar el contrato",
      error: error.message,
    });
  }
};

// Obtener todos los contratos de un cliente
export const getContractsByClient = async (req, res) => {
  const { id } = req.params;

  try {
    // Buscar todos los contratos asociados al cliente
    const contracts = await Contract.find({ cliente: id })
      .populate("cliente propiedad") // Incluye detalles de cliente y propiedad
      .sort({ fecha_contrato: -1 }); // Ordena si es necesario, por ejemplo, por fecha de contrato descendente

    // Validar si hay contratos para el cliente
    if (contracts.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No se encontraron contratos para este cliente.",
      });
    }

    // Devolver todos los contratos del cliente
    return res.status(200).json({
      status: "success",
      message: "Contratos encontrados para el cliente.",
      contracts,
    });
  } catch (error) {
    console.error("Error al obtener contratos del cliente:", error);
    return res.status(500).json({
      status: "error",
      message: "Error al obtener contratos del cliente.",
      error: error.message,
    });
  }
};
//Obtener saldo pendiente por contrato
export const getPendingBalanceByContract = async (req, res) => {
  const { id } = req.params;

  try {
    const contract = await Contract.findById(id).populate("pagos");
    if (!contract) {
      return res.status(404).json({
        status: "error",
        message: "Contrato no encontrado",
      });
    }

    const totalPaid = contract.pagos.reduce((sum, payment) => sum + payment.monto, 0);
    const pendingBalance = contract.total - totalPaid;

    return res.status(200).json({
      status: "success",
      pendingBalance,
    });
  } catch (error) {
    console.error("Error al obtener el saldo pendiente del contrato:", error);
    return res.status(500).json({
      status: "error",
      message: "Error al obtener el saldo pendiente del contrato",
      error: error.message,
    });
  }
};

//Obtener contratos próximos a vencer o con pagos atrasados
export const getContractsDueSoon = async (req, res) => {
  const daysToDue = 7; // Días para notificación de vencimiento próximo

  try {
    const contracts = await Contract.find().populate("pagos");

    const dueSoonContracts = contracts.filter(contract => {
      //const nextPaymentDate = /* lógica para calcular la próxima fecha de pago */;
      return (nextPaymentDate - Date.now()) <= daysToDue * 86400000;
    });

    if (!dueSoonContracts.length) {
      return res.status(404).json({
        status: "error",
        message: "No hay contratos próximos a vencer",
      });
    }

    return res.status(200).json({
      status: "success",
      dueSoonContracts,
    });
  } catch (error) {
    console.error("Error al obtener contratos próximos a vencer:", error);
    return res.status(500).json({
      status: "error",
      message: "Error al obtener contratos próximos a vencer",
      error: error.message,
    });
  }
};

// Eliminar contrato
export const deleteContract = async (req, res) => {
  const { id } = req.params;
  let { estado } = req.body;

  try {
    // Si 'estado' no se envía en el cuerpo, establecerlo en false
    if (estado === undefined) {
      estado = false;
    } else {
      // Convertir 'estado' a un valor booleano explícito
      if (estado === 'true') estado = true;
      else if (estado === 'false') estado = false;

      // Validar que 'estado' sea un booleano
      if (typeof estado !== 'boolean') {
        return res.status(400).json({
          status: "error",
          message: "El estado debe ser un valor booleano (true o false)",
        });
      }
    }
    // Cambiar el estado del contrato a false en lugar de eliminarlo
    const updatedContract = await Contract.findByIdAndUpdate(
      id,
      { estado },
      { new: true }
    );

    if (!updatedContract) {
      return res.status(404).json({
        status: "error",
        message: "Contrato no encontrado",
      });
    }

    return res.json({
      status: "success",
      message: "Contrato marcado como inactivo",
      contract: updatedContract,
    });
  } catch (error) {
    console.error("Error al marcar el contrato como inactivo:", error);
    return res.status(500).json({
      status: "error",
      message: "Error al marcar el contrato como inactivo.",
      error: error.message,
    });
  }
};