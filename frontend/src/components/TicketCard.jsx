import './TicketCard.css';

function TicketCard({ ticket, onDragStart, onDelete }) {
  const getPriorityColor = (priority) => {
    const colors = {
      urgent: '#e74c3c',
      high: '#e67e22',
      medium: '#f39c12',
      low: '#27ae60'
    };
    return colors[priority] || '#95a5a6';
  };

  const formatAge = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d`;
  };

  return (
    <div
      className="ticket-card"
      draggable
      onDragStart={() => onDragStart(ticket)}
    >
      <div className="ticket-header">
        <div className="ticket-left">
          <span
            className="priority-badge"
            style={{ backgroundColor: getPriorityColor(ticket.priority) }}
            title={ticket.priority}
          >
            {ticket.priority.charAt(0).toUpperCase()}
          </span>
          <h4 className="ticket-subject">{ticket.subject}</h4>
        </div>
        <button
          className="btn-delete"
          onClick={(e) => {
            e.stopPropagation();
            if (window.confirm('Are you sure you want to delete this ticket?')) {
              onDelete(ticket._id);
            }
          }}
          title="Delete ticket"
        >
          ×
        </button>
      </div>

      <p className="ticket-email">{ticket.customerEmail}</p>

      <p className="ticket-description">{ticket.description.substring(0, 80)}...</p>

      <div className="ticket-footer">
        <div className="ticket-meta">
          <span className="ticket-age" title="Time elapsed">
            ⏱ {formatAge(ticket.ageMinutes)}
          </span>
          {ticket.slaBreached && (
            <span className="sla-breached" title="SLA breached">
              ⚠ SLA
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default TicketCard;
