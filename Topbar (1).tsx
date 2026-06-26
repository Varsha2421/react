import { PAGE_SEARCH_PLACEHOLDER } from '../data/initialData';

interface TopbarProps {
  page: string;
  user: { name: string; role: string; init: string };
  onHelp: () => void;
  onSettings: () => void;
}

export default function Topbar({ page, user, onHelp, onSettings }: TopbarProps) {
  return (
    <header className="topbar">
      <label className="search-bar">
        <span aria-hidden="true">🔎</span>
        <input type="text" placeholder={PAGE_SEARCH_PLACEHOLDER[page] || 'Search...'} />
      </label>

      <div className="topbar-icons">
        <button type="button" className="icon-btn" aria-label="Notifications">
          🔔
        </button>
        <button type="button" className="icon-btn" onClick={onHelp} aria-label="Help">
          ❓
        </button>
        <button type="button" className="icon-btn" onClick={onSettings} aria-label="Settings">
          ⚙
        </button>
      </div>

      <div className="topbar-user">
        <div className="user-info">
          <div className="user-name">{user.name}</div>
          <div className="user-role">{user.role}</div>
        </div>
        <div className="user-avatar">{user.init}</div>
      </div>
    </header>
  );
}
