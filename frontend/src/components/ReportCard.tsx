import { useAddress } from '../hooks/useAddress';
import { CATEGORY_LABELS, STATUS_LABELS, STATUS_COLORS } from '../types';
import type { Report } from '../types';

interface ReportCardProps {
  report:      Report;
  onDelete?:   (id: string) => void;
  showDelete?: boolean;
}

export default function ReportCard({ report, onDelete, showDelete }: ReportCardProps) {
  const address = useAddress(report.latitude, report.longitude);

  const date = report.createdAt
    ? new Date(report.createdAt).toLocaleDateString('fr-FR', {
        day: '2-digit', month: 'long', year: 'numeric',
      })
    : '';

  return (
    <div className="report-card">
      {report.imageUrl && (
        <img src={report.imageUrl} alt={report.title} className="report-card-img" />
      )}

      <div className="report-card-body">
        <div className="report-card-header">
          <span className="report-category">
            {CATEGORY_LABELS[report.category] ?? report.category}
          </span>
          <span
            className="report-status"
            style={{ color: STATUS_COLORS[report.status] }}
          >
            {STATUS_LABELS[report.status] ?? report.status}
          </span>
        </div>

        <h3 className="report-title">{report.title}</h3>

        {report.description && (
          <p className="report-description">{report.description}</p>
        )}

        <div className="report-meta">
          <span className="report-address">📍 {address || 'Chargement...'}</span>
        </div>

        <div className="report-footer">
          <div className="report-author">
            <span className="author-avatar">👤</span>
            <span className="author-name">{report.authorName ?? 'Anonyme'}</span>
          </div>
          {date && <span className="report-date">{date}</span>}
        </div>

        {showDelete && onDelete && (
          <button className="btn-delete" onClick={() => onDelete(report.id)}>
            Supprimer
          </button>
        )}
      </div>
    </div>
  );
}
