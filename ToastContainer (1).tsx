interface ToastItem {
  id: number;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  msg?: string;
  hiding?: boolean;
  duration?: number;
}

interface ToastContainerProps {
  toasts: ToastItem[];
  onRemove: (id: number) => void;
}

export default function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div id="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type}${toast.hiding ? ' hiding' : ''}`}>
          <div className="toast-icon">{toast.type === 'success' ? '✅' : toast.type === 'warning' ? '⚠️' : toast.type === 'error' ? '❌' : 'ℹ️'}</div>
          <div className="toast-body">
            <div className="toast-title">{toast.title}</div>
            {toast.msg ? <div className="toast-msg">{toast.msg}</div> : null}
          </div>
          <button type="button" className="toast-close" onClick={() => onRemove(toast.id)} aria-label="Remove toast">
            ×
          </button>
          <div className="toast-bar" style={{ animationDuration: `${toast.duration || 4000}ms` }} />
        </div>
      ))}
    </div>
  );
}
