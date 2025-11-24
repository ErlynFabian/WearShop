import Hero from '../components/Hero';
import Categories from '../components/Categories';
import ProductGrid from '../components/ProductGrid';
import Testimonials from '../components/Testimonials';
import useProductsStore from '../context/productsStore';

const Home = () => {
  const { products } = useProductsStore();
  const featuredProducts = products.filter(p => p.featured).slice(0, 8);

  return (
    <div>
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

      <Testimonials />
    </div>
  );
};

export default Home;

