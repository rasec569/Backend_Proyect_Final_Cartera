import Project from "../models/projects.js";

// Método de prueba
export const testProject = (req, res) => {
  return res.status(200).send({
    message: "Mensaje enviado desde el controlador de Proyectos"
  });
};

// Crear proyecto
export const createProject = async (req, res) => {
  const projectData = req.body;

  try {
    // Validación de campos requeridos
    const requiredFields = ["nombre", "ubicación", "fecha_inicio", "estado"];
    for (const field of requiredFields) {
      if (!projectData[field]) {
        return res.status(400).send({
          status: "error",
          message: `El campo ${field} es requerido.`,
        });
      }
    }
    // validar si el project existe
    const existingProject = await Project.findOne({ nombre: projectData.nombre });
    if (existingProject) {
      return res.status(409).send({
        status: "error",
        message: "El nombre del proyecto ya está en uso.",
      });
    }
    // Crear y guardar el nuevo proyecto
    const project = new Project(projectData);
    await project.save();

    return res.status(201).json({
      status: "created",
      message: "Proyecto creado con éxito.",
      project,
    });
  } catch (error) {
    console.error("Error al crear el proyecto:", error);
    return res.status(500).json({
      status: "error",
      message: "Error al crear el proyecto.",
      error: error.message,
    });
  }
};

// Obtener todos los proyectos
export const getProjects = async (req, res) => {

  let page = req.params.page ? parseInt(req.params.page, 10) : 1;
  let itemsPerPage = req.params.limit ? parseInt(req.params.limit, 10) : 10;

  try {
    const options = {
      page: page,
      limit: itemsPerPage,
      select: '-__v',  // Excluir campos no deseados
      sort: { nombre: 1 }  // Ordenar por nombre de proyecto
    };

    // Obtener solo los proyectos con estado = true
    const projects = await Project.paginate({ estado: true }, options);

    // Verificar si hay proyectos para mostrar
    if (!projects || projects.docs.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No hay proyectos activos para mostrar"
      });
    }

    // Retorna los proyectos activos
    return res.status(200).json({
      status: "success",
      message: "Proyectos activos encontrados",
      projects: projects.docs,
      totalDocs: projects.totalDocs,
      totalPages: projects.totalPages,
      currentPage: projects.page,
      itemsPerPage: projects.limit
    });

  } catch (error) {
    console.error("Error al obtener los proyectos activos:", error);
    return res.status(500).json({
      status: "error",
      message: "Error al obtener los proyectos activos",
      error: error.message
    });
  }
};

// Obtener proyecto por ID
export const getProjectById = async (req, res) => {
  const { id } = req.params;

  try {
    const project = await Project.findById(id).select('-__v');
    if (!project) {
      return res.status(404).json({
        status: "error",
        message: "Proyecto no encontrado",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Proyecto encontrado",
      project,
    });
  } catch (error) {
    console.error("Error al obtener el proyecto:", error);
    res.status(500).json({
      status: "error",
      message: "Error al obtener el proyecto",
      error: error.message,
    });
  }
};

// Actualizar proyecto
export const updateProject = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    // Validar que los campos requeridos no estén vacíos o nulos
    const requiredFields = ["nombre", "ubicación", "fecha_inicio", "estado"];
    for (const field of requiredFields) {
      if (!updatedData[field]) {
        return res.status(400).send({
          status: "error",
          message: `El campo ${field} es requerido.`,
        });
      }
    }
    // Varificar que no se use el nombre de un project existente
    const existingProject = await Project.findOne({
      nombre: updatedData.nombre,
      _id: { $ne: id },
    });
    if (existingProject) {
      return res.status(409).send({
        status: "error",
        message: "El nombre del proyecto ya está en uso.",
      });
    }
    const updateProject = await Project.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updateProject) {
      return res.status(404).json({
        status: "error",
        message: "Proyecto no encontrado",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Proyecto actualizado con éxito",
      updateProject,
    });
  } catch (error) {
    console.error("Error al actualizar el proyecto:", error);
    res.status(400).json({
      status: "error",
      message: "Error al actualizar el proyecto",
      error: error.message,
    });
  }
};

// Eliminar proyecto (marcar como inactivo)
export const deleteProject = async (req, res) => {
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

    // Cambiar el estado del proyecto
    const project = await Project.findByIdAndUpdate(id, { estado }, { new: true });

    if (!project) {
      return res.status(404).json({
        status: "error",
        message: "Proyecto no encontrado",
      });
    }

    return res.json({
      status: "success",
      message: estado ? "Proyecto activado" : "Proyecto marcado como inactivo",
      project: project,
    });
  } catch (error) {
    console.error("Error al actualizar el estado del proyecto:", error);
    res.status(500).json({
      status: "error",
      message: "Error al actualizar el estado del proyecto.",
      error: error.message,
    });
  }
};
