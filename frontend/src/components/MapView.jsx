import { MapPin } from 'lucide-react';

export default function MapView({ reports = [] }) {
  return (
    <div className="relative w-full h-full min-h-[400px] bg-gradient-to-br from-green-50 to-blue-50 rounded-lg overflow-hidden shadow-inner">
      {/* Map Placeholder with Grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="grid grid-cols-8 grid-rows-6 h-full">
          {Array.from({ length: 48 }).map((_, i) => (
            <div key={i} className="border border-green-200"></div>
          ))}
        </div>
      </div>

      {/* Map Pins */}
      <div className="relative h-full p-8">
        {reports.length > 0 ? (
          reports.map((report, index) => (
            <div
              key={report.id || index}
              className="absolute group cursor-pointer"
              style={{
                left: `${(index * 23 + 15) % 80}%`,
                top: `${(index * 31 + 20) % 70}%`,
              }}
            >
              <div className="relative">
                <MapPin className="w-8 h-8 text-red-600 fill-red-500 drop-shadow-lg animate-bounce" />
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white px-3 py-2 rounded-lg shadow-lg whitespace-nowrap z-10">
                <p className="text-sm font-medium text-gray-900">{report.title}</p>
                <p className="text-xs text-gray-500">{report.location}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">No reports to display</p>
            </div>
          </div>
        )}

        {/* Heat Zone Indicators */}
        {reports.length > 3 && (
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
            <p className="text-xs font-semibold text-gray-700 mb-2">Heat Zones</p>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-gray-600">High Activity</span>
            </div>
            <div className="flex items-center gap-2 text-xs mt-1">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="text-gray-600">Medium Activity</span>
            </div>
            <div className="flex items-center gap-2 text-xs mt-1">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-gray-600">Low Activity</span>
            </div>
          </div>
        )}
      </div>

      {/* Map Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <button className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
          <span className="text-lg font-bold text-gray-700">+</span>
        </button>
        <button className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
          <span className="text-lg font-bold text-gray-700">−</span>
        </button>
      </div>
    </div>
  );
}
