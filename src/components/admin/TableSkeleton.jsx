const TableSkeleton = ({ rows = 5, cols = 4 }) => {
  return (
    <div className="space-y-4">
      {/* Header skeleton */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {Array.from({ length: cols }).map((_, index) => (
          <div key={index} className="h-6 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
      
      {/* Rows skeleton */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {Array.from({ length: cols }).map((_, colIndex) => (
            <div key={colIndex} className="h-12 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      ))}
    </div>
  );
};

export default TableSkeleton;

