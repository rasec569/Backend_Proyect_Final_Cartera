import jwt from 'jsonwebtoken';
import moment from 'moment';

// Clave secreta desde variables de entorno
const secret = process.env.JWT_SECRET || 'Cartera_Constructora_Bootcamp';

// Crear token
export const createToken = (user) => {
    try {
        const timestamp = moment().unix();
        const expiration = moment().add(7, 'days').unix();
        
        // Payload con más información y claims JWT recomendados
        const payload = {
            userId: user._id,
            iat: timestamp,
            exp: expiration,
            username: user.username,
            role: user.role,
        };
        
        return jwt.sign(payload, secret);
    } catch (error) {
        console.error("Error al crear el token:", error);
        throw new Error("No se pudo generar el token.");
    }
};