import jwt from "jsonwebtoken";
import { secret } from "../services/jwt.js";

export const ensureAuth = (req, res, next) => {
    // Extrae el header Authorization y verifica ambos formatos
    const authHeader = req.header("Authorization");
    
    let token;
    
    if (authHeader) {
        // Verifica si el token está en formato Bearer
        if (authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        } else {
            // Si no es formato Bearer, asume que el token está directamente en el valor de Authorization y elimina posibles comillas
            token = authHeader.replace(/['"]+/g, "");
        }
    }

    // Verifica si el token está presente después de los chequeos
    if (!token) {
        return res.status(403).send({ status: "error", message: "Token no encontrado en el header" });
    }

    try {
        // Verifica y decodifica el token
        const decoded = jwt.verify(token, secret);

        // Almacena la información del usuario en req.user para uso posterior
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).send({ status: "error", message: "El token ha expirado" });
        } else if (error.name === "JsonWebTokenError") {
            return res.status(401).send({ status: "error", message: "Token inválido" });
        }

        // Respuesta genérica para otros errores inesperados
        return res.status(500).send({ status: "error", message: "Error en la autenticación" });
    }
};