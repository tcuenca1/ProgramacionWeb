import v8 from 'v8';

export class AdapSalida_SerializacionBinaria {
    constructor() {}

    serializarYDeserializar(dto) {
        const bufferBinario = v8.serialize({
            nombre: dto.getNombre(),
            contrasena: dto.getContrasena(),
            valido: dto.getValido(),
            ciudad: dto.getCiudad(),
            telefono: dto.getTelefono()
        });

        const objetoRestaurado = v8.deserialize(bufferBinario);

        return {
            bufferBinarioHex: bufferBinario.toString('hex'),
            bytesTotales: bufferBinario.length,
            objetoRestaurado
        };
    }
}
