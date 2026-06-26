export interface Employee {
  id: string;
  name: string;
  role: string;
  status: string;
  performance: number;
  activeTask: string;
  avatar: string;
  checkin: string;
  location: string;
  checkinStatus: string;
}

export interface Client {
  name: string;
  industry: string;
  status: string;
  assignedLead: string;
  progress: number;
  dueDate: string;
  logo: string;
}

export interface QueueItem {
  id: string;
  title: string;
  client: string;
  priority: string;
  est: string;
  created: string;
}

export interface PayoutClaim {
  id: string;
  name: string;
  amt: number;
  claimant: string;
}

export interface ActivityItem {
  time: string;
  text: string;
  tag: string;
  tagText: string;
}

export interface DeadlineItem {
  title: string;
  client: string;
  type: string;
  hours: string;
}

export interface PortalData {
  currentUser: {
    name: string;
    role: string;
    init: string;
    theme: string;
    division: string;
  };
  employees: Employee[];
  clients: Client[];
  unassignedQueue: QueueItem[];
  payoutClaims: PayoutClaim[];
  activities: ActivityItem[];
  incentivePool: number;
  upcomingDeadlines: DeadlineItem[];
}

export type ToastType = 'success' | 'warning' | 'error' | 'info';
export type ToastHandler = (type: ToastType, title: string, msg?: string, duration?: number) => void;

export const INITIAL_DB: PortalData = {
  currentUser: {
    name: 'Alex Thompson',
    role: 'Team Lead',
    init: 'AT',
    theme: 'default',
    division: 'Central Division',
  },
  employees: [
    { id: 'EMP-2024-001', name: 'Aditi Sharma', role: 'Senior Field Agent', status: 'On Duty', performance: 94, activeTask: 'Client Site A - Audit', avatar: 'https://i.pravatar.cc/36?img=47', checkin: '08:45 AM', location: 'Cyber City, Hub 4', checkinStatus: 'On Time' },
    { id: 'EMP-2024-042', name: 'Rohan Varma', role: 'Logistics Lead', status: 'In Transit', performance: 82, activeTask: 'Warehouse Shift 2', avatar: 'https://i.pravatar.cc/36?img=12', checkin: '09:12 AM', location: 'Sector 62', checkinStatus: 'Late (12m)' },
    { id: 'EMP-2023-115', name: 'Priya Singh', role: 'Compliance Officer', status: 'Off Duty', performance: 98, activeTask: 'None', avatar: 'https://i.pravatar.cc/36?img=32', checkin: '--:--', location: 'Residential Address', checkinStatus: '' },
    { id: 'EMP-2024-088', name: 'Vikram Malhotra', role: 'Operations Jr.', status: 'Urgent Task', performance: 76, activeTask: 'Incident Report #992', avatar: 'https://i.pravatar.cc/36?img=15', checkin: '08:55 AM', location: 'DLF Phase 2', checkinStatus: 'On Time' },
    { id: 'EMP-2024-099', name: 'John Doe', role: 'Field Agent · Level 2', status: 'Off Duty', performance: 85, activeTask: 'None', avatar: 'https://i.pravatar.cc/36?img=33', checkin: '--:--', location: 'Residential Address', checkinStatus: '' },
    { id: 'EMP-2024-102', name: 'Sarah Miller', role: 'Lead Consultant', status: 'On Duty', performance: 98, activeTask: 'None', avatar: 'https://i.pravatar.cc/36?img=48', checkin: '08:30 AM', location: 'Cyber City, Hub 4', checkinStatus: 'On Time' },
    { id: 'EMP-2024-114', name: 'Robert Wilson', role: 'Analyst · Junior', status: 'Off Duty', performance: 72, activeTask: 'None', avatar: 'https://i.pravatar.cc/36?img=11', checkin: '--:--', location: 'Residential Address', checkinStatus: '' },
    { id: 'EMP-2024-125', name: 'Anita Kumar', role: 'System Admin', status: 'On Duty', performance: 91, activeTask: 'None', avatar: 'https://i.pravatar.cc/36?img=22', checkin: '08:40 AM', location: 'Sector 62', checkinStatus: 'On Time' },
  ],
  clients: [
    { name: 'Reliance Industries Ltd.', industry: 'Digital Transformation', status: 'ACTIVE', assignedLead: 'Sanya Malhotra', progress: 75, dueDate: 'Oct 24, 2026', logo: 'RI' },
    { name: 'Tata Consultancy Services', industry: 'Cloud Migration', status: 'ON HOLD', assignedLead: 'Amitabh S.', progress: 32, dueDate: 'Nov 12, 2026', logo: 'TC' },
    { name: 'HDFC Bank Corp', industry: 'Security Audit', status: 'PLANNING', assignedLead: 'Vikram Roy', progress: 10, dueDate: 'Dec 05, 2026', logo: 'HDFC' },
    { name: 'Adani Group', industry: 'Infrastructure Monitoring', status: 'CRITICAL', assignedLead: 'Rohan Gupta', progress: 92, dueDate: 'Oct 18, 2026', logo: 'AD' },
  ],
  unassignedQueue: [
    { id: 'UQ-1', title: 'Client Audit & Risk Assessment', client: 'Reliance Industries Ltd.', priority: 'High', est: '8 Hours', created: '2h ago' },
    { id: 'UQ-2', title: 'Quarterly Tax Compliance Filing', client: 'TATA Group', priority: 'Standard', est: '4 Hours', created: '4h ago' },
    { id: 'UQ-3', title: 'Document Verification – New Onboarding', client: 'Adani Enterprises', priority: 'Low', est: '2 Hours', created: '6h ago' },
  ],
  payoutClaims: [
    { id: '8821', name: 'Direct Sales Commission', amt: 450, claimant: 'Emily Watson' },
    { id: '8845', name: 'Upsell Multiplier', amt: 1200, claimant: 'Jordan Lee' },
    { id: '8790', name: 'Annual Retention', amt: 3500, claimant: 'Sarah Jenkins' },
  ],
  activities: [
    { time: '14:15 PM', text: 'Sarah Miller completed task "Client Audit - Reliance Ind."', tag: 'pending', tagText: '✦ Review pending' },
    { time: '13:58 PM', text: 'System flagged Robert Wilson for idle time exceeding 30m.', tag: 'alert', tagText: '⊙ Alert sent' },
    { time: '13:30 PM', text: 'Alex Thompson assigned 4 tasks to Night Shift A.', tag: 'processing', tagText: '↻ Processing...' },
    { time: '13:10 PM', text: 'Incentive Pool updated for Q4 2023.', tag: 'policy', tagText: '⊙ Policy viewable' },
  ],
  incentivePool: 14250,
  upcomingDeadlines: [
    { title: 'Security Patch V2', client: 'HDFC Bank Corp', type: 'critical', hours: '4 hours' },
    { title: 'UI Feedback Loop', client: 'Reliance Industries', type: 'urgent', hours: 'tomorrow' },
    { title: 'Quarterly Report', client: 'Tata Consultancy', type: 'routine', hours: '3 days' },
  ],
};

export const PAGE_USER_MAP: Record<string, { name: string; role: string; init: string }> = {
  dashboard: { name: 'Alex Thompson', role: 'Team Lead', init: 'AT' },
  employee: { name: 'Arjun Sharma', role: 'Team Lead', init: 'AS' },
  client: { name: 'Alex Rivera', role: 'Team Lead', init: 'AR' },
  tasks: { name: 'Aditi Sharma', role: 'Team Lead', init: 'AS' },
  tracking: { name: 'Alex Thompson', role: 'Team Lead', init: 'AT' },
  analytics: { name: 'Alexander Pierce', role: 'Lead Operations', init: 'AP' },
  incentive: { name: 'Alex Rivera', role: 'Team Lead', init: 'AR' },
};

export const PAGE_SEARCH_PLACEHOLDER: Record<string, string> = {
  dashboard: 'Search tasks, employees, or metrics...',
  employee: 'Search team members...',
  client: 'Search clients, projects, or tasks...',
  tasks: 'Search tasks, employees, or clients...',
  tracking: 'Search employees by name or ID...',
  analytics: 'Search analytics, employees, or tasks...',
  incentive: 'Search incentives, claims, or team members...',
};

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'employee', label: 'Employee' },
  { id: 'client', label: 'Client' },
  { id: 'tasks', label: 'Task Assigning' },
  { id: 'tracking', label: 'Employee Tracking' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'incentive', label: 'Incentive' },
];
