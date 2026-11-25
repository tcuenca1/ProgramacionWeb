export function obsolescenciaV1(req, res, next) {
  const fecha = Math.floor(
    Date.parse('2026-12-01T00:00:00Z') / 1000
  );
  res.setHeader('Deprecation', `@${fecha}`);
  res.setHeader(
    'Sunset',
    new Date('2027-06-01T00:00:00Z').toUTCString()
  );
  res.setHeader('Cache-Control', 'no-store');
  next();
}
