import { useMemo } from 'react';
import type { PortalData, ToastHandler } from '../data/initialData';

interface DashboardPageProps {
  data: PortalData;
  onNavigate: (page: string) => void;
  onAssignTask: (title?: string, client?: string, empId?: string) => void;
  toast: ToastHandler;
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    'On Duty': 'status-on-duty',
    'In Transit': 'status-in-transit',
    'Off Duty': 'status-off-duty',
    'Urgent Task': 'status-urgent-task',
    'No Task': 'status-no-task',
    'Completed': 'status-completed',
    ACTIVE: 'status-active',
    'ON HOLD': 'status-on-hold',
    PLANNING: 'status-planning',
    CRITICAL: 'status-critical',
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

function PerfBar({ pct }: { pct: number }) {
  return (
    <div className="perf-bar">
      <div className="perf-track"><div className="perf-fill" style={{ width: `${pct}%` }} /></div>
      <span className="perf-pct">{pct}%</span>
    </div>
  );
}

export default function DashboardPage({ data, onNavigate, onAssignTask, toast }: DashboardPageProps) {
  const onDutyCount = data.employees.filter((employee) => employee.status !== 'Off Duty').length;
  const leaderboard = useMemo(() => [...data.employees].sort((a, b) => b.performance - a.performance).slice(0, 5), [data.employees]);

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Team Overview</div>
          <div className="page-sub">Real-time performance and operational status of your direct reports.</div>
        </div>
        <div className="header-actions">
          <button className="btn-dark" onClick={() => toast('info', 'Exporting Report', 'Generating PDF report… your download will begin shortly.')}>
            ⬇ Export Report
          </button>
          <button className="btn-gold" onClick={() => onAssignTask()}>
            + Assign New Task
          </button>
        </div>
      </div>

      <div className="stats-row stats-4">
        <div className="stat-card">
          <div className="stat-label">Team Incentive Pool</div>
          <div className="stat-value">${data.incentivePool.toLocaleString()}.00</div>
          <div className="stat-sub">Current month forecast</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Completion Rate</div>
          <div className="stat-value">94.2%</div>
          <div className="stat-prog"><div className="stat-prog-fill" style={{ width: '94.2%' }} /></div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Active Staff</div>
          <div className="stat-value">{onDutyCount}/{data.employees.length}</div>
          <div className="stat-sub">4 On-leave, 2 Unassigned</div>
        </div>
        <div className="stat-card dark">
          <div className="stat-label">Avg Handling Time</div>
          <div className="stat-value">42m 15s</div>
          <div className="stat-sub">Optimized by 4m since last week</div>
        </div>
      </div>

      <div className="dash-grid">
        <div className="dash-left">
          <div className="card">
            <div className="card-header">
              <div className="card-title">Attention Required</div>
              <span className="attn-badge">{data.employees.filter((employee) => employee.status === 'Urgent Task' || employee.performance < 85).length} Action Items</span>
            </div>
            <table className="data-table">
              <thead>
                <tr><th>Employee</th><th>Status</th><th>Performance</th><th></th></tr>
              </thead>
              <tbody>
                {data.employees.filter((employee) => employee.status === 'Urgent Task' || employee.performance < 85).map((emp) => (
                  <tr key={emp.id}>
                    <td><div className="emp-cell"><EmpAvatar emp={emp} /><div><div className="emp-name">{emp.name}</div><div className="emp-role">{emp.role}</div></div></div></td>
                    <td><StatusPill status={emp.status} /></td>
                    <td><PerfBar pct={emp.performance} /></td>
                    <td><button className="assign-btn" onClick={() => onAssignTask(emp.id)}>Assign</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="view-all-btn" onClick={() => onNavigate('employee')}>View All Team Members</button>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title">Operational Activity</div>
              <div className="live-dot">ACTIVE</div>
            </div>
            <div className="activity-grid">
              {data.activities.map((activity, index) => (
                <div key={`${activity.time}-${index}`} className="activity-card">
                  <div className="activity-time">{activity.time}</div>
                  <div className="activity-text">{activity.text}</div>
                  <div className={`activity-tag tag-${activity.tag}`}>{activity.tagText}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="map-widget">
            <div className="map-header">
              <div>
                <div className="map-title">Regional Spread</div>
                <div className="map-sub">Live tracking of on-field agents</div>
              </div>
              <div className="live-dot">LIVE</div>
            </div>
            <div className="map-body">
              <div className="map-grid-bg" />
              {[
                { top: '30%', left: '25%' },
                { top: '55%', left: '45%' },
                { top: '40%', left: '65%' },
                { top: '65%', left: '75%' },
                { top: '25%', left: '80%' },
              ].map((dot, index) => (
                <div key={index} className="map-dot" style={{ top: dot.top, left: dot.left }} />
              ))}
            </div>
            <div className="map-footer">
              <div>
                <div className="agents-label">Active Agents</div>
                <div className="agents-count">14 Online</div>
              </div>
              <div className="agent-faces">
                {['A', 'R', 'M'].map((letter, index) => <div key={index} className="agent-face">{letter}</div>)}
                <div className="agent-face agent-more">+11</div>
              </div>
            </div>
          </div>

          <div className="leaderboard-card">
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#111' }}>Leaderboard</div>
              <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>Incentive projections this week</div>
            </div>
            {leaderboard.map((employee, index) => {
              const est = Math.round(employee.performance * 18);
              return (
                <div key={employee.id} className="lb-item">
                  <div className="lb-rank">{index + 1}</div>
                  <div style={{ flex: 1 }}>
                    <div className="lb-name">{employee.name}</div>
                    <div className="lb-bar"><div className="lb-bar-fill" style={{ width: `${employee.performance}%` }} /></div>
                  </div>
                  <div className="lb-amount">${est}</div>
                </div>
              );
            })}
            <button className="lb-full-btn" onClick={() => onNavigate('incentive')}>Full Incentive Dashboard</button>
          </div>
        </div>
      </div>
    </div>
  );
}
