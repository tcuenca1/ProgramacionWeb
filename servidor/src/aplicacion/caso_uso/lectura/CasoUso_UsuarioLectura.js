import { Usuario } from '../../../dominio/Usuario.js';

export class CasoUso_UsuarioLectura {
    constructor(adaptadorSalida) {
        this.adaptadorSalida = adaptadorSalida;
    }

    async validarUsuario(dto) {
        const resul = await this.adaptadorSalida.leerUsuario(dto);
        const dominioUsuario = new Usuario(resul.usuario, resul.contrasena, dto.getCiudad(), dto.getTelefono());
        
        const estado = dominioUsuario.validarUsuario(dto);
        dto.setValido(estado);
        
        return {
            usuario: dto.getNombre(),
            esValido: dto.getValido(),
            ciudad: dto.getCiudad(),
            telefono: dto.getTelefono()
        };
    }
}
