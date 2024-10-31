import Payment from "../models/payments.js";

// Crear pago
export const createPayment = async (req, res) => {
  try {
    const payment = new Payment(req.body);
    await payment.save();
    res.status(201).json(payment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtener todos los pagos
export const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate("contrato_id");
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener pago por ID
export const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate("contrato_id");
    if (!payment) return res.status(404).json({ message: "Pago no encontrado" });
    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar pago
export const updatePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!payment) return res.status(404).json({ message: "Pago no encontrado" });
    res.json(payment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar pago
export const deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    if (!payment) return res.status(404).json({ message: "Pago no encontrado" });
    res.json({ message: "Pago eliminado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};