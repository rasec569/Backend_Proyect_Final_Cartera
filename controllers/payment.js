import Payment from "../models/payments.js";

// Crear pago
export const createPayment = async (req, res) => {
  const paymentData = req.body;

  try {
    // Validación de campos requeridos
    const requiredFields = ["contrato", "fecha_pago", "monto"];
    for (const field of requiredFields) {
      if (!paymentData[field]) {
        return res.status(400).json({
          status: "error",
          message: `El campo ${field} es requerido.`,
        });
      }
    }

    // Validar que no haya un pago duplicado en la misma fecha para el mismo contrato
    const existingPayment = await Payment.findOne({ contrato: paymentData.contrato, fecha_pago: paymentData.fecha_pago });
    if (existingPayment) {
      return res.status(409).json({
        status: "error",
        message: "Ya existe un pago registrado en esta fecha para este contrato.",
      });
    }

    // Crear y guardar el nuevo pago
    const payment_to_save = new Payment(paymentData);
    await payment_to_save.save();

    return res.status(201).json({
      status: "created",
      message: "Pago creado con éxito.",
      payment: payment_to_save,
    });
  } catch (error) {
    console.error("Error al crear el pago:", error);
    return res.status(500).json({
      status: "error",
      message: "Error al crear el pago.",
      error: error.message,
    });
  }
};

// Obtener todos los pagos
export const getPayments = async (req, res) => {
  let page = req.params.page && !isNaN(req.params.page) ? parseInt(req.params.page, 10) : 1;
  let itemsPerPage = req.query.limit ? parseInt(req.query.limit, 10) : 10;

  try {
    const payments = await Payment.find()
      .populate("contrato")
      .sort({ fecha_pago: -1 })
      .skip((page - 1) * itemsPerPage)
      .limit(itemsPerPage);

    const totalDocs = await Payment.countDocuments();
    const totalPages = Math.ceil(totalDocs / itemsPerPage);

    if (!payments || payments.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No hay pagos para mostrar",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Pagos encontrados",
      payments,
      totalDocs,
      totalPages,
      currentPage: page,
      itemsPerPage,
    });
  } catch (error) {
    console.error("Error al obtener los pagos:", error);
    return res.status(500).json({
      status: "error",
      message: "Error al obtener los pagos",
      error: error.message,
    });
  }
};

// Obtener pago por ID
export const getPaymentById = async (req, res) => {
  const { id } = req.params;

  try {
    const payment = await Payment.findById(id).populate("contrato");
    if (!payment) {
      return res.status(404).json({
        status: "error",
        message: "Pago no encontrado",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Pago encontrado",
      payment,
    });
  } catch (error) {
    console.error("Error al obtener el pago:", error);
    return res.status(500).json({
      status: "error",
      message: "Error al obtener el pago",
      error: error.message,
    });
  }
};
// Obtener todos los pagos de un contrato
export const getPaymentsByContract = async (req, res) => {
  const { contratoId } = req.params;

  try {
    // Buscar todos los pagos asociados al contrato
    const payments = await Payment.find({ contrato: contratoId })
      .populate("contrato") // Incluye detalles del contrato
      .sort({ fecha_pago: -1 }); // Ordena por fecha de pago en orden descendente

    // Validar si hay pagos para el contrato
    if (payments.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No se encontraron pagos para este contrato.",
      });
    }

    // Devolver todos los pagos del contrato
    return res.status(200).json({
      status: "success",
      message: "Pagos encontrados para el contrato.",
      payments,
    });
  } catch (error) {
    console.error("Error al obtener pagos del contrato:", error);
    return res.status(500).json({
      status: "error",
      message: "Error al obtener pagos del contrato.",
      error: error.message,
    });
  }
};

//Reporte de ingresos mensuales/anuales
export const getIncomeReport = async (req, res) => {
  const { periodo } = req.query;
  const isMonthly = periodo === "mensual";
  const start = new Date(isMonthly ? new Date().getFullYear() : 0, 0, 1);

  try {
    const payments = await Payment.find({ fecha_pago: { $gte: start } });
    const incomeReport = payments.reduce((report, payment) => {
      const periodKey = isMonthly ? payment.fecha_pago.getMonth() : payment.fecha_pago.getFullYear();
      report[periodKey] = (report[periodKey] || 0) + payment.monto;
      return report;
    }, {});

    return res.status(200).json({
      status: "success",
      incomeReport,
    });
  } catch (error) {
    console.error("Error al generar reporte de ingresos:", error);
    return res.status(500).json({
      status: "error",
      message: "Error al generar reporte de ingresos",
      error: error.message,
    });
  }
};

// Actualizar pago
export const updatePayment = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    // Validación de campos requeridos
    const requiredFields = ["contrato", "fecha_pago", "monto"];
    for (const field of requiredFields) {
      if (!updatedData[field]) {
        return res.status(400).json({
          status: "error",
          message: `El campo ${field} es requerido.`,
        });
      }
    }

    const updatedPayment = await Payment.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updatedPayment) {
      return res.status(404).json({
        status: "error",
        message: "Pago no encontrado",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Pago actualizado con éxito",
      payment: updatedPayment,
    });
  } catch (error) {
    console.error("Error al actualizar el pago:", error);
    return res.status(400).json({
      status: "error",
      message: "Error al actualizar el pago",
      error: error.message,
    });
  }
};

// Eliminar pago
export const deletePayment = async (req, res) => {
  const { id } = req.params;
  let { estado } = req.body;

  try {
    if (estado === undefined) {
      estado = false;
    } else {
      estado = estado === 'true';
      if (typeof estado !== 'boolean') {
        return res.status(400).json({
          status: "error",
          message: "El estado debe ser un valor booleano (true o false)",
        });
      }
    }

    const updatedPayment = await Payment.findByIdAndUpdate(
      id,
      { estado },
      { new: true }
    );

    if (!updatedPayment) {
      return res.status(404).json({
        status: "error",
        message: "Pago no encontrado",
      });
    }

    return res.json({
      status: "success",
      message: "Pago marcado como inactivo",
      payment: updatedPayment,
    });
  } catch (error) {
    console.error("Error al marcar el pago como inactivo:", error);
    return res.status(500).json({
      status: "error",
      message: "Error al marcar el pago como inactivo.",
      error: error.message,
    });
  }
};