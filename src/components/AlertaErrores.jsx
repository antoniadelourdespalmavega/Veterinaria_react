// Cuadro rojo que lista los errores de un formulario. Recibe un arreglo de textos.
// Si no hay errores no muestra nada.
export default function AlertaErrores({ errores, titulo, className = 'alert alert-danger mt-3' }) {
  // Sin errores no dibujo nada (devuelvo null)
  if (!errores || errores.length === 0) return null;
  return (
    <div className={className}>
      <strong>{titulo || `Se encontraron ${errores.length} error(es):`}</strong>
      {/* Un renglón por cada error */}
      {errores.map((e, i) => (
        <div key={i}>* {e}</div>
      ))}
    </div>
  );
}
