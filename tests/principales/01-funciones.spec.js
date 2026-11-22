import { correoValido, telefonoValido, parsearPeso } from '../../src/utils/validaciones';
import { clp } from '../../src/utils/formato';

// =====================================================================
// PRUEBAS PRINCIPALES - Parte 1: funciones simples (utils)
//
// Prueba típica: le paso un dato a la función y compruebo con expect(...) que devuelva lo que espero.
// Estas funciones las usan todos los formularios, por eso son de las más importantes.
// =====================================================================

describe('Validaciones de formularios', () => {
  // PRUEBA 1
  it('correoValido acepta los correos con @ que terminan en .cl o .com y rechaza los demás', () => {
    // Casos válidos
    expect(correoValido('pedro.pascal@gmail.com')).toBe(true);
    expect(correoValido('camila@sanmarcos.cl')).toBe(true);

    // Casos inválidos
    expect(correoValido('pedrogmail.com')).toBe(false); // le falta la @
    expect(correoValido('pedro@gmail.org')).toBe(false); // no termina en .cl ni .com
    expect(correoValido('')).toBe(false); // vacío
  });

  // PRUEBA 2
  it('telefonoValido acepta un celular chileno (+56 9 y 8 dígitos) y rechaza otros formatos', () => {
    expect(telefonoValido('+56 9 1234 5678')).toBe(true);
    expect(telefonoValido('+56912345678')).toBe(true);

    expect(telefonoValido('912345678')).toBe(false); // sin el +56
    expect(telefonoValido('+56 2 1234 5678')).toBe(false); // teléfono fijo (no empieza con 9)
  });

  // PRUEBA 3
  it('parsearPeso convierte un texto como "12,5 kg" en el número 12.5', () => {
    expect(parsearPeso('12,5 kg')).toBe(12.5);
    // Si no es un número devuelve NaN ("no es un número"); con Number.isNaN lo compruebo
    expect(Number.isNaN(parsearPeso('abc'))).toBe(true);
  });
});

describe('Formato de precios', () => {
  // PRUEBA 4
  it('clp muestra el precio en pesos chilenos con punto de miles', () => {
    expect(clp(12500)).toBe('$12.500');
    expect(clp(1234567)).toBe('$1.234.567');
  });
});
