db = db.getSiblingDB("programacion_web");

db.usuario.deleteMany({});

db.usuario.insertMany([
    {
        nombre: "juan",
        contrasena: "perez",
        tipo: "Administrador",
        ciudad: "Bogotá",
        telefono: "3001234567",
        nivelAcceso: 3,
        departamento: "Sistemas"
    },
    {
        nombre: "personal1",
        contrasena: "perspass123",
        tipo: "Personal",
        ciudad: "Medellín",
        telefono: "3109876543",
        turno: "Matutino",
        codigoEmpleado: "EMP-001"
    },
    {
        nombre: "invitado1",
        contrasena: "invpass123",
        tipo: "Invitado",
        ciudad: "Cali",
        telefono: "3201112233",
        motivoVisita: "Reunión de negocios",
        fechaExpiracion: new Date("2026-12-31T23:59:59Z")
    }
]);
