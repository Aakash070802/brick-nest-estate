const ListingSkeleton = () => {
  return (
    <div className="animate-pulse bg-(--color-card) rounded-lg overflow-hidden">
      <div className="h-48 bg-(--color-border)" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-(--color-border) rounded w-3/4" />
        <div className="h-3 bg-(--color-border) rounded w-1/2" />
        <div className="h-4 bg-(--color-border) rounded w-1/3" />
      </div>
    </div>
  );
};

export default ListingSkeleton;
