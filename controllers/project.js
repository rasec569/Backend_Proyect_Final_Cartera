import Project from "../models/projects.js";

// Metodo de prueba
export const tesProject = (req, res) => { 
  return res.status(200).send({ 
      message: "Mensaje enviado desde el controlador de Proyectos" 
  }); 
};
// Crear proyecto
export const createProject = async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtener todos los proyectos
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener proyecto por ID
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Proyecto no encontrado" });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar proyecto
export const updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!project) return res.status(404).json({ message: "Proyecto no encontrado" });
    res.json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar proyecto
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: "Proyecto no encontrado" });
    res.json({ message: "Proyecto eliminado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};