import React, { useState } from 'react';

interface ManagerOperationsPageProps {
  activeTab: string;
}

export const ManagerOperationsPage: React.FC<ManagerOperationsPageProps> = ({ activeTab }) => {
  const [pinCode, setPinCode] = useState<string>('');
  const [eodChecked, setEodChecked] = useState<{ [key: string]: boolean }>({
    cashReconciled: true,
    stockLocked: true,
    equipmentOff: false,
    kdsCleared: true,
  });

  const [pendingApprovals, setPendingApprovals] = useState([
    { id: 'AUTH-901', cashier: 'Nguyễn Thị Mai (Cashier 1)', type: 'HUỶ MÓN (VOID)', detail: 'Huỷ 2x Trà Đào (Khách đổi món)', amount: '90.000đ', time: '1 phút trước' },
    { id: 'AUTH-902', cashier: 'Nguyễn Thị Mai (Cashier 1)', type: 'CHIẾT KHẤU >5%', detail: 'Giảm 15% VIP cho Khách Thân Thiết', amount: '150.000đ', time: '5 phút trước' }
  ]);

  const [incidents] = useState([
    { id: 'INC-101', customer: 'Anh Hoàng (Bàn 03)', issue: 'Phản ánh trà hơi ngọt', resolution: 'Đã đổi ly mới 50% đường & tặng voucher 20k', resolvedBy: 'Lê Hoàng Phúc (Manager)' }
  ]);

  const handleApprove = (id: string) => {
    if (pinCode.length < 4) {
      alert('Vui lòng nhập đủ 4-6 chữ số mã PIN Quản Lý!');
      return;
    }
    setPendingApprovals(pendingApprovals.filter(a => a.id !== id));
    alert(`Đã phê duyệt thành công yêu cầu ${id} với mã PIN xác thực nguyên tử! Log đã được lưu vào AuditLogs.`);
    setPinCode('');
  };

  const laborCostPercent = 18.5;

  return (
    <div style={{ padding: '24px', maxWidth: '1100px', margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* VIEW 1: APPROVALS */}
      {activeTab === 'manager-approvals' && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ fontSize: '20px', marginTop: 0, color: '#111827', fontWeight: 'bold' }}>Hộp Thư Phê Duyệt Yêu Cầu Khẩn Cấp Bằng Mã PIN Manager</h2>
          
          <div style={{ background: '#F3F4F6', padding: '16px', borderRadius: '6px', border: '1px solid #E5E7EB', marginBottom: '20px', display: 'flex', gap: '12px', alignItems: 'center' }}>
            <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#111827' }}>Nhập Mã PIN Xác Thực (Manager PIN):</label>
            <input type="password" maxLength={6} value={pinCode} onChange={(e) => setPinCode(e.target.value)} placeholder="• • • •" style={{ padding: '8px 12px', border: '1px solid #D1D5DB', borderRadius: '4px', width: '130px', letterSpacing: '4px', fontWeight: 'bold', color: '#111827' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {pendingApprovals.map((app) => (
              <div key={app.id} style={{ border: '1px solid #E5E7EB', background: '#F9FAFB', padding: '16px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ background: '#DC2626', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>{app.type}</span>
                  <h3 style={{ margin: '8px 0 4px 0', fontSize: '18px', color: '#111827' }}>{app.detail}</h3>
                  <div style={{ fontSize: '13px', color: '#4B5563' }}>Yêu cầu bởi: {app.cashier} | Giá trị: <strong style={{ color: '#059669' }}>{app.amount}</strong> | Thời gian: {app.time}</div>
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

      {/* VIEW 2: BRANCH TELEMETRY MONITOR */}
      {activeTab === 'manager-telemetry' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
          <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '24px' }}>
            <h3 style={{ marginTop: 0, color: '#2563EB', fontWeight: 'bold' }}>Soi Ca Thu Ngân (Cashier Operations)</h3>
            <ul style={{ paddingLeft: '20px', lineHeight: '1.8', fontSize: '14px', color: '#111827' }}>
              <li>Tiền mặt hiện tại trong két: <strong style={{ color: '#DC2626' }}>12.450.000đ (CẢNH BÁO TRÊN 10M RÚT BỚT KÉT)</strong></li>
              <li>Tổng giao dịch VietQR: <strong>8.200.000đ</strong></li>
              <li>Trạng thái ca: <strong>Đang mở (Nguyễn Thị Mai)</strong></li>
            </ul>
          </div>

          <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '24px' }}>
            <h3 style={{ marginTop: 0, color: '#D97706', fontWeight: 'bold' }}>Soi Trạm Chế Biến KDS</h3>
            <ul style={{ paddingLeft: '20px', lineHeight: '1.8', fontSize: '14px', color: '#111827' }}>
              <li>Thời gian chế biến trung bình: <strong>6.2 phút/món</strong></li>
              <li>Labor Cost Realtime: <strong style={{ color: '#059669' }}>{laborCostPercent}% (Target &lt; 22%)</strong></li>
            </ul>
          </div>
        </div>
      )}

      {/* VIEW 3: EOD CHECKLIST */}
      {activeTab === 'manager-eod' && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ fontSize: '20px', marginTop: 0, color: '#111827', fontWeight: 'bold' }}>Checklist Đóng Cửa Quán Cuối Ngày (EOD Closure Checklist)</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', color: '#111827' }}>
              <input type="checkbox" checked={eodChecked.cashReconciled} onChange={(e) => setEodChecked({ ...eodChecked, cashReconciled: e.target.checked })} />
              1. Đã kiểm đếm két tiền mặt và đối soát chênh lệch ca thu ngân thành công.
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', color: '#111827' }}>
              <input type="checkbox" checked={eodChecked.stockLocked} onChange={(e) => setEodChecked({ ...eodChecked, stockLocked: e.target.checked })} />
              2. Đã khóa sổ kho nguyên liệu ngày và niêm phong tủ lạnh bảo quản.
            </label>
          </div>

          <button onClick={() => alert('Đã chốt EOD đóng cửa quán thành công! Báo cáo ngày đã gửi về Admin.')} style={{ marginTop: '24px', padding: '12px 24px', background: '#059669', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>HOÀN TẤT ĐÓNG CỬA QUÁN CUỐI NGÀY</button>
        </div>
      )}

      {/* VIEW 4: INCIDENTS */}
      {activeTab === 'manager-incidents' && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ fontSize: '20px', marginTop: 0, color: '#111827', fontWeight: 'bold' }}>Sổ Ghi Nhận Sự Cố & Khiếu Nại Khách Hàng</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px' }}>
            <thead>
              <tr style={{ background: '#F9FAFB', borderBottom: '2px solid #E5E7EB', textAlign: 'left' }}>
                <th style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>Mã Sự Cố</th>
                <th style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>Khách Hàng</th>
                <th style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>Nội Dung Phản Ánh</th>
                <th style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>Biện Pháp Xử Lý</th>
              </tr>
            </thead>
            <tbody>
              {incidents.map((inc) => (
                <tr key={inc.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#111827' }}>{inc.id}</td>
                  <td style={{ padding: '14px 12px', color: '#111827' }}>{inc.customer}</td>
                  <td style={{ padding: '14px 12px', color: '#DC2626' }}>{inc.issue}</td>
                  <td style={{ padding: '14px 12px', color: '#059669', fontWeight: 'bold' }}>{inc.resolution}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManagerOperationsPage;
