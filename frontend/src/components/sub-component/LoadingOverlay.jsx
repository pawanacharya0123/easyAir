import React from "react";

const LoadingOverlay = () => {
  return (
    <div className="absolute inset-0 bg-white/10 backdrop-blur-[4px] flex items-center justify-center z-50 rounded-2xl pointer-events-none">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-blue-500 border-gray-300"></div>
    </div>
  );
};

export default LoadingOverlay;
