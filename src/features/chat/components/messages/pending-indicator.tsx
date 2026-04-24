const PendingIndicator = () => (
  <div className="absolute -left-4 top-1/2 -translate-y-1/2 flex items-center justify-center">
    <div className="w-2 h-2 aspect-square animate-spin rounded-full border-[1.5px] border-gray-300 border-t-transparent"></div>
  </div>
);

export default PendingIndicator;
