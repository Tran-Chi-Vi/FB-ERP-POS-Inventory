import React, { useState } from 'react';

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
  hourlyRate: number; // Lương theo giờ (đ/h)
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

export const ManagerOperationsPage: React.FC<ManagerOperationsPageProps> = ({ activeTab }) => {
  // MANAGER BRANCH ASSIGNMENT
  const managerBranch = 'Chi Nhánh Quận 1';

  // SUBORDINATE STAFF ACCOUNTS FOR THIS BRANCH ONLY
  const [subordinateStaff, setSubordinateStaff] = useState<StaffWageAccount[]>([
    { id: 'STAFF-1', code: 'EMP001', fullName: 'Trần Thanh Tâm', role: 'Staff (Phục vụ)', branch: 'Chi Nhánh Quận 1', phone: '0934567890', email: 'staff1@fnb.com', hourlyRate: 35000, totalHoursWorked: 180, bonus: 500000, deductions: 100000, status: 'Active' },
    { id: 'STAFF-2', code: 'EMP002', fullName: 'Nguyễn Thị Mai', role: 'Cashier (Thu ngân)', branch: 'Chi Nhánh Quận 1', phone: '0923456789', email: 'cashier1@fnb.com', hourlyRate: 40000, totalHoursWorked: 190, bonus: 800000, deductions: 200000, status: 'Active' },
    { id: 'STAFF-3', code: 'EMP003', fullName: 'Phạm Quốc Bảo', role: 'Warehouse (Thủ kho)', branch: 'Chi Nhánh Quận 1', phone: '0912345678', email: 'warehouse1@fnb.com', hourlyRate: 45000, totalHoursWorked: 176, bonus: 600000, deductions: 150000, status: 'Active' },
    { id: 'STAFF-4', code: 'EMP004', fullName: 'Vũ Minh Hoàng', role: 'Kitchen (Pha chế Bar)', branch: 'Chi Nhánh Quận 1', phone: '0945678901', email: 'kitchen1@fnb.com', hourlyRate: 42000, totalHoursWorked: 185, bonus: 700000, deductions: 120000, status: 'Active' },
  ]);

  // DAILY SHIFT IN/OUT TIMESTAMPS RECORD LOGS
  const [staffShifts, setStaffShifts] = useState<{ [staffCode: string]: ShiftInoutRecord[] }>({
    'EMP001': [
      { date: '2026-08-25', clockIn: '08:00 AM', clockOut: '18:00 PM', hoursWorked: 10, dailyWage: 350000 },
      { date: '2026-08-26', clockIn: '08:00 AM', clockOut: '18:00 PM', hoursWorked: 10, dailyWage: 350000 },
      { date: '2026-08-27', clockIn: '08:00 AM', clockOut: '18:00 PM', hoursWorked: 10, dailyWage: 350000 },
    ],
    'EMP002': [
      { date: '2026-08-25', clockIn: '08:00 AM', clockOut: '18:00 PM', hoursWorked: 10, dailyWage: 400000 },
      { date: '2026-08-26', clockIn: '08:00 AM', clockOut: '17:00 PM', hoursWorked: 9, dailyWage: 360000 },
    ],
    'EMP003': [
      { date: '2026-08-25', clockIn: '08:00 AM', clockOut: '16:00 PM', hoursWorked: 8, dailyWage: 360000 },
      { date: '2026-08-26', clockIn: '08:00 AM', clockOut: '17:00 PM', hoursWorked: 9, dailyWage: 405000 },
    ],
    'EMP004': [
      { date: '2026-08-25', clockIn: '08:00 AM', clockOut: '17:30 PM', hoursWorked: 9.5, dailyWage: 399000 },
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
  ]);

  // TELEMETRY MONITOR STATE
  const [cashInDrawer, setCashInDrawer] = useState<number>(12450000);
  const [showWithdrawCashModal, setShowWithdrawCashModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(5000000);
  const [withdrawReason, setWithdrawReason] = useState<string>('Rút bớt két quá định mức 10 triệu đồng chuyển vào két an toàn Manager');

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
    { id: 'INC-101', customer: 'Anh Hoàng (Bàn 03)', issue: 'Phản ánh trà hơi ngọt', resolution: 'Đã đổi ly mới 50% đường & tặng voucher 20k', handledBy: 'Lê Hoàng Phúc (Manager)' }
  ]);
  const [showAddIncidentModal, setShowAddIncidentModal] = useState(false);
  const [newIncident, setNewIncident] = useState({ customer: '', issue: '', resolution: '', handledBy: 'Lê Hoàng Phúc (Manager)' });

  // Handlers for Staff Wage Edit
  const handleSaveStaffWage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editStaffModal) return;
    setSubordinateStaff(subordinateStaff.map(s => s.id === editStaffModal.id ? editStaffModal : s));
    setEditStaffModal(null);
    alert(`MANAGER ACTION: Đã cập nhật mức lương mới (${editStaffModal.hourlyRate.toLocaleString('vi-VN')}đ/giờ) cho nhân sự "${editStaffModal.fullName}" thuộc ${managerBranch}!`);
  };

  const handleSimulateClockInOut = (e: React.FormEvent) => {
    e.preventDefault();
    const staff = subordinateStaff.find(s => s.code === clockStaffId);
    if (!staff) return;

    // Calculate hours worked (e.g. 08:00 AM to 18:00 PM = 10h)
    const hours = 10;
    const dailyWage = hours * staff.hourlyRate;

    const newRecord: ShiftInoutRecord = {
      date: new Date().toISOString().split('T')[0],
      clockIn: clockInTime,
      clockOut: clockOutTime,
      hoursWorked: hours,
      dailyWage: dailyWage
    };

    const updatedShifts = [newRecord, ...(staffShifts[clockStaffId] || [])];
    setStaffShifts({ ...staffShifts, [clockStaffId]: updatedShifts });

    // Update total hours for employee
    setSubordinateStaff(subordinateStaff.map(s => s.code === clockStaffId ? { ...s, totalHoursWorked: s.totalHoursWorked + hours } : s));

    alert(`Đã ghi nhận ca chấm công IN (${clockInTime}) - OUT (${clockOutTime}) cho nhân viên ${staff.fullName}. Tính số giờ làm: ${hours} tiếng. Lương ngày cộng thêm: ${dailyWage.toLocaleString('vi-VN')}đ!`);
  };

  const handleApprove = (id: string) => {
    if (pinCode.length < 4) {
      alert('Vui lòng nhập đủ 4-6 chữ số mã PIN Quản Lý!');
      return;
    }
    setPendingApprovals(pendingApprovals.filter(a => a.id !== id));
    alert(`Đã phê duyệt thành công yêu cầu ${id} với mã PIN xác thực!`);
    setPinCode('');
  };

  const handleWithdrawCash = (e: React.FormEvent) => {
    e.preventDefault();
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
    const inc: IncidentRecord = {
      id: `INC-10${incidents.length + 1}`,
      ...newIncident
    };
    setIncidents([...incidents, inc]);
    setShowAddIncidentModal(false);
    alert(`Đã lưu nhật ký sự cố khiếu nại của khách hàng "${newIncident.customer}"!`);
    setNewIncident({ customer: '', issue: '', resolution: '', handledBy: 'Lê Hoàng Phúc (Manager)' });
  };

  return (
    <div style={{ width: '100%', maxWidth: '100%', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* 1. VIEW 1: MANAGER BRANCH PAYROLL AUDIT & IN/OUT CLOCKING */}
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

          {/* SIMULATE CLOCK IN/OUT FORM */}
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

          {/* SUBORDINATE PAYROLL TABLE */}
          <div style={{ width: '100%', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0', textAlign: 'left' }}>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Mã NV</th>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Họ Và Tên</th>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Chức Danh</th>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Mức Lương / Giờ</th>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Tổng Giờ IN/OUT</th>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Lương Cơ Bản (Giờ x Lương/h)</th>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Thưởng / Trừ</th>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Thực Lĩnh Net</th>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Chỉnh Sửa Lương</th>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Xem Ca IN/OUT</th>
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
                      <td style={{ padding: '14px 12px', fontSize: '13px' }}>
                        <span style={{ color: '#059669', fontWeight: 'bold' }}>+{staff.bonus.toLocaleString('vi-VN')}đ</span><br/>
                        <span style={{ color: '#DC2626' }}>-{staff.deductions.toLocaleString('vi-VN')}đ</span>
                      </td>
                      <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#059669', fontSize: '15px' }}>{netSalary.toLocaleString('vi-VN')}đ</td>
                      <td style={{ padding: '14px 12px' }}>
                        <button onClick={() => setEditStaffModal(staff)} style={{ padding: '6px 12px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>Chỉnh Sửa Lương</button>
                      </td>
                      <td style={{ padding: '14px 12px' }}>
                        <button onClick={() => setSelectedStaffShifts({ staff, shifts: staffShifts[staff.code] || [] })} style={{ padding: '6px 12px', background: '#059669', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>Xem Giờ IN/OUT</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* EDIT STAFF WAGE MODAL */}
      {editStaffModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', maxWidth: '500px', width: '100%' }}>
            <h3 style={{ marginTop: 0, color: '#0F172A' }}>Chỉnh Sửa Hồ Sơ & Mức Lương Nhân Viên: {editStaffModal.fullName}</h3>
            <p style={{ fontSize: '13px', color: '#475569', marginBottom: '16px' }}>Chi nhánh: <strong>{editStaffModal.branch}</strong> | Chức danh: <strong>{editStaffModal.role}</strong></p>
            <form onSubmit={handleSaveStaffWage}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px', color: '#0F172A', fontWeight: 'bold' }}>Họ và Tên:</label>
                  <input type="text" value={editStaffModal.fullName} onChange={(e) => setEditStaffModal({ ...editStaffModal, fullName: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #CBD5E1', borderRadius: '6px', color: '#0F172A' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px', color: '#0F172A', fontWeight: 'bold' }}>Số Điện Thoại:</label>
                  <input type="text" value={editStaffModal.phone} onChange={(e) => setEditStaffModal({ ...editStaffModal, phone: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #CBD5E1', borderRadius: '6px', color: '#0F172A' }} />
                </div>
              </div>
              <div style={{ marginBottom: '16px', background: '#FEF3C7', padding: '12px', borderRadius: '6px', border: '1px solid #FDE68A' }}>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px', color: '#92400E', fontWeight: 'bold' }}>Mức Lương Theo Giờ (đ/giờ):</label>
                <input type="number" required value={editStaffModal.hourlyRate} onChange={(e) => setEditStaffModal({ ...editStaffModal, hourlyRate: Number(e.target.value) })} style={{ width: '100%', padding: '10px', border: '1px solid #CBD5E1', borderRadius: '6px', color: '#0F172A', fontSize: '16px', fontWeight: 'bold' }} />
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#78350F' }}>Công thức: Số giờ làm x Lương/giờ = Tổng lương tháng</p>
              </div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setEditStaffModal(null)} style={{ padding: '8px 16px', background: '#9CA3AF', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Hủy</button>
                <button type="submit" style={{ padding: '8px 16px', background: '#059669', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Lưu Mức Lương Mới</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SHIFT IN/OUT DETAIL MODAL */}
      {selectedStaffShifts && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', maxWidth: '650px', width: '100%', maxHeight: '85vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', color: '#0F172A', fontWeight: 'bold' }}>Nhật Ký Giờ Chấm Công IN/OUT: {selectedStaffShifts.staff.fullName}</h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#475569' }}>Chi nhánh: {selectedStaffShifts.staff.branch} | Lương/Giờ: <strong style={{ color: '#059669' }}>{selectedStaffShifts.staff.hourlyRate.toLocaleString('vi-VN')}đ/h</strong></p>
              </div>
              <button onClick={() => setSelectedStaffShifts(null)} style={{ padding: '6px 12px', background: '#9CA3AF', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Đóng</button>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0', textAlign: 'left' }}>
                  <th style={{ padding: '10px', color: '#0F172A', fontWeight: 'bold' }}>Ngày</th>
                  <th style={{ padding: '10px', color: '#0F172A', fontWeight: 'bold' }}>Giờ Vào (IN)</th>
                  <th style={{ padding: '10px', color: '#0F172A', fontWeight: 'bold' }}>Giờ Ra (OUT)</th>
                  <th style={{ padding: '10px', color: '#0F172A', fontWeight: 'bold' }}>Số Giờ Làm</th>
                  <th style={{ padding: '10px', color: '#0F172A', fontWeight: 'bold' }}>Lương Ngày (Giờ x Lương/h)</th>
                </tr>
              </thead>
              <tbody>
                {selectedStaffShifts.shifts.map((s, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '10px', fontWeight: 'bold', color: '#0F172A' }}>{s.date}</td>
                    <td style={{ padding: '10px', color: '#059669', fontWeight: 'bold' }}>{s.clockIn}</td>
                    <td style={{ padding: '10px', color: '#DC2626', fontWeight: 'bold' }}>{s.clockOut}</td>
                    <td style={{ padding: '10px', fontWeight: 'bold', color: '#2563EB' }}>{s.hoursWorked} tiếng</td>
                    <td style={{ padding: '10px', fontWeight: 'bold', color: '#059669' }}>{s.dailyWage.toLocaleString('vi-VN')}đ</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: APPROVALS */}
      {activeTab === 'manager-approvals' && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ fontSize: '20px', marginTop: 0, color: '#0F172A', fontWeight: 'bold' }}>Hộp Thư Phê Duyệt Yêu Cầu Khẩn Cấp Bằng Mã PIN Manager</h2>
          <p style={{ color: '#475569', fontSize: '14px', marginBottom: '16px' }}>Các yêu cầu hủy đơn, chiết khấu vượt định mức từ thu ngân quầy cần mã PIN quản lý để phê duyệt.</p>

          <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '6px', border: '1px solid #E2E8F0', marginBottom: '20px', display: 'flex', gap: '12px', alignItems: 'center' }}>
            <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#0F172A' }}>Nhập Mã PIN Xác Thực (Manager PIN):</label>
            <input type="password" maxLength={6} value={pinCode} onChange={(e) => setPinCode(e.target.value)} placeholder="• • • •" style={{ padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '4px', width: '130px', letterSpacing: '4px', fontWeight: 'bold', color: '#0F172A' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {pendingApprovals.map((app) => (
              <div key={app.id} style={{ border: '1px solid #E2E8F0', background: '#F8FAFC', padding: '16px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <span style={{ background: '#DC2626', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>{app.type}</span>
                  <h3 style={{ margin: '8px 0 4px 0', fontSize: '18px', color: '#0F172A' }}>{app.detail}</h3>
                  <div style={{ fontSize: '13px', color: '#475569' }}>Yêu cầu bởi: {app.cashier} | Giá trị: <strong style={{ color: '#059669' }}>{app.amount}</strong> | Thời gian: {app.time}</div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => setPendingApprovals(pendingApprovals.filter(a => a.id !== app.id))} style={{ padding: '8px 16px', background: '#9CA3AF', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Từ chối</button>
                  <button onClick={() => handleApprove(app.id)} style={{ padding: '8px 16px', background: '#059669', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>XÁC NHẬN PIN & DUYỆT</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: BRANCH LIVE MONITOR */}
      {activeTab === 'manager-telemetry' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '24px' }}>
            <h3 style={{ marginTop: 0, color: '#2563EB', fontWeight: 'bold', fontSize: '18px' }}>Soi Ca Thu Ngân & Tiền Mặt Két Quầy</h3>
            <div style={{ margin: '16px 0' }}>
              <div style={{ fontSize: '13px', color: '#475569' }}>Tiền mặt hiện tại trong két:</div>
              <div style={{ fontSize: '26px', fontWeight: 'bold', color: cashInDrawer > 10000000 ? '#DC2626' : '#059669' }}>
                {cashInDrawer.toLocaleString('vi-VN')}đ
              </div>
            </div>
            <button onClick={() => setShowWithdrawCashModal(true)} style={{ width: '100%', padding: '10px', background: '#DC2626', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
              Rút Bớt Két Tiền Mặt Sang Két An Toàn
            </button>
          </div>

          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '24px' }}>
            <h3 style={{ marginTop: 0, color: '#D97706', fontWeight: 'bold', fontSize: '18px' }}>Soi Trạm Chế Biến KDS & Chi Phí Nhân Công</h3>
            <div style={{ margin: '16px 0' }}>
              <div style={{ fontSize: '14px', color: '#0F172A', marginBottom: '8px' }}>Tốc độ chế biến trung bình: <strong style={{ color: '#059669' }}>6.2 phút/món (Tốt)</strong></div>
              <div style={{ fontSize: '14px', color: '#0F172A', marginBottom: '12px' }}>
                Chi Phí Nhân Công Realtime (Labor Cost %): <strong style={{ color: '#2563EB' }}>{laborCostPercent}%</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 4: EOD CHECKLIST */}
      {activeTab === 'manager-eod' && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ fontSize: '20px', marginTop: 0, color: '#0F172A', fontWeight: 'bold' }}>Checklist Đóng Cửa Quán Cuối Ngày (EOD Closure Checklist)</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '16px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px', color: '#0F172A', background: '#F8FAFC', padding: '12px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
              <input type="checkbox" checked={eodChecked.cashReconciled} onChange={(e) => setEodChecked({ ...eodChecked, cashReconciled: e.target.checked })} style={{ width: '18px', height: '18px' }} />
              1. Đã kiểm đếm két tiền mặt thực tế và đối soát chênh lệch ca thu ngân thành công.
            </label>
          </div>
        </div>
      )}

      {/* VIEW 5: INCIDENTS */}
      {activeTab === 'manager-incidents' && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ fontSize: '20px', marginTop: 0, color: '#0F172A', fontWeight: 'bold' }}>Sổ Ghi Nhận Sự Cố & Khiếu Nại Khách Hàng</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0', textAlign: 'left' }}>
                <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Mã Sự Cố</th>
                <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Khách Hàng / Bàn</th>
                <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Nội Dung Phản Ánh</th>
                <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Biện Pháp Xử Lý</th>
              </tr>
            </thead>
            <tbody>
              {incidents.map((inc) => (
                <tr key={inc.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#0F172A' }}>{inc.id}</td>
                  <td style={{ padding: '14px 12px', color: '#0F172A', fontWeight: 'bold' }}>{inc.customer}</td>
                  <td style={{ padding: '14px 12px', color: '#DC2626' }}>{inc.issue}</td>
                  <td style={{ padding: '14px 12px', color: '#059669', fontWeight: 'bold' }}>{inc.resolution}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* WITHDRAW CASH MODAL */}
      {showWithdrawCashModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', maxWidth: '450px', width: '100%' }}>
            <h3 style={{ marginTop: 0, color: '#0F172A' }}>Rút Bớt Két Tiền Mặt Thu Ngân</h3>
            <form onSubmit={handleWithdrawCash}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px', color: '#0F172A', fontWeight: 'bold' }}>Số Tiền Rút (đ):</label>
                <input type="number" required value={withdrawAmount} onChange={(e) => setWithdrawAmount(Number(e.target.value))} style={{ width: '100%', padding: '8px', border: '1px solid #CBD5E1', borderRadius: '6px', color: '#0F172A' }} />
              </div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowWithdrawCashModal(false)} style={{ padding: '8px 16px', background: '#9CA3AF', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Hủy</button>
                <button type="submit" style={{ padding: '8px 16px', background: '#DC2626', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Xác Nhận Rút Két</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerOperationsPage;
