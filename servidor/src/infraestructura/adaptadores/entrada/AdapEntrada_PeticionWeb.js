import { PuertoEntradaMensaje } from "../../../aplicacion/puerto/entrada/PuertoEntradaMensaje.js";

export class AdapEntrada_PeticionWeb extends PuertoEntradaMensaje {
    constructor(casoUso) {
        super();
        this.casoUso = casoUso;
    }

    leerMensaje(req, res) {
        const dto = this.casoUso.leerMensaje()
        res.json({
            mensaje: this.casoUso.leerMensaje()
        });
    }
}
