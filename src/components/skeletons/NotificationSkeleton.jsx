const NotificationSkeleton = ({ count = 5 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="p-4 border-l-4 border-gray-200 bg-white hover:bg-gray-50 transition-colors">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0 animate-pulse-fast" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse-fast" />
              <div className="h-3 bg-gray-200 rounded w-full animate-pulse-fast" />
              <div className="h-3 bg-gray-200 rounded w-1/3 animate-pulse-fast" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationSkeleton;

