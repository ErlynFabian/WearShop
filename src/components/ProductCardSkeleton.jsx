const ProductCardSkeleton = () => {
  return (
    <div className="group cursor-pointer">
      <div className="relative overflow-hidden bg-gray-200 aspect-square rounded-lg">
        <div 
          className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
          style={{
            backgroundSize: '200% 100%',
            animation: 'shimmer 0.8s infinite'
          }}
        />
      </div>
      <div className="mt-4">
        {/* Nombre del producto */}
        <div className="h-5 bg-gray-200 rounded mb-2 animate-pulse-fast" />
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4 animate-pulse-fast" />
        
        {/* Precio */}
        <div className="h-7 bg-gray-200 rounded w-1/2 mb-4 animate-pulse-fast" />
        
        {/* Botón */}
        <div className="w-full h-12 bg-gray-200 rounded-lg animate-pulse-fast" />
      </div>
    </div>
  );
};

export default ProductCardSkeleton;

