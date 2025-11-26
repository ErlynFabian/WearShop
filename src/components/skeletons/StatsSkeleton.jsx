const StatsSkeleton = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-white rounded-lg p-3 sm:p-4 md:p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2 sm:mb-4">
            <div className="p-2 sm:p-3 rounded-lg bg-gray-200 w-10 h-10 sm:w-12 sm:h-12 animate-pulse-fast" />
            <div className="h-4 w-8 bg-gray-200 rounded animate-pulse-fast" />
          </div>
          <div className="h-8 sm:h-10 bg-gray-200 rounded mb-2 animate-pulse-fast" />
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse-fast" />
        </div>
      ))}
    </div>
  );
};

export default StatsSkeleton;

