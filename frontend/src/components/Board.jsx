import { useState } from 'react';
import TicketColumn from './TicketColumn';
import './Board.css';

function Board({ tickets, onStatusUpdate, onDeleteTicket }) {
  const [draggedTicket, setDraggedTicket] = useState(null);
  const [dragError, setDragError] = useState('');

  const columns = [
    { status: 'open', title: 'Open', color: '#f39c12' },
    { status: 'in_progress', title: 'In Progress', color: '#3498db' },
    { status: 'resolved', title: 'Resolved', color: '#2ecc71' },
    { status: 'closed', title: 'Closed', color: '#95a5a6' }
  ];

  const getTicketsForStatus = (status) => {
    return tickets.filter(t => t.status === status);
  };

  const validTransitions = {
    'open': ['in_progress'],
    'in_progress': ['resolved', 'open'],
    'resolved': ['closed', 'in_progress'],
    'closed': []
  };

  const handleDragStart = (ticket) => {
    setDraggedTicket(ticket);
    setDragError('');
  };

  const handleDropOnColumn = async (targetStatus) => {
    if (!draggedTicket) return;

    if (draggedTicket.status === targetStatus) {
      setDraggedTicket(null);
      return;
    }

    // Check if transition is valid
    if (!validTransitions[draggedTicket.status]?.includes(targetStatus)) {
      setDragError(`Cannot move ${draggedTicket.status} ticket to ${targetStatus}`);
      setTimeout(() => setDragError(''), 3000);
      setDraggedTicket(null);
      return;
    }

    try {
      await onStatusUpdate(draggedTicket._id, targetStatus);
      setDraggedTicket(null);
    } catch (err) {
      setDragError(err.message || 'Failed to update ticket');
      setDraggedTicket(null);
    }
  };

  const handleDragCancel = () => {
    setDraggedTicket(null);
  };

  return (
    <div className="board">
      {dragError && (
        <div className="drag-error">
          {dragError}
        </div>
      )}
      <div className="board-container">
        {columns.map(column => (
          <TicketColumn
            key={column.status}
            title={column.title}
            status={column.status}
            color={column.color}
            tickets={getTicketsForStatus(column.status)}
            onDragStart={handleDragStart}
            onDrop={handleDropOnColumn}
            onDeleteTicket={onDeleteTicket}
            draggedTicket={draggedTicket}
            validTransitions={validTransitions[column.status] || []}
          />
        ))}
      </div>
    </div>
  );
}

export default Board;
