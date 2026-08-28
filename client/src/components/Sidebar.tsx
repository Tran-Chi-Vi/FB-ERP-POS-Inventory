import React from 'react';

export interface SidebarProps {
  currentUser: { fullName: string; role: string } | null;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentUser, activeTab, onTabChange, onLogout }) => {
  if (!currentUser) return null;

  const role = currentUser.role;

  return (
    <aside style={{
      width: '280px',
      height: '100vh',
      position: 'fixed',
      top: 0,
      left: 0,
      background: '#FFFFFF',
      borderRight: '1px solid #E2E8F0',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      zIndex: 100,
      boxShadow: '1px 0 3px rgba(0, 0, 0, 0.05)'
    }}>
      <div>
        {/* BRAND LOGO HEADER */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid #E2E8F0', background: '#F8FAFC' }}>
          <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#2563EB', textTransform: 'uppercase', letterSpacing: '1px' }}>HỆ THỐNG QUẢN TRỊ F&B</span>
          <h1 style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A', margin: '4px 0 0 0' }}>QUẢN LÝ BÁN HÀNG & KHO</h1>
          <p style={{ fontSize: '12px', color: '#475569', margin: '2px 0 0 0' }}>Phiên bản Doanh Nghiệp v2.0</p>
        </div>

        {/* LOGGED IN USER CARD */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', background: '#FFFFFF' }}>
          <div style={{ fontSize: '11px', color: '#475569', textTransform: 'uppercase', fontWeight: '600' }}>Tài Khoản Đăng Nhập:</div>
          <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#0F172A', marginTop: '2px' }}>{currentUser.fullName}</div>
          <div style={{ fontSize: '13px', color: '#2563EB', fontWeight: '600' }}>Vai trò: {currentUser.role}</div>
        </div>

        {/* NAV ITEMS DRIVEN EXCLUSIVELY BY ROLE */}
        <div style={{ padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          
          <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748B', textTransform: 'uppercase', padding: '0 8px 8px 8px', letterSpacing: '0.5px' }}>
            DANH MỤC CHỨC NĂNG {role.toUpperCase()}
          </div>

          {/* CUSTOMER ROLE NAV ITEMS */}
          {role === 'Customer' && (
            <>
              <NavItem active={activeTab === 'customer-menu'} onClick={() => onTabChange('customer-menu')} label="Menu Gọi Món QR Tại Bàn" />
              <NavItem active={activeTab === 'customer-group'} onClick={() => onTabChange('customer-group')} label="Giỏ Hàng Nhóm Thời Gian Thực" />
              <NavItem active={activeTab === 'customer-split'} onClick={() => onTabChange('customer-split')} label="Công Cụ Tách Tiền Hóa Đơn" />
              <NavItem active={activeTab === 'customer-loyalty'} onClick={() => onTabChange('customer-loyalty')} label="Ví Điểm Thưởng Hội Viên" />
            </>
          )}

          {/* CASHIER ROLE NAV ITEMS */}
          {role === 'Cashier' && (
            <>
              <NavItem active={activeTab === 'pos'} onClick={() => onTabChange('pos')} label="Màn Hình Thu Ngân Bán Hàng" />
              <NavItem active={activeTab === 'cashier-pending'} onClick={() => onTabChange('cashier-pending')} label="Hàng Đợi Đơn QR Chờ Xác Nhận" />
              <NavItem active={activeTab === 'cashier-shift'} onClick={() => onTabChange('cashier-shift')} label="Giao Ca & Kiểm Tiền Két" />
              <NavItem active={activeTab === 'cashier-orders'} onClick={() => onTabChange('cashier-orders')} label="Lịch Sử Hóa Đơn & In Vé" />
            </>
          )}

          {/* STAFF ROLE NAV ITEMS */}
          {role === 'Staff' && (
            <>
              <NavItem active={activeTab === 'staff-runner'} onClick={() => onTabChange('staff-runner')} label="Danh Sách Phục Vụ Trả Món" />
              <NavItem active={activeTab === 'staff-tables'} onClick={() => onTabChange('staff-tables')} label="Sơ Đồ Bàn & Trạng Thái" />
              <NavItem active={activeTab === 'staff-attendance'} onClick={() => onTabChange('staff-attendance')} label="Chấm Công Mạng Nội Bộ" />
            </>
          )}

          {/* KITCHEN ROLE NAV ITEMS */}
          {role === 'Kitchen' && (
            <>
              <NavItem active={activeTab === 'kds-tickets'} onClick={() => onTabChange('kds-tickets')} label="Màn Hình Chế Biến Bếp & Bar" />
              <NavItem active={activeTab === 'kds-batch'} onClick={() => onTabChange('kds-batch')} label="Gom Món Chế Biến Mẻ Lớn" />
              <NavItem active={activeTab === 'kds-86'} onClick={() => onTabChange('kds-86')} label="Danh Sách Món Báo Hết" />
              <NavItem active={activeTab === 'kds-recipe'} onClick={() => onTabChange('kds-recipe')} label="Quy Trình & Định Lượng Chế Biến" />
              <NavItem active={activeTab === 'kds-history'} onClick={() => onTabChange('kds-history')} label="Lịch Sử Vé Chế Biến & SLA" />
            </>
          )}

          {/* WAREHOUSE ROLE NAV ITEMS */}
          {role === 'Warehouse' && (
            <>
              <NavItem active={activeTab === 'wh-inventory'} onClick={() => onTabChange('wh-inventory')} label="Quản Lý Tồn Kho Thực Tế" />
              <NavItem active={activeTab === 'wh-fefo'} onClick={() => onTabChange('wh-fefo')} label="Theo Dõi Hạn Sử Dụng Lô Hàng" />
              <NavItem active={activeTab === 'wh-receipt'} onClick={() => onTabChange('wh-receipt')} label="Phiếu Nhập Kho Chứng Từ" />
              <NavItem active={activeTab === 'wh-transfer'} onClick={() => onTabChange('wh-transfer')} label="Điều Chuyển Kho Chi Nhánh" />
              <NavItem active={activeTab === 'wh-srm'} onClick={() => onTabChange('wh-srm')} label="Danh Bạ Nhà Cung Cấp" />
            </>
          )}

          {/* MANAGER ROLE NAV ITEMS */}
          {role === 'Manager' && (
            <>
              <NavItem active={activeTab === 'manager-approvals'} onClick={() => onTabChange('manager-approvals')} label="Hộp Thư Phê Duyệt Mã PIN" />
              <NavItem active={activeTab === 'manager-payroll'} onClick={() => onTabChange('manager-payroll')} label="Kiểm Kê Lương & Giờ Công Nhân Sự" />
              <NavItem active={activeTab === 'manager-telemetry'} onClick={() => onTabChange('manager-telemetry')} label="Giám Sát Ca Làm & Két Tiền" />
              <NavItem active={activeTab === 'manager-eod'} onClick={() => onTabChange('manager-eod')} label="Danh Sách Đóng Cửa Cuối Ngày" />
              <NavItem active={activeTab === 'manager-incidents'} onClick={() => onTabChange('manager-incidents')} label="Nhật Ký Sự Cố & Khiếu Nại" />
            </>
          )}

          {/* ADMIN ROLE NAV ITEMS */}
          {role === 'Admin' && (
            <>
              <NavItem active={activeTab === 'admin-users'} onClick={() => onTabChange('admin-users')} label="Quản Lý Tài Khoản Nhân Sự" />
              <NavItem active={activeTab === 'admin-financials'} onClick={() => onTabChange('admin-financials')} label="Báo Cáo Thu Chi & Kiểm Kê Chi Nhánh" />
              <NavItem active={activeTab === 'admin-bom'} onClick={() => onTabChange('admin-bom')} label="Định Lượng Công Thức & Kiểm Tra DFS" />
              <NavItem active={activeTab === 'admin-happyhour'} onClick={() => onTabChange('admin-happyhour')} label="Tự Động Đổi Giá Giờ Vàng" />
              <NavItem active={activeTab === 'admin-payroll'} onClick={() => onTabChange('admin-payroll')} label="Khóa Sổ Bảng Lương Toàn Chuỗi" />
              <NavItem active={activeTab === 'admin-menu-eng'} onClick={() => onTabChange('admin-menu-eng')} label="Phân Tích Lợi Nhuận Món Ăn" />
            </>
          )}

          {/* SUPERADMIN ROLE NAV ITEMS */}
          {role === 'SuperAdmin' && (
            <>
              <NavItem active={activeTab === 'superadmin-users'} onClick={() => onTabChange('superadmin-users')} label="Quản Lý Tài Khoản Toàn Hệ Thống" />
              <NavItem active={activeTab === 'super-branches'} onClick={() => onTabChange('super-branches')} label="Quản Lý Chi Nhánh & Phí Sàn" />
              <NavItem active={activeTab === 'super-audit'} onClick={() => onTabChange('super-audit')} label="Nhật Ký Kiểm Toán Hệ Thống" />
              <NavItem active={activeTab === 'super-dr'} onClick={() => onTabChange('super-dr')} label="Trung Tâm Khôi Phục Thảm Họa" />
              <NavItem active={activeTab === 'super-broadcast'} onClick={() => onTabChange('super-broadcast')} label="Phát Thông Báo Khẩn Cấp" />
            </>
          )}

        </div>
      </div>

      {/* LOGOUT BUTTON */}
      <div style={{ padding: '16px', borderTop: '1px solid #E2E8F0', background: '#F8FAFC' }}>
        <button onClick={onLogout} style={{
          width: '100%',
          padding: '12px',
          background: '#DC2626',
          color: '#FFFFFF',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '14px',
          transition: 'all 0.2s ease'
        }}>
          Đăng Xuất Tài Khoản
        </button>
      </div>
    </aside>
  );
};

const NavItem: React.FC<{ active: boolean; onClick: () => void; label: string }> = ({ active, onClick, label }) => (
  <button onClick={onClick} style={{
    width: '100%',
    textAlign: 'left',
    padding: '12px 14px',
    background: active ? '#2563EB' : 'transparent',
    color: active ? '#FFFFFF' : '#334155',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: active ? 'bold' : '500',
    fontSize: '13px',
    transition: 'all 0.15s ease'
  }}>
    {label}
  </button>
);
