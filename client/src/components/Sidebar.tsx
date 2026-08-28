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
          <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#2563EB', textTransform: 'uppercase', letterSpacing: '1px' }}>ENTERPRISE ERP POS</span>
          <h1 style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A', margin: '4px 0 0 0' }}>F&B SUPER-APP</h1>
          <p style={{ fontSize: '12px', color: '#475569', margin: '2px 0 0 0' }}>System Engine v2.0</p>
        </div>

        {/* LOGGED IN USER CARD */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', background: '#FFFFFF' }}>
          <div style={{ fontSize: '11px', color: '#475569', textTransform: 'uppercase', fontWeight: '600' }}>Tài Khoản Đang Đăng Nhập:</div>
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
              <NavItem active={activeTab === 'customer-group'} onClick={() => onTabChange('customer-group')} label="Giỏ Hàng Nhóm Realtime" />
              <NavItem active={activeTab === 'customer-split'} onClick={() => onTabChange('customer-split')} label="Công Cụ Tách Tiền Hóa Đơn" />
              <NavItem active={activeTab === 'customer-loyalty'} onClick={() => onTabChange('customer-loyalty')} label="Ví Điểm Thưởng Hội Viên" />
            </>
          )}

          {/* CASHIER ROLE NAV ITEMS */}
          {role === 'Cashier' && (
            <>
              <NavItem active={activeTab === 'pos'} onClick={() => onTabChange('pos')} label="Màn Hình Thu Ngân POS" />
              <NavItem active={activeTab === 'cashier-shift'} onClick={() => onTabChange('cashier-shift')} label="Giao Ca & Kiểm Tiền Két" />
              <NavItem active={activeTab === 'cashier-orders'} onClick={() => onTabChange('cashier-orders')} label="Lịch Sử Hóa Đơn & In Vé" />
            </>
          )}

          {/* STAFF ROLE NAV ITEMS */}
          {role === 'Staff' && (
            <>
              <NavItem active={activeTab === 'staff-runner'} onClick={() => onTabChange('staff-runner')} label="Trả Món mPOS Runner Queue" />
              <NavItem active={activeTab === 'staff-tables'} onClick={() => onTabChange('staff-tables')} label="Sơ Đồ Bàn & Trạng Thái" />
              <NavItem active={activeTab === 'staff-attendance'} onClick={() => onTabChange('staff-attendance')} label="Chấm Công WiFi Geofence" />
            </>
          )}

          {/* KITCHEN ROLE NAV ITEMS */}
          {role === 'Kitchen' && (
            <>
              <NavItem active={activeTab === 'kds-tickets'} onClick={() => onTabChange('kds-tickets')} label="Màn Hình Chế Biến KDS" />
              <NavItem active={activeTab === 'kds-batch'} onClick={() => onTabChange('kds-batch')} label="Gom Món Batch Cooking" />
              <NavItem active={activeTab === 'kds-86'} onClick={() => onTabChange('kds-86')} label="Khóa Món 86-List Matrix" />
              <NavItem active={activeTab === 'kds-recipe'} onClick={() => onTabChange('kds-recipe')} label="Quy Trình & Định Lượng BOM" />
              <NavItem active={activeTab === 'kds-history'} onClick={() => onTabChange('kds-history')} label="Lịch Sử Vé & SLA Chế Biến" />
            </>
          )}

          {/* WAREHOUSE ROLE NAV ITEMS */}
          {role === 'Warehouse' && (
            <>
              <NavItem active={activeTab === 'wh-inventory'} onClick={() => onTabChange('wh-inventory')} label="Tồn Kho Thực Tế" />
              <NavItem active={activeTab === 'wh-fefo'} onClick={() => onTabChange('wh-fefo')} label="Bảng Theo Dõi Date Lô FEFO" />
              <NavItem active={activeTab === 'wh-receipt'} onClick={() => onTabChange('wh-receipt')} label="Nhập Kho Goods Receipt" />
              <NavItem active={activeTab === 'wh-transfer'} onClick={() => onTabChange('wh-transfer')} label="Điều Chuyển Kho Chi Nhánh" />
              <NavItem active={activeTab === 'wh-srm'} onClick={() => onTabChange('wh-srm')} label="Danh Bạ Nhà Cung Cấp SRM" />
            </>
          )}

          {/* MANAGER ROLE NAV ITEMS */}
          {role === 'Manager' && (
            <>
              <NavItem active={activeTab === 'manager-approvals'} onClick={() => onTabChange('manager-approvals')} label="Hộp Thư Phê Duyệt PIN" />
              <NavItem active={activeTab === 'manager-payroll'} onClick={() => onTabChange('manager-payroll')} label="Kiểm Kê Lương & Giờ IN/OUT" />
              <NavItem active={activeTab === 'manager-telemetry'} onClick={() => onTabChange('manager-telemetry')} label="Branch Live Monitor" />
              <NavItem active={activeTab === 'manager-eod'} onClick={() => onTabChange('manager-eod')} label="Checklist Đóng Cửa EOD" />
              <NavItem active={activeTab === 'manager-incidents'} onClick={() => onTabChange('manager-incidents')} label="Nhật Ký Sự Cố Khiếu Nại" />
            </>
          )}

          {/* ADMIN ROLE NAV ITEMS */}
          {role === 'Admin' && (
            <>
              <NavItem active={activeTab === 'admin-users'} onClick={() => onTabChange('admin-users')} label="Quản Lý Tài Khoản Nhân Sự" />
              <NavItem active={activeTab === 'admin-bom'} onClick={() => onTabChange('admin-bom')} label="BOM Recipe Engine & DFS" />
              <NavItem active={activeTab === 'admin-happyhour'} onClick={() => onTabChange('admin-happyhour')} label="Happy Hour Dynamic Pricing" />
              <NavItem active={activeTab === 'admin-payroll'} onClick={() => onTabChange('admin-payroll')} label="Khóa Sổ Bảng Lương Toàn Chuỗi" />
              <NavItem active={activeTab === 'admin-menu-eng'} onClick={() => onTabChange('admin-menu-eng')} label="Food Cost & Menu Engineering" />
            </>
          )}

          {/* SUPERADMIN ROLE NAV ITEMS */}
          {role === 'SuperAdmin' && (
            <>
              <NavItem active={activeTab === 'superadmin-users'} onClick={() => onTabChange('superadmin-users')} label="Tài Khoản Toàn Chuỗi" />
              <NavItem active={activeTab === 'super-branches'} onClick={() => onTabChange('super-branches')} label="Quản Lý Chi Nhánh & Phí" />
              <NavItem active={activeTab === 'super-audit'} onClick={() => onTabChange('super-audit')} label="Centralized Audit Log JSON" />
              <NavItem active={activeTab === 'super-dr'} onClick={() => onTabChange('super-dr')} label="Disaster Recovery Console" />
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
