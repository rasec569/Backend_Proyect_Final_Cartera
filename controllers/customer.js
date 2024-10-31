import Customer from "../models/clients.js";
import Person from "../models/people.js";

// Crear persona y cliente
export const createCustomer = async (req, res) => {
    const { tip_doc, doc_identifiacion, nombres, apellidos, email, telefono, direccion } = req.body.persona;
    const { contacto, estado } = req.body.cliente;

    try {
        // Verificar si la persona ya existe por documento de identificación
        let person = await Person.findOne({ doc_identifiacion });

        // Si la persona no existe, crearla
        if (!person) {
            person = new Person({ tip_doc, doc_identifiacion, nombres, apellidos, email, telefono, direccion });
            await person.save();
        }

        // Crear el cliente asociado a la persona
        const newCustomer = new Customer({ persona: person._id, contacto, estado });
        const savedCustomer = await newCustomer.save();

        res.status(201).json({
            message: "Cliente creado con éxito.",
            cliente: savedCustomer,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener todos los clientes
export const getClients = async (req, res) => {
    try {
        const customers = await Customer.find({ estado: true }).populate("persona");
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener cliente por ID
export const getClientById = async (req, res) => {
    const { id } = req.params;

    try {
        const customer = await Customer.findOne({ _id: id, estado: true }).populate("persona");
        if (!customer) {
            return res.status(404).json({ message: "Cliente no encontrado." });
        }
        res.status(200).json(customer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar cliente
export const updateClient = async (req, res) => {
    const { id } = req.params;
    const { contacto, estado } = req.body.cliente;

    try {
        const updatedCustomer = await Customer.findByIdAndUpdate(
            id,
            { contacto, estado },
            { new: true }
        );

        if (!updatedCustomer) {
            return res.status(404).json({ message: "Cliente no encontrado." });
        }

        res.status(200).json({
            message: "Cliente actualizado con éxito.",
            cliente: updatedCustomer,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar cliente
export const deleteClient = async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;

    try {
        const updatedCustomer = await Customer.findByIdAndUpdate(
            id,
            { estado },
            { new: true }
        );

        if (!updatedCustomer) {
            return res.status(404).json({ message: "Cliente no encontrado." });
        }

        res.status(200).json({
            message: "Estado del cliente actualizado con éxito.",
            cliente: updatedCustomer,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};