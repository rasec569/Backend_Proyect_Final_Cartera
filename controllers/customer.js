import Customer from "../models/clients.js";
import Person from "../models/people.js";

// Metodo de prueba
export const testCustomer = (req, res) => {
    return res.status(200).send({
        message: "Mensaje enviado desde el controlador de cliente"
    });
};
// Crear persona y cliente
export const createCustomer = async (req, res) => {
    const params = req.body;
    // Definir el objeto `persona` 
    const persona = {
        tip_doc: params.tip_doc,
        doc_identificacion: params.doc_identificacion,
        nombres: params.nombres,
        apellidos: params.apellidos,
        email: params.email,
        telefono: params.telefono,
        direccion: params.direccion,
    };

    // Definir el objeto `customer`
    const customer = {
        contacto: params.contacto,
        estado: params.estado,
    };

    try {
        // Validación de campos requeridos para persona
        const requiredPersonFields = ['tip_doc', 'doc_identificacion', 'nombres', 'apellidos', 'telefono'];
        for (const field of requiredPersonFields) {
            if (!persona[field]) {
                return res.status(400).send({
                    status: "error",
                    message: `El campo ${field} es requerido para la persona.`,
                });
            }
        }

        // Validación de campos requeridos para cliente
        const requiredClientFields = ['contacto', 'estado'];
        for (const field of requiredClientFields) {
            if (customer[field] === undefined || customer[field] === '') {
                return res.status(400).send({
                    status: "error",
                    message: `El campo ${field} es requerido para el cliente.`,
                });
            }
        }

        // Verificar si la persona ya existe por documento de identificación
        let person = await Person.findOne({ doc_identificacion: persona.doc_identificacion });

        // Si la persona no existe, crearla
        if (!person) {
            person = new Person(persona);
            await person.save();
        }

        // Verificar si ya existe un cliente asociado a esta persona
        const existingCustomer = await Customer.findOne({ persona: person._id });
        if (existingCustomer) {
            return res.status(409).send({
                status: "error",
                message: "La persona ya está registrada como cliente.",
            });
        }

        // Crear el cliente asociado a la persona
        const newCustomer = new Customer({ persona: person._id, ...customer });
        const savedCustomer = await newCustomer.save();

        res.status(201).json({
            status: "created",
            message: "Cliente creado con éxito.",
            cliente: savedCustomer,
        });
    } catch (error) {
        console.error("Error al crear el cliente", error);
        res.status(500).json({
            status: "error",
            message: "Error al crear el cliente",
            error: error.message,
        });
    }
};

export const getClients = async (req, res) => {
    let page = req.params.page ? parseInt(req.params.page, 10) : 1;
    let itemsPerPage = req.params.limit ? parseInt(req.params.limit, 10) : 10;

    try {
        // Usa el método paginate en lugar de find
        const options = {
            page,
            limit: itemsPerPage,
            populate: "persona",
            sort: { _id: 1 },
        };

        const customer = await Customer.paginate({ estado: true }, options);

        if (!customer.docs || customer.docs.length === 0) {
            return res.status(404).send({
                status: "error",
                message: "No hay clientes para mostrar",
            });
        }

        return res.status(200).json({
            status: "success",
            message: "Clientes encontrados",
            people: customer.docs,
            totalDocs: customer.totalDocs,
            totalPages: customer.totalPages,
            currentPage: customer.page,
            itemsPerPage: customer.limit,
        });
    } catch (error) {
        console.error("Error al obtener los clientes", error);
        res.status(500).json({
            status: "error",
            message: "Error al obtener los clientes",
            error: error.message,
        });
    }
};

// Obtener cliente por ID
export const getClientById = async (req, res) => {

    const customerId = req.params.id;

    try {
        const customer = await Customer.findOne({ _id: customerId, estado: true }).populate("persona");
        if (!customer) {
            return res.status(404).json({
                status: "error",
                message: "Cliente no encontrado",
            });
        }

        res.status(200).json({
            status: "success",
            message: "Cliente encontrado",
            cliente: customer,
        });
    } catch (error) {
        console.error("Error al obtener el cliente", error);
        res.status(500).json({
            status: "error",
            message: "Error al obtener el cliente",
            error: error.message,
        });
    }
};

// Actualizar cliente
export const updateClient = async (req, res) => {
    const customerId = req.params.id;
    const customerToUpdate = req.body;

    try {
        // Validación de campos requeridos para cliente
        const requiredClientFields = ['conctacto', 'estado'];
        for (const field of requiredClientFields) {
            if (!customerToUpdate[field]) {
                return res.status(400).send({
                    status: "error",
                    message: `El campo ${field} es requerido para el cliente.`,
                });
            }
        }

        const updatedCustomer = await Customer.findByIdAndUpdate(customerId, customerToUpdate, { new: true });

        if (!updatedCustomer) {
            return res.status(404).json({
                status: "error",
                message: "Cliente no encontrado",
            });
        }

        res.status(200).json({
            status: "success",
            message: "Cliente actualizado con éxito",
            cliente: updatedCustomer,
        });
    } catch (error) {
        console.error("Error al actualizar el cliente", error);
        res.status(500).json({
            status: "error",
            message: "Error al actualizar el cliente",
            error: error.message,
        });
    }
};

//Obtener historial de pagos por cliente
export const getPaymentHistoryByClient = async (req, res) => {
    const { id } = req.params;

    try {
        const payments = await Payment.find({ cliente: id }).populate("contrato");

        if (!payments.length) {
            return res.status(404).json({
                status: "error",
                message: "No se encontraron pagos para este cliente",
            });
        }

        return res.status(200).json({
            status: "success",
            payments,
        });
    } catch (error) {
        console.error("Error al obtener el historial de pagos del cliente:", error);
        return res.status(500).json({
            status: "error",
            message: "Error al obtener el historial de pagos del cliente",
            error: error.message,
        });
    }
};
//Obtener pagos pendientes por cliente

export const getPendingPaymentsByClient = async (req, res) => {
    const { id } = req.params;

    try {
        const contracts = await Contract.find({ cliente: id, estado: true }).populate("pagos");
        const pendingPayments = contracts.map(contract => {
            const totalPaid = contract.pagos.reduce((sum, payment) => sum + payment.monto, 0);
            return { contrato: contract, saldoPendiente: contract.total - totalPaid };
        });

        return res.status(200).json({
            status: "success",
            pendingPayments,
        });
    } catch (error) {
        console.error("Error al obtener pagos pendientes del cliente:", error);
        return res.status(500).json({
            status: "error",
            message: "Error al obtener pagos pendientes del cliente",
            error: error.message,
        });
    }
};

// Cambiar el estado de un cliente
export const deleteClient = async (req, res) => {
    const { id } = req.params;
    let { estado } = req.body;

    try {
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

        const updatedCustomer = await Customer.findByIdAndUpdate(id, { estado }, { new: true });
        if (!updatedCustomer) {
            return res.status(404).json({
                status: "error",
                message: "Cliente no encontrado",
            });
        }

        res.status(200).json({
            status: "success",
            message: "Estado del cliente actualizado con éxito",
            cliente: updatedCustomer,
        });
    } catch (error) {
        console.error("Error al cambiar el estado del cliente", error);
        res.status(500).json({
            status: "error",
            message: "Error al cambiar el estado del cliente",
            error: error.message,
        });
    }
};