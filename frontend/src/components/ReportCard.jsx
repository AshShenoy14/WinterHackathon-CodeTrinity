import { MapPin, Calendar, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ReportCard({ report }) {
  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return {
          bg: 'bg-amber-50',
          text: 'text-amber-700',
          border: 'border-amber-200',
          dot: 'bg-amber-400'
        };
      case 'in progress':
      case 'in-progress':
        return {
          bg: 'bg-blue-50',
          text: 'text-blue-700',
          border: 'border-blue-200',
          dot: 'bg-blue-400'
        };
      case 'resolved':
        return {
          bg: 'bg-emerald-50',
          text: 'text-emerald-700',
          border: 'border-emerald-200',
          dot: 'bg-emerald-400'
        };
      case 'rejected':
        return {
          bg: 'bg-rose-50',
          text: 'text-rose-700',
          border: 'border-rose-200',
          dot: 'bg-rose-400'
        };
      default:
        return {
          bg: 'bg-gray-50',
          text: 'text-gray-700',
          border: 'border-gray-200',
          dot: 'bg-gray-400'
        };
    }
  };

  const statusStyle = getStatusConfig(report.status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-soft hover:shadow-soft-lg transition-shadow duration-300"
    >
      {/* Image Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none" />

      {/* Image */}
      {report.image ? (
        <div className="aspect-video w-full bg-gray-100 overflow-hidden relative">
          <motion.img
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.6 }}
            src={report.image}
            alt={report.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 right-3 z-20">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-sm backdrop-blur-md ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot} animate-pulse`} />
              {report.status}
            </span>
          </div>
        </div>
      ) : (
        <div className="aspect-video w-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
          <p className="text-gray-400 font-medium">No Image</p>
        </div>
      )}

      {/* Content */}
      <div className="p-5">
        <h3 className="font-display font-semibold text-gray-900 text-lg mb-2 line-clamp-1 group-hover:text-primary-600 transition-colors">
          {report.title}
        </h3>

        <p className="text-sm text-gray-600 line-clamp-2 mb-4 font-normal leading-relaxed">
          {report.description}
        </p>

        <div className="grid grid-cols-2 gap-3 text-xs text-gray-500 py-3 border-t border-gray-100">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-primary-500" />
            <span className="truncate">{report.location}</span>
          </div>
          {report.date && (
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-primary-500" />
              <span>{report.date}</span>
            </div>
          )}
        </div>

        <div className="mt-3 pt-3 flex justify-end">
          <motion.button
            whileHover={{ x: 5 }}
            className="text-sm font-semibold text-primary-600 flex items-center gap-1 group/btn hover:text-primary-700 transition-colors"
          >
            View Details <ArrowRight className="w-4 h-4 transition-transform" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
