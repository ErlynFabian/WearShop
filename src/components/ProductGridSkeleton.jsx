import ProductCardSkeleton from './ProductCardSkeleton';

const ProductGridSkeleton = ({ count = 8 }) => {
  return (
    <>
      {/* Carrusel en móvil */}
      <div className="md:hidden overflow-x-auto pb-4 -mx-4 px-4">
        <div className="flex gap-4" style={{ width: 'max-content' }}>
          {Array.from({ length: count }).map((_, index) => (
            <div key={index} className="w-64 flex-shrink-0">
              <ProductCardSkeleton />
            </div>
          ))}
        </div>
      </div>

      {/* Grid en desktop */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {Array.from({ length: count }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    </>
  );
};

export default ProductGridSkeleton;

