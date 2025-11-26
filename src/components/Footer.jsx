import { Link } from 'react-router-dom';
import { FaWhatsapp, FaInstagram, FaTiktok, FaPlane } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 pt-16 pb-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Logo & Description */}
          <div>
            <h3 
              className="text-2xl font-black mb-4"
              style={{
                backgroundImage: 'linear-gradient(to right, #facc15, #fbbf24, #f59e0b)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              WearShop
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">
              Tu destino para el estilo y la moda. Calidad premium, diseño innovador.
            </p>
            <p className="text-yellow-500 text-sm font-medium flex items-center gap-2">
              Envíos Nacionales e Internacionales
              <FaPlane className="w-4 h-4" />
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-black text-black mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link to="/" className="hover:text-black transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/hombres" className="hover:text-black transition-colors">
                  Hombres
                </Link>
              </li>
              <li>
                <Link to="/mujeres" className="hover:text-black transition-colors">
                  Mujeres
                </Link>
              </li>
              <li>
                <Link to="/ofertas" className="hover:text-black transition-colors">
                  Ofertas
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-black transition-colors">
                  Guía de Estilo
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-black text-black mb-4">Soporte</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link to="/contacto" className="hover:text-black transition-colors">
                  Contacto
                </Link>
              </li>
              <li>
                <Link to="/envios" className="hover:text-black transition-colors">
                  Envíos
                </Link>
              </li>
              <li>
                <Link to="/devoluciones" className="hover:text-black transition-colors">
                  Devoluciones
                </Link>
              </li>
              <li>
                <Link to="/calculadora-tallas" className="hover:text-black transition-colors">
                  Calculadora de Tallas
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-black transition-colors">
                  Preguntas Frecuentes
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-black text-black mb-4">Síguenos</h4>
            <div className="flex space-x-4">
              <a
                href="https://wa.link/l8vc70"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
                aria-label="WhatsApp"
              >
                <FaWhatsapp className="w-6 h-6 text-white" />
              </a>
              <a
                href="https://www.instagram.com/modawearshop2_alterna?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 rounded-full flex items-center justify-center hover:opacity-90 transition-opacity"
                aria-label="Instagram"
              >
                <FaInstagram className="w-6 h-6 text-white" />
              </a>
              <a
                href="https://www.tiktok.com/@enmanuelmoda1?_r=1&_t=ZS-91fgB9jLhN2"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
                aria-label="TikTok"
              >
                <FaTiktok className="w-6 h-6 text-white" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright & Legal Links */}
        <div className="border-t border-gray-200 pt-6 pb-2">
          <p className="text-center text-sm text-gray-600 mb-3">
            &copy; {new Date().getFullYear()} WearShop. Todos los derechos reservados.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600">
            <Link to="/sobre-nosotros" className="hover:text-black transition-colors">
              Sobre Nosotros
            </Link>
            <span className="text-gray-400">•</span>
            <Link to="/politica-privacidad" className="hover:text-black transition-colors">
              Política de Privacidad
            </Link>
            <span className="text-gray-400">•</span>
            <Link to="/terminos-condiciones" className="hover:text-black transition-colors">
              Términos y Condiciones
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

