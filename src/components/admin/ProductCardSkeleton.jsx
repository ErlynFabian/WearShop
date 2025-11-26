const ProductCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex gap-4">
        <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0 animate-pulse" />
        <div className="flex-1 min-w-0">
          <div className="h-5 bg-gray-200 rounded mb-2 w-3/4 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded mb-2 w-1/2 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;

