import fs from 'node:fs';
import path from 'node:path';
import { auditoriaEventoModelo } from '../base_dato/modelo/PgModeloAuditoriaEvento.js';

export async function registrarLogAuditoria(eventoData) {
    const logEntry = {
        timestamp: new Date().toISOString(),
        ...eventoData
    };
    
    console.log(JSON.stringify(logEntry, null, 2));

    try {
        const logDir = path.resolve(process.cwd(), 'src', 'logs');
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true });
        }
        const logPath = path.join(logDir, 'auditoria.log');
        fs.appendFileSync(logPath, JSON.stringify(logEntry) + '\n', 'utf8');
    } catch (error) {
        console.error('Error al escribir en auditoria.log:', error.message);
    }

    try {
        await auditoriaEventoModelo.create({
            tipo: eventoData.evento || "EVENTO_AUDITORIA",
            payload: logEntry,
            publicado: false
        });
    } catch (dbError) {
        // Ignorar si la base de datos no está lista todavía
    }
}
