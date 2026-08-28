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

export const ManagerOperationsPage: React.FC<ManagerOperationsPageProps> = ({ activeTab }) => {
  const managerBranch = 'Chi Nhánh Quận 1';

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
    { id: 'INC-102', customer: 'Chị Lan (Bàn VIP 01)', issue: 'Chờ món bánh Croissant lâu', resolution: 'Giải thích bánh nướng tươi 12 phút & tặng ly Cappuccino', handledBy: 'Lê Hoàng Phúc (Manager)' },
  ]);
  const [showAddIncidentModal, setShowAddIncidentModal] = useState(false);
  const [newIncident, setNewIncident] = useState({ customer: '', issue: '', resolution: '', handledBy: 'Lê Hoàng Phúc (Manager)' });

  // Handlers
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

      {/* 2. VIEW 2: APPROVALS */}
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

      {/* 3. VIEW 3: BRANCH LIVE MONITOR */}
      {activeTab === 'manager-telemetry' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '24px' }}>
            <h3 style={{ marginTop: 0, color: '#2563EB', fontWeight: 'bold', fontSize: '18px' }}>Soi Ca Thu Ngân & Tiền Mặt Két Quầy</h3>
            <div style={{ margin: '16px 0' }}>
              <div style={{ fontSize: '13px', color: '#475569' }}>Tiền mặt hiện tại trong két:</div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: cashInDrawer > 10000000 ? '#DC2626' : '#059669', margin: '4px 0' }}>
                {cashInDrawer.toLocaleString('vi-VN')}đ
              </div>
              <p style={{ margin: 0, fontSize: '12px', color: '#DC2626', fontWeight: 'bold' }}>Cảnh báo: Tiền mặt vượt định mức an toàn 10 triệu đồng!</p>
            </div>
            <button onClick={() => setShowWithdrawCashModal(true)} style={{ width: '100%', padding: '12px', background: '#DC2626', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>
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
      )}

      {/* 4. VIEW 4: EOD CHECKLIST */}
      {activeTab === 'manager-eod' && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ fontSize: '20px', marginTop: 0, color: '#0F172A', fontWeight: 'bold' }}>Checklist Đóng Cửa Quán Cuối Ngày (EOD Closure Checklist)</h2>
          <p style={{ color: '#475569', fontSize: '14px', marginBottom: '20px' }}>Quản lý chi nhánh bắt buộc tích xác nhận hoàn tất 4 bước tiêu chuẩn trước khi khóa cửa chi nhánh.</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px', color: '#0F172A', background: '#F8FAFC', padding: '14px', borderRadius: '6px', border: '1px solid #E2E8F0', cursor: 'pointer' }}>
              <input type="checkbox" checked={eodChecked.cashReconciled} onChange={(e) => setEodChecked({ ...eodChecked, cashReconciled: e.target.checked })} style={{ width: '20px', height: '20px' }} />
              <span>1. Đã kiểm đếm két tiền mặt thực tế và đối soát chênh lệch ca thu ngân thành công.</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px', color: '#0F172A', background: '#F8FAFC', padding: '14px', borderRadius: '6px', border: '1px solid #E2E8F0', cursor: 'pointer' }}>
              <input type="checkbox" checked={eodChecked.stockLocked} onChange={(e) => setEodChecked({ ...eodChecked, stockLocked: e.target.checked })} style={{ width: '20px', height: '20px' }} />
              <span>2. Đã chốt sổ tồn kho nguyên liệu cuối ngày và khóa tủ lạnh bảo quản nguyên liệu tươi.</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px', color: '#0F172A', background: '#F8FAFC', padding: '14px', borderRadius: '6px', border: '1px solid #E2E8F0', cursor: 'pointer' }}>
              <input type="checkbox" checked={eodChecked.equipmentOff} onChange={(e) => setEodChecked({ ...eodChecked, equipmentOff: e.target.checked })} style={{ width: '20px', height: '20px' }} />
              <span>3. Đã tắt toàn bộ thiết bị điện high-wattage (Máy pha cà phê, Lò nướng, Điều hòa trung tâm).</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px', color: '#0F172A', background: '#F8FAFC', padding: '14px', borderRadius: '6px', border: '1px solid #E2E8F0', cursor: 'pointer' }}>
              <input type="checkbox" checked={eodChecked.kdsCleared} onChange={(e) => setEodChecked({ ...eodChecked, kdsCleared: e.target.checked })} style={{ width: '20px', height: '20px' }} />
              <span>4. Màn hình KDS Bếp đã xóa sạch toàn bộ hàng đợi order và lưu log lịch sử chế biến.</span>
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
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#475569' }}>Lưu vết nhật ký xử lý phản hồi dịch vụ tại chi nhánh để phục vụ đánh giá chất lượng phục vụ.</p>
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
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Biện Pháp Xử Lý Khắc Phục</th>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Người Xử Lý</th>
                </tr>
              </thead>
              <tbody>
                {incidents.map((inc) => (
                  <tr key={inc.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#0F172A' }}>{inc.id}</td>
                    <td style={{ padding: '14px 12px', color: '#0F172A', fontWeight: 'bold' }}>{inc.customer}</td>
                    <td style={{ padding: '14px 12px', color: '#DC2626' }}>{inc.issue}</td>
                    <td style={{ padding: '14px 12px', color: '#059669', fontWeight: 'bold' }}>{inc.resolution}</td>
                    <td style={{ padding: '14px 12px', color: '#2563EB' }}>{inc.handledBy}</td>
                  </tr>
                ))}
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

      {/* ADD INCIDENT MODAL */}
      {showAddIncidentModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', maxWidth: '500px', width: '100%' }}>
            <h3 style={{ marginTop: 0, color: '#0F172A' }}>Ghi Nhận Sự Cố Khiếu Nại Mới</h3>
            <form onSubmit={handleAddIncident}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px', color: '#0F172A', fontWeight: 'bold' }}>Khách Hàng / Vị Trí Bàn:</label>
                <input type="text" required value={newIncident.customer} onChange={(e) => setNewIncident({ ...newIncident, customer: e.target.value })} placeholder="Ví dụ: Anh Minh (Bàn 05)" style={{ width: '100%', padding: '8px', border: '1px solid #CBD5E1', borderRadius: '6px', color: '#0F172A' }} />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px', color: '#0F172A', fontWeight: 'bold' }}>Nội Dung Phản Ánh:</label>
                <textarea required value={newIncident.issue} onChange={(e) => setNewIncident({ ...newIncident, issue: e.target.value })} placeholder="Mô tả sự cố..." style={{ width: '100%', padding: '8px', border: '1px solid #CBD5E1', borderRadius: '6px', color: '#0F172A', minHeight: '60px' }} />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px', color: '#0F172A', fontWeight: 'bold' }}>Biện Pháp Xử Lý Khắc Phục:</label>
                <input type="text" required value={newIncident.resolution} onChange={(e) => setNewIncident({ ...newIncident, resolution: e.target.value })} placeholder="Phương án giải quyết..." style={{ width: '100%', padding: '8px', border: '1px solid #CBD5E1', borderRadius: '6px', color: '#0F172A' }} />
              </div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowAddIncidentModal(false)} style={{ padding: '8px 16px', background: '#9CA3AF', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Hủy</button>
                <button type="submit" style={{ padding: '8px 16px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Lưu Sự Cố</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerOperationsPage;
