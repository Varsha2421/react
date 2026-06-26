import type { PortalData, ToastHandler } from '../data/initialData';

interface TaskPageProps {
  data: PortalData;
  toast: ToastHandler;
  onAssignTask: (title?: string, client?: string, empId?: string) => void;
}

export default function TaskPage({ data, onAssignTask }: TaskPageProps) {
  const activeEmployees = data.employees.filter((employee) => employee.status !== 'Off Duty');

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Task Assignment Board</div>
          <div className="page-sub">Distribute and monitor field tasks across your team.</div>
        </div>
        <div className="header-actions">
          <button className="btn-gold" onClick={() => onAssignTask()}>+ New Task</button>
        </div>
      </div>

      <div className="task-stats">
        {[
          { label: 'Unassigned', value: data.unassignedQueue.length, badge: '🕐 Pending' },
          { label: 'In Progress', value: data.employees.filter((employee) => employee.activeTask !== 'None').length, badge: '↻ Active' },
          { label: 'Completed Today', value: 7, badge: '✓ Done' },
          { label: 'Avg Completion', value: '42m', badge: '⏱ Time' },
        ].map((stat) => (
          <div key={stat.label} className="task-stat">
            <div className="ts-lbl">{stat.label}</div>
            <div className="ts-val">{stat.value}</div>
            <div style={{ position: 'absolute', top: 14, right: 14, fontSize: 11, color: '#888' }}>{stat.badge}</div>
          </div>
        ))}
      </div>

      <div className="task-grid">
        <div className="card" style={{ margin: 0 }}>
          <div className="card-header">
            <div className="card-title">Unassigned Queue</div>
            <span style={{ fontSize: 12, color: '#888' }}>{data.unassignedQueue.length} tasks pending</span>
          </div>
          {data.unassignedQueue.map((task) => (
            <div key={task.id} className="queue-item">
              <div className="queue-icon">📋</div>
              <div className="queue-info">
                <div className="queue-name">{task.title}</div>
                <div className="queue-meta">{task.client} · Created {task.created}</div>
              </div>
              <div className="queue-right">
                <div className={`priority-badge priority-${task.priority === 'High' ? 'high' : task.priority === 'Low' ? 'low' : 'std'}`}>{task.priority.toUpperCase()}</div>
                <div className="est-time">Est. {task.est}</div>
                <button className="assign-btn" onClick={() => onAssignTask(task.title, task.client)}>Assign</button>
              </div>
            </div>
          ))}
        </div>

        <div className="avail-card">
          <div className="avail-title" style={{ marginBottom: 14 }}>Available Now</div>
          {activeEmployees.slice(0, 5).map((employee) => {
            const dotCls = employee.performance >= 90 ? 'dot-green' : employee.performance >= 75 ? 'dot-orange' : 'dot-red';
            return (
              <div key={employee.id} className="avail-item">
                <div className={`avail-dot ${dotCls}`} />
                <div className="avail-info">
                  <div className="avail-name">{employee.name}</div>
                  <div className="avail-bar"><div style={{ height: '100%', width: `${employee.performance}%`, background: employee.performance >= 90 ? '#4caf50' : '#ff9800', borderRadius: 2 }} /></div>
                </div>
                <div style={{ fontSize: 12, color: '#888' }}>{employee.performance}%</div>
                <button className="assign-btn" style={{ padding: '5px 10px', fontSize: 12 }} onClick={() => onAssignTask('', '', employee.id)}>Assign</button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
