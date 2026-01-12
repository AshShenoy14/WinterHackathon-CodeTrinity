import { MapPin, Calendar } from 'lucide-react';


export default function ReportCard({ report }) {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'in progress':
      case 'in-progress':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'resolved':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'rejected':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div
      className={
        `rounded-xl border overflow-hidden bg-gradient-to-br from-white via-emerald-50 to-cyan-50 transition-all duration-300 shadow-sm hover:shadow-2xl hover:scale-[1.025] group`
      }
      style={{ minHeight: 220 }}
    >
      {/* Image */}
      {report.image && (
        <div className="aspect-video w-full bg-gray-100 overflow-hidden">
          <img
            src={report.image}
            alt={report.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="font-semibold text-gray-900 line-clamp-2 text-lg group-hover:text-green-700 transition-colors duration-200">{report.title}</h3>
          <span
            className={`flex items-center gap-1 px-2 py-1 text-xs font-bold rounded-full whitespace-nowrap shadow border transition-colors duration-200 ${getStatusColor(report.status)}`}
          >
            {/* Status icon */}
            {report.status?.toLowerCase() === 'pending' && <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />}
            {(report.status?.toLowerCase() === 'in progress' || report.status?.toLowerCase() === 'in-progress') && <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />}
            {report.status?.toLowerCase() === 'resolved' && <span className="w-2 h-2 bg-green-400 rounded-full" />}
            {report.status?.toLowerCase() === 'rejected' && <span className="w-2 h-2 bg-red-400 rounded-full" />}
            {report.status}
          </span>
        </div>

        <p className="text-sm text-gray-700 line-clamp-2 mb-3 font-medium group-hover:text-gray-900 transition-colors duration-200">{report.description}</p>

        <div className="flex items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span>{report.location}</span>
          </div>
          {report.date && (
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{report.date}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
