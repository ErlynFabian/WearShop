import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMaximize2, FiInfo, FiCheckCircle } from 'react-icons/fi';

const CalculadoraTallas = () => {
  const [selectedCategory, setSelectedCategory] = useState('hombre');
  const [selectedType, setSelectedType] = useState('camisas');
  const [showCalculator, setShowCalculator] = useState(false);
  const [measurements, setMeasurements] = useState({
    pecho: '',
    cintura: '',
    cadera: '',
    largo: '',
    longitud: ''
  });
  const [recommendedSize, setRecommendedSize] = useState(null);

  // Tablas de tallas para diferentes tipos de prendas
  const sizeCharts = {
    hombre: {
      camisas: {
        title: 'Camisas',
        measurements: ['Pecho (cm)', 'Cintura (cm)', 'Largo (cm)'],
        sizes: {
          'S': { pecho: '92-96', cintura: '80-84', largo: '70-72' },
          'M': { pecho: '96-100', cintura: '84-88', largo: '72-74' },
          'L': { pecho: '100-104', cintura: '88-92', largo: '74-76' },
          'XL': { pecho: '104-108', cintura: '92-96', largo: '76-78' },
          'XXL': { pecho: '108-112', cintura: '96-100', largo: '78-80' },
          'XXXL': { pecho: '112-116', cintura: '100-104', largo: '80-82' }
        }
      },
      pantalones: {
        title: 'Pantalones',
        measurements: ['Cintura (cm)', 'Cadera (cm)', 'Largo (cm)'],
        sizes: {
          '28': { cintura: '71-73', cadera: '90-92', largo: '100-102' },
          '30': { cintura: '76-78', cadera: '95-97', largo: '102-104' },
          '32': { cintura: '81-83', cadera: '100-102', largo: '104-106' },
          '34': { cintura: '86-88', cadera: '105-107', largo: '106-108' },
          '36': { cintura: '91-93', cadera: '110-112', largo: '108-110' },
          '38': { cintura: '96-98', cadera: '115-117', largo: '110-112' },
          '40': { cintura: '101-103', cadera: '120-122', largo: '112-114' }
        }
      },
      polos: {
        title: 'Polos',
        measurements: ['Pecho (cm)', 'Cintura (cm)', 'Largo (cm)'],
        sizes: {
          'S': { pecho: '90-94', cintura: '78-82', largo: '68-70' },
          'M': { pecho: '94-98', cintura: '82-86', largo: '70-72' },
          'L': { pecho: '98-102', cintura: '86-90', largo: '72-74' },
          'XL': { pecho: '102-106', cintura: '90-94', largo: '74-76' },
          'XXL': { pecho: '106-110', cintura: '94-98', largo: '76-78' }
        }
      },
      shorts: {
        title: 'Shorts',
        measurements: ['Cintura (cm)', 'Cadera (cm)'],
        sizes: {
          'S': { cintura: '76-80', cadera: '90-94' },
          'M': { cintura: '80-84', cadera: '94-98' },
          'L': { cintura: '84-88', cadera: '98-102' },
          'XL': { cintura: '88-92', cadera: '102-106' },
          'XXL': { cintura: '92-96', cadera: '106-110' }
        }
      },
      calzado: {
        title: 'Calzado',
        measurements: ['Longitud del Pie (cm)'],
        sizes: {
          '38': { largo: '24.0-24.5' },
          '39': { largo: '24.5-25.0' },
          '40': { largo: '25.0-25.5' },
          '41': { largo: '25.5-26.0' },
          '42': { largo: '26.0-26.5' },
          '43': { largo: '26.5-27.0' },
          '44': { largo: '27.0-27.5' },
          '45': { largo: '27.5-28.0' },
          '46': { largo: '28.0-28.5' }
        }
      }
    },
    mujer: {
      blusas: {
        title: 'Blusas',
        measurements: ['Pecho (cm)', 'Cintura (cm)', 'Largo (cm)'],
        sizes: {
          'XS': { pecho: '80-84', cintura: '64-68', largo: '58-60' },
          'S': { pecho: '84-88', cintura: '68-72', largo: '60-62' },
          'M': { pecho: '88-92', cintura: '72-76', largo: '62-64' },
          'L': { pecho: '92-96', cintura: '76-80', largo: '64-66' },
          'XL': { pecho: '96-100', cintura: '80-84', largo: '66-68' },
          'XXL': { pecho: '100-104', cintura: '84-88', largo: '68-70' }
        }
      },
      pantalones: {
        title: 'Pantalones',
        measurements: ['Cintura (cm)', 'Cadera (cm)', 'Largo (cm)'],
        sizes: {
          'XS': { cintura: '60-64', cadera: '84-88', largo: '95-97' },
          'S': { cintura: '64-68', cadera: '88-92', largo: '97-99' },
          'M': { cintura: '68-72', cadera: '92-96', largo: '99-101' },
          'L': { cintura: '72-76', cadera: '96-100', largo: '101-103' },
          'XL': { cintura: '76-80', cadera: '100-104', largo: '103-105' },
          'XXL': { cintura: '80-84', cadera: '104-108', largo: '105-107' }
        }
      },
      vestidos: {
        title: 'Vestidos',
        measurements: ['Pecho (cm)', 'Cintura (cm)', 'Cadera (cm)'],
        sizes: {
          'XS': { pecho: '80-84', cintura: '64-68', cadera: '84-88' },
          'S': { pecho: '84-88', cintura: '68-72', cadera: '88-92' },
          'M': { pecho: '88-92', cintura: '72-76', cadera: '92-96' },
          'L': { pecho: '92-96', cintura: '76-80', cadera: '96-100' },
          'XL': { pecho: '96-100', cintura: '80-84', cadera: '100-104' },
          'XXL': { pecho: '100-104', cintura: '84-88', cadera: '104-108' }
        }
      },
      shorts: {
        title: 'Shorts',
        measurements: ['Cintura (cm)', 'Cadera (cm)'],
        sizes: {
          'XS': { cintura: '60-64', cadera: '84-88' },
          'S': { cintura: '64-68', cadera: '88-92' },
          'M': { cintura: '68-72', cadera: '92-96' },
          'L': { cintura: '72-76', cadera: '96-100' },
          'XL': { cintura: '76-80', cadera: '100-104' }
        }
      },
      calzado: {
        title: 'Calzado',
        measurements: ['Longitud del Pie (cm)'],
        sizes: {
          '35': { largo: '22.0-22.5' },
          '36': { largo: '22.5-23.0' },
          '37': { largo: '23.0-23.5' },
          '38': { largo: '23.5-24.0' },
          '39': { largo: '24.0-24.5' },
          '40': { largo: '24.5-25.0' },
          '41': { largo: '25.0-25.5' },
          '42': { largo: '25.5-26.0' }
        }
      }
    }
  };

  const currentChart = sizeCharts[selectedCategory]?.[selectedType];

  // Calcular talla recomendada
  const calculateSize = () => {
    if (!currentChart) return;

    const userMeasurements = {
      pecho: parseFloat(measurements.pecho),
      cintura: parseFloat(measurements.cintura),
      cadera: parseFloat(measurements.cadera),
      largo: parseFloat(measurements.largo || measurements.longitud)
    };

    let bestMatch = null;
    let bestScore = Infinity;

    Object.entries(currentChart.sizes).forEach(([size, ranges]) => {
      let score = 0;
      let matches = 0;

      // Comparar cada medida
      Object.entries(ranges).forEach(([key, range]) => {
        let userValue = userMeasurements[key];
        // Para calzado, usar 'longitud' si 'largo' no está disponible
        if (!userValue && key === 'largo' && userMeasurements.longitud) {
          userValue = userMeasurements.longitud;
        }
        if (userValue && range) {
          const [min, max] = range.split('-').map(v => parseFloat(v.trim()));
          if (userValue >= min && userValue <= max) {
            matches++;
          } else {
            // Calcular distancia al rango
            const distance = userValue < min ? min - userValue : userValue - max;
            score += distance;
          }
        }
      });

      // Preferir tallas con más coincidencias y menor distancia
      const finalScore = score - (matches * 10);
      if (finalScore < bestScore) {
        bestScore = finalScore;
        bestMatch = size;
      }
    });

    setRecommendedSize(bestMatch);
  };

  const handleMeasurementChange = (key, value) => {
    setMeasurements(prev => ({ ...prev, [key]: value }));
    setRecommendedSize(null);
  };

  const resetCalculator = () => {
    setMeasurements({ pecho: '', cintura: '', cadera: '', largo: '', longitud: '' });
    setRecommendedSize(null);
  };

  const getMeasurementInstructions = () => {
    return {
      pecho: 'Mide alrededor de la parte más ancha del pecho, justo debajo de los brazos.',
      cintura: 'Mide alrededor de la cintura natural, donde normalmente usas el cinturón.',
      cadera: 'Mide alrededor de la parte más ancha de las caderas.',
      largo: 'Para camisas: desde el hombro hasta donde quieres que termine. Para pantalones: desde la cintura hasta el tobillo. Para calzado: mide la longitud de tu pie desde el talón hasta la punta del dedo más largo.',
      longitud: 'Coloca tu pie sobre una hoja de papel y marca el punto más largo (desde el talón hasta la punta del dedo más largo). Mide esa distancia en centímetros.'
    };
  };

  const instructions = getMeasurementInstructions();

  return (
    <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen bg-gray-50 overflow-x-hidden">
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center mb-4 gap-3">
            <FiMaximize2 className="w-8 h-8 sm:w-12 sm:h-12 text-black" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-black break-words">
              Calculadora de Tallas
            </h1>
          </div>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-2">
            Encuentra tu talla perfecta con nuestras tablas de medidas y calculadora interactiva
          </p>
        </motion.div>

        {/* Category Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-4 justify-center mb-6">
            <button
              onClick={() => {
                setSelectedCategory('hombre');
                setSelectedType('camisas');
                resetCalculator();
              }}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                selectedCategory === 'hombre'
                  ? 'bg-black text-white'
                  : 'bg-white text-black hover:bg-gray-100 border border-gray-300'
              }`}
            >
              Hombre
            </button>
            <button
              onClick={() => {
                setSelectedCategory('mujer');
                setSelectedType('blusas');
                resetCalculator();
              }}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                selectedCategory === 'mujer'
                  ? 'bg-black text-white'
                  : 'bg-white text-black hover:bg-gray-100 border border-gray-300'
              }`}
            >
              Mujer
            </button>
          </div>

          {/* Type Selector */}
          <div className="flex flex-wrap gap-3 justify-center">
            {Object.keys(sizeCharts[selectedCategory] || {}).map((type) => (
              <button
                key={type}
                onClick={() => {
                  setSelectedType(type);
                  resetCalculator();
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedType === type
                    ? 'bg-black text-white'
                    : 'bg-white text-black hover:bg-gray-100 border border-gray-300'
                }`}
              >
                {sizeCharts[selectedCategory][type].title}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Calculator Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 text-center"
        >
          <button
            onClick={() => {
              setShowCalculator(!showCalculator);
              if (showCalculator) resetCalculator();
            }}
            className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-600 transition-all shadow-lg hover:shadow-xl"
          >
            {showCalculator ? 'Ver Tabla de Tallas' : 'Calcular Mi Talla'}
          </button>
        </motion.div>

        {/* Calculator */}
        {showCalculator && currentChart && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8 max-w-2xl mx-auto w-full"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-black mb-6 text-center break-words">
              Calculadora de Talla - {currentChart.title}
            </h2>
            
            <div className="space-y-6">
              {currentChart.measurements.map((measurement) => {
                const key = measurement.toLowerCase().split(' ')[0];
                const isRequired = measurement.includes('Pecho') || measurement.includes('Cintura') || measurement.includes('Longitud');
                const instructionKey = key === 'longitud' ? 'longitud' : key;
                
                return (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {measurement} {isRequired && <span className="text-red-500">*</span>}
                      <button
                        type="button"
                        className="ml-2 text-gray-400 hover:text-black transition-colors"
                        title={instructions[instructionKey] || instructions[key]}
                      >
                        <FiInfo className="w-4 h-4 inline" />
                      </button>
                    </label>
                    <input
                      type="number"
                      value={measurements[key] || ''}
                      onChange={(e) => handleMeasurementChange(key, e.target.value)}
                      placeholder={`Ingresa tu medida en cm`}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    />
                    <p className="mt-1 text-xs text-gray-500">{instructions[instructionKey] || instructions[key]}</p>
                  </div>
                );
              })}

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={calculateSize}
                  disabled={!measurements.pecho && !measurements.cintura && !measurements.largo && !measurements.longitud}
                  className="flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  Calcular Talla
                </button>
                <button
                  onClick={resetCalculator}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-200 text-black rounded-lg font-medium hover:bg-gray-300 transition-colors text-sm sm:text-base"
                >
                  Limpiar
                </button>
              </div>

              {recommendedSize && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-6 p-6 bg-green-50 border-2 border-green-500 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <FiCheckCircle className="w-6 h-6 text-green-600" />
                    <div>
                      <p className="text-lg font-bold text-green-800">
                        Tu talla recomendada es: <span className="text-2xl">{recommendedSize}</span>
                      </p>
                      <p className="text-sm text-green-700 mt-1">
                        Esta es una recomendación basada en tus medidas. Si estás entre dos tallas, te recomendamos la más grande.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* Size Chart Table */}
        {!showCalculator && currentChart && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8 w-full"
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-black mb-6 text-center break-words px-2">
              Tabla de Tallas - {currentChart.title} ({selectedCategory === 'hombre' ? 'Hombre' : 'Mujer'})
            </h2>

            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-black text-white">
                      <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-left font-bold text-xs sm:text-sm md:text-base">Talla</th>
                      {currentChart.measurements.map((measurement) => (
                        <th key={measurement} className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-center font-bold text-xs sm:text-sm md:text-base whitespace-nowrap">
                          {measurement}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(currentChart.sizes).map(([size, ranges], index) => (
                      <tr
                        key={size}
                        className={`border-b border-gray-200 ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        } hover:bg-yellow-50 transition-colors`}
                      >
                        <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 font-bold text-sm sm:text-base md:text-lg">{size}</td>
                        {currentChart.measurements.map((measurement) => {
                          const key = measurement.toLowerCase().split(' ')[0];
                          // Para calzado, buscar en 'largo' si la medida es 'longitud'
                          const value = ranges[key] || ranges[key === 'longitud' ? 'largo' : key] || '-';
                          return (
                            <td key={key} className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-center text-xs sm:text-sm md:text-base whitespace-nowrap">
                              {value}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-bold text-blue-900 mb-2 flex items-center text-sm sm:text-base">
                <FiInfo className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
                <span>Cómo tomar tus medidas</span>
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-blue-800">
                {currentChart.measurements.map((measurement) => {
                  const key = measurement.toLowerCase().split(' ')[0];
                  const instructionKey = key === 'longitud' ? 'longitud' : key;
                  return (
                    <li key={key}>
                      <strong>{measurement}:</strong> {instructions[instructionKey] || instructions[key]}
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs sm:text-sm text-yellow-800">
                <strong>💡 Consejo:</strong> Si estás entre dos tallas, te recomendamos elegir la talla más grande para mayor comodidad. 
                Las medidas están en centímetros. Si tienes dudas, contáctanos por WhatsApp.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CalculadoraTallas;

