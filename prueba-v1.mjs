import assert from 'node:assert/strict';

const nombre = 'juan';
const clave = 'perez1';

for (const [cont, valido] of [[clave, true], ['NO_VALIDA', false]]) {
  const q = new URLSearchParams({ usu: nombre, cont });
  const res = await fetch('http://localhost:8082/6A/usuario?' + q);
  assert.equal(res.status, 200);
  const datos = await res.json();
  assert.equal(datos.mensaje, 'respuesta');
  assert.equal(datos.usuario, nombre);
  assert.equal(datos.esvalido, valido);
}

console.log('Contrato V1: OK');
