import { useState } from 'react';
import './FilterBar.css';

function FilterBar({ filters, onFilterChange }) {
  const statuses = ['', 'open', 'in_progress', 'resolved', 'closed'];
  const priorities = ['', 'low', 'medium', 'high', 'urgent'];

  const handleStatusChange = (status) => {
    onFilterChange({ ...filters, status });
  };

  const handlePriorityChange = (priority) => {
    onFilterChange({ ...filters, priority });
  };

  const handleBreachedChange = (e) => {
    onFilterChange({ ...filters, breached: e.target.checked });
  };

  const handleReset = () => {
    onFilterChange({ status: '', priority: '', breached: false });
  };

  return (
    <div className="filter-bar">
      <div className="filter-container">
        <div className="filter-group">
          <label htmlFor="status-filter">Status:</label>
          <select 
            id="status-filter"
            value={filters.status} 
            onChange={(e) => handleStatusChange(e.target.value)}
            className="filter-select"
          >
            <option value="">All Statuses</option>
            {statuses.filter(s => s).map(status => (
              <option key={status} value={status}>
                {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="priority-filter">Priority:</label>
          <select 
            id="priority-filter"
            value={filters.priority} 
            onChange={(e) => handlePriorityChange(e.target.value)}
            className="filter-select"
          >
            <option value="">All Priorities</option>
            {priorities.filter(p => p).map(priority => (
              <option key={priority} value={priority}>
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>
            <input 
              type="checkbox" 
              checked={filters.breached}
              onChange={handleBreachedChange}
              className="filter-checkbox"
            />
            <span>SLA Breached Only</span>
          </label>
        </div>

        <button 
          className="btn-secondary"
          onClick={handleReset}
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
}

export default FilterBar;
