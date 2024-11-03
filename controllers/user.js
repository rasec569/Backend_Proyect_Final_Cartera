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
    //Obtener datos de la petición
    const params = req.body;

    // Crear objetos persona y usuario a partir de los datos en params
    const persona = {
        tip_doc: params.tip_doc,
        doc_identificacion: params.doc_identificacion,
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
        const requiredPersonFields = ['tip_doc', 'doc_identificacion', 'nombres', 'apellidos', 'email', 'telefono'];
        for (const field of requiredPersonFields) {
            if (!persona[field]) {
                return res.status(400).send({
                    status: "error",
                    message: `El campo ${field} es requerido para la persona.`,
                });
            }
        }

        // Validación de campos requeridos para usuario
        const requiredUserFields = ['nickname', 'contraseña', 'rol', 'estado'];
        for (const field of requiredUserFields) {
            if (usuario[field] === undefined || usuario[field] === '') {
                return res.status(400).send({
                    status: "error",
                    message: `El campo ${field} es requerido para el usuario.`,
                });
            }
        }

        // Verificar si la persona ya existe por documento de identificación
        let existingPerson = await Person.findOne({ doc_identificacion: persona.doc_identificacion });

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

    const { nickname, contraseña } = req.body;

    try {
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
    const page = req.params.page ? parseInt(req.params.page, 10) : 1;
    const itemsPerPage = req.params.limit ? parseInt(req.params.limit, 10) : 10;

    try {
        // Primero obtenemos todos los usuarios y aplicamos populate
        const users = await User.find({ estado: true })
            .select('-contraseña -__v')
            .populate("persona")
            .sort({ nickname: 1 })
            .skip((page - 1) * itemsPerPage) // Aplicamos la paginación
            .limit(itemsPerPage); // Limitamos los resultados

        const totalDocs = await User.countDocuments({ estado: true }); // Contamos el total de documentos

        if (!users || users.length === 0) {
            return res.status(404).send({
                status: "error",
                message: "No hay usuarios para mostrar"
            });
        }

        // Calculamos el total de páginas
        const totalPages = Math.ceil(totalDocs / itemsPerPage);

        return res.status(200).json({
            status: "success",
            message: "Usuarios encontrados",
            users: users,
            totalDocs: totalDocs,
            totalPages: totalPages,
            currentPage: page,
            itemsPerPage: itemsPerPage
        });
    } catch (error) {
        console.error("Error al obtener los usuarios", error);
        return res.status(500).json({
            status: "error",
            message: "Error al obtener los usuarios",
            error: error.message
        });
    }
};

// Obtener un usuario por ID
export const getUserById = async (req, res) => {

    const { id } = req.params;

    try {
        const user = await User.findOne({ _id: id, estado: true }).populate("persona").select('-contraseña -__v');
        
        if (!user) {
            return res.status(404).json({
                status: "error",
                message: "Usuario no encontrado"
            });
        }
        
        return res.status(200).json({
            status: "success",
            message: "Usuario encontrado",
            user
        });
    } catch (error) {
        console.error("Error al obtener el usuario", error);
        return res.status(500).json({
            status: "error",
            message: "Error al obtener el usuario",
            error: error.message
        });
    }
};

export const updateUser = async (req, res) => {
    const userId = req.params.id;
    const userToUpdate = req.body;

    try {
        // Validar que los campos requeridos no estén vacíos o nulos
        const requiredFields = ['nickname', 'rol', 'estado'];
        for (const field of requiredFields) {
            if (!userToUpdate[field]) {
                return res.status(400).send({
                    status: "error",
                    message: `El campo ${field} es requerido.`,
                });
            }
        }

        // Verificar si el nickname está en uso por otro usuario
        const existingUser = await User.findOne({ nickname: userToUpdate.nickname, _id: { $ne: userId } });
        if (existingUser) {
            return res.status(409).send({
                status: "error",
                message: "El nickname ya está en uso por otro usuario"
            });
        }

        // Cifrar la contraseña si se proporciona
        if (userToUpdate.contraseña) {
            const salt = await bcrypt.genSalt(10);
            userToUpdate.contraseña = await bcrypt.hash(userToUpdate.contraseña, salt);
        } else {
            // Si no se proporciona contraseña, eliminarla del objeto de actualización
            delete userToUpdate.contraseña;
        }

        // Buscar y actualizar el usuario
        const updatedUser = await User.findByIdAndUpdate(userId, userToUpdate, { new: true });

        // Verificar si el usuario existe
        if (!updatedUser) {
            return res.status(404).json({
                status: "error",
                message: "Usuario no encontrado"
            });
        }

        return res.status(200).json({
            status: "success",
            message: "Usuario actualizado con éxito",
            usuario: updatedUser
        });
    } catch (error) {
        console.error("Error al actualizar el usuario", error);
        return res.status(500).json({
            status: "error",
            message: "Error al actualizar el usuario",
            error: error.message
        });
    }
};

// Cambiar el estado de un usuario
export const deleteUser = async (req, res) => {
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
                message: "El estado debe ser un valor booleano (true o false)"
            });
        }

        const updatedUser = await User.findByIdAndUpdate(id, { estado }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({
                status: "error",
                message: "Usuario no encontrado"
            });
        }

        return res.status(200).json({
            status: "success",
            message: "Estado del usuario actualizado con éxito",
            usuario: updatedUser
        });
    } catch (error) {
        console.error("Error al cambiar el estado del usuario", error);
        return res.status(500).json({
            status: "error",
            message: "Error al cambiar el estado del usuario",
            error: error.message
        });
    }
};