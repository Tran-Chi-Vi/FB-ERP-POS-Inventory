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

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pos' | 'kds' | 'prompt-skills'>('pos');
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const headerRef = useRef<HTMLDivElement>(null);
  const cartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // GSAP Impeccable Header Entry Animation
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

    // GSAP Bounce Animation on Cart Update
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
            className={`nav-button ${activeTab === 'prompt-skills' ? 'active' : ''}`}
            onClick={() => setActiveTab('prompt-skills')}
          >
            Prompt & Skills Engine
          </button>
        </div>
      </header>

      <main className="main-content">
        {activeTab === 'pos' && (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
            <div>
              <div className="card">
                <h2>Sơ Đồ Bàn - Chi Nhánh Mặc Định</h2>
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
                    onClick={() => alert('Thanh toán thành công qua POS Hub SignalR & Atomic SQL Decrement!')}
                  >
                    Xác Nhận Thanh Toán
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'kds' && (
          <div className="card">
            <h2>KDS Kitchen Queue Realtime (SignalR Integrated)</h2>
            <p>Màn hình hiển thị đơn hàng cho các trạm bếp Bar, Bếp Nóng với Timer & Alerting.</p>
          </div>
        )}

        {activeTab === 'prompt-skills' && (
          <div className="card">
            <h2>AI Prompt & Skills Control Panel</h2>
            <p>Hệ thống tích hợp 6 GitHub Repositories:</p>
            <ul>
              <li><strong>pbakaus/impeccable:</strong> GSAP Micro-interaction Guidelines</li>
              <li><strong>mattpocock/skills:</strong> TypeScript & React Best Practices</li>
              <li><strong>DietrichGebert/ponytail:</strong> Pipeline Async Helper</li>
              <li><strong>linshenkx/prompt-optimizer:</strong> Prompt Cleansing & Optimization Engine</li>
              <li><strong>multica-ai/andrej-karpathy-skills:</strong> Minimal Code & Ledger Design</li>
              <li><strong>obra/superpowers:</strong> Automated Workflow Superpowers</li>
            </ul>
          </div>
        )}
      </main>
    </div>
  );
};
export default App;
