import { MapPin, Calendar } from 'lucide-react';


export default function ReportCard({ report }) {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'in progress':
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className={`rounded-lg border overflow-hidden hover:shadow-xl transition-shadow bg-gradient-to-br from-white via-emerald-50 to-cyan-50 ${getStatusColor(report.status).split(' ').pop()}`}>
      {/* Image */}
      {report.image && (
        <div className="aspect-video w-full bg-gray-100 overflow-hidden">
          <img
            src={report.image}
            alt={report.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="font-semibold text-gray-900 line-clamp-2">{report.title}</h3>
          <span
            className={`px-2 py-1 text-xs font-bold rounded-full whitespace-nowrap shadow-sm border ${getStatusColor(report.status)}`}
          >
            {report.status}
          </span>
        </div>

        <p className="text-sm text-gray-700 line-clamp-2 mb-3 font-medium">{report.description}</p>

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
