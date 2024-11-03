import Person from "../models/people.js";

// Metodo de prueba
export const testPerson = (req, res) => { 
  return res.status(200).send({ 
      message: "Mensaje enviado desde el controlador de Personas" 
  }); 
};

// Crear persona
export const createPerson = async (req, res) => {
  try {

    //Obtener datos de la petición
    let person = req.body;

    // Validar que existan los datos requeridos obtenidos 
    if(!person.tip_doc || !person.doc_identifiacion || !person.nombres || !person.apellidos || !person.email || !person.telefono ){
      return res.status(400).send({
        status:"error",
        message:"Faltan datos por enviar"
      });
    }

    // Crear una nuevo objeto persona
    let person_to_save= new Person(person);

    // Control de persona duplicada
    let existingPerson = await Person.findOne({ doc_identifiacion: person.doc_identifiacion });

    // Si la persona ya existe, retornar error
    if(existingPerson){
      return res.status(409).send({
        status:"error",
        message:"La persona ya existe"
      });
    }

    // Guardar la nueva persona en la base de datos
    await person_to_save.save();

    res.status(201).json({
      status:"created",
      message:"Registro de persona exitoso",
      person_to_save
    });
  } catch (error) {
    console.log("Error al crear la persona:", error);
    res.status(500).send({
      status:"error",
      message:"Error en el registro de persona"
    });
  }
};

// Obtener todas las personas
export const getPeople = async (req, res) => {
  try {
    const people = await Person.find();
    res.json(people);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener persona por ID
export const getPersonById = async (req, res) => {
  try {
    const person = await Person.findById(req.params.id);
    if (!person) return res.status(404).json({ message: "Persona no encontrada" });
    res.json(person);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar persona
export const updatePerson = async (req, res) => {
  try {
    const person = await Person.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!person) return res.status(404).json({ message: "Persona no encontrada" });
    res.json(person);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar persona
export const deletePerson = async (req, res) => {
  try {
    const person = await Person.findByIdAndDelete(req.params.id);
    if (!person) return res.status(404).json({ message: "Persona no encontrada" });
    res.json({ message: "Persona eliminada" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};