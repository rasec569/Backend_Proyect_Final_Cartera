import Person from "../models/people.js";
import User from "../models/users.js";

// Crear persona y usuario
export const createdUser = async (req, res) => {
    const { tip_doc, doc_identifiacion, nombres, apellidos, email, telefono, direccion } = req.body.persona;
    const { nickname, contraseña, rol, estado } = req.body.usuario;

    try {
        // Verificar si la persona ya existe por documento de identificación
        let person = await Person.findOne({ doc_identifiacion });

        // Si la persona no existe, crearla
        if (!person) {
            person = new Person({ tip_doc, doc_identifiacion, nombres, apellidos, email, telefono, direccion });
            await person.save();
        }

        // Crear el usuario asociado a la persona
        const newUser = new User({
            persona: person._id,
            nickname,
            contraseña,
            rol,
            estado,
        });
        const savedUser = await newUser.save();

        res.status(201).json({
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