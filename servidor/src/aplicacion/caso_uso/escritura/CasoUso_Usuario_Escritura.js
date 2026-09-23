import { Usuario } from '../../../dominio/Usuario.js';
import { AdapSalida_UsuarioWeb } from '../../../infraestructura/adaptadores/salida/AdapSalida_UsuarioWeb.js';

export class CasoUso_Usuario_Escritura {
    constructor(dto) {
        this.dto = dto;
    }

    crearUsuario() {
        console.log("Crear usuario")    
    }
}