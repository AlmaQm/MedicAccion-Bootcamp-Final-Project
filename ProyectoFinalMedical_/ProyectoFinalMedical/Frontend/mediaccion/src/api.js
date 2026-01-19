import axios from "axios"
import { ACCES_TOKEN } from "./constants"

const api = axios.create({
    //importa todo lo que este en el fichero env necesita empezar por VITE, URL del backend
    baseURL: import.meta.env.VITE_API_URL
})
//mira si tiene el token JWT
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCES_TOKEN);
        if (token){
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

export default api