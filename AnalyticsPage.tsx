import type { PortalData, ToastHandler } from '../data/initialData';

interface AnalyticsPageProps {
  data: PortalData;
  toast: ToastHandler;
}

function PerfBar({ pct }: { pct: number }) {
  return (
    <div className="perf-bar">
      <div className="perf-track"><div className="perf-fill" style={{ width: `${pct}%` }} /></div>
      <span className="perf-pct">{pct}%</span>
    </div>
  );
}

function EmpAvatar({ emp }: { emp: PortalData['employees'][number] }) {
  const initials = emp.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div className="emp-avatar">
      {emp.avatar ? <img src={emp.avatar} alt={emp.name} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} /> : initials}
    </div>
  );
}

export default function AnalyticsPage({ data, toast }: AnalyticsPageProps) {
  const avgPerf = Math.round(data.employees.reduce((sum, employee) => sum + employee.performance, 0) / data.employees.length);
  const top5 = [...data.employees].sort((a, b) => b.performance - a.performance).slice(0, 5);

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Analytics Dashboard</div>
          <div className="page-sub">Comprehensive performance metrics and operational insights.</div>
        </div>
        <div className="header-actions">
          <button className="btn-dark" onClick={() => toast('info', 'Exporting', 'Analytics report is being generated.')}>⬇ Export Report</button>
        </div>
      </div>

      <div className="analytics-stats">
        <div className="an-stat">
          <div className="an-lbl">Team Efficiency Score</div>
          <div className="an-val">{avgPerf}%</div>
          <div className="an-trend">▲ +3.2% from last month</div>
        </div>
        <div className="an-stat">
          <div className="an-lbl">Tasks Completed (Week)</div>
          <div className="an-val">148</div>
          <div className="an-trend">▲ +11 vs last week</div>
        </div>
        <div className="an-stat">
          <div className="an-lbl">Avg Resolution Time</div>
          <div className="an-val">1.4h</div>
          <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>▼ -0.2h optimization needed</div>
        </div>
      </div>

      <div className="chart-area">
        <div className="chart-title">
          Performance Trends (Operational Flow vs. Target)
          <div className="chart-legend">
            <div className="legend-item"><div className="legend-dot ld-dark" /> Operational Flow</div>
            <div className="legend-item"><div className="legend-dot ld-light" /> Target Baseline</div>
          </div>
        </div>
        <svg viewBox="0 0 900 200" className="chart-svg">
          <path d="M20,160 C100,158 200,155 300,150 C400,145 500,140 600,136 C700,132 800,128 880,125" fill="none" stroke="#ddd" strokeWidth="2" strokeDasharray="6,4" />
          <path d="M20,160 C60,155 90,150 120,140 C150,130 170,135 200,120 C230,105 260,115 300,95 C340,75 360,105 400,90 C440,75 470,80 510,60 C550,40 600,55 650,45 C700,35 750,38 800,30 C840,24 870,22 880,20 L880,200 L20,200 Z" fill="#f5f0e0" opacity=".5" />
          <path d="M20,160 C60,155 90,150 120,140 C150,130 170,135 200,120 C230,105 260,115 300,95 C340,75 360,105 400,90 C440,75 470,80 510,60 C550,40 600,55 650,45 C700,35 750,38 800,30 C840,24 870,22 880,20" fill="none" stroke="#1a1a1a" strokeWidth="2.5" />
          {['WK 01', 'WK 02', 'WK 03', 'WK 04', 'WK 05', 'WK 06', 'WK 07', 'WK 08', 'WK 09', 'WK 10'].map((week, index) => (
            <text key={week} x={20 + index * 93} y="195" fontSize="11" fill="#aaa">{week}</text>
          ))}
          <circle cx="400" cy="90" r="5" fill="#1a1a1a" />
          <circle cx="880" cy="20" r="5" fill="#1a1a1a" />
        </svg>
      </div>

      <div className="analytics-bottom">
        <div className="top-emp-table">
          <div className="card-header">
            <div className="card-title">Top Performing Employees</div>
          </div>
          <table className="data-table">
            <thead>
              <tr><th>Employee</th><th>Designation</th><th>Tasks</th><th>Efficiency</th></tr>
            </thead>
            <tbody>
              {top5.map((employee, index) => (
                <tr key={employee.id}>
                  <td><div className="emp-cell"><EmpAvatar emp={employee} /><div className="emp-name">{employee.name}</div></div></td>
                  <td style={{ fontSize: 13 }}>{employee.role}</td>
                  <td style={{ fontSize: 13 }}>{10 + (5 - index) * 3}</td>
                  <td><PerfBar pct={employee.performance} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="domain-card">
          <div className="card-title" style={{ marginBottom: 16 }}>Task Domain Distribution</div>
          {[['Software Development', 42], ['Marketing Strategy', 28], ['Compliance', 18], ['Operations', 12]].map(([label, pct]) => (
            <div key={label} className="domain-item">
              <div className="domain-label"><span>{label}</span><span>{pct}%</span></div>
              <div className="domain-bar"><div className="domain-fill" style={{ width: `${pct}%` }} /></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
