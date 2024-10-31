import Property from "../models/properties.js";

// Crear propiedad
export const createProperty = async (req, res) => {
  try {
    const property = new Property(req.body);
    await property.save();
    res.status(201).json(property);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtener todas las propiedades
export const getProperties = async (req, res) => {
  try {
    const properties = await Property.find().populate("proyecto_id");
    res.json(properties);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener propiedad por ID
export const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate("proyecto_id");
    if (!property) return res.status(404).json({ message: "Propiedad no encontrada" });
    res.json(property);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar propiedad
export const updateProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!property) return res.status(404).json({ message: "Propiedad no encontrada" });
    res.json(property);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar propiedad
export const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) return res.status(404).json({ message: "Propiedad no encontrada" });
    res.json({ message: "Propiedad eliminada" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};