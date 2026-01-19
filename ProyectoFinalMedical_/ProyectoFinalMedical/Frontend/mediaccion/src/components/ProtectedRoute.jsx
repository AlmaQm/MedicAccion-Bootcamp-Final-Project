import {Navigate, Outlet} from "react-router-dom"
import {jwtDecode} from "jwt-decode"
import api from "../api"
import { REFRESH_TOKEN, ACCES_TOKEN } from "../constants"
import { useState, useEffect } from "react"

function ProtectedRoute(){
    const [isAuthorized, setIsAuthorized] = useState(null)
//catch metodo auth en caso de que haya algun error 
    useEffect(() =>{
        auth().catch(() => setIsAuthorized(false))
    },[])

//Comprueba que el token siga vigente, en caso contrario refrescamos el token para evitar logearse otra vez. en caso de que no se peuda refrescar
//vamos directo a pagina logearse
    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN)
        try {
            const res = await api.post("/api/token/refresh/",{
                refresh: refreshToken,
            });
            if(res.status == 200){
                localStorage.setItem(ACCES_TOKEN, res.data.access)
                setIsAuthorized(true)
            }else{
                setIsAuthorized(false)
            }
        } catch (error) {
            setIsAuthorized(false)
        }
    }

    const auth = async () => {
        const token = localStorage.getItem(ACCES_TOKEN)
        if(!token){
            setIsAuthorized(false)
            return
        }
        const decoded = jwtDecode(token)
        const tokenExpiration = decoded.exp
        const now = Date.now() / 1000

        if(tokenExpiration < now){
            await refreshToken()
        }else{
            setIsAuthorized(true)
        }
    }

    if(isAuthorized == null){
        return <div>Cargando...</div>
    }

    return isAuthorized ? <Outlet /> : <Navigate to="/login" />
}

export default ProtectedRoute