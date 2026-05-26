import './Header.css';

function Header({ onCreateClick }) {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <h1 className="header-title">DeskFlow</h1>
          <p className="header-subtitle">Support Ticket Triage Board</p>
        </div>
        <button 
          className="btn-primary btn-create"
          onClick={onCreateClick}
        >
          + New Ticket
        </button>
      </div>
    </header>
  );
}

export default Header;
