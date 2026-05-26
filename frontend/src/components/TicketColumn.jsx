import { useState } from 'react';
import TicketCard from './TicketCard';
import './TicketColumn.css';

function TicketColumn({ 
  title, 
  status, 
  color, 
  tickets, 
  onDragStart, 
  onDrop, 
  onDeleteTicket,
  draggedTicket,
  validTransitions
}) {
  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    if (draggedTicket && draggedTicket.status !== status) {
      setDragOver(validTransitions.includes(status));
    }
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (draggedTicket) {
      onDrop(status);
    }
  };

  return (
    <div
      className={`ticket-column ${dragOver ? 'drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="column-header" style={{ borderTopColor: color }}>
        <h3 className="column-title">{title}</h3>
        <span className="column-count">{tickets.length}</span>
      </div>
      <div className="column-content">
        {tickets.length === 0 ? (
          <div className="empty-state">
            <p>No tickets</p>
          </div>
        ) : (
          tickets.map(ticket => (
            <TicketCard
              key={ticket._id}
              ticket={ticket}
              onDragStart={onDragStart}
              onDelete={onDeleteTicket}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default TicketColumn;
