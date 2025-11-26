const FormSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Form fields */}
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-24 animate-pulse-fast" />
          <div className="h-12 bg-gray-200 rounded animate-pulse-fast" />
        </div>
      ))}
      
      {/* Buttons */}
      <div className="flex gap-4 pt-4">
        <div className="h-12 bg-gray-200 rounded w-32 animate-pulse-fast" />
        <div className="h-12 bg-gray-200 rounded w-32 animate-pulse-fast" />
      </div>
    </div>
  );
};

export default FormSkeleton;

