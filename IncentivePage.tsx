import type { PortalData, ToastHandler } from '../data/initialData';

interface IncentivePageProps {
  data: PortalData;
  toast: ToastHandler;
  onApprove: (claimId: string, amt: number) => void;
  onAdjust: () => void;
}

export default function IncentivePage({ data, toast, onApprove, onAdjust }: IncentivePageProps) {
  const top5 = [...data.employees].sort((a, b) => b.performance - a.performance).slice(0, 5);
  const barData = [
    { month: 'May', height: 60, highlight: false },
    { month: 'Jun', height: 80, highlight: false },
    { month: 'Jul', height: 50, highlight: false },
    { month: 'Aug', height: 90, highlight: false },
    { month: 'Sep', height: 70, highlight: false },
    { month: 'Oct', height: 110, highlight: true },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Team Incentive Performance</div>
          <div className="page-sub">Real-time tracking of quarterly payouts and individual performance metrics.</div>
        </div>
        <div className="header-actions">
          <button className="btn-dark" onClick={() => toast('info', 'Exporting Data', 'Payouts breakdown sheet is being prepared.')}>⬇ Export Report</button>
          <button className="btn-gold" onClick={onAdjust}>+ Manual Adjust</button>
        </div>
      </div>

      <div className="incentive-stats">
        <div className="inc-stat">
          <div className="inc-lbl">Total Incentive Pool</div>
          <div className="inc-val">${data.incentivePool.toLocaleString()}.00</div>
          <div className="inc-trend">▲ 12.5% vs Last Month</div>
        </div>
        <div className="inc-stat">
          <div className="inc-lbl">Payout Readiness</div>
          <div className="inc-val">88.4%</div>
          <div style={{ height: 4, background: '#eee', borderRadius: 2, marginTop: 8 }}><div style={{ height: '100%', width: '88%', background: '#111', borderRadius: 2 }} /></div>
        </div>
        <div className="inc-stat">
          <div className="inc-lbl">Next Payout Date</div>
          <div className="inc-val">Oct 30, 2026</div>
          <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>🕐 12 Days Remaining</div>
        </div>
      </div>

      <div className="inc-grid">
        <div>
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-header"><div className="card-title">Monthly Allocation Trends</div></div>
            <div className="bar-chart-wrap">
              {barData.map((bar) => (
                <div key={bar.month} className="bar-month">
                  <div className={`bar-stack ${bar.highlight ? 'bar-highlight' : 'bar-dark'}`} style={{ height: bar.height }} />
                  <div className="bar-label">{bar.month}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="lb-table">
            <div className="card-header"><div className="card-title">Earnings Leaderboard</div></div>
            {top5.map((employee, index) => {
              const est = Math.round(employee.performance * 18);
              return (
                <div key={employee.id} className="lb-row">
                  <div className="lb-num">{index + 1}</div>
                  <div className="lb-avatar">{employee.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}</div>
                  <div className="lb-info">
                    <div className="lb-nm">{employee.name}</div>
                    <div className="lb-pct">{employee.performance}% efficiency</div>
                  </div>
                  <div className="lb-est">${est}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <div className="pool-alloc" style={{ marginBottom: 20 }}>
            <div className="pool-title">Pool Allocation</div>
            {[['Performance Bonus', 45], ['Attendance Incentive', 25], ['Client Achievement', 20], ['Retention Bonus', 10]].map(([label, pct]) => (
              <div key={label}>
                <div className="pool-item"><span className="pool-label">{label}</span><span className="pool-pct">{pct}%</span></div>
                <div className="pool-bar"><div className="pool-fill" style={{ width: `${pct}%` }} /></div>
              </div>
            ))}
          </div>

          <div className="payout-card">
            <div className="payout-header">
              <div className="payout-title">Pending Approvals</div>
              <div className="payout-badge">{data.payoutClaims.length} Claims</div>
            </div>
            {data.payoutClaims.map((claim) => (
              <div key={claim.id} className="payout-item">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <div className="payout-name">{claim.name}</div>
                  <div className="payout-amt">${claim.amt}</div>
                </div>
                <div className="payout-by">by {claim.claimant}</div>
                <div className="payout-actions">
                  <button className="approve-btn" onClick={() => onApprove(claim.id, claim.amt)}>Approve</button>
                  <button className="review-btn2" onClick={() => toast('info', 'Under Review', `Claim #${claim.id} flagged for review.`)}>Review</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
