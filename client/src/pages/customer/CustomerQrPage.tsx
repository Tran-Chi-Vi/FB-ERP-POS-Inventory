import React, { useState } from 'react';

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
  customerName: string;
  itemName: string;
  quantity: number;
  price: number;
}

interface LoyaltyTransaction {
  date: string;
  type: 'Earned' | 'Spent';
  points: number;
  orderNo: string;
}

export const CustomerQrPage: React.FC<CustomerQrPageProps> = ({ activeTab }) => {
  const tableSession = 'Bàn 04 - Mạng WiFi Nội Bộ';

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

  // 2. GROUP CART REALTIME & KDS INTEGRATION
  const [groupCart, setGroupCart] = useState<GroupCartItem[]>([
    { customerName: 'Khách 1 (Bạn)', itemName: 'Cà Phê Sữa Đá Sài Gòn', quantity: 2, price: 29000 },
    { customerName: 'Khách 2 (Minh)', itemName: 'Trà Đào Cam Sả Tươi', quantity: 1, price: 39000 },
    { customerName: 'Khách 3 (Lan)', itemName: 'Bánh Croissant Bơ', quantity: 1, price: 25000 },
  ]);

  // 3. SPLIT BILL CALCULATOR
  const [splitPeople, setSplitPeople] = useState<number>(3);

  // 4. LOYALTY WALLET LINKED TO ORDERS
  const [loyaltyPoints, setLoyaltyPoints] = useState<number>(1250);
  const [membershipTier] = useState<string>('Hạng Vàng (Giảm 10%)');
  const [loyaltyHistory, setLoyaltyHistory] = useState<LoyaltyTransaction[]>([
    { date: '2026-08-28', type: 'Earned', points: 185, orderNo: 'ORD-9921' },
    { date: '2026-08-25', type: 'Earned', points: 120, orderNo: 'ORD-9910' },
    { date: '2026-08-20', type: 'Spent', points: -500, orderNo: 'ORD-9850' },
  ]);

  const categories = ['Tất Cả', 'Cà Phê', 'Trà & Trà Sữa', 'Bánh Ngọt'];
  const filteredMenu = selectedCategory === 'Tất Cả' ? menuItems : menuItems.filter(i => i.category === selectedCategory);

  const handleAddToCart = (id: string) => {
    setCart({ ...cart, [id]: (cart[id] || 0) + 1 });
  };

  const handleSendOrderToKitchen = () => {
    const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
    if (totalItems === 0) {
      alert('Vui lòng chọn ít nhất 1 món trước khi gửi đơn!');
      return;
    }

    // Build new group cart items
    const newItems: GroupCartItem[] = [];
    let orderSubtotal = 0;
    Object.keys(cart).forEach(id => {
      const item = menuItems.find(m => m.id === id);
      if (item) {
        const qty = cart[id];
        newItems.push({ customerName: 'Khách 1 (Bạn)', itemName: item.name, quantity: qty, price: item.price });
        orderSubtotal += item.price * qty;
      }
    });

    setGroupCart([...groupCart, ...newItems]);

    // Calculate loyalty points earned (5% of order total)
    const earnedPoints = Math.round((orderSubtotal * 0.05) / 100);
    setLoyaltyPoints(prev => prev + earnedPoints);
    const newHistory: LoyaltyTransaction = {
      date: new Date().toISOString().split('T')[0],
      type: 'Earned',
      points: earnedPoints,
      orderNo: `ORD-${Math.floor(1000 + Math.random() * 9000)}`
    };
    setLoyaltyHistory([newHistory, ...loyaltyHistory]);

    // RESET CART IMMEDIATELY AFTER SENDING TO KITCHEN!
    setCart({});

    alert(`ĐÃ GỬI ${totalItems} MÓN XUỐNG BẾP THÀNH CÔNG!\n- Đơn hàng tại ${tableSession} đã chuyển sang màn hình KDS.\n- Giỏ hàng nhóm realtime đã chốt.\n- Bạn được cộng +${earnedPoints} điểm thưởng tích lũy vào Ví Hội Viên!`);
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

      {/* 1. VIEW 1: QR MENU */}
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

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px', marginBottom: '24px' }}>
            {filteredMenu.map((item) => (
              <div key={item.id} style={{ border: '1px solid #E2E8F0', background: '#F8FAFC', borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '11px', color: '#2563EB', background: '#DBEAFE', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>{item.category}</span>
                  <h3 style={{ margin: '8px 0 4px 0', fontSize: '16px', color: '#0F172A', fontWeight: 'bold' }}>{item.name}</h3>
                  <div style={{ fontSize: '15px', color: '#059669', fontWeight: 'bold', marginBottom: '12px' }}>{item.price.toLocaleString('vi-VN')}đ</div>
                </div>
                <button
                  onClick={() => handleAddToCart(item.id)}
                  style={{ width: '100%', padding: '10px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
                >
                  + Thêm Vào Giỏ {cart[item.id] ? `(${cart[item.id]})` : ''}
                </button>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '2px solid #E2E8F0', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <span style={{ fontSize: '14px', color: '#475569' }}>Tổng món đã chọn: </span>
              <strong style={{ fontSize: '18px', color: '#059669' }}>{Object.values(cart).reduce((a, b) => a + b, 0)} món</strong>
            </div>
            <button
              onClick={handleSendOrderToKitchen}
              style={{ padding: '12px 24px', background: '#059669', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}
            >
              GỬI ĐƠN XUỐNG BẾP VÀ BARISTA
            </button>
          </div>
        </div>
      )}

      {/* 2. VIEW 2: GROUP CART */}
      {activeTab === 'customer-group' && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ fontSize: '20px', marginTop: 0, color: '#0F172A', fontWeight: 'bold' }}>Giỏ Hàng Nhóm Thời Gian Thực Tại {tableSession}</h2>
          <p style={{ color: '#475569', fontSize: '13px', marginBottom: '20px' }}>Tất cả mọi người tại bàn đều có thể thêm món vào giỏ hàng chung theo thời gian thực.</p>

          <div style={{ width: '100%', overflowX: 'auto', marginBottom: '20px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0', textAlign: 'left' }}>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Thành Viên</th>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Món Đã Chọn</th>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Số Lượng</th>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Đơn Giá</th>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Thành Tiền</th>
                </tr>
              </thead>
              <tbody>
                {groupCart.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#2563EB' }}>{item.customerName}</td>
                    <td style={{ padding: '14px 12px', color: '#0F172A', fontWeight: 'bold' }}>{item.itemName}</td>
                    <td style={{ padding: '14px 12px', color: '#0F172A' }}>x{item.quantity}</td>
                    <td style={{ padding: '14px 12px', color: '#475569' }}>{item.price.toLocaleString('vi-VN')}đ</td>
                    <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#059669' }}>{(item.quantity * item.price).toLocaleString('vi-VN')}đ</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '14px', color: '#475569' }}>TỔNG TIỀN BÀN GỘP: </span>
              <strong style={{ fontSize: '22px', color: '#059669' }}>{groupTotal.toLocaleString('vi-VN')}đ</strong>
            </div>
            <button onClick={() => alert('Đã chốt giỏ hàng nhóm thành công!')} style={{ padding: '10px 20px', background: '#059669', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>XÁC NHẬN CHỐT GIỎ HÀNG NHÓM</button>
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
                {Math.round(groupTotal / splitPeople).toLocaleString('vi-VN')}đ / người
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. VIEW 4: LOYALTY WALLET */}
      {activeTab === 'customer-loyalty' && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ fontSize: '20px', marginTop: 0, color: '#0F172A', fontWeight: 'bold' }}>Ví Điểm Thưởng & Hạng Thẻ Hội Viên</h2>
          <p style={{ color: '#475569', fontSize: '13px', marginBottom: '20px' }}>Mọi giao dịch thanh toán hoặc gửi đơn đều tích điểm 5% giá trị hóa đơn vào ví hội viên.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '24px' }}>
            <div style={{ background: '#FEF3C7', border: '1px solid #F59E0B', padding: '20px', borderRadius: '8px' }}>
              <span style={{ fontSize: '12px', color: '#92400E', fontWeight: 'bold' }}>HẠNG THẺ HỘI VIÊN</span>
              <h3 style={{ margin: '8px 0 4px 0', fontSize: '18px', color: '#78350F', fontWeight: 'bold' }}>{membershipTier}</h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#92400E' }}>Ưu đãi chiết khấu trực tiếp 10% trên tổng bill</p>
            </div>

            <div style={{ background: '#ECFDF5', border: '1px solid #10B981', padding: '20px', borderRadius: '8px' }}>
              <span style={{ fontSize: '12px', color: '#065F46', fontWeight: 'bold' }}>TỔNG ĐIỂM TÍCH LŨY</span>
              <h3 style={{ margin: '8px 0 4px 0', fontSize: '28px', color: '#047857', fontWeight: 'bold' }}>{loyaltyPoints} Điểm</h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#065F46' }}>Tương đương {loyaltyPoints * 100}đ khi đổi quà/thanh toán</p>
            </div>
          </div>

          <h3 style={{ fontSize: '16px', color: '#0F172A', fontWeight: 'bold', marginBottom: '12px' }}>Lịch Sử Bút Toán Điểm Thưởng Tự Động (Loyalty Ledger):</h3>
          <div style={{ width: '100%', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0', textAlign: 'left' }}>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Ngày Giao Dịch</th>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Số Hóa Đơn</th>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Loại Bút Toán</th>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Số Điểm Biến Động</th>
                </tr>
              </thead>
              <tbody>
                {loyaltyHistory.map((h, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#0F172A' }}>{h.date}</td>
                    <td style={{ padding: '14px 12px', color: '#475569' }}>{h.orderNo}</td>
                    <td style={{ padding: '14px 12px' }}>
                      <span style={{ background: h.type === 'Earned' ? '#DCFCE7' : '#FEE2E2', color: h.type === 'Earned' ? '#166534' : '#991B1B', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                        {h.type === 'Earned' ? 'Tích Điểm Tự Động' : 'Tiêu Điểm'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 12px', fontWeight: 'bold', color: h.points > 0 ? '#059669' : '#DC2626', fontSize: '15px' }}>
                      {h.points > 0 ? `+${h.points}` : h.points} Điểm
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

export default CustomerQrPage;
