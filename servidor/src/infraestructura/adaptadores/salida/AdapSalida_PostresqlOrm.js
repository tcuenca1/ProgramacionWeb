import {PuertoSalidaUsuarioWeb} from "../../../aplicacion/puerto/salida/PuertoSalidaUsuarioWeb.js"
import {Administrador} from "../../../dominio/Administrador.js";
import {Invitado} from "../../../dominio/Invitado.js";
import {Personal} from "../../../dominio/Personal.js";
import {Usuario} from "../../../dominio/Usuario.js";
import {usuarioModelo} from "../../base_dato/modelo/PgModeloUsuario.js"
export class AdapSalida_PosgresqlOrm extends PuertoSalidaUsuarioWeb{
    async leerUsuario(dto){ 
        //const resultado = await conexionPostgres.query("SELECT * FROM usuario where nombre='"+dto.nombre+"' AND contrasena='"+dto.contrasena+"'");
        const resultado = await usuarioModelo.findOne({
            where:{
                nombre: dto.nombre,
                contrasena:dto.contrasena
            }
        });
        let obj = null;
        if (resultado!=null){
           switch (resultado.tipo){
            case 'Administrador':
            case '1':
                obj = new Administrador(resultado.nombre,resultado.contrasena, resultado.tipo);
                break;
            case 'Personal':
            case '2':
                obj = new Personal(resultado.nombre,resultado.contrasena, resultado.tipo);
                break;
            case 'Invitado':
            case '3':
                obj = new Invitado(resultado.nombre,resultado.contrasena, resultado.tipo);
                break;
            default:
                obj = new Usuario(resultado.nombre,resultado.contrasena, resultado.ciudad, resultado.telefono, resultado.tipo);
                break;
           }
           obj.ciudad = resultado.ciudad;
           obj.telefono = resultado.telefono;
           return obj; 
        }else{
             return obj = new Invitado("","","");
        }     
    }
}