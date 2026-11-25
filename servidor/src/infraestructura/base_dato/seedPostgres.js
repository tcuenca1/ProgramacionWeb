import { usuarioModelo } from "./modelo/PgModeloUsuario.js";

export async function sembrarUsuarioInicial() {
    const existente = await usuarioModelo.findOne({
        where: { nombre: "juan" }
    });

    if (!existente) {
        await usuarioModelo.create({
            nombre: "juan",
            contrasena: "perez1",
            tipo: "Administrador",
            ciudad: "Machala",
            telefono: "099854213"
        });
        console.log("Seed inicial: usuario de prueba 'juan' creado en PostgreSQL");
    }
}
