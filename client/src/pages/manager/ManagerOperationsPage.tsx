import React, { useState, useEffect } from 'react';

interface ManagerOperationsPageProps {
  activeTab: string;
}

interface StaffWageAccount {
  id: string;
  code: string;
  fullName: string;
  role: string;
  branch: string;
  phone: string;
  email: string;
  hourlyRate: number;
  totalHoursWorked: number;
  bonus: number;
  deductions: number;
  status: string;
}

interface ShiftInoutRecord {
  date: string;
  clockIn: string;
  clockOut: string;
  hoursWorked: number;
  dailyWage: number;
}

interface IncidentRecord {
  id: string;
  customer: string;
  issue: string;
  resolution: string;
  handledBy: string;
}

interface PaidInvoiceRecord {
  id: string;
  table: string;
  items: { product: { name: string; price: number }; quantity: number }[];
  totalAmount: number;
  paymentMethod: string;
  timestamp: string;
}

export const ManagerOperationsPage: React.FC<ManagerOperationsPageProps> = ({ activeTab }) => {
  const managerBranch = 'Chi Nhánh Quận 1';

  // DYNAMICALLY READ PAID INVOICES FOR TODAY'S SALES RECONCILIATION
  const [paidInvoices, setPaidInvoices] = useState<PaidInvoiceRecord[]>([]);

  const syncPaidInvoices = () => {
    const saved = localStorage.getItem('fnb_paid_invoices');
    setPaidInvoices(saved ? JSON.parse(saved) : []);
  };

  useEffect(() => {
    syncPaidInvoices();
    window.addEventListener('fnb_data_updated', syncPaidInvoices);
    const interval = setInterval(syncPaidInvoices, 1500);
    return () => {
      window.removeEventListener('fnb_data_updated', syncPaidInvoices);
      clearInterval(interval);
    };
  }, [activeTab]);

  // 1. SUBORDINATE STAFF ACCOUNTS
  const [subordinateStaff, setSubordinateStaff] = useState<StaffWageAccount[]>([
    { id: 'STAFF-1', code: 'EMP001', fullName: 'Trần Thanh Tâm', role: 'Staff (Phục vụ)', branch: 'Chi Nhánh Quận 1', phone: '0934567890', email: 'staff1@fnb.com', hourlyRate: 35000, totalHoursWorked: 180, bonus: 500000, deductions: 100000, status: 'Active' },
    { id: 'STAFF-2', code: 'EMP002', fullName: 'Nguyễn Thị Mai', role: 'Cashier (Thu ngân)', branch: 'Chi Nhánh Quận 1', phone: '0923456789', email: 'cashier1@fnb.com', hourlyRate: 40000, totalHoursWorked: 190, bonus: 800000, deductions: 200000, status: 'Active' },
    { id: 'STAFF-3', code: 'EMP003', fullName: 'Phạm Quốc Bảo', role: 'Warehouse (Thủ kho)', branch: 'Chi Nhánh Quận 1', phone: '0912345678', email: 'warehouse1@fnb.com', hourlyRate: 45000, totalHoursWorked: 176, bonus: 600000, deductions: 150000, status: 'Active' },
    { id: 'STAFF-4', code: 'EMP004', fullName: 'Vũ Minh Hoàng', role: 'Kitchen (Pha chế Bar)', branch: 'Chi Nhánh Quận 1', phone: '0945678901', email: 'kitchen1@fnb.com', hourlyRate: 42000, totalHoursWorked: 185, bonus: 700000, deductions: 120000, status: 'Active' },
  ]);

  // 2. DAILY SHIFT LOGS
  const [staffShifts, setStaffShifts] = useState<{ [staffCode: string]: ShiftInoutRecord[] }>({
    'EMP001': [
      { date: '2026-08-25', clockIn: '08:00 AM', clockOut: '18:00 PM', hoursWorked: 10, dailyWage: 350000 },
      { date: '2026-08-26', clockIn: '08:00 AM', clockOut: '18:00 PM', hoursWorked: 10, dailyWage: 350000 },
      { date: '2026-08-27', clockIn: '08:00 AM', clockOut: '18:00 PM', hoursWorked: 10, dailyWage: 350000 },
    ],
    'EMP002': [
      { date: '2026-08-25', clockIn: '08:00 AM', clockOut: '18:00 PM', hoursWorked: 10, dailyWage: 400000 },
    ]
  });

  const [editStaffModal, setEditStaffModal] = useState<StaffWageAccount | null>(null);
  const [selectedStaffShifts, setSelectedStaffShifts] = useState<{ staff: StaffWageAccount; shifts: ShiftInoutRecord[] } | null>(null);

  // CLOCK IN/OUT TEST SIMULATION
  const [clockStaffId, setClockStaffId] = useState<string>('EMP001');
  const [clockInTime, setClockInTime] = useState<string>('08:00 AM');
  const [clockOutTime, setClockOutTime] = useState<string>('18:00 PM');

  // APPROVALS STATE
  const [pinCode, setPinCode] = useState<string>('');
  const [pendingApprovals, setPendingApprovals] = useState([
    { id: 'AUTH-901', cashier: 'Nguyễn Thị Mai (Cashier 1)', type: 'HUỶ MÓN (VOID)', detail: 'Huỷ 2x Trà Đào (Khách đổi món)', amount: '90.000đ', time: '1 phút trước' },
    { id: 'AUTH-902', cashier: 'Nguyễn Thị Mai (Cashier 1)', type: 'DISCOUNT 20%', detail: 'Chiết khấu đối tác VIP công ty', amount: '150.000đ', time: '5 phút trước' },
  ]);

  // TELEMETRY MONITOR STATE
  const [cashInDrawer, setCashInDrawer] = useState<number>(12450000);
  const [showWithdrawCashModal, setShowWithdrawCashModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(5000000);
  const [laborCostPercent, setLaborCostPercent] = useState<number>(18.5);

  // EOD CHECKLIST STATE
  const [eodChecked, setEodChecked] = useState<{ [key: string]: boolean }>({
    cashReconciled: true,
    stockLocked: true,
    equipmentOff: false,
    kdsCleared: true,
  });

  // INCIDENTS STATE
  const [incidents, setIncidents] = useState<IncidentRecord[]>([
    { id: 'INC-101', customer: 'Anh Hoàng (Bàn 03)', issue: 'Phản ánh trà hơi ngọt', resolution: 'Đã đổi ly mới 50% đường & tặng voucher 20k', handledBy: 'Lê Hoàng Phúc (Manager)' },
  ]);

  const [showAddIncidentModal, setShowAddIncidentModal] = useState(false);
  const [newIncident, setNewIncident] = useState({ customer: '', issue: '', resolution: '', handledBy: 'Lê Hoàng Phúc (Manager)' });

  // Handlers
  const handleUpdateStaffHourlyRate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editStaffModal) return;
    setSubordinateStaff(subordinateStaff.map(s => s.id === editStaffModal.id ? editStaffModal : s));
    setEditStaffModal(null);
    alert(`Đã cập nhật mức lương ${editStaffModal.hourlyRate.toLocaleString('vi-VN')}đ/h cho nhân sự "${editStaffModal.fullName}" thuộc ${managerBranch}!`);
  };

  const handleSimulateClockInOut = (e: React.FormEvent) => {
    e.preventDefault();
    const staff = subordinateStaff.find(s => s.code === clockStaffId);
    if (!staff) return;

    const newShiftRecord: ShiftInoutRecord = {
      date: new Date().toISOString().split('T')[0],
      clockIn: clockInTime,
      clockOut: clockOutTime,
      hoursWorked: 10,
      dailyWage: 10 * staff.hourlyRate
    };

    setStaffShifts({
      ...staffShifts,
      [clockStaffId]: [newShiftRecord, ...(staffShifts[clockStaffId] || [])]
    });

    setSubordinateStaff(subordinateStaff.map(s => s.code === clockStaffId ? { ...s, totalHoursWorked: s.totalHoursWorked + 10 } : s));
    alert(`Đã ghi nhận ca chấm công IN (${clockInTime}) - OUT (${clockOutTime}) cho nhân viên ${staff.fullName}. Tính cộng +10 giờ công!`);
  };

  const handleApprovePin = (id: string) => {
    if (pinCode !== '9921') {
      alert('Mã PIN xác thực Quản lý không đúng! Vui lòng nhập PIN: 9921');
      return;
    }
    setPendingApprovals(pendingApprovals.filter(p => p.id !== id));
    setPinCode('');
    alert(`Phê duyệt mã PIN thành công cho yêu cầu ${id}!`);
  };

  const handleWithdrawCash = () => {
    if (withdrawAmount <= 0 || withdrawAmount > cashInDrawer) {
      alert('Số tiền rút không hợp lệ!');
      return;
    }
    setCashInDrawer(cashInDrawer - withdrawAmount);
    setShowWithdrawCashModal(false);
    alert(`Đã rút ${withdrawAmount.toLocaleString('vi-VN')}đ tiền mặt từ két thu ngân sang két an toàn Manager!`);
  };

  const handleAddIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIncident.customer || !newIncident.issue) return;
    const inc: IncidentRecord = {
      id: `INC-10${incidents.length + 1}`,
      ...newIncident
    };
    setIncidents([...incidents, inc]);
    setShowAddIncidentModal(false);
    alert(`Đã lưu nhật ký sự cố khiếu nại của khách hàng "${newIncident.customer}"!`);
    setNewIncident({ customer: '', issue: '', resolution: '', handledBy: 'Lê Hoàng Phúc (Manager)' });
  };

  const handleCompleteEodClosure = () => {
    const allDone = Object.values(eodChecked).every(v => v);
    if (!allDone) {
      alert('CẢNH BÁO: Vui lòng hoàn tất và tích chọn đủ 4 bước kiểm tra trước khi chốt đóng cửa!');
      return;
    }
    alert('THÀNH CÔNG: Đã hoàn tất 100% Checklist đóng cửa chi nhánh cuối ngày. Báo cáo EOD đã được gửi lên hệ thống trung tâm!');
  };

  const todayTotalSales = paidInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);

  return (
    <div style={{ width: '100%', maxWidth: '100%', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* 1. VIEW 1: PAYROLL AUDIT & IN/OUT CLOCKING */}
      {activeTab === 'manager-payroll' && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '20px', margin: 0, color: '#0F172A', fontWeight: 'bold' }}>Kiểm Kê Lương & Nhật Ký Giờ Công IN/OUT Nhân Sự - {managerBranch}</h2>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#475569' }}>Quản lý: Lê Hoàng Phúc | Scope: Quyền thiết lập lương & xem giờ công nhân sự thuộc {managerBranch}.</p>
            </div>
            <div style={{ background: '#DCFCE7', color: '#166534', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold', border: '1px solid #A7F3D0' }}>
              Scope Chi Nhánh: {managerBranch} (Đã Cô Lập Quyền)
            </div>
          </div>

          <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '15px', color: '#0F172A', fontWeight: 'bold' }}>Thao Tác Chấm Công Theo Giờ Hành Chính (Check-IN / Check-OUT):</h3>
            <form onSubmit={handleSimulateClockInOut} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#0F172A', marginBottom: '4px' }}>Chọn Nhân Viên:</label>
                <select value={clockStaffId} onChange={(e) => setClockStaffId(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '6px', color: '#0F172A' }}>
                  {subordinateStaff.map(s => <option key={s.code} value={s.code}>{s.fullName} ({s.role})</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#0F172A', marginBottom: '4px' }}>Giờ Vào (IN):</label>
                <input type="text" value={clockInTime} onChange={(e) => setClockInTime(e.target.value)} placeholder="08:00 AM" style={{ padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '6px', color: '#0F172A', width: '110px' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#0F172A', marginBottom: '4px' }}>Giờ Ra (OUT):</label>
                <input type="text" value={clockOutTime} onChange={(e) => setClockOutTime(e.target.value)} placeholder="18:00 PM" style={{ padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '6px', color: '#0F172A', width: '110px' }} />
              </div>
              <button type="submit" style={{ padding: '9px 18px', background: '#059669', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>XÁC NHẬN CHẤM CÔNG IN/OUT</button>
            </form>
          </div>

          <div style={{ width: '100%', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0', textAlign: 'left' }}>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Mã NV</th>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Họ Và Tên</th>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Chức Danh</th>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Mức Lương / Giờ</th>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Tổng Giờ IN/OUT</th>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Lương Cơ Bản</th>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Thực Lĩnh Net</th>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Chỉnh Sửa Lương</th>
                </tr>
              </thead>
              <tbody>
                {subordinateStaff.map((staff) => {
                  const baseSalary = staff.totalHoursWorked * staff.hourlyRate;
                  const netSalary = baseSalary + staff.bonus - staff.deductions;

                  return (
                    <tr key={staff.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#0F172A' }}>{staff.code}</td>
                      <td style={{ padding: '14px 12px', color: '#0F172A', fontWeight: 'bold' }}>{staff.fullName}</td>
                      <td style={{ padding: '14px 12px' }}><span style={{ background: '#DBEAFE', color: '#1E40AF', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>{staff.role}</span></td>
                      <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#059669', fontSize: '15px' }}>{staff.hourlyRate.toLocaleString('vi-VN')}đ / h</td>
                      <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#2563EB' }}>{staff.totalHoursWorked} giờ</td>
                      <td style={{ padding: '14px 12px', color: '#0F172A' }}>{baseSalary.toLocaleString('vi-VN')}đ</td>
                      <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#059669', fontSize: '15px' }}>{netSalary.toLocaleString('vi-VN')}đ</td>
                      <td style={{ padding: '14px 12px' }}>
                        <button onClick={() => setEditStaffModal(staff)} style={{ padding: '6px 12px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>Chỉnh Sửa Lương</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. VIEW 2: PIN APPROVALS */}
      {activeTab === 'manager-approvals' && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ fontSize: '20px', marginTop: 0, color: '#0F172A', fontWeight: 'bold' }}>Hộp Thư Phê Duyệt Mã PIN Quản Lý ({managerBranch})</h2>
          <div style={{ width: '100%', overflowX: 'auto', marginTop: '16px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0', textAlign: 'left' }}>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Mã Yêu Cầu</th>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Thu Ngân Trình Duyệt</th>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Loại Phê Duyệt</th>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Chi Tiết Lý Do</th>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Số Tiền</th>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Thao Tác PIN</th>
                </tr>
              </thead>
              <tbody>
                {pendingApprovals.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#0F172A' }}>{p.id}</td>
                    <td style={{ padding: '14px 12px', color: '#0F172A' }}>{p.cashier}</td>
                    <td style={{ padding: '14px 12px' }}><span style={{ background: '#FEF3C7', color: '#92400E', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>{p.type}</span></td>
                    <td style={{ padding: '14px 12px', color: '#475569' }}>{p.detail}</td>
                    <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#DC2626' }}>{p.amount}</td>
                    <td style={{ padding: '14px 12px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input type="password" value={pinCode} onChange={(e) => setPinCode(e.target.value)} placeholder="Nhập PIN (9921)" style={{ padding: '6px 8px', border: '1px solid #CBD5E1', borderRadius: '4px', width: '110px' }} />
                        <button onClick={() => handleApprovePin(p.id)} style={{ padding: '6px 12px', background: '#059669', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Duyệt PIN</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. VIEW 3: TELEMETRY & TODAY'S SALES RECONCILIATION AUDIT */}
      {activeTab === 'manager-telemetry' && (
        <div>
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '24px', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '20px', marginTop: 0, color: '#0F172A', fontWeight: 'bold' }}>Nhật Ký Kiểm Kê Doanh Thu & Đơn Hàng Hôm Nay - {managerBranch}</h2>
            <p style={{ color: '#475569', fontSize: '13px', marginBottom: '16px' }}>
              Tổng doanh thu tích lũy hôm nay: <strong style={{ color: '#059669', fontSize: '20px' }}>{todayTotalSales.toLocaleString('vi-VN')} đ</strong> ({paidInvoices.length} đơn hàng đã làm xong)
            </p>

            <div style={{ width: '100%', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0', textAlign: 'left' }}>
                    <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Mã Hóa Đơn</th>
                    <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Bàn Phục Vụ</th>
                    <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Chi Tiết Các Món Chế Biến</th>
                    <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Tổng Tiền</th>
                    <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Phương Thức Thanh Toán</th>
                    <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Thời Gian</th>
                  </tr>
                </thead>
                <tbody>
                  {paidInvoices.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: '24px', textAlign: 'center', color: '#64748B' }}>Chưa có đơn hàng nào được thanh toán hôm nay.</td>
                    </tr>
                  ) : (
                    paidInvoices.map((inv) => (
                      <tr key={inv.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#0F172A' }}>{inv.id}</td>
                        <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#2563EB' }}>{inv.table}</td>
                        <td style={{ padding: '14px 12px', color: '#475569', fontSize: '13px' }}>
                          {inv.items.map(i => `${i.product.name} (x${i.quantity})`).join(', ')}
                        </td>
                        <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#059669', fontSize: '15px' }}>{inv.totalAmount.toLocaleString('vi-VN')} đ</td>
                        <td style={{ padding: '14px 12px' }}><span style={{ background: '#DBEAFE', color: '#1E40AF', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>{inv.paymentMethod}</span></td>
                        <td style={{ padding: '14px 12px', color: '#64748B', fontSize: '13px' }}>{inv.timestamp}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '24px' }}>
              <h3 style={{ marginTop: 0, color: '#2563EB', fontWeight: 'bold', fontSize: '18px' }}>Soi Ca Thu Ngân & Tiền Mặt Két Quầy</h3>
              <div style={{ margin: '16px 0' }}>
                <div style={{ fontSize: '13px', color: '#475569' }}>Tiền mặt hiện tại trong két:</div>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#059669', margin: '4px 0' }}>
                  {cashInDrawer.toLocaleString('vi-VN')}đ
                </div>
              </div>
              <button onClick={handleWithdrawCash} style={{ width: '100%', padding: '12px', background: '#DC2626', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>
                Rút Bớt Két Tiền Mặt Sang Két An Toàn
              </button>
            </div>

            <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '24px' }}>
              <h3 style={{ marginTop: 0, color: '#D97706', fontWeight: 'bold', fontSize: '18px' }}>Soi Trạm Chế Biến KDS & Chi Phí Nhân Công</h3>
              <div style={{ margin: '16px 0' }}>
                <div style={{ fontSize: '14px', color: '#0F172A', marginBottom: '8px' }}>Tốc độ chế biến trung bình: <strong style={{ color: '#059669' }}>6.2 phút/món (Đạt SLA)</strong></div>
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ fontSize: '13px', color: '#475569', display: 'block', marginBottom: '4px' }}>Tỷ Lệ Chi Phí Nhân Công Realtime (Labor Cost %): <strong style={{ color: '#2563EB' }}>{laborCostPercent}%</strong></label>
                  <input type="range" min="10" max="35" step="0.5" value={laborCostPercent} onChange={(e) => setLaborCostPercent(Number(e.target.value))} style={{ width: '100%' }} />
                </div>
              </div>
              <button onClick={() => alert('Đã phát chuông cảnh báo KDS đến các trạm chế biến bếp!')} style={{ width: '100%', padding: '12px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>
                Phát Cảnh Báo Đẩy Nhanh Chế Biến KDS
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. VIEW 4: EOD CHECKLIST */}
      {activeTab === 'manager-eod' && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ fontSize: '20px', marginTop: 0, color: '#0F172A', fontWeight: 'bold' }}>Checklist Đóng Cửa Quán Cuối Ngày (EOD Closure Checklist)</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px', marginTop: '16px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px', color: '#0F172A', background: '#F8FAFC', padding: '14px', borderRadius: '6px', border: '1px solid #E2E8F0', cursor: 'pointer' }}>
              <input type="checkbox" checked={eodChecked.cashReconciled} onChange={(e) => setEodChecked({ ...eodChecked, cashReconciled: e.target.checked })} style={{ width: '20px', height: '20px' }} />
              <span>1. Đã kiểm đếm két tiền mặt thực tế và đối soát chênh lệch ca thu ngân thành công.</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px', color: '#0F172A', background: '#F8FAFC', padding: '14px', borderRadius: '6px', border: '1px solid #E2E8F0', cursor: 'pointer' }}>
              <input type="checkbox" checked={eodChecked.stockLocked} onChange={(e) => setEodChecked({ ...eodChecked, stockLocked: e.target.checked })} style={{ width: '20px', height: '20px' }} />
              <span>2. Đã chốt sổ tồn kho nguyên liệu cuối ngày và khóa tủ lạnh bảo quản nguyên liệu tươi.</span>
            </label>
          </div>

          <button onClick={handleCompleteEodClosure} style={{ padding: '12px 24px', background: '#059669', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer' }}>
            HOÀN TẤT ĐÓNG CỬA QUÁN CUỐI NGÀY
          </button>
        </div>
      )}

      {/* 5. VIEW 5: INCIDENTS */}
      {activeTab === 'manager-incidents' && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '20px', margin: 0, color: '#0F172A', fontWeight: 'bold' }}>Sổ Ghi Nhận Sự Cố & Khiếu Nại Khách Hàng</h2>
            </div>
            <button onClick={() => setShowAddIncidentModal(true)} style={{ padding: '10px 18px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>+ GHI NHẬN SỰ CỐ MỚI</button>
          </div>

          <div style={{ width: '100%', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0', textAlign: 'left' }}>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Mã Sự Cố</th>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Khách Hàng / Bàn</th>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Nội Dung Phản Ánh</th>
                </tr>
              </thead>
              <tbody>
                {incidents.map((inc) => (
                  <tr key={inc.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#0F172A' }}>{inc.id}</td>
                    <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#2563EB' }}>{inc.customer}</td>
                    <td style={{ padding: '14px 12px', color: '#475569' }}>{inc.issue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* EDIT STAFF MODAL */}
      {editStaffModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', maxWidth: '480px', width: '100%' }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#0F172A', fontSize: '18px', fontWeight: 'bold' }}>Chỉnh Sửa Mức Lương Nhân Sự - {editStaffModal.fullName}</h3>
            <form onSubmit={handleUpdateStaffHourlyRate}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#0F172A', marginBottom: '4px' }}>Mức Lương / Giờ (VNĐ):</label>
                <input type="number" value={editStaffModal.hourlyRate} onChange={(e) => setEditStaffModal({ ...editStaffModal, hourlyRate: Number(e.target.value) })} style={{ width: '100%', padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '6px' }} />
              </div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button type="button" onClick={() => setEditStaffModal(null)} style={{ padding: '8px 16px', background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: '6px', fontWeight: 'bold' }}>Hủy</button>
                <button type="submit" style={{ padding: '8px 16px', background: '#059669', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold' }}>Lưu Mức Lương</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ManagerOperationsPage;
