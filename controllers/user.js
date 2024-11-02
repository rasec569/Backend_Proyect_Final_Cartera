import Person from "../models/people.js";
import User from "../models/users.js";

// Metodo de prueba
export const tesUser = (req, res) => { 
    return res.status(200).send({ 
        message: "Mensaje enviado desde el controlador de Usuarios" 
    }); 
};

// Crear persona y usuario
export const createdUser = async (req, res) => {
    let params = req.body;

    // Crear objetos persona y usuario a partir de los datos en params
    let persona = {
        tip_doc: params.tip_doc,
        doc_identifiacion: params.doc_identifiacion,
        nombres: params.nombres,
        apellidos: params.apellidos,
        email: params.email,
        telefono: params.telefono,
        direccion: params.direccion
    };

    let usuario = {
        nickname: params.nickname,
        contraseña: params.contraseña,
        rol: params.rol,
        estado: params.estado
    };

    try {
        // Validación de campos requeridos para persona
        if (!persona.tip_doc || !persona.doc_identifiacion || !persona.nombres || !persona.apellidos || !persona.email || !persona.telefono) {
            return res.status(400).json({
                status: "error",
                message: "Faltan datos requeridos para la persona",
            });
        }

        // Validación de campos requeridos para usuario
        if (!usuario.nickname || !usuario.contraseña || !usuario.rol || usuario.estado === undefined) {
            return res.status(400).json({
                status: "error",
                message: "Faltan datos requeridos para el usuario",
            });
        }

        // Verificar si la persona ya existe por documento de identificación
        let existingPerson = await Person.findOne({ doc_identifiacion: persona.doc_identifiacion });

        // Si la persona no existe, crearla
        if (!existingPerson) {
            existingPerson = new Person(persona);
            await existingPerson.save();
        }

        // Verificar si ya existe un usuario con el mismo nickname
        const existingUser = await User.findOne({ nickname: usuario.nickname });
        if (existingUser) {
            return res.status(400).json({
                status: "error",
                message: "El nickname ya está en uso. Por favor elige otro.",
            });
        }

        // Crear el usuario asociado a la persona
        const newUser = new User({
            persona: existingPerson._id,
            nickname: usuario.nickname,
            contraseña: usuario.contraseña,
            rol: usuario.rol,
            estado: usuario.estado,
        });
        const savedUser = await newUser.save();

        res.status(200).json({
            message: "Usuario creado con éxito.",
            usuario: savedUser,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener todos los usuarios
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ estado: true }).populate("persona");
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener un usuario por ID
export const getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findOne({ _id: id, estado: true }).populate("persona");
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar usuario
export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { nickname, contraseña, rol, estado } = req.body.usuario;

    try {
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { nickname, contraseña, rol, estado },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }

        res.status(200).json({
            message: "Usuario actualizado con éxito.",
            usuario: updatedUser,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Cambiar el estado de un usuario
export const deleteUser = async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { estado },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }

        res.status(200).json({
            message: "Estado del usuario actualizado con éxito.",
            usuario: updatedUser,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};