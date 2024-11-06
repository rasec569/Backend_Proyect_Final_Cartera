import { getCartera } from "../services/carteraService.js";

export const listCartera = async (req, res) => {
    try {
        const cartera = await getCartera();
        res.status(200).json(cartera);
    } catch (error) {
        console.error("Error al obtener la cartera:", error);
        res.status(500).json({ error: "Error al obtener la cartera" });
    }
};