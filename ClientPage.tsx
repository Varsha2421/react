import type { PortalData, ToastHandler } from '../data/initialData';

interface ClientPageProps {
  data: PortalData;
  toast: ToastHandler;
  onAddClient: () => void;
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    ACTIVE: 'status-active',
    'ON HOLD': 'status-on-hold',
    PLANNING: 'status-planning',
    CRITICAL: 'status-critical',
  };
  return <span className={`status-pill ${map[status] || 'status-off-duty'}`}>{status}</span>;
}

export default function ClientPage({ data, toast, onAddClient }: ClientPageProps) {
  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Client Registry</div>
          <div className="page-sub">Manage all active client accounts and track project progress.</div>
        </div>
        <div className="header-actions">
          <button className="btn-dark" onClick={() => toast('info', 'Exporting', 'Client list is being prepared.')}>⬇ Export</button>
          <button className="btn-gold" onClick={onAddClient}>+ Register Client</button>
        </div>
      </div>

      <div className="client-grid">
        <div className="card" style={{ margin: 0 }}>
          <div className="card-header">
            <div className="card-title">Client Accounts</div>
            <span style={{ fontSize: 12, color: '#888' }}>{data.clients.length} registered</span>
          </div>
          <table className="data-table">
            <thead>
              <tr><th>Client</th><th>Industry</th><th>Status</th><th>Lead</th><th>Progress</th><th>Due Date</th></tr>
            </thead>
            <tbody>
              {data.clients.map((client) => (
                <tr key={client.name}>
                  <td><div className="emp-cell"><div className="client-logo">{client.logo}</div><div><div className="client-name">{client.name}</div></div></div></td>
                  <td><div className="client-type">{client.industry}</div></td>
                  <td><StatusPill status={client.status} /></td>
                  <td style={{ fontSize: 13 }}>{client.assignedLead}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 60, height: 4, background: '#eee', borderRadius: 2 }}>
                        <div style={{ width: `${client.progress}%`, height: '100%', background: '#1a1a1a', borderRadius: 2 }} />
                      </div>
                      <span style={{ fontSize: 12 }}>{client.progress}%</span>
                    </div>
                  </td>
                  <td style={{ fontSize: 13 }}>{client.dueDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <div className="deadline-card">
            <div className="deadline-title">Upcoming Deadlines</div>
            {data.upcomingDeadlines.map((deadline, index) => (
              <div key={`${deadline.title}-${index}`} className={`dl-item dl-${deadline.type}`}>
                <div className="dl-name">{deadline.title}<span className={`dl-badge ${deadline.type === 'critical' ? 'crit' : deadline.type === 'urgent' ? 'urg' : 'rout'}`}>{deadline.type.toUpperCase()}</span></div>
                <div className="dl-client">{deadline.client}</div>
                <div className="dl-time">🕐 {deadline.hours}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
