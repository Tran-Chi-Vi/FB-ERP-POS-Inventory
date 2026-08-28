import React, { useState } from 'react';

interface ManagerOperationsPageProps {
  activeTab: string;
}

interface IncidentRecord {
  id: string;
  customer: string;
  issue: string;
  resolution: string;
  handledBy: string;
}

export const ManagerOperationsPage: React.FC<ManagerOperationsPageProps> = ({ activeTab }) => {
  // APPROVALS STATE
  const [pinCode, setPinCode] = useState<string>('');
  const [pendingApprovals, setPendingApprovals] = useState([
    { id: 'AUTH-901', cashier: 'Nguyễn Thị Mai (Cashier 1)', type: 'HUỶ MÓN (VOID)', detail: 'Huỷ 2x Trà Đào (Khách đổi món)', amount: '90.000đ', time: '1 phút trước' },
    { id: 'AUTH-902', cashier: 'Nguyễn Thị Mai (Cashier 1)', type: 'CHIẾT KHẤU >5%', detail: 'Giảm 15% VIP cho Khách Thân Thiết', amount: '150.000đ', time: '5 phút trước' }
  ]);

  // TELEMETRY MONITOR STATE
  const [cashInDrawer, setCashInDrawer] = useState<number>(12450000);
  const [showWithdrawCashModal, setShowWithdrawCashModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(5000000);
  const [withdrawReason, setWithdrawReason] = useState<string>('Rút bớt két quá định mức 10 triệu đồng chuyển vào két an toàn Manager');

  const [laborCostPercent, setLaborCostPercent] = useState<number>(18.5);
  const [slaAlertSent, setSlaAlertSent] = useState(false);

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

  // Handlers
  const handleApprove = (id: string) => {
    if (pinCode.length < 4) {
      alert('Vui lòng nhập đủ 4-6 chữ số mã PIN Quản Lý!');
      return;
    }
    setPendingApprovals(pendingApprovals.filter(a => a.id !== id));
    alert(`Đã phê duyệt thành công yêu cầu ${id} với mã PIN xác thực nguyên tử! Log đã được lưu vào AuditLogs.`);
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
    alert(`Đã rút ${withdrawAmount.toLocaleString('vi-VN')}đ tiền mặt từ két thu ngân chuyển vào két an toàn Manager! Sổ quỹ tiền mặt đã được cập nhật.`);
  };

  const handleSendSlaAlert = () => {
    setSlaAlertSent(true);
    alert('Đã gửi thông báo nhắc nhở đẩy nhanh tốc độ chế biến tới toàn bộ màn hình KDS trạm Bar & Kitchen!');
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
      
      {/* 1. VIEW 1: APPROVALS */}
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

            {pendingApprovals.length === 0 && (
              <div style={{ textAlign: 'center', padding: '30px', color: '#64748B', fontWeight: 'bold' }}>Không có yêu cầu duyệt khẩn cấp nào đang chờ.</div>
            )}
          </div>
        </div>
      )}

      {/* 2. VIEW 2: BRANCH LIVE MONITOR */}
      {activeTab === 'manager-telemetry' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {/* Cashier Safe Float Card */}
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '24px' }}>
            <h3 style={{ marginTop: 0, color: '#2563EB', fontWeight: 'bold', fontSize: '18px' }}>Soi Ca Thu Ngân & Tiền Mặt Két Quầy</h3>
            <div style={{ margin: '16px 0' }}>
              <div style={{ fontSize: '13px', color: '#475569' }}>Tiền mặt hiện tại trong két:</div>
              <div style={{ fontSize: '26px', fontWeight: 'bold', color: cashInDrawer > 10000000 ? '#DC2626' : '#059669' }}>
                {cashInDrawer.toLocaleString('vi-VN')}đ
              </div>
              {cashInDrawer > 10000000 && (
                <div style={{ fontSize: '12px', color: '#DC2626', fontWeight: 'bold', marginTop: '4px' }}>
                  CẢNH BÁO: Tiền két vượt định mức 10M, đề xuất rút bớt tiền chuyển vào két an toàn!
                </div>
              )}
            </div>
            <button onClick={() => setShowWithdrawCashModal(true)} style={{ width: '100%', padding: '10px', background: '#DC2626', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
              Rút Bớt Két Tiền Mặt Sang Két An Toàn
            </button>
          </div>

          {/* Kitchen SLA & Labor Cost Card */}
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '24px' }}>
            <h3 style={{ marginTop: 0, color: '#D97706', fontWeight: 'bold', fontSize: '18px' }}>Soi Trạm Chế Biến KDS & Chi Phí Nhân Công</h3>
            <div style={{ margin: '16px 0' }}>
              <div style={{ fontSize: '14px', color: '#0F172A', marginBottom: '8px' }}>Tốc độ chế biến trung bình: <strong style={{ color: '#059669' }}>6.2 phút/món (Tốt)</strong></div>
              <div style={{ fontSize: '14px', color: '#0F172A', marginBottom: '12px' }}>
                Chi Phí Nhân Công Realtime (Labor Cost %): <strong style={{ color: '#2563EB' }}>{laborCostPercent}%</strong> (Target &lt; 22%)
              </div>
              <label style={{ display: 'block', fontSize: '12px', color: '#475569', marginBottom: '4px' }}>Điều chỉnh định mức phân bổ nhân sự ca:</label>
              <input type="range" min={15} max={30} step={0.5} value={laborCostPercent} onChange={(e) => setLaborCostPercent(Number(e.target.value))} style={{ width: '100%' }} />
            </div>
            <button onClick={handleSendSlaAlert} disabled={slaAlertSent} style={{ width: '100%', padding: '10px', background: slaAlertSent ? '#9CA3AF' : '#2563EB', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: slaAlertSent ? 'not-allowed' : 'pointer' }}>
              {slaAlertSent ? 'Đã Phát Cảnh Báo Trễ SLA' : 'Phát Cảnh Báo Đẩy Nhanh Chế Biến KDS'}
            </button>
          </div>
        </div>
      )}

      {/* 3. VIEW 3: EOD CHECKLIST */}
      {activeTab === 'manager-eod' && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ fontSize: '20px', marginTop: 0, color: '#0F172A', fontWeight: 'bold' }}>Checklist Đóng Cửa Quán Cuối Ngày (EOD Closure Checklist)</h2>
          <p style={{ color: '#475569', fontSize: '14px', marginBottom: '20px' }}>Yêu cầu quản lý hoàn tất 4 bước kiểm tra trước khi niêm phong ca làm việc ngày.</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px', color: '#0F172A', background: '#F8FAFC', padding: '12px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
              <input type="checkbox" checked={eodChecked.cashReconciled} onChange={(e) => setEodChecked({ ...eodChecked, cashReconciled: e.target.checked })} style={{ width: '18px', height: '18px' }} />
              1. Đã kiểm đếm két tiền mặt thực tế và đối soát chênh lệch ca thu ngân thành công.
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px', color: '#0F172A', background: '#F8FAFC', padding: '12px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
              <input type="checkbox" checked={eodChecked.stockLocked} onChange={(e) => setEodChecked({ ...eodChecked, stockLocked: e.target.checked })} style={{ width: '18px', height: '18px' }} />
              2. Đã khóa sổ kho nguyên liệu cuối ngày và kiểm kê niêm phong tủ lạnh bảo quản FEFO.
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px', color: '#0F172A', background: '#F8FAFC', padding: '12px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
              <input type="checkbox" checked={eodChecked.equipmentOff} onChange={(e) => setEodChecked({ ...eodChecked, equipmentOff: e.target.checked })} style={{ width: '18px', height: '18px' }} />
              3. Đã ngắt nguồn máy pha cà phê, bếp đun, hệ thống âm thanh và đèn chiếu sáng.
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px', color: '#0F172A', background: '#F8FAFC', padding: '12px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
              <input type="checkbox" checked={eodChecked.kdsCleared} onChange={(e) => setEodChecked({ ...eodChecked, kdsCleared: e.target.checked })} style={{ width: '18px', height: '18px' }} />
              4. Màn hình KDS trạm Bar & Kitchen đã hoàn tất 100% các vé order trong ngày.
            </label>
          </div>

          <button onClick={() => alert('Đã CHỐT EOD ĐÓNG CỬA QUÁN THÀNH CÔNG! Báo cáo chốt doanh số và chi phí ngày đã tự động gửi về Admin.')} style={{ marginTop: '24px', padding: '12px 24px', background: '#059669', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
            HOÀN TẤT ĐÓNG CỬA QUÁN CUỐI NGÀY
          </button>
        </div>
      )}

      {/* 4. VIEW 4: INCIDENTS */}
      {activeTab === 'manager-incidents' && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '20px', margin: 0, color: '#0F172A', fontWeight: 'bold' }}>Sổ Ghi Nhận Sự Cố & Khiếu Nại Khách Hàng</h2>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#475569' }}>Nhật ký truy vết xử lý phản ánh chất lượng phục vụ và bồi thường voucher cho khách.</p>
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
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Biện Pháp Xử Lý</th>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Quản Lý Xử Lý</th>
                </tr>
              </thead>
              <tbody>
                {incidents.map((inc) => (
                  <tr key={inc.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#0F172A' }}>{inc.id}</td>
                    <td style={{ padding: '14px 12px', color: '#0F172A', fontWeight: 'bold' }}>{inc.customer}</td>
                    <td style={{ padding: '14px 12px', color: '#DC2626' }}>{inc.issue}</td>
                    <td style={{ padding: '14px 12px', color: '#059669', fontWeight: 'bold' }}>{inc.resolution}</td>
                    <td style={{ padding: '14px 12px', color: '#475569' }}>{inc.handledBy}</td>
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
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px', color: '#0F172A', fontWeight: 'bold' }}>Ghi Chú Lý Do Rút Tiền:</label>
                <input type="text" required value={withdrawReason} onChange={(e) => setWithdrawReason(e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #CBD5E1', borderRadius: '6px', color: '#0F172A' }} />
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
          <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', maxWidth: '450px', width: '100%' }}>
            <h3 style={{ marginTop: 0, color: '#0F172A' }}>Ghi Nhận Sự Cố Khiếu Nại Mới</h3>
            <form onSubmit={handleAddIncident}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px', color: '#0F172A', fontWeight: 'bold' }}>Tên Khách Hàng / Số Bàn:</label>
                <input type="text" required value={newIncident.customer} onChange={(e) => setNewIncident({ ...newIncident, customer: e.target.value })} placeholder="Anh Hoàng (Bàn 03)" style={{ width: '100%', padding: '8px', border: '1px solid #CBD5E1', borderRadius: '6px', color: '#0F172A' }} />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px', color: '#0F172A', fontWeight: 'bold' }}>Nội Dung Sự Cố / Khiếu Nại:</label>
                <input type="text" required value={newIncident.issue} onChange={(e) => setNewIncident({ ...newIncident, issue: e.target.value })} placeholder="Phản ánh đồ uống không đúng vị..." style={{ width: '100%', padding: '8px', border: '1px solid #CBD5E1', borderRadius: '6px', color: '#0F172A' }} />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px', color: '#0F172A', fontWeight: 'bold' }}>Biện Pháp Giải Quyết / Bồi Thường:</label>
                <input type="text" required value={newIncident.resolution} onChange={(e) => setNewIncident({ ...newIncident, resolution: e.target.value })} placeholder="Đổi ly mới & tặng voucher 20k" style={{ width: '100%', padding: '8px', border: '1px solid #CBD5E1', borderRadius: '6px', color: '#0F172A' }} />
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
