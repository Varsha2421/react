import { useMemo, useState } from 'react';
import type { PortalData, ToastHandler } from '../data/initialData';

interface EmployeePageProps {
  data: PortalData;
  onShowEmployee: (employeeId: string) => void;
  onAssignTask: (title?: string, client?: string, empId?: string) => void;
  onAddEmployee: () => void;
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

function PerfBar({ pct }: { pct: number }) {
  return (
    <div className="perf-bar">
      <div className="perf-track"><div className="perf-fill" style={{ width: `${pct}%` }} /></div>
      <span className="perf-pct">{pct}%</span>
    </div>
  );
}

export default function EmployeePage({ data, onShowEmployee, onAssignTask, onAddEmployee, toast }: EmployeePageProps) {
  const [filter, setFilter] = useState('All');
  const [sort, setSort] = useState('perfDesc');

  const onDuty = data.employees.filter((employee) => employee.status === 'On Duty' || employee.status === 'In Transit' || employee.status === 'Urgent Task').length;
  const avgPerf = Math.round(data.employees.reduce((sum, employee) => sum + employee.performance, 0) / data.employees.length);

  const list = useMemo(() => {
    let employees = [...data.employees];
    if (filter === 'On Duty') employees = employees.filter((employee) => employee.status !== 'Off Duty');
    if (filter === 'Off Duty') employees = employees.filter((employee) => employee.status === 'Off Duty');
    if (sort === 'perfDesc') employees.sort((a, b) => b.performance - a.performance);
    if (sort === 'nameAsc') employees.sort((a, b) => a.name.localeCompare(b.name));
    return employees;
  }, [data.employees, filter, sort]);

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Team Management</div>
          <div className="page-sub">Monitor, manage, and coordinate your active field team.</div>
        </div>
        <div className="header-actions">
          <button className="btn-dark" onClick={() => toast('info', 'Exporting Data', 'Employee list spreadsheet is being prepared for download.')}>⬇ Export List</button>
          <button className="btn-gold" onClick={onAddEmployee}>+ Onboard New</button>
        </div>
      </div>

      <div className="emp-stats">
        {[
          { label: 'Total Team', value: data.employees.length, trend: '▲ Active staff', icon: '👥', cls: 'icon-blue' },
          { label: 'On Duty', value: onDuty, trend: 'Live tracking enabled', icon: '🎯', cls: 'icon-green' },
          { label: 'Avg Performance', value: `${avgPerf}%`, trend: 'Rating index', icon: '⭐', cls: 'icon-yellow' },
          { label: 'Pending Leave', value: 3, sub: 'Needs review', icon: '📅', cls: 'icon-red' },
        ].map((stat) => (
          <div key={stat.label} className="emp-stat-card">
            <div>
              <div className="emp-stat-lbl">{stat.label}</div>
              <div className="emp-stat-val">{stat.value}</div>
              {stat.trend ? <div className="emp-stat-trend">{stat.trend}</div> : null}
              {stat.sub ? <div className="emp-stat-sub">{stat.sub}</div> : null}
            </div>
            <div className={`emp-stat-icon ${stat.cls}`}>{stat.icon}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="filter-row">
          <div className="filter-tabs">
            {['All', 'On Duty', 'Off Duty'].map((value) => (
              <button key={value} className={`filter-tab${filter === value ? ' active' : ''}`} onClick={() => setFilter(value)}>
                {value === 'All' ? 'All Members' : value}
              </button>
            ))}
          </div>
          <button className="filter-btn" onClick={() => toast('success', 'Filter Applied', 'Employee list updated.')}>Filter</button>
          <select className="sort-select" value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="perfDesc">Performance (High to Low)</option>
            <option value="nameAsc">Name A-Z</option>
          </select>
        </div>

        <table className="data-table">
          <thead>
            <tr><th>Member</th><th>Role</th><th>Status</th><th>Performance</th><th>Active Task</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {list.map((employee) => (
              <tr key={employee.id}>
                <td><div className="emp-cell"><EmpAvatar emp={employee} /><div><div className="emp-name">{employee.name}</div><div className="emp-role">{employee.id}</div></div></div></td>
                <td>{employee.role}</td>
                <td><StatusPill status={employee.status} /></td>
                <td><PerfBar pct={employee.performance} /></td>
                <td style={{ fontSize: 13, color: employee.activeTask === 'None' ? '#aaa' : '#222' }}>{employee.activeTask}</td>
                <td>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button className="act-btn" onClick={() => onShowEmployee(employee.id)} title="View Profile">👁</button>
                    <button className="act-btn" onClick={() => onAssignTask('', '', employee.id)} title="Assign Task">✎</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
