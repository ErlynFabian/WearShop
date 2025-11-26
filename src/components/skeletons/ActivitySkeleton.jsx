const ActivitySkeleton = ({ count = 5 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={`flex items-center space-x-4 ${index < count - 1 ? 'pb-4 border-b border-gray-200' : ''}`}>
          <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse-fast" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse-fast" />
            <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse-fast" />
            <div className="h-3 bg-gray-200 rounded w-1/4 animate-pulse-fast" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivitySkeleton;

