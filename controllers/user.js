import Person from "../models/people.js";
import User from "../models/users.js";
import bcrypt from "bcrypt";
import { createToken } from "../services/jwt.js";

// Metodo de prueba
export const tesUser = (req, res) => { 
    return res.status(200).send({ 
        message: "Mensaje enviado desde el controlador de Usuarios" 
    }); 
};

// Crear persona y usuario
export const createdUser = async (req, res) => {
    const params = req.body;

    // Crear objetos persona y usuario a partir de los datos en params
    const persona = {
        tip_doc: params.tip_doc,
        doc_identifiacion: params.doc_identifiacion,
        nombres: params.nombres,
        apellidos: params.apellidos,
        email: params.email,
        telefono: params.telefono,
        direccion: params.direccion
    };

    const usuario = {
        nickname: params.nickname,
        contraseña: params.contraseña,
        rol: params.rol,
        estado: params.estado
    };

    try {
        // Validación de campos requeridos para persona
        if (!persona.tip_doc || !persona.doc_identifiacion || !persona.nombres || !persona.apellidos || !persona.email || !persona.telefono) {
            return res.status(400).send({
                status: "error",
                message: "Faltan datos requeridos para la persona",
            });
        }

        // Validación de campos requeridos para usuario
        if (!usuario.nickname || !usuario.contraseña || !usuario.rol || usuario.estado === undefined) {
            return res.status(400).send({
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

        // Crear el objeto usuario con los datos de `usuario`
        const user_to_save = new User({
            nickname: usuario.nickname,
            contraseña: usuario.contraseña,  // contraseña se sobrescribirá después del hash
            rol: usuario.rol,
            estado: usuario.estado,
            persona: existingPerson._id
        });

        // Verificar si ya existe un usuario con el mismo nickname
        const existingUser = await User.findOne({ nickname: user_to_save.nickname });

        if (existingUser) {
            return res.status(409).send({
                status: "error",
                message: "El nickname ya está en uso. Por favor elige otro.",
            });
        }

        // Cifrar la contraseña solo si está definida y no vacía
        if (user_to_save.contraseña) {
            const salt = await bcrypt.genSalt(10);
            user_to_save.contraseña = await bcrypt.hash(user_to_save.contraseña, salt);
        } else {
            return res.status(400).send({
                status: "error",
                message: "La contraseña no puede estar vacía."
            });
        }

        // Guarda el usuario        
        await user_to_save.save();

        res.status(201).json({
            status: "created",
            message: "Usuario creado con éxito.",
            user: user_to_save
        });
    } catch (error) {
        console.log("Error al crear el usuario", error);
        res.status(500).send({
            status: "error",
            message: "Error al crear el usuario",
        });
    }
};

// Login user
export const login = async (req, res) => {
    try {
        // Recibe nickname y contraseña del request body
        const { nickname, contraseña } = req.body;

        // Valida que nickname y contraseña estén presentes en el request body
        if (!nickname ||!contraseña) {
            return res.status(400).send({ 
                status: "error",
                message: "Debes proporcionar un nickname o una contraseña." });
        }
        
        // Busca al usuario por nickname 
        const userBd = await User.findOne({ nickname:nickname });

        // Valida que el usuario exista 
        if (!userBd) {
            return res.status(404).send({ 
                status: "error",
                message: "Usuario no encontrado." 
            });
        }

        // Valida que la contraseña sea correcta
        const validPassword = await bcrypt.compare(contraseña, userBd.contraseña);

        // Valida que la contraseña sea correcta
        if (!validPassword) {
            return res.status(401).send({ 
                status: "error",
                message: "Contraseña incorrecta." 
            });
        }

        // Genera un token con JWT
        const token = createToken(userBd);
        
        // Devuelve el token al usuario
        res.status(200).json({ 
            status: "success",
            message: "Usuario logueado correctamente.",
            userBd,
            token
        });
    } catch (error) {
        console.log("Error al loguear el usuario", error);
        res.status(500).send({
            status: "error",
            message: "Error al loguear el usuario"
        });
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