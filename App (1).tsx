import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BrowserRouter, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { INITIAL_DB, PAGE_USER_MAP, type PortalData, type ToastHandler, type ToastType } from '../data/initialData';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import Modal from './Modal';
import ToastContainer from './ToastContainer';
import DashboardPage from '../pages/DashboardPage';
import EmployeePage from '../pages/EmployeePage';
import ClientPage from '../pages/ClientPage';
import TaskPage from '../pages/TaskPage';
import TrackingPage from '../pages/TrackingPage';
import AnalyticsPage from '../pages/AnalyticsPage';
import IncentivePage from '../pages/IncentivePage';
import LoginPage from './LoginPage';

function AppShell({ data, setData, onLogout }: { data: PortalData; setData: React.Dispatch<React.SetStateAction<PortalData>>; onLogout: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPage = location.pathname.replace('/', '') || 'dashboard';
  const [toasts, setToasts] = useState<Array<{ id: number; type: ToastType; title: string; msg?: string; hiding?: boolean; duration?: number }>>([]);
  const [assignModal, setAssignModal] = useState({ open: false, title: '', client: '', empId: '' });
  const [empModal, setEmpModal] = useState(false);
  const [clientModal, setClientModal] = useState(false);
  const [settingsModal, setSettingsModal] = useState(false);
  const [helpModal, setHelpModal] = useState(false);
  const [empDetailModal, setEmpDetailModal] = useState({ open: false, empId: '' });
  const toastId = useRef(0);

  useEffect(() => {
    document.body.className = data.currentUser.theme && data.currentUser.theme !== 'default' ? `theme-${data.currentUser.theme}` : '';
  }, [data.currentUser.theme]);

  const toast = useCallback<ToastHandler>((type, title, msg, duration = 4000) => {
    const id = ++toastId.current;
    setToasts((prev) => [...prev, { id, type, title, msg, duration }]);
    setTimeout(() => {
      setToasts((prev) => prev.map((item) => (item.id === id ? { ...item, hiding: true } : item)));
      setTimeout(() => setToasts((prev) => prev.filter((item) => item.id !== id)), 350);
    }, duration);
  }, []);

  const persistData = useCallback((newData: PortalData) => {
    setData(newData);
    try {
      localStorage.setItem('TL_PORTAL_DB_REACT', JSON.stringify(newData));
    } catch {}
  }, [setData]);

  const pageUser = useMemo(() => PAGE_USER_MAP[currentPage] || data.currentUser, [currentPage, data.currentUser]);

  const openAssignTask = (title = '', client = '', empId = '') => {
    setAssignModal({ open: true, title, client, empId });
  };

  const handleAssign = ({ title, empId }: { title: string; client: string; empId: string; priority: string }) => {
    if (!title || !empId) {
      toast('warning', 'Missing Fields', 'Please fill in task title and assignee.');
      return;
    }
    const employee = data.employees.find((item) => item.id === empId);
    const newData = { ...data, employees: data.employees.map((item) => item.id === empId ? { ...item, activeTask: title } : item) };
    persistData(newData);
    toast('success', 'Task Assigned', `"${title}" assigned to ${employee?.name || empId}.`);
  };

  const handleAddEmployee = ({ name, role, status }: { name: string; role: string; status: string }) => {
    if (!name || !role) {
      toast('error', 'Missing Fields', 'Name and role are required.');
      return;
    }
    const id = `EMP-${Date.now()}`;
    const newEmployee = { id, name, role, status, performance: 80, activeTask: 'None', avatar: '', checkin: '--:--', location: 'TBD', checkinStatus: '' };
    persistData({ ...data, employees: [...data.employees, newEmployee] });
    toast('success', 'Employee Onboarded', `${name} has been added to your team.`);
  };

  const handleAddClient = (clientData: { name: string; industry: string; assignedLead: string; status: string; progress: number; dueDate: string; logo: string }) => {
    if (!clientData.name) {
      toast('error', 'Missing Fields', 'Client name is required.');
      return;
    }
    persistData({ ...data, clients: [...data.clients, clientData] });
    toast('success', 'Client Registered', `${clientData.name} has been registered.`);
  };

  const handleSaveSettings = ({ name, role, division, theme }: { name: string; role: string; division: string; theme: string }) => {
    if (!name || !role) {
      toast('error', 'Missing Fields', 'Name and role are required.');
      return;
    }
    const initials = name.split(' ').map((word) => word[0]).join('').slice(0, 2).toUpperCase();
    persistData({ ...data, currentUser: { ...data.currentUser, name, role, division, theme, init: initials } });
    toast('success', 'Settings Saved', 'Your portal settings have been updated.');
    setSettingsModal(false);
  };

  const handleReset = () => {
    if (window.confirm('Reset all data to defaults?')) {
      persistData(INITIAL_DB);
      toast('info', 'Reset Complete', 'Database restored to defaults.');
    }
  };

  const handleApprove = (claimId: string, amt: number) => {
    const newData = {
      ...data,
      payoutClaims: data.payoutClaims.filter((claim) => claim.id !== claimId),
      incentivePool: data.incentivePool + amt,
    };
    persistData(newData);
    toast('success', 'Claim Approved', `$${amt} added back to incentive pool.`);
  };

  const handleAdjust = () => {
    const val = window.prompt('Enter adjustment amount (+ to add, - to subtract):', '500');
    if (val === null) return;
    const num = parseFloat(val);
    if (Number.isNaN(num)) {
      toast('error', 'Invalid', 'Please enter a valid number.');
      return;
    }
    persistData({ ...data, incentivePool: Math.max(0, data.incentivePool + num) });
    toast('success', 'Pool Adjusted', `Incentive pool ${num >= 0 ? 'increased' : 'decreased'} by $${Math.abs(num)}.`);
  };

  const selectedEmployee = data.employees.find((employee) => employee.id === empDetailModal.empId) || null;

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage data={data} onNavigate={(page) => navigate(`/${page}`)} onAssignTask={openAssignTask} toast={toast} />;
      case 'employee':
        return <EmployeePage data={data} onShowEmployee={(employeeId) => setEmpDetailModal({ open: true, empId: employeeId })} onAssignTask={openAssignTask} onAddEmployee={() => setEmpModal(true)} toast={toast} />;
      case 'client':
        return <ClientPage data={data} onAddClient={() => setClientModal(true)} toast={toast} />;
      case 'tasks':
        return <TaskPage data={data} onAssignTask={openAssignTask} toast={toast} />;
      case 'tracking':
        return <TrackingPage data={data} toast={toast} />;
      case 'analytics':
        return <AnalyticsPage data={data} toast={toast} />;
      case 'incentive':
        return <IncentivePage data={data} toast={toast} onApprove={handleApprove} onAdjust={handleAdjust} />;
      default:
        return <Navigate to="/dashboard" replace />;
    }
  };

  return (
    <div className="app-shell">
      <Sidebar activePage={currentPage} onPageChange={(page) => navigate(`/${page}`)} onSettingsClick={() => setSettingsModal(true)} onLogout={onLogout} />
      <div className="main">
        <Topbar page={currentPage} user={pageUser} onHelp={() => setHelpModal(true)} onSettings={() => setSettingsModal(true)} />
        <div className="content">{renderPage()}</div>
      </div>

      <ToastContainer toasts={toasts} onRemove={(id) => setToasts((prev) => prev.filter((toastItem) => toastItem.id !== id))} />

      <Modal open={assignModal.open} title="Assign New Task" onClose={() => setAssignModal((prev) => ({ ...prev, open: false }))}>
        <div className="modal-field">
          <label className="modal-label">Task Title</label>
          <input className="modal-input" defaultValue={assignModal.title} />
        </div>
        <div className="modal-field">
          <label className="modal-label">Client / Project</label>
          <input className="modal-input" defaultValue={assignModal.client} />
        </div>
        <div className="modal-field">
          <label className="modal-label">Assign To</label>
          <select className="modal-select" defaultValue={assignModal.empId}>
            <option value="">— Select Employee —</option>
            {data.employees.filter((employee) => employee.status !== 'Off Duty').map((employee) => (
              <option key={employee.id} value={employee.id}>{employee.name} ({employee.role})</option>
            ))}
          </select>
        </div>
        <div className="modal-field">
          <label className="modal-label">Priority</label>
          <select className="modal-select" defaultValue="Standard">
            <option>High</option>
            <option>Standard</option>
            <option>Low</option>
          </select>
        </div>
        <div className="modal-actions">
          <button className="btn-outline" onClick={() => setAssignModal((prev) => ({ ...prev, open: false }))}>Cancel</button>
          <button className="btn-gold" onClick={() => {
            const taskTitle = (document.querySelectorAll('.modal-input')[0] as HTMLInputElement | undefined)?.value || '';
            const taskClient = (document.querySelectorAll('.modal-input')[1] as HTMLInputElement | undefined)?.value || '';
            const empId = (document.querySelectorAll('.modal-select')[0] as HTMLSelectElement | undefined)?.value || '';
            const priority = (document.querySelectorAll('.modal-select')[1] as HTMLSelectElement | undefined)?.value || 'Standard';
            handleAssign({ title: taskTitle, client: taskClient, empId, priority });
            setAssignModal((prev) => ({ ...prev, open: false }));
          }}>Assign Task</button>
        </div>
      </Modal>

      <Modal open={empModal} title="Onboard New Employee" onClose={() => setEmpModal(false)}>
        <div className="modal-field">
          <label className="modal-label">Full Name</label>
          <input className="modal-input" id="emp-name" />
        </div>
        <div className="modal-field">
          <label className="modal-label">Role / Designation</label>
          <input className="modal-input" id="emp-role" />
        </div>
        <div className="modal-field">
          <label className="modal-label">Initial Status</label>
          <select className="modal-select" id="emp-status" defaultValue="On Duty">
            <option>On Duty</option>
            <option>Off Duty</option>
          </select>
        </div>
        <div className="modal-actions">
          <button className="btn-outline" onClick={() => setEmpModal(false)}>Cancel</button>
          <button className="btn-gold" onClick={() => {
            const name = (document.getElementById('emp-name') as HTMLInputElement | null)?.value || '';
            const role = (document.getElementById('emp-role') as HTMLInputElement | null)?.value || '';
            const status = (document.getElementById('emp-status') as HTMLSelectElement | null)?.value || 'On Duty';
            handleAddEmployee({ name, role, status });
            setEmpModal(false);
          }}>Onboard Employee</button>
        </div>
      </Modal>

      <Modal open={clientModal} title="Register New Client" onClose={() => setClientModal(false)}>
        <div className="modal-field"><label className="modal-label">Client Name</label><input className="modal-input" id="client-name" /></div>
        <div className="modal-field"><label className="modal-label">Industry / Project Type</label><input className="modal-input" id="client-industry" /></div>
        <div className="modal-field"><label className="modal-label">Assigned Lead</label><input className="modal-input" id="client-lead" /></div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div className="modal-field" style={{ flex: 1 }}><label className="modal-label">Status</label><select className="modal-select" id="client-status" defaultValue="ACTIVE"><option>ACTIVE</option><option>ON HOLD</option><option>PLANNING</option><option>CRITICAL</option></select></div>
          <div className="modal-field" style={{ flex: 1 }}><label className="modal-label">Progress %</label><input type="number" className="modal-input" id="client-progress" defaultValue="0" /></div>
        </div>
        <div className="modal-field"><label className="modal-label">Filing Due Date</label><input className="modal-input" id="client-due" /></div>
        <div className="modal-actions">
          <button className="btn-outline" onClick={() => setClientModal(false)}>Cancel</button>
          <button className="btn-gold" onClick={() => {
            const name = (document.getElementById('client-name') as HTMLInputElement | null)?.value || '';
            const industry = (document.getElementById('client-industry') as HTMLInputElement | null)?.value || '';
            const assignedLead = (document.getElementById('client-lead') as HTMLInputElement | null)?.value || '';
            const status = (document.getElementById('client-status') as HTMLSelectElement | null)?.value || 'ACTIVE';
            const progress = Number((document.getElementById('client-progress') as HTMLInputElement | null)?.value || 0);
            const dueDate = (document.getElementById('client-due') as HTMLInputElement | null)?.value || '';
            handleAddClient({ name, industry, assignedLead, status, progress, dueDate, logo: name.slice(0, 2).toUpperCase() });
            setClientModal(false);
          }}>Register Client</button>
        </div>
      </Modal>

      <Modal open={settingsModal} title="Portal Settings" onClose={() => setSettingsModal(false)}>
        <div className="modal-field"><label className="modal-label">User Profile Name</label><input className="modal-input" defaultValue={data.currentUser.name} id="settings-name" /></div>
        <div className="modal-field"><label className="modal-label">Role</label><input className="modal-input" defaultValue={data.currentUser.role} id="settings-role" /></div>
        <div className="modal-field"><label className="modal-label">Division / Branch</label><input className="modal-input" defaultValue={data.currentUser.division} id="settings-division" /></div>
        <div className="modal-field"><label className="modal-label">Portal Theme</label><select className="modal-select" defaultValue={data.currentUser.theme} id="settings-theme"><option value="default">Default Modern</option><option value="classic">Classic Dark Gold</option><option value="corporate">Corporate Blue</option></select></div>
        <div className="modal-actions" style={{ justifyContent: 'space-between' }}>
          <button className="btn-outline" style={{ borderColor: '#ef4444', color: '#ef4444' }} onClick={handleReset}>Reset Database</button>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn-outline" onClick={() => setSettingsModal(false)}>Cancel</button>
            <button className="btn-gold" onClick={() => {
              const name = (document.getElementById('settings-name') as HTMLInputElement | null)?.value || '';
              const role = (document.getElementById('settings-role') as HTMLInputElement | null)?.value || '';
              const division = (document.getElementById('settings-division') as HTMLInputElement | null)?.value || '';
              const theme = (document.getElementById('settings-theme') as HTMLSelectElement | null)?.value || 'default';
              handleSaveSettings({ name, role, division, theme });
            }}>Save Settings</button>
          </div>
        </div>
      </Modal>

      <Modal open={helpModal} title="Help & Documentation Center" onClose={() => setHelpModal(false)} width="550px">
        <div style={{ maxHeight: 350, overflowY: 'auto', fontSize: 13.5, color: '#444', lineHeight: 1.6 }}>
          <h4 style={{ marginBottom: 6, color: '#111' }}>💡 Quick Start Guide</h4>
          <p style={{ marginBottom: 12 }}>This portal is designed for Team Leads to manage task distribution, compliance timelines, field executive locations, and payouts in real-time.</p>
        </div>
        <div className="modal-actions">
          <button className="btn-gold" onClick={() => setHelpModal(false)}>Close Help Center</button>
        </div>
      </Modal>

      <Modal open={empDetailModal.open} title="Employee Profile" onClose={() => setEmpDetailModal({ open: false, empId: '' })} width="520px">
        {selectedEmployee ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, paddingBottom: 16, borderBottom: '1px solid #eee', marginBottom: 16 }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#f0a500', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700 }}>{selectedEmployee.name.split(' ').map((word) => word[0]).join('').slice(0, 2).toUpperCase()}</div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#111' }}>{selectedEmployee.name}</div>
                <div style={{ fontSize: 13, color: '#666', marginTop: 2 }}>{selectedEmployee.role}</div>
                <div style={{ fontSize: 11, color: '#999', marginTop: 1 }}>ID: {selectedEmployee.id}</div>
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn-outline" onClick={() => setEmpDetailModal({ open: false, empId: '' })}>Close Profile</button>
              <button className="btn-gold" onClick={() => { setEmpDetailModal({ open: false, empId: '' }); openAssignTask('', '', selectedEmployee.id); }}>Assign New Task</button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [data, setData] = useState<PortalData>(() => {
    try {
      const saved = localStorage.getItem('TL_PORTAL_DB_REACT');
      return saved ? { ...INITIAL_DB, ...JSON.parse(saved) } : INITIAL_DB;
    } catch {
      return INITIAL_DB;
    }
  });

  const handleLogin = () => {
    setLoggedIn(true);
  };

  return (
    <BrowserRouter>
      {!loggedIn ? (
        <LoginPage onLoginSuccess={handleLogin} />
      ) : (
        <AppShell data={data} setData={setData} onLogout={() => setLoggedIn(false)} />
      )}
    </BrowserRouter>
  );
}
