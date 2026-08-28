import React from 'react';

interface ManagerOperationsPageProps {
  activeTab: string;
}

export const ManagerOperationsPage: React.FC<ManagerOperationsPageProps> = ({ activeTab }) => {
  return (
    <div>
      {/* 1. HỘP THƯ PHÊ DUYỆT KHẨN CẤP */}
      {activeTab === 'manager-approvals' && (
        <div className="card">
          <h2>Manager Authorization Center (Thẩm Quyền Phê Duyệt Nghiệp Vụ Khẩn Cấp)</h2>
          <p style={{ color: '#94a3b8', marginTop: '0.25rem' }}>
            Duyệt hủy món sau khi gửi bếp, duyệt chiết khấu trên 5%, duyệt xuất hủy kho. Mọi thao tác ghi AuditLog.
          </p>

          <div style={{ padding: '1rem', background: '#0f172a', borderRadius: '0.5rem', marginTop: '1.25rem', borderLeft: '4px solid #f43f5e' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ color: '#f43f5e' }}>Yêu Cầu Hủy Món (Void Request #ORD-102)</h3>
                <p style={{ color: '#cbd5e1', marginTop: '0.25rem' }}>Người gửi: Thu Ngân (Nguyễn Thị Mai) | Món: 1x Trà Đào Cam Sả</p>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Lý do: Khách đổi ý sang Cà Phê | Trạng thái bếp: Đã gửi bếp (Chuyển thành phiếu Waste)</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn-primary" style={{ padding: '0.5rem 1rem' }} onClick={() => alert('Đã nhập mã PIN Quản lý và phê duyệt hủy món thành công!')}>
                  Duyệt Hủy Món (Cần Mã PIN)
                </button>
                <button style={{ padding: '0.5rem 1rem', background: '#334155', color: '#fff', border: 'none', borderRadius: '0.375rem', cursor: 'pointer' }}>Từ Chối</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. GIÁM SÁT VẬN HÀNH CHI NHÁNH */}
      {activeTab === 'manager-live-monitor' && (
        <div className="card">
          <h2>Branch Live Monitor (Giao Diện Giám Sát Chi Nhánh - Read Only)</h2>
          <p style={{ color: '#94a3b8', marginTop: '0.25rem' }}>Giám sát thu ngân, bếp và két tiền thời gian thực mà không can thiệp trực tiếp vào ca.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginTop: '1.25rem' }}>
            <div style={{ padding: '1rem', background: '#0f172a', borderRadius: '0.5rem', borderLeft: '4px solid #f43f5e' }}>
              <h3>Soi Ca Thu Ngân (Dual-Blind Cash Count)</h3>
              <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>Tiền thực đếm: 4.980.000đ | Tiền kỳ vọng hệ thống: 5.000.000đ</p>
              <span style={{ color: '#f43f5e', fontWeight: 'bold' }}>Lệch: -20.000đ (Bắt buộc giải trình)</span>
            </div>

            <div style={{ padding: '1rem', background: '#0f172a', borderRadius: '0.5rem', borderLeft: '4px solid #f59e0b' }}>
              <h3>Soi Nghẽn Bếp (Kitchen SLA Monitor)</h3>
              <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>Trạm Bar 01: 0 đơn trễ | Bếp Nóng: 1 đơn quá 12 phút (Cảnh báo nhấp nháy Đỏ)</p>
              <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>Cần điều phối hỗ trợ Bếp Nóng</span>
            </div>

            <div style={{ padding: '1rem', background: '#0f172a', borderRadius: '0.5rem', borderLeft: '4px solid #38bdf8' }}>
              <h3>Cảnh Báo Hạn Mức Tiền Két (Cash Skimming)</h3>
              <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>Tiền mặt trong két: 12.500.000đ (Vượt trần 10 triệuđ)</p>
              <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>Yêu cầu thu ngân rút bớt cất két sắt</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. XẾP LỊCH CA & DUYỆT PHÉP */}
      {activeTab === 'manager-scheduling' && (
        <div className="card">
          <h2>Xếp Lịch Ca Kéo Thả & Duyệt Phép (Drag & Drop Scheduler)</h2>
          <p style={{ color: '#94a3b8', marginTop: '0.25rem' }}>Tự động phát hiện xung đột trùng ca hoặc làm quá giờ quy định.</p>
          <div style={{ marginTop: '1.25rem', padding: '1.25rem', background: '#0f172a', borderRadius: '0.5rem' }}>
            <h4 style={{ color: '#10b981', marginBottom: '0.5rem' }}>Ma Trận Ca Tuần Này</h4>
            <p style={{ color: '#cbd5e1' }}>12 Nhân viên | Ca Sáng (6h-14h): 5 NV | Ca Tối (14h-22h): 7 NV</p>
          </div>
        </div>
      )}
    </div>
  );
};
