import logoimg from "../assets/logo_svg.svg";
import '../styles/Footer.css';
export default function Footer() {
  return (
    <footer>

        <img
          src={logoimg}
          alt="MediAccion Logo"
          style={{ height: "50px", margin: "0px", padding: "0px" }}/>    
          <p style={{margin: "0px", padding: "0px"}}>

          
        © 2023 MediAccion. Todos los derechos reservados.

      </p>
    </footer>
  )
}
