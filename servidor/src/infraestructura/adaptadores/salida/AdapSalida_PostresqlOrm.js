import {PuertoSalidaUsuarioWeb} from "../../../aplicacion/puerto/salida/PuertoSalidaUsuarioWeb.js"
import {Administrador} from "../../../dominio/Administrador.js";
import {Invitado} from "../../../dominio/Invitado.js";
import {Personal} from "../../../dominio/Personal.js";
import {Usuario} from "../../../dominio/Usuario.js";
import {usuarioModelo} from "../../base_dato/modelo/PgModeloUsuario.js"
import {pgModelosPorTipo} from "../../base_dato/modelo/PgModeloRoles.js"
export class AdapSalida_PosgresqlOrm extends PuertoSalidaUsuarioWeb{
    async leerUsuario(dto){
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

    async filaCompleta(fila){
        const modeloRol = pgModelosPorTipo[fila.tipo];
        if (modeloRol){
            const filaRol = await modeloRol.findByPk(fila.id);
            if (filaRol) return filaRol.get({plain:true});
        }
        return fila.get({plain:true});
    }

    async listarUsuarios(){
        const filas = await usuarioModelo.findAll({order:[["id","ASC"]]});
        const filasRol = {};
        for (const modeloRol of Object.values(pgModelosPorTipo)){
            for (const filaRol of await modeloRol.findAll()){
                filasRol[filaRol.id] = filaRol.get({plain:true});
            }
        }
        return filas.map((fila) => Usuario.crearUsuarioDominio(filasRol[fila.id] ?? fila.get({plain:true})));
    }

    async crearUsuario(usuario){
        const modelo = pgModelosPorTipo[usuario.tipo] ?? usuarioModelo;
        const fila = await modelo.create({...usuario});
        return Usuario.crearUsuarioDominio(fila.get({plain:true}));
    }

    async actualizarUsuario(id, usuario){
        const existente = await usuarioModelo.findByPk(id);
        if (existente==null) return null;
        const modelo = pgModelosPorTipo[existente.tipo] ?? usuarioModelo;
        const {id: _id, tipo, ...campos} = usuario;
        await modelo.update(campos, {where:{id}});
        return Usuario.crearUsuarioDominio(await this.filaCompleta(await usuarioModelo.findByPk(id)));
    }
}
