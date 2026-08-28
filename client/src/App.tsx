import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import './styles/impeccable-theme.css';
import { Sidebar } from './components/Sidebar';
import { LoginPage } from './pages/auth/LoginPage';
import { UserManagementPage } from './pages/admin/UserManagementPage';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  unit: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

export const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<{ fullName: string; role: string } | null>(null);
  const [activeTab, setActiveTab] = useState<string>('pos');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất Cả');
  const [selectedTable, setSelectedTable] = useState<string | null>('Bàn 01');
  const [cart, setCart] = useState<CartItem[]>([]);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mainRef.current) {
      gsap.fromTo(mainRef.current, { opacity: 0, x: 15 }, { opacity: 1, x: 0, duration: 0.35, ease: 'power2.out' });
    }
  }, [activeTab, currentUser]);

  const handleLoginSuccess = (user: { fullName: string; role: string }) => {
    setCurrentUser(user);
    // Automatically route user to their dedicated role UI
    switch (user.role) {
      case 'Kitchen':
        setActiveTab('kds');
        break;
      case 'Staff':
        setActiveTab('staff-runner');
        break;
      case 'Cashier':
        setActiveTab('pos');
        break;
      case 'Warehouse':
        setActiveTab('inventory');
        break;
      case 'Manager':
        setActiveTab('manager-dash');
        break;
      case 'Admin':
      case 'SuperAdmin':
        setActiveTab('users');
        break;
      case 'Customer':
        setActiveTab('customer-qr');
        break;
      default:
        setActiveTab('pos');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const categories = ['Tất Cả', 'Cà Phê', 'Trà & Trà Sữa', 'Bánh Ngọt', 'Toppings'];

  const products: Product[] = [
    { id: '1', name: 'Cà Phê Sữa Đá', price: 29000, category: 'Cà Phê', unit: 'Ly' },
    { id: '2', name: 'Bạc Xỉu Đá', price: 32000, category: 'Cà Phê', unit: 'Ly' },
    { id: '3', name: 'Espresso Intenso', price: 35000, category: 'Cà Phê', unit: 'Tách' },
    { id: '4', name: 'Trà Đào Cam Sả', price: 39000, category: 'Trà & Trà Sữa', unit: 'Ly' },
    { id: '5', name: 'Trà Sữa Ô Long', price: 42000, category: 'Trà & Trà Sữa', unit: 'Ly' },
    { id: '6', name: 'Bánh Croissant Bơ', price: 25000, category: 'Bánh Ngọt', unit: 'Cái' },
    { id: '7', name: 'Bánh Tiramisu', price: 38000, category: 'Bánh Ngọt', unit: 'Cái' },
    { id: '8', name: 'Trân Châu Đen', price: 8000, category: 'Toppings', unit: 'Phần' },
  ];

  const filteredProducts = selectedCategory === 'Tất Cả' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) => (item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const tables = ['Bàn 01', 'Bàn 02', 'Bàn 03', 'Bàn 04', 'Bàn 05', 'VIP 01', 'VIP 02'];

  if (!currentUser) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="app-layout">
      {/* LEFT VERTICAL SIDEBAR NAVIGATION (STRICT ROLE ISOLATED, NO EMOJI ICONS) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* MAIN CONTENT WRAPPER */}
      <main className="main-wrapper" ref={mainRef}>
        {/* 1. KITCHEN UI (Role: Kitchen) - NO PRICES / NO REVENUE */}
        {activeTab === 'kds' && (
          <div className="card">
            <h2>KDS Kitchen Screen (Màn Hình Điều Phối Bếp)</h2>
            <p style={{ color: '#94a3b8', marginTop: '0.25rem' }}>
              Dành riêng cho Đầu bếp & Pha chế. Chữ to, đếm giây SLA, tuyệt đối KHÔNG có giá tiền hay doanh thu.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '1.25rem' }}>
              <div style={{ padding: '1.25rem', backgroundColor: '#0f172a', borderRadius: '0.5rem', borderLeft: '4px solid #f59e0b' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <h3 style={{ fontSize: '1.2rem' }}>Bàn 01 - Đơn #ORD-102</h3>
                  <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>03:45 SLA</span>
                </div>
                <ul style={{ margin: '1rem 0', fontSize: '1.1rem', lineHeight: '1.8' }}>
                  <li>2x Cà Phê Sữa Đá (Đường 50%, Đá 100%)</li>
                  <li>1x Bánh Croissant Bơ</li>
                </ul>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn-primary" style={{ padding: '0.5rem 1rem' }}>Xác Nhận Nấu</button>
                  <button style={{ padding: '0.5rem 1rem', background: '#f43f5e', color: '#fff', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', fontWeight: 'bold' }}>Báo Hết Món (86 List)</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. STAFF RUNNER UI (Role: Staff) */}
        {activeTab === 'staff-runner' && (
          <div className="card">
            <h2>Staff Runner App (Phục Vụ Bàn & Gọi Món)</h2>
            <p style={{ color: '#94a3b8', marginTop: '0.25rem' }}>
              Dành cho nhân viên chạy bàn. Xem tiến độ món trong bếp và trả món ra bàn. Không thu tiền hoặc sửa tồn kho.
            </p>
            <div style={{ marginTop: '1.25rem' }}>
              <div style={{ padding: '1rem', background: '#0f172a', borderRadius: '0.5rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ color: '#10b981' }}>Bàn 01 - Món Đã Xong (Ready to Serve)</h3>
                  <p style={{ color: '#cbd5e1', marginTop: '0.25rem' }}>2x Cà Phê Sữa Đá -&gt; Trạm Bar 01</p>
                </div>
                <button className="btn-primary" style={{ width: 'auto', padding: '0.5rem 1.25rem' }}>Đã Phục Vụ (Served)</button>
              </div>
            </div>
          </div>
        )}

        {/* 3. CASHIER UI (Role: Cashier) */}
        {activeTab === 'pos' && (
          <div className="pos-layout">
            <div className="category-menu">
              <h3 style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.5rem' }}>DANH MỤC MÓN</h3>
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div>
              <div className="card" style={{ marginBottom: '1rem' }}>
                <h3 style={{ marginBottom: '0.75rem' }}>Sơ Đồ Bàn Phục Vụ</h3>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {tables.map((t) => (
                    <button
                      key={t}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '0.375rem',
                        border: '1px solid #334155',
                        background: selectedTable === t ? '#10b981' : '#0f172a',
                        color: selectedTable === t ? '#fff' : '#94a3b8',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                      onClick={() => setSelectedTable(t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="product-grid">
                {filteredProducts.map((p) => (
                  <div key={p.id} className="product-card" onClick={() => addToCart(p)}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: '#38bdf8', background: 'rgba(56,189,248,0.1)', padding: '0.1rem 0.4rem', borderRadius: '0.2rem' }}>
                        {p.category}
                      </span>
                      <div className="product-title" style={{ marginTop: '0.5rem' }}>{p.name}</div>
                    </div>
                    <div className="product-price">{p.price.toLocaleString('vi-VN')} đ</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h3>Giỏ Hàng {selectedTable ? `- ${selectedTable}` : ''}</h3>
              {cart.length === 0 ? (
                <p style={{ color: '#94a3b8', marginTop: '1rem' }}>Chưa chọn món nào</p>
              ) : (
                <div style={{ marginTop: '1rem' }}>
                  {cart.map((item) => (
                    <div key={item.product.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #334155' }}>
                      <div>{item.product.name} x {item.quantity}</div>
                      <div style={{ fontWeight: 'bold', color: '#10b981' }}>{(item.product.price * item.quantity).toLocaleString('vi-VN')} đ</div>
                    </div>
                  ))}
                  <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '2px solid #10b981', display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 'bold' }}>
                    <span>Tổng Tiền:</span>
                    <span>{cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0).toLocaleString('vi-VN')} đ</span>
                  </div>
                  <button
                    className="btn-primary"
                    style={{ marginTop: '1rem' }}
                    onClick={() => alert('Thanh toán thành công! Tự động trừ kho theo công thức BOM và phát hành HĐĐT.')}
                  >
                    Thanh Toán VietQR / Tiền Mặt
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 4. WAREHOUSE UI (Role: Warehouse) */}
        {activeTab === 'inventory' && (
          <div className="card">
            <h2>WMS Desktop (Quản Lý Kho & Lô Date FEFO)</h2>
            <p style={{ color: '#94a3b8', marginTop: '0.25rem' }}>Dành riêng cho Thủ kho. Quản lý PO, nhập kho, kiểm kê và theo dõi lô date FEFO.</p>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1.25rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #334155', color: '#10b981', textAlign: 'left' }}>
                  <th style={{ padding: '0.75rem' }}>Tên Nguyên Liệu</th>
                  <th style={{ padding: '0.75rem' }}>Số Lượng Tồn</th>
                  <th style={{ padding: '0.75rem' }}>Mã Lô Hạn Dùng</th>
                  <th style={{ padding: '0.75rem' }}>Quy Tắc FEFO</th>
                  <th style={{ padding: '0.75rem' }}>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #334155' }}>
                  <td style={{ padding: '0.75rem' }}>Hạt Cà Phê Robusta</td>
                  <td style={{ padding: '0.75rem' }}>50,000 g</td>
                  <td style={{ padding: '0.75rem', color: '#38bdf8' }}>L01 (HSD: 2027-01-15)</td>
                  <td style={{ padding: '0.75rem', color: '#10b981', fontWeight: 'bold' }}>Ưu tiên xuất trước</td>
                  <td style={{ padding: '0.75rem' }}>
                    <button className="btn-primary" style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem' }}>Tạo Phiếu Kiểm Kê</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* 5. MANAGER OPERATIONS VIEW (Role: Manager) */}
        {activeTab === 'manager-dash' && (
          <div>
            <div className="card">
              <h2>Manager Operations Dashboard (Giao Diện Giám Sát Ca Quản Lý)</h2>
              <p style={{ color: '#94a3b8', marginTop: '0.25rem' }}>
                Cửa sổ kiểm soát chi nhánh: Soi thu ngân (chênh lệch ca), soi bếp (SLA nghẽn), soi kho (cận date).
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginTop: '1.25rem' }}>
                <div style={{ padding: '1rem', background: '#0f172a', borderRadius: '0.5rem' }}>
                  <h3>Soi Ca Thu Ngân (Dual-Blind Shift Audit)</h3>
                  <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>Két thu ngân ca sáng: Khai báo 5,000,000 đ | Thực tế: 4,980,000 đ</p>
                  <span style={{ color: '#f43f5e', fontWeight: 'bold' }}>Lệch: -20,000 đ</span>
                </div>
                <div style={{ padding: '1rem', background: '#0f172a', borderRadius: '0.5rem' }}>
                  <h3>Soi Nghẽn Bếp (Kitchen SLA Bottleneck)</h3>
                  <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>Trạm Bar 01: 0 đơn quá SLA | Bếp Nóng: 1 đơn quá 10 phút</p>
                  <span style={{ color: '#10b981', fontWeight: 'bold' }}>Vận hành bình thường</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'manager-void' && (
          <div className="card">
            <h2>Duyệt Khẩn Cấp (Emergency Void & Discount Approvals)</h2>
            <p style={{ color: '#94a3b8', marginTop: '0.25rem' }}>Thẩm quyền sinh sát: Duyệt hủy món sau khi gửi bếp, duyệt bồi hoàn và xuất hủy kho.</p>
            <div style={{ padding: '1rem', background: '#0f172a', borderRadius: '0.5rem', marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3>Yêu Cầu Hủy Món #ORD-102 (Thu Ngân: Nguyễn Thị Mai)</h3>
                <p style={{ color: '#94a3b8' }}>Món: 1x Trà Đào Cam Sả | Lý do: Khách đổi ý sang Cà Phê</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn-primary" style={{ padding: '0.5rem 1rem' }}>Duyệt Hủy Món</button>
                <button style={{ padding: '0.5rem 1rem', background: '#334155', color: '#fff', border: 'none', borderRadius: '0.375rem', cursor: 'pointer' }}>Từ Chối</button>
              </div>
            </div>
          </div>
        )}

        {/* 6. USER MANAGEMENT (Role: Admin & SuperAdmin) */}
        {activeTab === 'users' && <UserManagementPage />}

        {/* ADMIN ERP PANEL (Role: Admin) */}
        {activeTab === 'catalog-bom' && (
          <div className="card">
            <h2>Cấu Hình Menu Master Data & Công Thức Định Lượng BOM</h2>
            <p style={{ color: '#94a3b8', marginTop: '0.25rem' }}>Cài đặt công thức pha chế đa tầng (BOM Engine) và ma trận Topping.</p>
            <ul style={{ lineHeight: '2', marginTop: '1rem' }}>
              <li>☕ <strong>1 ly Cà Phê Sữa Đá BOM:</strong> 30ml Cà Phê cốt + 40ml Sữa đặc + 150g Đá viên.</li>
              <li>🍰 <strong>1 bánh Tiramisu BOM:</strong> 50g Bột Mì + 30g Bơ + 20g Phô mai Mascarpone.</li>
            </ul>
          </div>
        )}

        {activeTab === 'finance-payroll' && (
          <div className="card">
            <h2>ERP Tài Chính, Khóa Sổ Lương & Hạch Toán P&L</h2>
            <p style={{ color: '#94a3b8', marginTop: '0.25rem' }}>Phê duyệt bảng lương tháng và khóa sổ chống chỉnh sửa trực tiếp.</p>
            <button className="btn-primary" style={{ width: 'auto', padding: '0.6rem 1.25rem', marginTop: '1rem' }}>
              Khóa Sổ Bảng Lương Tháng Hiện Tại
            </button>
          </div>
        )}

        {/* 7. SUPERADMIN CONSOLE (Role: SuperAdmin) */}
        {activeTab === 'branch-admin' && (
          <div className="card">
            <h2>System Console - Quản Lý Đa Chi Nhánh Hợp Nhất</h2>
            <p style={{ color: '#94a3b8', marginTop: '0.25rem' }}>Quản lý chi nhánh trực thuộc & chi nhánh nhượng quyền (Franchise).</p>
            <ul style={{ lineHeight: '2', marginTop: '1rem' }}>
              <li>📍 <strong>Chi nhánh Q1 (Trực thuộc):</strong> Doanh thu hôm nay: 45,200,000 đ</li>
              <li>📍 <strong>Chi nhánh Q7 (Franchise):</strong> Doanh thu hôm nay: 38,100,000 đ (Trích 5% phí bản quyền)</li>
            </ul>
          </div>
        )}

        {activeTab === 'audit-log' && (
          <div className="card">
            <h2>Centralized Audit Log (Nhật Ký Kiểm Toán Toàn Chuỗi)</h2>
            <p style={{ color: '#94a3b8', marginTop: '0.25rem' }}>Xem vết mọi hành động nhạy cảm toàn hệ thống có dấu thời gian nguyên tử.</p>
            <ul style={{ lineHeight: '2', marginTop: '1rem', fontSize: '0.9rem', color: '#cbd5e1' }}>
              <li>[2026-08-28 20:15:02] [ADMIN] [Trần Chí Vĩ] Tạo tài khoản mới 'manager1' role Manager.</li>
              <li>[2026-08-28 20:20:11] [MANAGER] [Lê Hoàng Phúc] Duyệt hủy món ORD-102.</li>
            </ul>
          </div>
        )}

        {/* 8. CUSTOMER UI (Role: Customer) */}
        {activeTab === 'customer-qr' && (
          <div className="card">
            <h2>Thực Đơn Điện Tử Dynamic QR (Giao Diện Khách Hàng)</h2>
            <p style={{ color: '#94a3b8', marginTop: '0.25rem' }}>Khách tự chọn món tại bàn, tùy biến đường/đá và gửi đơn trực tiếp vào bếp.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
              {products.map((p) => (
                <div key={p.id} style={{ padding: '1rem', background: '#0f172a', borderRadius: '0.5rem', border: '1px solid #334155' }}>
                  <h4>{p.name}</h4>
                  <p style={{ color: '#10b981', fontWeight: 'bold', marginTop: '0.5rem' }}>{p.price.toLocaleString('vi-VN')} đ</p>
                  <button className="btn-primary" style={{ padding: '0.3rem', fontSize: '0.8rem', marginTop: '0.5rem' }}>Thêm Vào Đơn</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
export default App;
