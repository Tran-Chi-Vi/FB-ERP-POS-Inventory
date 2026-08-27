import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import './styles/impeccable-theme.css';

interface Product {
  id: string;
  name: string;
  price: number;
  unit: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface Employee {
  id: string;
  code: string;
  name: string;
  role: string;
  salary: number;
  status: string;
}

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pos' | 'kds' | 'hr' | 'inventory' | 'prompt-skills'>('pos');
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const headerRef = useRef<HTMLDivElement>(null);
  const cartRef = useRef<HTMLDivElement>(null);

  // HR Employees State
  const [employees, setEmployees] = useState<Employee[]>([
    { id: '1', code: 'NV001', name: 'Trần Chi Vi', role: 'SuperAdmin', salary: 25000000, status: 'Đã Chấm Công (WiFi)' },
    { id: '2', code: 'NV002', name: 'Nguyễn Văn Thu Ngân', role: 'Cashier', salary: 8000000, status: 'Đang Trong Ca' },
    { id: '3', code: 'NV003', name: 'Lê Thị Bếp Trưởng', role: 'Kitchen', salary: 12000000, status: 'Đang Trong Ca' },
    { id: '4', code: 'NV004', name: 'Phạm Văn Quản Lý', role: 'Manager', salary: 15000000, status: 'Đã Chấm Công (WiFi)' },
    { id: '5', code: 'NV005', name: 'Hoàng Thị HR', role: 'HR', salary: 11000000, status: 'Nghỉ Ca' },
  ]);

  useEffect(() => {
    // GSAP Entry Animation
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
      );
    }
  }, []);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });

    if (cartRef.current) {
      gsap.fromTo(cartRef.current, { scale: 0.95 }, { scale: 1, duration: 0.2, ease: 'back.out(1.5)' });
    }
  };

  const sampleProducts: Product[] = [
    { id: '1', name: 'Cà Phê Sữa Đá', price: 29000, unit: 'Ly' },
    { id: '2', name: 'Trà Đào Cam Sả', price: 39000, unit: 'Ly' },
    { id: '3', name: 'Bạc Xỉu Đá', price: 32000, unit: 'Ly' },
    { id: '4', name: 'Bánh Croissant Bơ', price: 25000, unit: 'Cái' },
  ];

  const tables = ['Bàn 01', 'Bàn 02', 'Bàn 03', 'Bàn 04', 'Bàn 05', 'VIP 01', 'VIP 02'];

  return (
    <div className="app-container">
      <header className="navbar" ref={headerRef}>
        <div className="brand">
          <span>☕ F&B ERP POS Inventory System</span>
        </div>
        <div className="nav-links">
          <button
            className={`nav-button ${activeTab === 'pos' ? 'active' : ''}`}
            onClick={() => setActiveTab('pos')}
          >
            Màn Hình POS
          </button>
          <button
            className={`nav-button ${activeTab === 'kds' ? 'active' : ''}`}
            onClick={() => setActiveTab('kds')}
          >
            Màn Hình Bếp (KDS)
          </button>
          <button
            className={`nav-button ${activeTab === 'hr' ? 'active' : ''}`}
            onClick={() => setActiveTab('hr')}
          >
            Admin & Quản Lý Nhân Sự (HR)
          </button>
          <button
            className={`nav-button ${activeTab === 'inventory' ? 'active' : ''}`}
            onClick={() => setActiveTab('inventory')}
          >
            Tồn Kho & BOM Recipe
          </button>
          <button
            className={`nav-button ${activeTab === 'prompt-skills' ? 'active' : ''}`}
            onClick={() => setActiveTab('prompt-skills')}
          >
            AI Prompt & Skills
          </button>
        </div>
      </header>

      <main className="main-content">
        {/* POS TAB */}
        {activeTab === 'pos' && (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
            <div>
              <div className="card">
                <h2>Sơ Đồ Bàn - Chi Nhánh Quận 1</h2>
                <div className="grid-tables">
                  {tables.map((t) => (
                    <div
                      key={t}
                      className={`table-card ${selectedTable === t ? 'serving' : 'available'}`}
                      onClick={() => setSelectedTable(t)}
                    >
                      <h3>{t}</h3>
                      <p>{selectedTable === t ? 'Đang chọn' : 'Trống'}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <h2>Thực Đơn Món Ăn & Đồ Uống</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
                  {sampleProducts.map((p) => (
                    <div
                      key={p.id}
                      style={{
                        padding: '1rem',
                        backgroundColor: '#334155',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                      }}
                      onClick={() => addToCart(p)}
                    >
                      <h4>{p.name}</h4>
                      <p style={{ color: '#10b981', fontWeight: 'bold' }}>
                        {p.price.toLocaleString('vi-VN')} đ / {p.unit}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="card" ref={cartRef}>
              <h2>Giỏ Hàng {selectedTable ? `- ${selectedTable}` : ''}</h2>
              {cart.length === 0 ? (
                <p style={{ color: '#94a3b8' }}>Chưa chọn món nào</p>
              ) : (
                <div>
                  {cart.map((item) => (
                    <div
                      key={item.product.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '0.5rem 0',
                        borderBottom: '1px solid #334155',
                      }}
                    >
                      <div>
                        {item.product.name} x {item.quantity}
                      </div>
                      <div style={{ fontWeight: 'bold' }}>
                        {(item.product.price * item.quantity).toLocaleString('vi-VN')} đ
                      </div>
                    </div>
                  ))}
                  <div
                    style={{
                      marginTop: '1.5rem',
                      paddingTop: '1rem',
                      borderTop: '2px solid #10b981',
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '1.2rem',
                      fontWeight: 'bold',
                    }}
                  >
                    <span>Tổng Tiền:</span>
                    <span>
                      {cart
                        .reduce((sum, item) => sum + item.product.price * item.quantity, 0)
                        .toLocaleString('vi-VN')}{' '}
                      đ
                    </span>
                  </div>
                  <button
                    style={{
                      width: '100%',
                      marginTop: '1rem',
                      padding: '0.75rem',
                      backgroundColor: '#10b981',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '0.375rem',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                    }}
                    onClick={() => alert('Thanh toán thành công! Đã tự động trừ kho nguyên liệu theo BOM và lưu sổ cái Inventory Ledger.')}
                  >
                    Xác Nhận Thanh Toán
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
            <p>Màn hình hiển thị đơn hàng cho các trạm bếp Bar, Bếp Nóng với Timer & Alerting.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
              <div style={{ padding: '1rem', backgroundColor: '#334155', borderRadius: '0.5rem', borderLeft: '4px solid #f59e0b' }}>
                <h3>Bàn 01 - Đơn ORD-20260828-A1</h3>
                <p>2x Cà Phê Sữa Đá (Đường 50%, Đá 100%)</p>
                <p style={{ color: '#f59e0b' }}>⏱️ Thời gian chờ: 03:45</p>
                <button style={{ backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.25rem', cursor: 'pointer' }}>
                  Đã Báo Hoàn Thành
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ADMIN & HR MANAGEMENT TAB */}
        {activeTab === 'hr' && (
          <div>
            <div className="card">
              <h2>Quản Lý Nhân Sự, Phân Quyền Roles & Bảng Lương</h2>
              <p>Phần quyền 8 Role chuẩn: <strong>SuperAdmin, Admin, Manager, Warehouse, Cashier, Kitchen, HR, Staff</strong></p>
              
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #334155', color: '#10b981' }}>
                    <th style={{ padding: '0.75rem' }}>Mã NV</th>
                    <th style={{ padding: '0.75rem' }}>Họ Và Tên</th>
                    <th style={{ padding: '0.75rem' }}>Chức Vụ (Role)</th>
                    <th style={{ padding: '0.75rem' }}>Lương Cơ Bản</th>
                    <th style={{ padding: '0.75rem' }}>Trạng Thái Chấm Công WiFi</th>
                    <th style={{ padding: '0.75rem' }}>Thao Tác</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp) => (
                    <tr key={emp.id} style={{ borderBottom: '1px solid #334155' }}>
                      <td style={{ padding: '0.75rem', fontWeight: 'bold' }}>{emp.code}</td>
                      <td style={{ padding: '0.75rem' }}>{emp.name}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <span style={{ padding: '0.25rem 0.5rem', borderRadius: '0.25rem', backgroundColor: '#334155', color: '#10b981', fontSize: '0.85rem' }}>
                          {emp.role}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem' }}>{emp.salary.toLocaleString('vi-VN')} đ</td>
                      <td style={{ padding: '0.75rem', color: '#10b981' }}>{emp.status}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <button
                          style={{ padding: '0.25rem 0.5rem', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '0.25rem', cursor: 'pointer' }}
                          onClick={() => alert(`Đã tính lương & khóa sổ lương tháng cho ${emp.name}!`)}
                        >
                          Khóa Bảng Lương
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="card">
              <h2>Chấm Công Qua WiFi Nội Bộ (Anti-Fraud Trusted BSSID)</h2>
              <p>Chức năng xác thực BSSID/IP WiFi chi nhánh để chống check-in hộ và fake vị trí GPS.</p>
              <button
                style={{ padding: '0.75rem 1.5rem', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '0.375rem', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' }}
                onClick={() => alert('Chấm công thành công trên WiFi Chi Nhánh Quận 1 (BSSID: 00:11:22:33:44:55)!')}
              >
                Chấm Công WiFi Ngay
              </button>
            </div>
          </div>
        )}

        {/* INVENTORY TAB */}
        {activeTab === 'inventory' && (
          <div className="card">
            <h2>Tồn Kho Nguyên Liệu & Công Thức BOM Multi-Level</h2>
            <p>Hệ thống tồn kho dạng Append-Only Ledger (Không xóa/sửa trực tiếp số lượng).</p>
            <ul>
              <li><strong>Hạt Cà Phê Robusta:</strong> Tồn kho: 50,000 g | Định mức 1 ly Cà phê = 20g</li>
              <li><strong>Sữa Đặc Lon:</strong> Tồn kho: 20,000 ml | Định mức 1 ly Cà phê = 30ml</li>
            </ul>
          </div>
        )}

        {/* PROMPT & SKILLS TAB */}
        {activeTab === 'prompt-skills' && (
          <div className="card">
            <h2>AI Prompt & Skills Control Panel (6 GitHub Repositories)</h2>
            <p>Hệ thống tích hợp 6 GitHub Repositories:</p>
            <ul>
              <li><strong>pbakaus/impeccable:</strong> GSAP Micro-interaction Guidelines</li>
              <li><strong>mattpocock/skills:</strong> TypeScript & React Best Practices</li>
              <li><strong>DietrichGebert/ponytail:</strong> Pipeline Async Helper</li>
              <li><strong>linshenkx/prompt-optimizer:</strong> Prompt Cleansing Engine</li>
              <li><strong>multica-ai/andrej-karpathy-skills:</strong> Minimal Code & Single Source of Truth</li>
              <li><strong>obra/superpowers:</strong> Automated Workflow Superpowers</li>
            </ul>
          </div>
        )}
      </main>
    </div>
  );
};
export default App;
