import { useMemo } from 'react';
import Hero from '../components/Hero';
import Categories from '../components/Categories';
import ProductGrid from '../components/ProductGrid';
import Testimonials from '../components/Testimonials';
import SEO from '../components/SEO';
import useProductsStore from '../context/productsStore';
import useRecentlyViewedStore from '../context/recentlyViewedStore';

const Home = () => {
  const { products } = useProductsStore();
  const { getViewedProductIds } = useRecentlyViewedStore();
  
  const featuredProducts = useMemo(() => {
    return products.filter(p => p.featured && (p.stock || 0) > 0).slice(0, 8);
  }, [products]);

  const recentlyViewedProducts = useMemo(() => {
    const viewedIds = getViewedProductIds();
    if (viewedIds.length === 0) return [];
    
    // Obtener los productos en el orden en que fueron vistos
    const viewed = viewedIds
      .map(id => products.find(p => p.id === id))
      .filter(p => p !== undefined && (p.stock || 0) > 0); // Filtrar productos que ya no existen y que no tienen stock
    
    return viewed;
  }, [products, getViewedProductIds]);

  return (
    <div>
      <SEO
        title="Inicio"
        description="Descubre las últimas tendencias en moda. Ropa para hombres, mujeres y accesorios de calidad. Envíos nacionales e internacionales. Estilo que define tu personalidad."
        keywords="moda, ropa, tienda online, ropa para hombres, ropa para mujeres, accesorios, estilo, tendencias"
      />
      <Hero />
      <Categories />
      
      {/* Featured Products */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-black text-black mb-16 text-center">
            DESTACADOS
          </h2>
          <ProductGrid products={featuredProducts} />
        </div>
      </section>

      {/* Recently Viewed Products */}
      {recentlyViewedProducts.length > 0 && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-black text-black mb-16 text-center">
              VISTOS RECIENTEMENTE
            </h2>
            <ProductGrid products={recentlyViewedProducts} />
          </div>
        </section>
      )}

      <Testimonials />
    </div>
  );
};

export default Home;

