import React, { useState, useEffect } from 'react';

interface CustomerQrPageProps {
  activeTab: string;
}

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
}

interface GroupCartItem {
  id: string;
  customerName: string;
  itemName: string;
  quantity: number;
  price: number;
}

interface PaidOrderConfirmation {
  orderId: string;
  table: string;
  items: { name: string; quantity: number; price: number }[];
  totalAmount: number;
  pagerId: string; // Mã Thẻ Rung IoT
  timestamp: string;
}

export const CustomerQrPage: React.FC<CustomerQrPageProps> = ({ activeTab }) => {
  const tableSession = 'Bàn 04';
  const currentUserFullName = 'Trần Chí Vĩ';

  // 1. MENU ITEMS
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất Cả');
  const [cart, setCart] = useState<{ [id: string]: number }>({});
  const menuItems: MenuItem[] = [
    { id: '1', name: 'Cà Phê Sữa Đá Sài Gòn', price: 29000, category: 'Cà Phê' },
    { id: '2', name: 'Bạc Xỉu Đá Ngọt Dịu', price: 32000, category: 'Cà Phê' },
    { id: '3', name: 'Trà Đào Cam Sả Tươi', price: 39000, category: 'Trà & Trà Sữa' },
    { id: '4', name: 'Trà Sữa Ô Long Kem Trứng', price: 42000, category: 'Trà & Trà Sữa' },
    { id: '5', name: 'Bánh Croissant Bơ Bơ', price: 25000, category: 'Bánh Ngọt' },
    { id: '6', name: 'Bánh Tiramisu Ý', price: 38000, category: 'Bánh Ngọt' },
  ];

  // 2. REALTIME GROUP CART
  const [groupCart, setGroupCart] = useState<GroupCartItem[]>(() => {
    const saved = localStorage.getItem('fnb_group_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('fnb_group_cart', JSON.stringify(groupCart));
  }, [groupCart]);

  // 3. IOT PAGER DEVICE ASSIGNMENT & ORDER CONFIRMATION MODAL
  const [selectedPagerId, setSelectedPagerId] = useState<string>('PAGER-05');
  const [confirmedOrder, setConfirmedOrder] = useState<PaidOrderConfirmation | null>(null);

  // 4. SPLIT BILL CALCULATOR
  const [splitPeople, setSplitPeople] = useState<number>(1);

  // 5. LOYALTY WALLET
  const [loyaltyPoints, setLoyaltyPoints] = useState<number>(1250);
  const [membershipTier] = useState<string>('Hạng Vàng (Giảm 10%)');

  const categories = ['Tất Cả', 'Cà Phê', 'Trà & Trà Sữa', 'Bánh Ngọt'];
  const filteredMenu = selectedCategory === 'Tất Cả' ? menuItems : menuItems.filter(i => i.category === selectedCategory);

  const handleAddToCart = (item: MenuItem) => {
    setCart(prev => ({ ...prev, [item.id]: (prev[item.id] || 0) + 1 }));

    setGroupCart(prev => {
      const existing = prev.find(g => g.itemName === item.name);
      if (existing) {
        return prev.map(g => g.itemName === item.name ? { ...g, quantity: g.quantity + 1 } : g);
      }
      return [...prev, { id: Date.now().toString(), customerName: currentUserFullName, itemName: item.name, quantity: 1, price: item.price }];
    });
  };

  const handleIncreaseGroupQuantity = (id: string) => {
    setGroupCart(prev => prev.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item));
  };

  const handleDecreaseGroupQuantity = (id: string) => {
    setGroupCart(prev => prev.map(item => {
      if (item.id === id) {
        return item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : null;
      }
      return item;
    }).filter(Boolean) as GroupCartItem[]);
  };

  const handleRemoveGroupItem = (id: string) => {
    setGroupCart(prev => prev.filter(item => item.id !== id));
  };

  const handlePayAndSendToKitchenWithIotPager = () => {
    if (groupCart.length === 0) {
      alert('Giỏ hàng trống! Vui lòng chọn món trước khi đặt đơn.');
      return;
    }

    const totalAmount = groupCart.reduce((sum, item) => sum + item.quantity * item.price, 0);
    const orderId = `HD-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: PaidOrderConfirmation = {
      orderId: orderId,
      table: tableSession,
      items: groupCart.map(g => ({ name: g.itemName, quantity: g.quantity, price: g.price })),
      totalAmount: totalAmount,
      pagerId: selectedPagerId,
      timestamp: new Date().toLocaleTimeString('vi-VN')
    };

    // 1. Direct-push ticket to KDS Kitchen
    const existingKds = JSON.parse(localStorage.getItem('fnb_kds_tickets') || '[]');
    const newKdsTicket = {
      id: `TK-${Math.floor(100 + Math.random() * 900)}`,
      orderNo: orderId,
      table: tableSession,
      pagerId: selectedPagerId, // Mã Thẻ Rung IoT
      station: 'Barista',
      timeElapsedMinutes: 1,
      slaStatus: 'Normal',
      items: groupCart.map(g => ({ id: g.id, name: g.itemName, quantity: g.quantity, note: `Thẻ Rung IoT: ${selectedPagerId}` }))
    };
    localStorage.setItem('fnb_kds_tickets', JSON.stringify([newKdsTicket, ...existingKds]));

    // 2. Add 5% loyalty points
    const earnedPoints = Math.round((totalAmount * 0.05) / 100);
    setLoyaltyPoints(prev => prev + earnedPoints);

    // 3. Open order & IoT Pager confirmation modal
    setConfirmedOrder(newOrder);

    // 4. Clear active group cart & local cart
    setGroupCart([]);
    setCart({});
    localStorage.removeItem('fnb_group_cart');
  };

  const groupTotal = groupCart.reduce((sum, item) => sum + item.quantity * item.price, 0);

  return (
    <div style={{ width: '100%', maxWidth: '100%', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* HEADER BANNER */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '16px 24px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <span style={{ fontSize: '11px', color: '#2563EB', fontWeight: 'bold', textTransform: 'uppercase' }}>GỌI MÓN MÃ QR TẠI BÀN</span>
          <h2 style={{ margin: '2px 0 0 0', fontSize: '18px', color: '#0F172A', fontWeight: 'bold' }}>Phiên Phục Vụ: {tableSession}</h2>
        </div>
        <div style={{ background: '#DCFCE7', color: '#166534', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', border: '1px solid #A7F3D0' }}>
          Đã xác thực WiFi nội bộ
        </div>
      </div>

      {/* 1. VIEW 1: QR MENU (NO BOTTOM CONFIRM BUTTON - MOVED EXCLUSIVELY TO CART) */}
      {(activeTab === 'customer-menu' || activeTab === 'customer') && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '24px' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '4px' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '8px 16px',
                  background: selectedCategory === cat ? '#2563EB' : '#F1F5F9',
                  color: selectedCategory === cat ? '#fff' : '#475569',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '13px'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
            {filteredMenu.map((item) => (
              <div key={item.id} style={{ border: '1px solid #E2E8F0', background: '#F8FAFC', borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '11px', color: '#2563EB', background: '#DBEAFE', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>{item.category}</span>
                  <h3 style={{ margin: '8px 0 4px 0', fontSize: '16px', color: '#0F172A', fontWeight: 'bold' }}>{item.name}</h3>
                  <div style={{ fontSize: '15px', color: '#059669', fontWeight: 'bold', marginBottom: '12px' }}>{item.price.toLocaleString('vi-VN')}đ</div>
                </div>
                <button
                  onClick={() => handleAddToCart(item)}
                  style={{ width: '100%', padding: '10px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
                >
                  + Thêm Vào Giỏ {cart[item.id] ? `(${cart[item.id]})` : ''}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. VIEW 2: GROUP CART & IOT PAGER WORKFLOW */}
      {activeTab === 'customer-group' && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ fontSize: '20px', marginTop: 0, color: '#0F172A', fontWeight: 'bold' }}>Giỏ Hàng Nhóm Thời Gian Thực & Thẻ Rung IoT</h2>
          <p style={{ color: '#475569', fontSize: '13px', marginBottom: '20px' }}>Kiểm tra các món trong giỏ, điều chỉnh số lượng và chọn Thẻ Rung IoT để hoàn tất đặt đơn & thanh toán.</p>

          {groupCart.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#64748B', background: '#F8FAFC', borderRadius: '8px', marginBottom: '20px' }}>
              Giỏ hàng nhóm đang trống. Vui lòng quay lại Menu để chọn món!
            </div>
          ) : (
            <div style={{ width: '100%', overflowX: 'auto', marginBottom: '20px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0', textAlign: 'left' }}>
                    <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Thành Viên</th>
                    <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Món Đã Chọn</th>
                    <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Đơn Giá</th>
                    <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Tăng / Giảm Số Lượng</th>
                    <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Thành Tiền</th>
                    <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Thao Tác</th>
                  </tr>
                </thead>
                <tbody>
                  {groupCart.map((item) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#2563EB' }}>{item.customerName}</td>
                      <td style={{ padding: '14px 12px', color: '#0F172A', fontWeight: 'bold' }}>{item.itemName}</td>
                      <td style={{ padding: '14px 12px', color: '#475569' }}>{item.price.toLocaleString('vi-VN')}đ</td>
                      <td style={{ padding: '14px 12px' }}>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                          <button onClick={() => handleDecreaseGroupQuantity(item.id)} style={{ padding: '2px 8px', background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>-</button>
                          <span style={{ fontWeight: 'bold', width: '24px', textAlign: 'center', color: '#0F172A' }}>{item.quantity}</span>
                          <button onClick={() => handleIncreaseGroupQuantity(item.id)} style={{ padding: '2px 8px', background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>+</button>
                        </div>
                      </td>
                      <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#059669' }}>{(item.quantity * item.price).toLocaleString('vi-VN')}đ</td>
                      <td style={{ padding: '14px 12px' }}>
                        <button onClick={() => handleRemoveGroupItem(item.id)} style={{ padding: '6px 12px', background: '#FEE2E2', color: '#DC2626', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>Xóa Món</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* IOT PAGER SELECTION BLOCK */}
          <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0', marginBottom: '20px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#0F172A' }}>Gán Thẻ Rung IoT Nhận Món (Wireless Pager ID):</label>
            <select value={selectedPagerId} onChange={(e) => setSelectedPagerId(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '6px', color: '#0F172A', fontWeight: 'bold' }}>
              <option value="PAGER-01">Thẻ Rung IoT #01</option>
              <option value="PAGER-02">Thẻ Rung IoT #02</option>
              <option value="PAGER-03">Thẻ Rung IoT #03</option>
              <option value="PAGER-04">Thẻ Rung IoT #04</option>
              <option value="PAGER-05">Thẻ Rung IoT #05 (Mặc Định)</option>
              <option value="PAGER-06">Thẻ Rung IoT #06</option>
            </select>
          </div>

          <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <span style={{ fontSize: '14px', color: '#475569' }}>TỔNG TIỀN THANH TOÁN: </span>
              <strong style={{ fontSize: '22px', color: '#059669' }}>{groupTotal.toLocaleString('vi-VN')}đ</strong>
            </div>
            <button onClick={handlePayAndSendToKitchenWithIotPager} style={{ padding: '12px 24px', background: '#059669', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
              XÁC NHẬN ĐẶT ĐƠN & THANH TOÁN VỚI THẺ RUNG IOT
            </button>
          </div>
        </div>
      )}

      {/* 3. VIEW 3: SPLIT BILL CALCULATOR */}
      {activeTab === 'customer-split' && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ fontSize: '20px', marginTop: 0, color: '#0F172A', fontWeight: 'bold' }}>Công Cụ Tính Tách Tiền Hóa Đơn Chia Đều</h2>
          <p style={{ color: '#475569', fontSize: '13px', marginBottom: '20px' }}>Chia đều tổng tiền hóa đơn cho số lượng người tại bàn một cách công bằng.</p>

          <div style={{ background: '#F8FAFC', padding: '20px', borderRadius: '8px', border: '1px solid #E2E8F0', maxWidth: '500px' }}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#0F172A', marginBottom: '6px' }}>Tổng Tiền Hóa Đơn Bàn:</label>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#059669' }}>{groupTotal.toLocaleString('vi-VN')}đ</div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#0F172A', marginBottom: '6px' }}>Số Lượng Người Chia:</label>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button onClick={() => setSplitPeople(Math.max(1, splitPeople - 1))} style={{ padding: '8px 16px', background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>-</button>
                <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#0F172A', width: '40px', textAlign: 'center' }}>{splitPeople}</span>
                <button onClick={() => setSplitPeople(splitPeople + 1)} style={{ padding: '8px 16px', background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>+</button>
              </div>
            </div>

            <div style={{ background: '#DBEAFE', padding: '16px', borderRadius: '6px', border: '1px solid #BFDBFE' }}>
              <div style={{ fontSize: '13px', color: '#1E40AF' }}>Mỗi Người Cần Trả (Mỗi Phần):</div>
              <div style={{ fontSize: '26px', fontWeight: 'bold', color: '#1E40AF', marginTop: '4px' }}>
                {groupTotal > 0 ? Math.round(groupTotal / splitPeople).toLocaleString('vi-VN') : 0}đ / người
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. VIEW 4: LOYALTY WALLET */}
      {activeTab === 'customer-loyalty' && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ fontSize: '20px', marginTop: 0, color: '#0F172A', fontWeight: 'bold' }}>Ví Điểm Thưởng & Hạng Thẻ Hội Viên</h2>
          <p style={{ color: '#475569', fontSize: '13px', marginBottom: '20px' }}>Mọi giao dịch thanh toán thành công đều tự động tích điểm 5% giá trị hóa đơn vào ví hội viên.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <div style={{ background: '#FEF3C7', border: '1px solid #F59E0B', padding: '20px', borderRadius: '8px' }}>
              <span style={{ fontSize: '12px', color: '#92400E', fontWeight: 'bold' }}>HẠNG THẺ HỘI VIÊN</span>
              <h3 style={{ margin: '8px 0 4px 0', fontSize: '18px', color: '#78350F', fontWeight: 'bold' }}>{membershipTier}</h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#92400E' }}>Ưu đãi chiết khấu trực tiếp 10% trên tổng bill</p>
            </div>

            <div style={{ background: '#ECFDF5', border: '1px solid #10B981', padding: '20px', borderRadius: '8px' }}>
              <span style={{ fontSize: '12px', color: '#065F46', fontWeight: 'bold' }}>TỔNG ĐIỂM TÍCH LŨY</span>
              <h3 style={{ margin: '8px 0 4px 0', fontSize: '28px', color: '#047857', fontWeight: 'bold' }}>{loyaltyPoints} Điểm</h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#065F46' }}>Tương đương {(loyaltyPoints * 100).toLocaleString('vi-VN')}đ khi đổi quà/thanh toán</p>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMED ORDER & IOT PAGER MODAL */}
      {confirmedOrder && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', maxWidth: '520px', width: '100%', textAlign: 'center' }}>
            <div style={{ background: '#DCFCE7', color: '#166534', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto', fontSize: '24px', fontWeight: 'bold' }}>✓</div>
            <h3 style={{ margin: '0 0 6px 0', color: '#0F172A', fontSize: '20px', fontWeight: 'bold' }}>ĐÃ THANH TOÁN & TẠO ĐƠN CHẾ BIẾN BẾP</h3>
            <p style={{ fontSize: '13px', color: '#475569', margin: '0 0 16px 0' }}>Mã hóa đơn: <strong>{confirmedOrder.orderId}</strong> | {confirmedOrder.table} | {confirmedOrder.timestamp}</p>

            <div style={{ background: '#FEF3C7', border: '2px solid #F59E0B', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
              <span style={{ fontSize: '12px', color: '#92400E', fontWeight: 'bold' }}>MÃ THẺ RUNG IOT CỦA QUÝ KHÁCH:</span>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#DC2626', letterSpacing: '2px', margin: '4px 0' }}>{confirmedOrder.pagerId}</div>
              <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#059669' }}>Tổng tiền đã trả: {confirmedOrder.totalAmount.toLocaleString('vi-VN')} đ (In Hóa Đơn ESC/POS)</div>
            </div>

            <div style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', padding: '12px', borderRadius: '6px', textAlign: 'left', marginBottom: '20px', fontSize: '12px', color: '#475569' }}>
              <strong>QUY TRÌNH NHẬN MÓN BẰNG THẺ RUNG IOT:</strong>
              <ol style={{ margin: '4px 0 0 0', paddingLeft: '20px' }}>
                <li>Đơn hàng đã được tự động chuyển đến màn hình <strong>Bếp / Barista</strong>.</li>
                <li>Khi Bếp chế biến xong và bấm hoàn tất, <strong>Thẻ Rung IoT {confirmedOrder.pagerId}</strong> sẽ phát chuông kêu Beep Beep và nhấp nháy đèn.</li>
                <li>Quý khách vui lòng cầm <strong>{confirmedOrder.pagerId}</strong> đến quầy để nhận món!</li>
              </ol>
            </div>

            <button onClick={() => setConfirmedOrder(null)} style={{ padding: '10px 24px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
              ĐÓNG THÔNG BÁO & GIỮ THẺ RUNG
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default CustomerQrPage;
