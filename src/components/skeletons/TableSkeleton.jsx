const TableSkeleton = ({ rows = 5, columns = 4 }) => {
  return (
    <div className="space-y-4">
      {/* Header skeleton */}
      <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-gray-200">
        {Array.from({ length: columns }).map((_, index) => (
          <div key={index} className="h-4 bg-gray-200 rounded animate-pulse-fast" />
        ))}
      </div>
      
      {/* Rows skeleton */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-1 md:grid-cols-12 gap-4 py-4 border-b border-gray-200">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div key={colIndex} className="h-4 bg-gray-200 rounded animate-pulse-fast" />
          ))}
        </div>
      ))}
    </div>
  );
};

export default TableSkeleton;

