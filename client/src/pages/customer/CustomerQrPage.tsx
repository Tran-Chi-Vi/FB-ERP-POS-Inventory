import React, { useState } from 'react';

export const CustomerQrPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('Cà Phê');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [size, setSize] = useState('M');
  const [sweetness, setSweetness] = useState('50%');
  const [ice, setIce] = useState('100%');
  const [notes, setNotes] = useState('');
  const [cart, setCart] = useState<any[]>([]);
  const [serviceCooldown, setServiceCooldown] = useState(0);

  const categories = ['Cà Phê', 'Trà Sữa', 'Món Ăn Vặt', 'Topping Kèm'];

  const products = [
    { id: '1', name: 'Cà Phê Sữa Đá', price: 29000, category: 'Cà Phê', status: 'Bán Chạy', img: '☕' },
    { id: '2', name: 'Bạc Xỉu Đá', price: 32000, category: 'Cà Phê', status: 'Còn Hàng', img: '🥤' },
    { id: '3', name: 'Trà Đào Cam Sả', price: 39000, category: 'Trà Sữa', status: 'Còn Hàng', img: '🍑' },
    { id: '4', name: 'Trà Sữa Ô Long', price: 42000, category: 'Trà Sữa', status: 'Bán Chạy', img: '🧋' },
  ];

  const handleAddToCart = () => {
    if (!selectedProduct) return;
    const item = {
      product: selectedProduct,
      size,
      sweetness,
      ice,
      notes,
      totalPrice: selectedProduct.price + (size === 'L' ? 5000 : 0)
    };
    setCart(prev => [...prev, item]);
    setSelectedProduct(null);
  };

  const triggerServiceCall = (type: string) => {
    if (serviceCooldown > 0) {
      alert(`Vui lòng đợi ${serviceCooldown} giây trước khi gửi yêu cầu tiếp theo.`);
      return;
    }
    alert(`Đã gửi yêu cầu '${type}' đến nhân viên phục vụ bàn Bàn 01!`);
    setServiceCooldown(60);
    const interval = setInterval(() => {
      setServiceCooldown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h2>Menu Điện Tử Bàn 01 (Dynamic QR Session)</h2>
          <span style={{ color: '#10b981', fontSize: '0.85rem' }}>✓ Kết nối WiFi nội bộ quán (BSSID: 00:11:22:33:44:55)</span>
        </div>

        {/* SERVICE CALL BUTTONS */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} onClick={() => triggerServiceCall('Gọi Nhân Viên')}>
            🔔 Gọi Phục Vụ
          </button>
          <button style={{ padding: '0.4rem 0.8rem', background: '#334155', color: '#fff', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', fontSize: '0.85rem' }} onClick={() => triggerServiceCall('Xin Thêm Đá / Nước')}>
            🧊 Xin Thêm Đá
          </button>
          <button style={{ padding: '0.4rem 0.8rem', background: '#38bdf8', color: '#fff', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', fontSize: '0.85rem' }} onClick={() => triggerServiceCall('Yêu Cầu Thanh Toán')}>
            💳 Gọi Thanh Toán
          </button>
        </div>
      </div>

      {/* CATEGORY TABS */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
        {categories.map(c => (
          <button
            key={c}
            className={`category-btn ${selectedCategory === c ? 'active' : ''}`}
            onClick={() => setSelectedCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {/* PRODUCT CARDS */}
      <div className="product-grid">
        {products.filter(p => p.category === selectedCategory).map(p => (
          <div key={p.id} className="product-card" onClick={() => setSelectedProduct(p)}>
            <div>
              <div style={{ fontSize: '2rem' }}>{p.img}</div>
              <span style={{ fontSize: '0.75rem', color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '0.1rem 0.4rem', borderRadius: '0.2rem' }}>
                {p.status}
              </span>
              <h4 style={{ marginTop: '0.5rem' }}>{p.name}</h4>
            </div>
            <div className="product-price" style={{ marginTop: '0.75rem' }}>{p.price.toLocaleString('vi-VN')} đ</div>
          </div>
        ))}
      </div>

      {/* MODIFIER MODAL */}
      {selectedProduct && (
        <div className="auth-overlay">
          <div className="auth-modal">
            <h3 style={{ color: '#10b981', marginBottom: '1rem' }}>{selectedProduct.name}</h3>

            <div className="form-group">
              <label>Chọn Size</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {['S', 'M (+0đ)', 'L (+5.000đ)'].map(s => (
                  <button key={s} type="button" className={`category-btn ${size === s.charAt(0) ? 'active' : ''}`} onClick={() => setSize(s.charAt(0))}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Độ Ngọt</label>
              <select className="form-control" value={sweetness} onChange={e => setSweetness(e.target.value)}>
                {['0%', '30%', '50%', '70%', '100%'].map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Mức Đá</label>
              <select className="form-control" value={ice} onChange={e => setIce(e.target.value)}>
                {['Không đá', '30% đá', '50% đá', '100% đá'].map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Ghi Chú Đặc Biệt</label>
              <input type="text" className="form-control" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Ví dụ: Ít ngọt, không hành..." />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
              <button className="btn-primary" style={{ flex: 1 }} onClick={handleAddToCart}>Thêm Vào Giỏ (Soft Reservation TTL 10m)</button>
              <button style={{ padding: '0.75rem', background: '#334155', color: '#fff', border: 'none', borderRadius: '0.5rem' }} onClick={() => setSelectedProduct(null)}>Hủy</button>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING CART DRAWER */}
      {cart.length > 0 && (
        <div style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', background: '#1e293b', border: '2px solid #10b981', borderRadius: '0.75rem', padding: '1.25rem', width: '320px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
          <h3 style={{ color: '#10b981' }}>Giỏ Hàng Bàn 01 ({cart.length} món)</h3>
          {cart.map((c, idx) => (
            <div key={idx} style={{ fontSize: '0.85rem', margin: '0.5rem 0', borderBottom: '1px solid #334155', paddingBottom: '0.4rem' }}>
              <strong>{c.product.name} (Size {c.size})</strong> - {c.sweetness} đường, {c.ice}
              <div style={{ color: '#10b981' }}>{c.totalPrice.toLocaleString('vi-VN')} đ</div>
            </div>
          ))}
          <button className="btn-primary" style={{ marginTop: '0.75rem' }} onClick={() => { alert('Đơn hàng đã được gửi xuống KDS Bếp!'); setCart([]); }}>
            Xác Nhận Gửi Đơn Xuống Bếp
          </button>
        </div>
      )}
    </div>
  );
};
