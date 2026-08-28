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

interface PendingBill {
  billCode: string;
  table: string;
  items: { name: string; quantity: number; price: number }[];
  totalAmount: number;
  status: 'PendingPayment' | 'Paid';
  timestamp: string;
}

interface LoyaltyTransaction {
  date: string;
  type: 'Earned' | 'Spent';
  points: number;
  orderNo: string;
}

export const CustomerQrPage: React.FC<CustomerQrPageProps> = ({ activeTab }) => {
  const [tableSession, setTableSession] = useState<string>('Bàn 04');
  const currentUserFullName = 'Trần Chí Vĩ';

  // PERSISTENT GLOBAL SEQUENTIAL BILL ID GENERATOR
  const getNextGlobalBillCode = (prefix: 'BILL' | 'HD') => {
    const currentSeq = parseInt(localStorage.getItem('fnb_global_bill_seq') || '1001', 10);
    const nextSeq = currentSeq + 1;
    localStorage.setItem('fnb_global_bill_seq', nextSeq.toString());
    return `${prefix}-${currentSeq}`;
  };

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

  // 3. PENDING BILL CONFIRMATION MODAL
  const [generatedBill, setGeneratedBill] = useState<PendingBill | null>(null);

  // 4. SPLIT BILL CALCULATOR
  const [splitPeople, setSplitPeople] = useState<number>(1);

  // 5. LOYALTY WALLET
  const [loyaltyPoints] = useState<number>(1250);
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

  const handleCheckoutGroupCart = () => {
    if (groupCart.length === 0) {
      alert('Giỏ hàng trống! Vui lòng chọn món trước khi chốt đơn.');
      return;
    }

    const totalAmount = groupCart.reduce((sum, item) => sum + item.quantity * item.price, 0);
    const billCode = getNextGlobalBillCode('BILL');

    const newBill: PendingBill = {
      billCode: billCode,
      table: tableSession,
      items: groupCart.map(g => ({ name: g.itemName, quantity: g.quantity, price: g.price })),
      totalAmount: totalAmount,
      status: 'PendingPayment',
      timestamp: new Date().toLocaleTimeString('vi-VN')
    };

    // Save pending bill to localStorage
    const existingBills: PendingBill[] = JSON.parse(localStorage.getItem('fnb_pending_bills') || '[]');
    const updatedBills = [newBill, ...existingBills];
    localStorage.setItem('fnb_pending_bills', JSON.stringify(updatedBills));

    // Dispatch global data update event so Cashier POS picks it up in real time!
    window.dispatchEvent(new Event('fnb_data_updated'));

    // Show modal bill confirmation
    setGeneratedBill(newBill);

    // Clear active group cart and local cart
    setGroupCart([]);
    setCart({});
    localStorage.removeItem('fnb_group_cart');
  };

  const groupTotal = groupCart.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const tablesList = ['Bàn 01', 'Bàn 02', 'Bàn 03', 'Bàn 04', 'Bàn 05', 'VIP 01', 'VIP 02'];

  return (
    <div style={{ width: '100%', maxWidth: '100%', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* HEADER BANNER WITH TABLE SWITCHER */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '20px 24px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <span style={{ fontSize: '11px', color: '#2563EB', fontWeight: 'bold', textTransform: 'uppercase' }}>GỌI MÓN MÃ QR TẠI BÀN</span>
          <h2 style={{ margin: '4px 0 0 0', fontSize: '22px', color: '#0F172A', fontWeight: 'bold' }}>Phiên Phục Vụ: {tableSession}</h2>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <label style={{ fontSize: '12px', color: '#475569', fontWeight: 'bold' }}>Đổi vị trí bàn:</label>
          <select value={tableSession} onChange={(e) => setTableSession(e.target.value)} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontWeight: 'bold' }}>
            {tablesList.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <div style={{ background: '#DCFCE7', color: '#166534', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}>
            WiFi Nội Bộ Verified
          </div>
        </div>
      </div>

      {/* 1. TAB 1: MENU QR WITH RESTORED QUANTITY COUNTER BADGE */}
      {activeTab === 'customer-menu' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '20px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#0F172A', fontWeight: 'bold' }}>DANH MỤC THỰC ĐƠN</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    textAlign: 'left',
                    padding: '12px 16px',
                    background: selectedCategory === cat ? '#2563EB' : '#F8FAFC',
                    color: selectedCategory === cat ? '#fff' : '#0F172A',
                    border: '1px solid #CBD5E1',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '20px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#0F172A', fontWeight: 'bold' }}>SẢN PHẨM {selectedCategory.toUpperCase()}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
              {filteredMenu.map((item) => {
                const qtyCount = cart[item.id] || 0;
                return (
                  <div key={item.id} style={{ border: '1px solid #E2E8F0', borderRadius: '8px', padding: '16px', background: '#F8FAFC', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontWeight: 'bold', color: '#0F172A', fontSize: '15px' }}>{item.name}</div>
                      <div style={{ color: '#059669', fontWeight: 'bold', marginTop: '6px', fontSize: '16px' }}>{item.price.toLocaleString('vi-VN')} đ</div>
                    </div>
                    <button
                      onClick={() => handleAddToCart(item)}
                      style={{
                        marginTop: '12px',
                        padding: '10px 12px',
                        background: qtyCount > 0 ? '#047857' : '#059669',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        display: 'flex',
                        justify: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <span>+ Thêm Vào Giỏ</span>
                      {qtyCount > 0 && (
                        <span style={{ background: '#FEF3C7', color: '#92400E', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>
                          Đã chọn: x{qtyCount}
                        </span>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 2. TAB 2: GROUP CART REALTIME */}
      {activeTab === 'customer-group' && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ fontSize: '20px', marginTop: 0, color: '#0F172A', fontWeight: 'bold' }}>Giỏ Hàng Nhóm Thời Gian Thực ({tableSession})</h2>
          <p style={{ color: '#475569', fontSize: '13px', marginBottom: '20px' }}>Tất cả mọi người tại bàn đều có thể thêm, chỉnh sửa hoặc bớt món trước khi chốt đơn gửi xuống Thu Ngân.</p>

          {groupCart.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#64748B', background: '#F8FAFC', borderRadius: '8px' }}>
              Giỏ hàng nhóm hiện tại đang trống. Vui lòng quay lại tab Thực Đơn để chọn món!
            </div>
          ) : (
            <div>
              <div style={{ width: '100%', overflowX: 'auto', marginBottom: '20px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0', textAlign: 'left' }}>
                      <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Tên Món Ăn / Đồ Uống</th>
                      <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Đơn Giá</th>
                      <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Số Lượng</th>
                      <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Thành Tiền</th>
                      <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupCart.map((item) => (
                      <tr key={item.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#0F172A' }}>{item.itemName}</td>
                        <td style={{ padding: '14px 12px', color: '#475569' }}>{item.price.toLocaleString('vi-VN')} đ</td>
                        <td style={{ padding: '14px 12px' }}>
                          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                            <button onClick={() => handleDecreaseGroupQuantity(item.id)} style={{ padding: '2px 8px', background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>-</button>
                            <span style={{ fontWeight: 'bold', width: '24px', textAlign: 'center' }}>{item.quantity}</span>
                            <button onClick={() => handleIncreaseGroupQuantity(item.id)} style={{ padding: '2px 8px', background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>+</button>
                          </div>
                        </td>
                        <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#059669', fontSize: '15px' }}>{(item.quantity * item.price).toLocaleString('vi-VN')} đ</td>
                        <td style={{ padding: '14px 12px' }}>
                          <button onClick={() => handleRemoveGroupItem(item.id)} style={{ padding: '6px 12px', background: '#FEE2E2', color: '#DC2626', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>Xóa Món</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <span style={{ fontSize: '13px', color: '#475569' }}>TỔNG TIỀN THANH TOÁN:</span>
                  <h3 style={{ margin: '4px 0 0 0', fontSize: '24px', color: '#059669', fontWeight: 'bold' }}>{groupTotal.toLocaleString('vi-VN')} đ</h3>
                </div>
                <button
                  onClick={handleCheckoutGroupCart}
                  style={{ padding: '14px 28px', background: '#059669', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}
                >
                  XÁC NHẬN ĐẶT ĐƠN & TẠO MÃ BILL THANH TOÁN
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. TAB 3: SPLIT BILL CALCULATOR */}
      {activeTab === 'customer-split' && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ fontSize: '20px', marginTop: 0, color: '#0F172A', fontWeight: 'bold' }}>Công Cụ Tách Tiền Hóa Đơn Chia Đều</h2>
          <div style={{ marginTop: '20px', maxWidth: '400px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#0F172A', marginBottom: '6px' }}>Số Người Tại Bàn Cần Tách Tiền:</label>
            <input type="number" min="1" max="20" value={splitPeople} onChange={(e) => setSplitPeople(Math.max(1, Number(e.target.value)))} style={{ width: '100%', padding: '10px', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold' }} />
            
            <div style={{ marginTop: '20px', background: '#DBEAFE', padding: '16px', borderRadius: '8px', border: '1px solid #93C5FD' }}>
              <span style={{ fontSize: '12px', color: '#1E40AF', fontWeight: 'bold' }}>SỐ TIỀN MỖI NGƯỜI CẦN TRẢ:</span>
              <h3 style={{ margin: '6px 0 0 0', fontSize: '24px', color: '#1E40AF', fontWeight: 'bold' }}>
                {Math.round(groupTotal / splitPeople).toLocaleString('vi-VN')} đ / người
              </h3>
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB 4: LOYALTY WALLET */}
      {activeTab === 'customer-loyalty' && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ fontSize: '20px', marginTop: 0, color: '#0F172A', fontWeight: 'bold' }}>Ví Điểm Thưởng Hội Viên</h2>
          <div style={{ background: '#FEF3C7', padding: '20px', borderRadius: '8px', border: '1px solid #FDE68A', marginBottom: '24px', maxWidth: '400px' }}>
            <span style={{ fontSize: '12px', color: '#92400E', fontWeight: 'bold' }}>ĐIỂM TÍCH LŨY HIỆN CÓ:</span>
            <h3 style={{ margin: '6px 0 0 0', fontSize: '28px', color: '#D97706', fontWeight: 'bold' }}>{loyaltyPoints} Điểm</h3>
            <div style={{ marginTop: '8px', fontSize: '13px', color: '#92400E', fontWeight: 'bold' }}>Hạng thẻ: {membershipTier}</div>
          </div>
        </div>
      )}

      {/* BILL GENERATION MODAL FOR CUSTOMER */}
      {generatedBill && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '28px', borderRadius: '12px', maxWidth: '480px', width: '100%', textAlign: 'center', border: '2px solid #059669' }}>
            <div style={{ background: '#DCFCE7', color: '#166534', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto', fontSize: '24px', fontWeight: 'bold' }}>✓</div>
            <h3 style={{ margin: '0 0 6px 0', color: '#0F172A', fontSize: '20px', fontWeight: 'bold' }}>ĐÃ ĐẶT ĐƠN THANH TOÁN TẠI QUẦY THU NGÂN</h3>
            <p style={{ fontSize: '13px', color: '#475569', margin: '0 0 16px 0' }}>Bàn phục vụ: <strong>{generatedBill.table}</strong> | Thời gian: {generatedBill.timestamp}</p>
            
            <div style={{ background: '#F8FAFC', border: '2px dashed #2563EB', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
              <span style={{ fontSize: '12px', color: '#2563EB', fontWeight: 'bold' }}>MÃ BILL ĐƠN HÀNG CỦA BẠN:</span>
              <h2 style={{ margin: '4px 0 2px 0', fontSize: '32px', color: '#0F172A', fontWeight: 'bold' }}>{generatedBill.billCode}</h2>
              <div style={{ fontSize: '15px', color: '#059669', fontWeight: 'bold' }}>Tổng tiền: {generatedBill.totalAmount.toLocaleString('vi-VN')} đ</div>
            </div>

            <div style={{ background: '#FEF3C7', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '12px', color: '#92400E', textAlign: 'left', border: '1px solid #FDE68A' }}>
              <strong>BƯỚC THANH TOÁN & GÁN THỂ RUNG IOT TẠI QUẦY:</strong>
              <ol style={{ margin: '4px 0 0 0', paddingLeft: '20px' }}>
                <li>Quý khách vui lòng đến quầy Thu Ngân đọc Mã Bill <strong>{generatedBill.billCode}</strong>.</li>
                <li>Thu Ngân xác nhận thanh toán (Tiền mặt / VietQR) và <strong>gán Thẻ Rung IoT Nhận Món</strong>.</li>
                <li>Đơn hàng sẽ chuyển xuống Bếp chế biến. Khi xong Thẻ Rung sẽ phát chuông báo quý khách lên nhận món!</li>
              </ol>
            </div>

            <button onClick={() => setGeneratedBill(null)} style={{ width: '100%', padding: '12px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}>
              ĐÓNG THÔNG BÁO
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default CustomerQrPage;
