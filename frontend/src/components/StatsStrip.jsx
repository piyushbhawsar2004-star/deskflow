import './StatsStrip.css';

function StatsStrip({ stats }) {
  const statItems = [
    { label: 'Total Tickets', value: stats.totalTickets || 0, color: '#667eea' },
    { label: 'Open', value: stats.statusCounts?.open || 0, color: '#f39c12' },
    { label: 'In Progress', value: stats.statusCounts?.in_progress || 0, color: '#3498db' },
    { label: 'Resolved', value: stats.statusCounts?.resolved || 0, color: '#2ecc71' },
    { label: 'Closed', value: stats.statusCounts?.closed || 0, color: '#95a5a6' },
    { label: 'SLA Breached', value: stats.breachedOpen || 0, color: '#e74c3c' }
  ];

  return (
    <div className="stats-strip">
      <div className="stats-container">
        {statItems.map((item, index) => (
          <div key={index} className="stat-item">
            <div 
              className="stat-color"
              style={{ backgroundColor: item.color }}
            ></div>
            <div className="stat-content">
              <p className="stat-label">{item.label}</p>
              <p className="stat-value">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StatsStrip;
