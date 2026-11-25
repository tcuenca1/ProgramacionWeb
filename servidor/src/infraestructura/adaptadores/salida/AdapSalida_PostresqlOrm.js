import {PuertoSalidaUsuarioWeb} from "../../../aplicacion/puerto/salida/PuertoSalidaUsuarioWeb.js"
import {Usuario} from "../../../dominio/Usuario.js";
import {usuarioModelo} from "../../base_dato/modelo/PgModeloUsuario.js"
import {accesoModelo} from "../../base_dato/modelo/PgModeloAcceso.js"
import {pgModelosPorTipo} from "../../base_dato/modelo/PgModeloRoles.js"
import {outboxModelo} from "../../base_dato/modelo/PgModeloOutBox.js"
import {registrarLogAuditoria} from "../../util/logger.js"
import {Transaction} from "sequelize";

export class AdapSalida_PosgresqlOrm extends PuertoSalidaUsuarioWeb{
    async leerUsuario(dto){
        dto.setValido(false);
        const valido = await usuarioModelo.sequelize.transaction({
            isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED
        }, async (t) => {
            const resultado = await usuarioModelo.findOne({
                attributes: ["id", "nombre", "tipo"],
                where: {
                    nombre: dto.getNombre(),
                    contrasena: dto.getContrasena()
                },
                transaction: t,
                lock: t.LOCK.UPDATE,
                logging: false
            });
            if (!resultado) return false;
            const acceso = await accesoModelo.create({
                fecha: new Date(),
                dispositivo: "chrome",
                usuario_id: resultado.id
            }, { transaction: t });
            await outboxModelo.create({
                tipo: "ACCESO_OK_AUTENTICADO_REGISTRADO",
                playload: { acceso_id: acceso.id, usuario_id: resultado.id },
                publicado: false
            }, { transaction: t });
            return true;
        });
        dto.setValido(valido);
        return dto;
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
        registrarLogAuditoria({ evento: "LISTAR_USUARIOS" });
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
        registrarLogAuditoria({ evento: "CREAR_USUARIO", nombre: usuario.nombre });
        const modelo = pgModelosPorTipo[usuario.tipo] ?? usuarioModelo;
        const fila = await modelo.create({...usuario});
        
        await outboxModelo.create({
            tipo: "USUARIO_CREADO_AUDITORIA",
            playload: { nombre: usuario.nombre, tipo: usuario.tipo },
            publicado: false
        }).catch(e => console.error(e));

        return Usuario.crearUsuarioDominio(fila.get({plain:true}));
    }

    async actualizarUsuario(id, usuario){
        registrarLogAuditoria({ evento: "ACTUALIZAR_USUARIO", id });
        const existente = await usuarioModelo.findByPk(id);
        if (existente==null) return null;
        const modelo = pgModelosPorTipo[existente.tipo] ?? usuarioModelo;
        const {id: _id, tipo, ...campos} = usuario;
        await modelo.update(campos, {where:{id}});

        await outboxModelo.create({
            tipo: "USUARIO_ACTUALIZADO_AUDITORIA",
            playload: { id, cambios: campos },
            publicado: false
        }).catch(e => console.error(e));

        return Usuario.crearUsuarioDominio(await this.filaCompleta(await usuarioModelo.findByPk(id)));
    }
}
