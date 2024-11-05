import Property from "../models/properties.js";

// Metodo de prueba
export const tesProperty = (req, res) => {
  return res.status(200).send({
    message: "Mensaje enviado desde el controlador de Property"
  });
};

// Crear propiedad
export const createProperty = async (req, res) => {
  const propertyData = req.body;

  try {
    // Validación de campos requeridos
    const requiredFields = ["proyecto", "nombre", "tipo", "precio"];
    for (const field of requiredFields) {
      if (!propertyData[field]) {
        return res.status(400).send({
          status: "error",
          message: `El campo ${field} es requerido.`,
        });
      }
    }
    // valida que existe una propiedad con el mismo nombre
    const existingProperty = await Property.findOne({ nombre: propertyData.nombre });
    if (existingProperty) {
      return res.status(400).send({
        status: "error",
        message: "Ya existe una propiedad con el mismo nombre.",
      });
    }

    // Crear y guardar la nueva propiedad
    const property = new Property(propertyData);
    await property.save();

    return res.status(201).json({
      status: "created",
      message: "Propiedad creada con éxito.",
      property,
    });
  } catch (error) {
    console.error("Error al crear la propiedad:", error);

    // Manejo de error por duplicado
    if (error.code === 11000) { // Código de error para duplicados
      return res.status(400).json({
        status: "error",
        message: "El nombre de la propiedad ya existe.",
      });
    }

    return res.status(500).json({
      status: "error",
      message: "Error al crear la propiedad.",
      error: error.message,
    });
  }
};

// Obtener todas las propiedades con paginación
export const getProperties = async (req, res) => {
  let page = req.query.page ? parseInt(req.query.page, 10) : 1;
  let itemsPerPage = req.query.limit ? parseInt(req.query.limit, 10) : 10;

  try {
    const properties = await Property.find()
      .populate("proyecto")
      .sort({ _id: 1 })
      .skip((page - 1) * itemsPerPage)
      .limit(itemsPerPage);

    const totalDocs = await Property.countDocuments();
    const totalPages = Math.ceil(totalDocs / itemsPerPage);

    if (!properties || properties.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No hay propiedades para mostrar",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Propiedades encontradas",
      properties,
      totalDocs,
      totalPages,
      currentPage: page,
      itemsPerPage,
    });
  } catch (error) {
    console.error("Error al obtener las propiedades:", error);
    res.status(500).json({
      status: "error",
      message: "Error al obtener las propiedades",
      error: error.message,
    });
  }
};

// Obtener propiedad por ID
export const getPropertyById = async (req, res) => {
  const { id } = req.params;

  try {
    const property = await Property.findById(id).populate("proyecto");
    if (!property) {
      return res.status(404).json({
        status: "error",
        message: "Propiedad no encontrada",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Propiedad encontrada",
      property,
    });
  } catch (error) {
    console.error("Error al obtener la propiedad:", error);
    res.status(500).json({
      status: "error",
      message: "Error al obtener la propiedad",
      error: error.message,
    });
  }
};

// Actualizar propiedad
export const updateProperty = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const property = await Property.findByIdAndUpdate(id, updatedData, { new: true });
    if (!property) {
      return res.status(404).json({
        status: "error",
        message: "Propiedad no encontrada",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Propiedad actualizada con éxito",
      property,
    });
  } catch (error) {
    console.error("Error al actualizar la propiedad:", error);
    res.status(400).json({
      status: "error",
      message: "Error al actualizar la propiedad",
      error: error.message,
    });
  }
};

// Eliminar propiedad (marcar como inactiva)
export const deleteProperty = async (req, res) => {
  const { id } = req.params;
  let { estado } = req.body;

  try {
    //validar si estado viene vacio
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
    // Cambiar el estado de la propiedad
    const updatedProperty = await Property.findByIdAndUpdate(
      id,
      { estado},
      { new: true }
    );

    if (!updatedProperty) {
      return res.status(404).json({
        status: "error",
        message: "Propiedad no encontrada",
      });
    }

    return res.json({
      status: "success",
      message: estado ? "Propiedad activada" : "Propiedad marcada como inactiva",
      property: updatedProperty,
    });
  } catch (error) {
    console.error("Error al marcar la propiedad como inactiva:", error);
    res.status(500).json({
      status: "error",
      message: "Error al marcar la propiedad como inactiva.",
      error: error.message,
    });
  }
};