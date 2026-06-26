import { NAV_ITEMS } from '../data/initialData';

interface SidebarProps {
  activePage: string;
  onPageChange: (page: string) => void;
  onSettingsClick: () => void;
  onLogout: () => void;
}

export default function Sidebar({ activePage, onPageChange, onSettingsClick, onLogout }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-name">Admin Console</div>
        <div className="brand-sub">Team Lead Portal</div>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`nav-item${activePage === item.id ? ' active' : ''}`}
            onClick={() => onPageChange(item.id)}
          >
            <span aria-hidden="true">▣</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <button type="button" className="nav-item" onClick={onSettingsClick}>
          <span aria-hidden="true">⚙</span>
          Settings
        </button>
        <button type="button" className="nav-item nav-logout" onClick={onLogout}>
          <span aria-hidden="true">⎋</span>
          Logout
        </button>
      </div>
    </aside>
  );
}
