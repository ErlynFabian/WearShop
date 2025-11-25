/**
 * Formatea un precio quitando .00 si no hay decimales y agregando comas a los miles
 * @param {number} price - El precio a formatear
 * @returns {string} - El precio formateado (ej: "RD$1,200" o "RD$1,200.50")
 */
export const formatPrice = (price) => {
  if (price === null || price === undefined || isNaN(price)) {
    return 'RD$0';
  }

  // Redondear a 2 decimales
  const rounded = Math.round(price * 100) / 100;
  
  // Separar parte entera y decimal
  const parts = rounded.toString().split('.');
  const integerPart = parts[0];
  const decimalPart = parts[1];

  // Agregar comas a los miles
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  // Si no hay decimales o son .00, no mostrar decimales
  if (!decimalPart || decimalPart === '00' || parseInt(decimalPart) === 0) {
    return `RD$${formattedInteger}`;
  }

  // Si hay decimales, mostrarlos
  return `RD$${formattedInteger}.${decimalPart}`;
};

