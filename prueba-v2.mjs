import assert from 'node:assert/strict';

const nombre = 'juan';
const clave = 'perez1';

for (const [contrasena, estado, valido] of [[clave, 200, true], ['NO_VALIDA', 403, false]]) {
  const res = await fetch('http://localhost:8082/6A/v2/usuario', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, contrasena })
  });
  assert.equal(res.status, estado);
  const datos = await res.json();
  assert.equal(datos.autenticado, valido);
  assert.deepEqual(datos.usuario, valido ? { nombre } : null);
}

console.log('Contrato V2: OK');
