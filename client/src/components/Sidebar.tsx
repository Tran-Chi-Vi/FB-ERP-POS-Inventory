import React from 'react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: { fullName: string; role: string };
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onLogout,
}) => {
  const getTabsForRole = (role: string) => {
    switch (role) {
      case 'Customer':
        return [
          { id: 'customer-menu', label: 'Menu Điện Tử & Đặt Món' },
          { id: 'customer-group', label: 'Giỏ Hàng Nhóm Realtime' },
          { id: 'customer-split', label: 'Chia Hóa Đơn Bàn' },
          { id: 'customer-loyalty', label: 'Ví Điểm & Đổi Quà' },
        ];
      case 'Staff':
        return [
          { id: 'staff-tables', label: 'Sơ Đồ Bàn Ăn & mPOS' },
          { id: 'staff-runner', label: 'Hàng Đợi Trả Món Ready' },
          { id: 'staff-attendance', label: 'Chấm Công Selfie WiFi' },
        ];
      case 'Kitchen':
        return [
          { id: 'kds-tickets', label: 'Màn Hình Chế Biến KDS' },
          { id: 'kds-batch', label: 'Gom Món Batch Cooking' },
          { id: 'kds-86', label: 'Khóa Món 86-List Matrix' },
        ];
      case 'Cashier':
        return [
          { id: 'pos', label: 'Thu Ngân POS & Sơ Đồ Bàn' },
          { id: 'cashier-shift', label: 'Đóng / Mở Ca Thu Ngân' },
        ];
      case 'Warehouse':
        return [
          { id: 'wh-inventory', label: 'Tồn Kho Thực Tế' },
          { id: 'wh-fefo', label: 'Bảng Theo Dõi Date Lô FEFO' },
          { id: 'wh-receipt', label: 'Nhập Kho Goods Receipt' },
          { id: 'wh-transfer', label: 'Điều Chuyển Kho Chi Nhánh' },
          { id: 'wh-srm', label: 'Danh Bạ Nhà Cung Cấp SRM' },
        ];
      case 'Manager':
        return [
          { id: 'manager-approvals', label: 'Hộp Thư Phê Duyệt PIN' },
          { id: 'manager-telemetry', label: 'Branch Live Monitor' },
          { id: 'manager-eod', label: 'Checklist Đóng Cửa EOD' },
          { id: 'manager-incidents', label: 'Nhật Ký Sự Cố Khiếu Nại' },
        ];
      case 'Admin':
        return [
          { id: 'users', label: 'Quản Lý Tài Khoản Nhân Sự' },
          { id: 'admin-bom', label: 'BOM Recipe Engine & DFS' },
          { id: 'admin-happyhour', label: 'Happy Hour Dynamic Pricing' },
          { id: 'admin-payroll', label: 'Khóa Sổ Bảng Lương' },
          { id: 'admin-menu-eng', label: 'Food Cost & Menu Engineering' },
        ];
      case 'SuperAdmin':
        return [
          { id: 'users', label: 'Tài Khoản Toàn Chuỗi' },
          { id: 'super-branches', label: 'Quản Lý Chi Nhánh & Phí' },
          { id: 'super-audit', label: 'Centralized Audit Log JSON' },
          { id: 'super-dr', label: 'Disaster Recovery Console' },
          { id: 'super-broadcast', label: 'Phát Thông Báo Khẩn Cấp' },
        ];
      default:
        return [];
    }
  };

  const tabs = getTabsForRole(currentUser.role);

  return (
    <aside style={{ width: '280px', background: '#111827', color: '#F3F4F6', height: '100vh', display: 'flex', flexDirection: 'column', borderRight: '1px solid #1F2937', position: 'fixed', left: 0, top: 0, overflowY: 'auto' }}>
      {/* App Branding */}
      <div style={{ padding: '20px', borderBottom: '1px solid #1F2937' }}>
        <div style={{ fontSize: '11px', background: '#374151', color: '#9CA3AF', padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase', tracking: '1px', width: 'fit-content', marginBottom: '6px' }}>
          ENTERPRISE ERP POS
        </div>
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#FFFFFF' }}>F&B SUPER-APP</h2>
        <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#9CA3AF' }}>System Engine v2.0</p>
      </div>

      {/* User Info Header */}
      <div style={{ padding: '16px', borderBottom: '1px solid #1F2937', background: '#1F2937' }}>
        <div style={{ fontSize: '12px', color: '#9CA3AF' }}>TÀI KHOẢN ĐANG ĐĂNG NHẬP:</div>
        <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#FFFFFF', marginTop: '2px' }}>{currentUser.fullName}</div>
        <div style={{ fontSize: '12px', color: '#10B981', marginTop: '2px' }}>Vai trò: <strong>{currentUser.role}</strong></div>
      </div>

      {/* Feature Menu List */}
      <div style={{ padding: '16px 12px', flex: 1 }}>
        <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#6B7280', marginBottom: '10px', paddingLeft: '8px', fontWeight: 'bold' }}>
          DANH MỤC CHỨC NĂNG {currentUser.role.toUpperCase()}
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '10px 14px',
                  background: isActive ? '#2563EB' : 'transparent',
                  color: isActive ? '#FFFFFF' : '#9CA3AF',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: isActive ? 'bold' : 'normal',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease-in-out',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Logout Button */}
      <div style={{ padding: '16px', borderTop: '1px solid #1F2937' }}>
        <button
          onClick={onLogout}
          style={{
            width: '100%',
            padding: '10px',
            background: '#DC2626',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          Đăng Xuất Tài Khoản
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
