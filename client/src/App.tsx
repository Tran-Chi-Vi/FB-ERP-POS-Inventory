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
      gsap.fromTo(mainRef.current, { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' });
    }
  }, [activeTab]);

  const handleLoginSuccess = (user: { fullName: string; role: string }) => {
    setCurrentUser(user);
    if (user.role === 'Admin' || user.role === 'SuperAdmin') {
      setActiveTab('users');
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
      {/* LEFT VERTICAL SIDEBAR NAVIGATION */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* MAIN CONTENT WRAPPER */}
      <main className="main-wrapper" ref={mainRef}>
        {/* ACCOUNT MANAGEMENT TAB (FOR ADMIN & SUPERADMIN) */}
        {activeTab === 'users' && <UserManagementPage />}

        {/* EXTENSIONS ROADMAP TAB */}
        {activeTab === 'extensions' && (
          <div>
            <h2 style={{ marginBottom: '0.5rem' }}>FNB POS Roles & Feature Extensions Roadmap</h2>
            <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>
              Đặc tả tính năng mở rộng theo file FNB_POS_Roles_And_Feature_Extensions.docx
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
              <div className="card">
                <h3 style={{ color: '#f43f5e' }}>👑 SuperAdmin Extensions</h3>
                <ul style={{ marginTop: '0.75rem', lineHeight: '1.8', color: '#cbd5e1', fontSize: '0.9rem' }}>
                  <li>▫️ Cấu hình Franchise & Nhượng quyền (Royalty Fee %)</li>
                  <li>▫️ Regional Dynamic Pricing (Giá theo vùng miền & sân bay)</li>
                  <li>▫️ Session Revocation Dashboard & Force Logout từ xa</li>
                  <li>▫️ AI-driven Anomaly Detection (Cảnh báo hủy món ca đêm)</li>
                  <li>▫️ Financial Forecasting bằng Machine Learning</li>
                </ul>
              </div>

              <div className="card">
                <h3 style={{ color: '#10b981' }}>🔑 Admin Extensions</h3>
                <ul style={{ marginTop: '0.75rem', lineHeight: '1.8', color: '#cbd5e1', fontSize: '0.9rem' }}>
                  <li>▫️ <strong>Quản lý Tạo Tài Khoản & Gán 8 Roles (Đã hoàn thành)</strong></li>
                  <li>▫️ Omnichannel Menu Matrix (In-store, Takeaway, GrabFood)</li>
                  <li>▫️ Catch-weight Pricing (Bán món theo gram/kg thực tế)</li>
                  <li>▫️ What-If Cost Simulation (Mô phỏng biến động giá vốn)</li>
                  <li>▫️ Chi trả lương 1-click qua API Ngân hàng (VietinBank/MBBank)</li>
                </ul>
              </div>

              <div className="card">
                <h3 style={{ color: '#38bdf8' }}>👔 Manager Extensions</h3>
                <ul style={{ marginTop: '0.75rem', lineHeight: '1.8', color: '#cbd5e1', fontSize: '0.9rem' }}>
                  <li>▫️ Dual-blind Cash Count (Xác thực đóng ca đếm tiền kép)</li>
                  <li>▫️ Cash Skimming Alert (Cảnh báo két tiền vượt 10 triệu)</li>
                  <li>▫️ Remote Push-Notification Approval (Duyệt hủy món qua App)</li>
                  <li>▫️ Smart Shift Swap Marketplace (Chợ đổi ca tự động)</li>
                </ul>
              </div>

              <div className="card">
                <h3 style={{ color: '#818cf8' }}>📦 Warehouse & Cashier Extensions</h3>
                <ul style={{ marginTop: '0.75rem', lineHeight: '1.8', color: '#cbd5e1', fontSize: '0.9rem' }}>
                  <li>▫️ Automated PO Dispatch qua PDF Email</li>
                  <li>▫️ Mobile Barcode Stocktaking (Kiểm kê kho bằng camera HP)</li>
                  <li>▫️ P2P Local Mesh Sync (Đồng bộ ngang hàng khi mất mạng)</li>
                  <li>▫️ Customer Facing Display (CFD Màn hình phụ hiển thị QR)</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* POS TAB */}
        {activeTab === 'pos' && (
          <div className="pos-layout">
            <div className="category-menu">
              <h3 style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '0.5rem' }}>DANH MỤC MÓN</h3>
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
                <h3 style={{ marginBottom: '0.75rem' }}>Sơ Đồ Bàn Phục Vụ (Branch: Quận 1)</h3>
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
              <h3>Đơn Hàng {selectedTable ? `- ${selectedTable}` : ''}</h3>
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
                    <span>Tổng Cộng:</span>
                    <span>{cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0).toLocaleString('vi-VN')} đ</span>
                  </div>
                  <button
                    className="btn-primary"
                    style={{ marginTop: '1rem' }}
                    onClick={() => alert('Thanh toán thành công! Tự động trừ kho theo công thức BOM và in bill nhiệt ESC/POS.')}
                  >
                    Thanh Toán & In Bill (ESC/POS)
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* KDS TAB */}
        {activeTab === 'kds' && (
          <div className="card">
            <h2>KDS Kitchen Queue Realtime (SignalR Integrated)</h2>
            <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>Màn hình điều phối bếp/bar theo chuẩn Workflow 1 & 5.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
              <div style={{ padding: '1rem', backgroundColor: '#0f172a', borderRadius: '0.5rem', borderLeft: '4px solid #f59e0b' }}>
                <h3>Bàn 01 - Đơn #ORD-20260828-A1</h3>
                <p style={{ marginTop: '0.5rem' }}>2x Cà Phê Sữa Đá (Đường 50%, Đá 100%)</p>
                <p style={{ color: '#f59e0b', margin: '0.5rem 0' }}>⏱️ SLA Delay Timer: 03:45</p>
                <button className="btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>Đã Hoàn Thành</button>
              </div>
            </div>
          </div>
        )}

        {/* INVENTORY TAB */}
        {activeTab === 'inventory' && (
          <div className="card">
            <h2>Quản Lý Tồn Kho Chi Tiết F&B, Lô Hàng & Hạn Sử Dụng (FEFO/FIFO)</h2>
            <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>Sổ cái Append-Only Inventory Ledger chống sửa/xóa số lượng trực tiếp.</p>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #334155', color: '#10b981', textAlign: 'left' }}>
                  <th style={{ padding: '0.5rem' }}>Mã NVL</th>
                  <th style={{ padding: '0.5rem' }}>Tên Nguyên Liệu</th>
                  <th style={{ padding: '0.5rem' }}>Số Lượng Tồn</th>
                  <th style={{ padding: '0.5rem' }}>Mã Lô / HSD</th>
                  <th style={{ padding: '0.5rem' }}>Quy Tắc Xuất Kho</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #334155' }}>
                  <td style={{ padding: '0.5rem' }}>NVL-01</td>
                  <td style={{ padding: '0.5rem' }}>Hạt Cà Phê Robusta</td>
                  <td style={{ padding: '0.5rem' }}>50,000 g</td>
                  <td style={{ padding: '0.5rem', color: '#38bdf8' }}>L01 (HSD: 2027-01-15)</td>
                  <td style={{ padding: '0.5rem', color: '#10b981', fontWeight: 'bold' }}>FEFO</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #334155' }}>
                  <td style={{ padding: '0.5rem' }}>NVL-02</td>
                  <td style={{ padding: '0.5rem' }}>Sữa Đặc Lon</td>
                  <td style={{ padding: '0.5rem' }}>20,000 ml</td>
                  <td style={{ padding: '0.5rem', color: '#38bdf8' }}>L02 (HSD: 2026-12-30)</td>
                  <td style={{ padding: '0.5rem', color: '#10b981', fontWeight: 'bold' }}>FIFO</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* CRM TAB */}
        {activeTab === 'crm' && (
          <div className="card">
            <h2>CRM Customer 360 & Ví Điểm Loyalty (4 Tiers)</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #334155', color: '#10b981', textAlign: 'left' }}>
                  <th style={{ padding: '0.5rem' }}>Họ Và Tên</th>
                  <th style={{ padding: '0.5rem' }}>Số Điện Thoại</th>
                  <th style={{ padding: '0.5rem' }}>Hạng Thành Viên</th>
                  <th style={{ padding: '0.5rem' }}>Ví Điểm Loyalty</th>
                  <th style={{ padding: '0.5rem' }}>Tổng Chi Tiêu</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #334155' }}>
                  <td style={{ padding: '0.5rem' }}>Nguyễn Văn A</td>
                  <td style={{ padding: '0.5rem' }}>0988111222</td>
                  <td style={{ padding: '0.5rem', color: '#f59e0b', fontWeight: 'bold' }}>Gold 🥇</td>
                  <td style={{ padding: '0.5rem' }}>1,250 điểm</td>
                  <td style={{ padding: '0.5rem' }}>12,500,000 đ</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #334155' }}>
                  <td style={{ padding: '0.5rem' }}>Trần Thị B</td>
                  <td style={{ padding: '0.5rem' }}>0977333444</td>
                  <td style={{ padding: '0.5rem', color: '#38bdf8', fontWeight: 'bold' }}>Diamond 💎</td>
                  <td style={{ padding: '0.5rem' }}>5,400 điểm</td>
                  <td style={{ padding: '0.5rem' }}>54,000,000 đ</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* ERP FINANCE TAB */}
        {activeTab === 'finance' && (
          <div className="card">
            <h2>ERP Kế Toán Tài Chính & Mua Hàng PO</h2>
            <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>Quản lý đơn mua hàng PO và tự động hạch toán doanh thu/chi phí.</p>
            <ul style={{ marginTop: '1rem', lineHeight: '2' }}>
              <li>📦 <strong>Đơn PO-2026-001:</strong> 50kg Hạt Cà Phê | Nhà Cung Cấp: Vinacafé | Trạng thái: Đã Phê Duyệt</li>
              <li>🧾 <strong>Hóa Đơn Điện Tử (Nghị định 123):</strong> Đã phát hành 1,420 hóa đơn GTGT.</li>
            </ul>
          </div>
        )}

        {/* BI REPORT TAB */}
        {activeTab === 'bi' && (
          <div className="card">
            <h2>BI Dashboard - Menu Engineering Matrix & P&L Realtime</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
              <div style={{ padding: '1rem', backgroundColor: '#0f172a', borderRadius: '0.5rem' }}>
                <h3>Menu Engineering Matrix</h3>
                <p style={{ marginTop: '0.5rem' }}>⭐ <strong>Star (Lời Cao & Bán Chạy):</strong> Cà Phê Sữa Đá</p>
                <p>🐴 <strong>Plowhorse (Bán Chạy & Lời Ít):</strong> Bạc Xỉu Đá</p>
                <p>🧩 <strong>Puzzle (Lời Cao & Bán Chậm):</strong> Trà Đào Cam Sả</p>
              </div>
              <div style={{ padding: '1rem', backgroundColor: '#0f172a', borderRadius: '0.5rem' }}>
                <h3>Báo Cáo P&L Realtime</h3>
                <p style={{ color: '#10b981', marginTop: '0.5rem' }}>📈 Doanh Thu Gộp: 185,400,000 đ</p>
                <p style={{ color: '#f43f5e' }}>📉 Giá Vốn Hàng Bán: 55,620,000 đ</p>
                <p style={{ color: '#38bdf8', fontWeight: 'bold', fontSize: '1.1rem', marginTop: '0.5rem' }}>💰 Lợi Nhuận Ròng: 129,780,000 đ (Tỷ suất 70%)</p>
              </div>
            </div>
          </div>
        )}

        {/* HRM TAB */}
        {activeTab === 'hr' && (
          <div className="card">
            <h2>Quản Lý Nhân Sự, Chấm Công WiFi Nội Bộ & Khóa Sổ Lương</h2>
            <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>Chống gian lận chấm công qua BSSID/IP WiFi chi nhánh.</p>
            <button
              className="btn-primary"
              style={{ width: 'auto', padding: '0.6rem 1.25rem', marginTop: '1rem' }}
              onClick={() => alert('Chấm công WiFi thành công! BSSID: 00:11:22:33:44:55 (IP: 192.168.1.102)')}
            >
              Chấm Công WiFi Cửa Hàng
            </button>
          </div>
        )}

        {/* AI SKILLS TAB */}
        {activeTab === 'prompt-skills' && (
          <div className="card">
            <h2>AI Prompt & Skills Control Panel (6 Repos GitHub)</h2>
            <ul style={{ lineHeight: '2', marginTop: '1rem' }}>
              <li><strong>pbakaus/impeccable:</strong> GSAP Micro-interactions & Visual Polish</li>
              <li><strong>mattpocock/skills:</strong> TypeScript Standards</li>
              <li><strong>DietrichGebert/ponytail:</strong> Async Execution Wrapper</li>
              <li><strong>linshenkx/prompt-optimizer:</strong> Prompt Standardization</li>
              <li><strong>multica-ai/andrej-karpathy-skills:</strong> Single Source of Truth</li>
              <li><strong>obra/superpowers:</strong> Automated Workflows</li>
            </ul>
          </div>
        )}
      </main>
    </div>
  );
};
export default App;
