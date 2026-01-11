import { Leaf } from 'lucide-react';

export default function Loader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Leaf className="w-8 h-8 text-green-600 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
