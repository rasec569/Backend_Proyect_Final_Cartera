import Person from "../models/people.js";
import Client from "../models/clients.js";

// Crear persona
export const createPerson = async (req, res) => {
  try {
    const person = new Person(req.body);
    await person.save();
    res.status(201).json(person);
  } catch (error) {
    res.status(400).json({ error: error.message });
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