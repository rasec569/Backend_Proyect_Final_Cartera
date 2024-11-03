import Person from "../models/people.js";

// Metodo de prueba
export const testPerson = (req, res) => { 
  return res.status(200).send({ 
      message: "Mensaje enviado desde el controlador de Personas" 
  }); 
};

// Crear persona
export const createPerson = async (req, res) => {

  //Obtener datos de la petición
  let person = req.body;

  try {  
    // Validación de campos requeridos para persona
    const requiredPersonFields = ['tip_doc', 'doc_identificacion', 'nombres', 'apellidos', 'telefono'];
    for (const field of requiredPersonFields) {
        if (!person[field] || (field === 'doc_identificacion' && person[field] === '')) {
            return res.status(400).send({
                status: "error",
                message: `El campo ${field} es requerido para la persona.`,
            });
        }
    }

    // Crear una nuevo objeto persona
    let person_to_save= new Person(person);

    // Control de persona duplicada
    let existingPerson = await Person.findOne({ doc_identificacion: person.doc_identificacion });

    // Si la persona ya existe, retornar error
    if(existingPerson){
      return res.status(409).send({
        status:"error",
        message:"La persona ya existe"
      });
    }

    // Guardar la nueva persona en la base de datos
    await person_to_save.save();

    return res.status(201).json({
      status:"created",
      message:"Registro de persona exitoso",
      person_to_save
    });
  } catch (error) {
    console.log("Error al crear la persona:", error);
    return res.status(500).send({
      status:"error",
      message:"Error en el registro de persona"
    });
  }
};

// Obtener todas las personas
export const getPeople = async (req, res) => {
   // Obtener la página desde los parámetros de la solicitud
   let page=req.params.page? parseInt(req.params.page, 10) :1;

   // Obtener el número de personas por página desde los parámetros de la solicitud
   let itemsPorPage=req.params.limit? parseInt(req.params.limit, 10) :10;
   
  try {
    const options={
      page: page,
      limit: itemsPorPage,
      select: '-email -__v',
      sort: {
        nombres: 1,
        apellidos: 1
      }
    }

    // Obtener las personas paginadas
    const people = await Person.paginate({}, options);

    // Verificar si hay personas para mostrar
    if (!people||people.docs.length===0){
      return res.status(404).send({
        status: "error",
        message: "No hay personas para mostrar"
      });
    }

    // Retorna los personas
    return res.status(200).json({
      status: "success",
      message: "Persona encontrada",
      people: people.docs,
      totalDocs: people.totalDocs,
      totalPages: people.totalPages,
      currentPage: people.page,
      itemsPerPage: people.limit
    });
    
  } catch (error) {
    console.log("Error al obtener las persona", error);
    return res.status(500).json({
      status: "error",
      message: "Error al obtener las persona",
      error: error.message
    });
  }
};

// Obtener persona por ID
export const getPersonById = async (req, res) => {
  const personId = req.params.id;
  try {
    // Buscar la persona en la base de datos y excluir ciertos campos
    const person = await Person.findById(personId).select('-email -dirección -__v');

    // Verificar si la persona existe
    if (!person) {
      return res.status(404).send({
        status: "error",
        message: "Persona no encontrada"
      });
    }

    // Devolver la información de la persona
    return res.status(200).json({
      status: "success",
      message: "Persona encontrada",
      user: person
    });
  } catch (error) {
    console.log("Error al obtener la persona", error);
    return res.status(500).json({
      status: "error",
      message: "Error al obtener la persona",
      error: error.message
    });
  }
};

// Actualizar persona
export const updatePerson = async (req, res) => {

  const personId = req.params.id;
  const personToUpdate = req.body;

  try {
    // Validar campos requeridos
    const requiredFields = ['tip_doc', 'doc_identificacion', 'nombres', 'apellidos', 'email', 'telefono'];
    for (const field of requiredFields) {
      if (!personToUpdate[field]) {
        return res.status(400).send({
          status: "error",
          message: `El campo ${field} es requerido.`,
        });
      }
    }

    // Verificar si se intenta actualizar el doc_identificacion
    const existingPerson = await Person.findOne({
      doc_identificacion: personToUpdate.doc_identificacion,
      _id: { $ne: personId } // Excluir el ID actual
    });

    // Si se intenta actualizar el doc_identificacion y ya existe una persona con el mismo documento, retornar error
    if (existingPerson) {
      return res.status(409).send({
        status: "error",
        message: "El documento de identificación ya está en uso por otra persona.",
      });
    }

    // Buscar y actualizar la persona
    const updatedPerson = await Person.findByIdAndUpdate(personId, personToUpdate, { new: true });

    // Verificar si la persona existe
    if (!updatedPerson) {
      return res.status(404).send({ 
        status: "error",
        message: "Persona no encontrada",
      });
    }

    // Retornar la persona actualizada
    return res.status(200).json({
      status: "success",
      message: "Persona actualizada con éxito",
      person: updatedPerson,
    });
  } catch (error) {
    console.log("Error al actualizar la persona:", error);
    return res.status(500).json({
      status: "error",
      message: "Error al actualizar la persona",
      error: error.message,
    });
  }
};

// Eliminar persona
export const deletePerson = async (req, res) => {

  const personId = req.params.id;

  try {
    // Buscar la persona para verificar si existe antes de eliminarla
    const person = await Person.findById(personId);
    if (!person) {
      return res.status(404).send({
        status: "error",
        message: "Persona no encontrada",
      });
    }

    // Eliminar la persona
    await Person.findByIdAndDelete(personId);

    // Retornar mensaje de éxito
    return res.status(200).send({
      status: "success",
      message: "Persona eliminada con éxito",
    });
  } catch (error) {
    console.log("Error al eliminar la persona:", error);
    return res.status(500).send({
      status: "error",
      message: "Error al eliminar la persona",
      error: error.message,
    });
  }
};