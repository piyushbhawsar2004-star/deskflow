import { useState, useEffect, useCallback } from 'react';
import { ticketAPI } from './api/ticketAPI';
import Header from './components/Header';
import StatsStrip from './components/StatsStrip';
import FilterBar from './components/FilterBar';
import Board from './components/Board';
import CreateTicketModal from './components/CreateTicketModal';
import './App.css';

function App() {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({
    statusCounts: {},
    priorityCounts: {},
    breachedOpen: 0,
    totalTickets: 0
  });
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    breached: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Fetch tickets
  const fetchTickets = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await ticketAPI.getTickets(filters);
      setTickets(data);
    } catch (err) {
      setError('Failed to load tickets: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const data = await ticketAPI.getStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchTickets();
    fetchStats();
  }, [fetchTickets, fetchStats]);

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Handle create ticket
  const handleCreateTicket = async (ticketData) => {
    setError('');
    try {
      await ticketAPI.createTicket(ticketData);
      setShowCreateModal(false);
      await fetchTickets();
      await fetchStats();
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Failed to create ticket');
    }
  };

  // Handle status update
  const handleUpdateStatus = async (ticketId, newStatus) => {
    try {
      const updatedTicket = await ticketAPI.updateTicketStatus(ticketId, newStatus);
      
      // Update tickets list
      setTickets(tickets.map(t => t._id === ticketId ? updatedTicket : t));
      
      // Refresh stats
      await fetchStats();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update ticket status');
    }
  };

  // Handle delete ticket
  const handleDeleteTicket = async (ticketId) => {
    try {
      await ticketAPI.deleteTicket(ticketId);
      setTickets(tickets.filter(t => t._id !== ticketId));
      await fetchStats();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete ticket');
    }
  };

  return (
    <div className="app">
      <Header onCreateClick={() => setShowCreateModal(true)} />
      
      {error && <div className="error-banner">{error}</div>}
      
      <StatsStrip stats={stats} />
      
      <FilterBar filters={filters} onFilterChange={handleFilterChange} />
      
      {loading ? (
        <div className="loading">Loading tickets...</div>
      ) : (
        <Board 
          tickets={tickets}
          onStatusUpdate={handleUpdateStatus}
          onDeleteTicket={handleDeleteTicket}
        />
      )}
      
      {showCreateModal && (
        <CreateTicketModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateTicket}
        />
      )}
    </div>
  );
}

export default App;
