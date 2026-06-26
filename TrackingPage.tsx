import type { PortalData, ToastHandler } from '../data/initialData';

interface TrackingPageProps {
  data: PortalData;
  toast: ToastHandler;
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    'On Duty': 'status-on-duty',
    'In Transit': 'status-in-transit',
    'Off Duty': 'status-off-duty',
    'Urgent Task': 'status-urgent-task',
  };
  return <span className={`status-pill ${map[status] || 'status-off-duty'}`}>{status}</span>;
}

function EmpAvatar({ emp }: { emp: PortalData['employees'][number] }) {
  const initials = emp.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div className="emp-avatar">
      {emp.avatar ? <img src={emp.avatar} alt={emp.name} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} /> : initials}
    </div>
  );
}

export default function TrackingPage({ data, toast }: TrackingPageProps) {
  const inTransit = data.employees.filter((employee) => employee.status === 'In Transit').length;
  const onSite = data.employees.filter((employee) => employee.status === 'On Duty').length;

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Live Field Tracking</div>
          <div className="page-sub">Real-time location and status of all field executives.</div>
        </div>
        <div className="header-actions">
          <button className="btn-dark" onClick={() => toast('info', 'Refreshing', 'Live data refreshed.')}>↻ Refresh</button>
        </div>
      </div>

      <div className="tracking-stats">
        {[
          { icon: '🟢', label: 'On Site', value: onSite, cls: 'icon-green' },
          { icon: '🚗', label: 'In Transit', value: inTransit, cls: 'icon-blue' },
          { icon: '⛔', label: 'Offline', value: data.employees.filter((employee) => employee.status === 'Off Duty').length, cls: 'icon-red' },
          { icon: '🔴', label: 'Urgent', value: data.employees.filter((employee) => employee.status === 'Urgent Task').length, cls: 'icon-yellow' },
        ].map((stat) => (
          <div key={stat.label} className="track-stat">
            <div className={`track-stat-icon ${stat.cls}`}>{stat.icon}</div>
            <div>
              <div className="track-stat-val">{stat.value}</div>
              <div className="track-stat-lbl">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Field Executive Status</div>
          <div className="live-dot">LIVE</div>
        </div>
        <table className="data-table">
          <thead>
            <tr><th>Executive</th><th>Status</th><th>Location</th><th>Check-In</th><th>Active Task</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {data.employees.map((employee) => (
              <tr key={employee.id}>
                <td><div className="emp-cell"><EmpAvatar emp={employee} /><div><div className="emp-name">{employee.name}</div><div className="emp-role">{employee.role}</div></div></div></td>
                <td><StatusPill status={employee.status} /></td>
                <td style={{ fontSize: 13 }}>📍 {employee.location}</td>
                <td style={{ fontSize: 13 }}>{employee.checkin}</td>
                <td style={{ fontSize: 13, color: employee.activeTask === 'None' ? '#aaa' : '#222' }}>{employee.activeTask}</td>
                <td>
                  <button className="act-btn" onClick={() => toast('info', '📍 Route View', `Tracking ${employee.name} — ${employee.location}`)}>
                    📍
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
