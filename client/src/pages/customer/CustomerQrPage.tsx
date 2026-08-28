import React, { useState } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  addedBy: string;
  sugar: number;
  ice: number;
  toppings: string[];
}

export const CustomerQrPage: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'menu' | 'group' | 'split' | 'loyalty'>('menu');
  const [voucherCode, setVoucherCode] = useState<string>('');
  const [appliedVoucher, setAppliedVoucher] = useState<{ code: string; discount: number } | null>(null);
  
  // Shared Group Order Cart State
  const [groupCart] = useState<CartItem[]>([
    { id: '1', name: 'Cà Phê Sữa Đá Sài Gòn', price: 35000, quantity: 2, addedBy: 'Bạn (Bàn 04)', sugar: 100, ice: 100, toppings: ['Bánh Flan'] },
    { id: '2', name: 'Trà Đào Cam Sả Tươi', price: 45000, quantity: 1, addedBy: 'Minh Tuấn (Khách 2)', sugar: 50, ice: 50, toppings: ['Trân Châu Trắng'] },
  ]);

  // At-table Service Calls Log
  const [callStatus, setCallStatus] = useState<string | null>(null);
  const [callCooldown, setCallCooldown] = useState<number>(0);

  // Loyalty Wallet State
  const [loyaltyPoints] = useState<number>(450);
  const memberTier = 'Hạng Vàng (Gold Member)';

  const handleCallStaff = (action: string) => {
    if (callCooldown > 0) return;
    setCallStatus(`Đã gửi yêu cầu "${action}" tới phục vụ!`);
    setCallCooldown(60);
    const interval = setInterval(() => {
      setCallCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCallStatus(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const applyVoucher = () => {
    if (voucherCode.toUpperCase() === 'VIP2026') {
      setAppliedVoucher({ code: 'VIP2026', discount: 20000 });
      alert('Đã áp dụng mã VIP2026: Giảm 20.000đ!');
    } else {
      alert('Mã giảm giá không hợp lệ hoặc đã hết hạn!');
    }
  };

  const totalRaw = groupCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const finalTotal = Math.max(0, totalRaw - (appliedVoucher?.discount || 0));

  return (
    <div style={{ padding: '24px', maxWidth: '1100px', margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      {/* Page Title Header */}
      <div style={{ marginBottom: '20px', borderBottom: '1px solid #E5E7EB', paddingBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 'bold', color: '#111827' }}>Menu Điện Tử & Đặt Món QR Tại Bàn</h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#6B7280' }}>Phiên bàn: #SESS-89214 | Bàn 04 (Khu Vực Sân Vườn) | Hạn giữ chỗ tồn kho (TTL): 09:45</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '12px', color: '#6B7280' }}>Hội viên: <strong>Nguyễn Văn A</strong></div>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#059669' }}>{memberTier} ({loyaltyPoints} điểm)</div>
        </div>
      </div>

      {/* Dynamic Sub Tab Navigation */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid #E5E7EB', marginBottom: '24px' }}>
        <button onClick={() => setActiveSubTab('menu')} style={{ padding: '10px 18px', fontWeight: 'bold', border: 'none', borderBottom: activeSubTab === 'menu' ? '3px solid #2563EB' : 'none', background: 'transparent', cursor: 'pointer', color: activeSubTab === 'menu' ? '#2563EB' : '#4B5563' }}>Menu & Gọi Món</button>
        <button onClick={() => setActiveSubTab('group')} style={{ padding: '10px 18px', fontWeight: 'bold', border: 'none', borderBottom: activeSubTab === 'group' ? '3px solid #2563EB' : 'none', background: 'transparent', cursor: 'pointer', color: activeSubTab === 'group' ? '#2563EB' : '#4B5563' }}>Giỏ Hàng Nhóm Realtime ({groupCart.length})</button>
        <button onClick={() => setActiveSubTab('split')} style={{ padding: '10px 18px', fontWeight: 'bold', border: 'none', borderBottom: activeSubTab === 'split' ? '3px solid #2563EB' : 'none', background: 'transparent', cursor: 'pointer', color: activeSubTab === 'split' ? '#2563EB' : '#4B5563' }}>Chia Hóa Đơn Bàn</button>
        <button onClick={() => setActiveSubTab('loyalty')} style={{ padding: '10px 18px', fontWeight: 'bold', border: 'none', borderBottom: activeSubTab === 'loyalty' ? '3px solid #2563EB' : 'none', background: 'transparent', cursor: 'pointer', color: activeSubTab === 'loyalty' ? '#2563EB' : '#4B5563' }}>Ví Điểm & Đổi Quà</button>
      </div>

      {/* Sub Tab 1: Menu & Quick Service */}
      {activeSubTab === 'menu' && (
        <div>
          {/* Quick Service Calls Panel */}
          <div style={{ background: '#F3F4F6', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '16px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong style={{ color: '#1F2937', fontSize: '14px' }}>Tiện ích gọi hỗ trợ tại bàn (Rate limit 60s):</strong>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#4B5563' }}>Gửi thông báo trực tiếp đến mPOS của phục vụ gần nhất.</p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => handleCallStaff('Xin thêm đá')} disabled={callCooldown > 0} style={{ padding: '8px 14px', background: callCooldown > 0 ? '#9CA3AF' : '#2563EB', color: '#fff', border: 'none', borderRadius: '6px', cursor: callCooldown > 0 ? 'not-allowed' : 'pointer' }}>Xin Đá</button>
              <button onClick={() => handleCallStaff('Gọi dọn bàn')} disabled={callCooldown > 0} style={{ padding: '8px 14px', background: callCooldown > 0 ? '#9CA3AF' : '#2563EB', color: '#fff', border: 'none', borderRadius: '6px', cursor: callCooldown > 0 ? 'not-allowed' : 'pointer' }}>Gọi Dọn Bàn</button>
              <button onClick={() => handleCallStaff('Yêu cầu thanh toán')} disabled={callCooldown > 0} style={{ padding: '8px 14px', background: callCooldown > 0 ? '#9CA3AF' : '#059669', color: '#fff', border: 'none', borderRadius: '6px', cursor: callCooldown > 0 ? 'not-allowed' : 'pointer' }}>Yêu Cầu Tính Tiền</button>
            </div>
          </div>

          {callStatus && (
            <div style={{ padding: '12px', background: '#D1FAE5', border: '1px solid #10B981', color: '#065F46', borderRadius: '6px', marginBottom: '16px' }}>
              {callStatus} (Thao tác tiếp theo sau {callCooldown}s)
            </div>
          )}

          {/* Menu Items Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            <div style={{ border: '1px solid #E5E7EB', borderRadius: '8px', padding: '16px', background: '#fff' }}>
              <span style={{ fontSize: '11px', background: '#E0E7FF', color: '#4338CA', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>BÁN CHẠY #1</span>
              <h3 style={{ margin: '8px 0 4px 0', fontSize: '18px' }}>Cà Phê Sữa Đá Sài Gòn</h3>
              <p style={{ margin: 0, color: '#6B7280', fontSize: '13px' }}>Cà phê đậm đà kết hợp sữa đặc Ngôi Sao Phương Nam</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#059669' }}>35.000đ</span>
                <button style={{ padding: '6px 12px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>+ Thêm Vào Giỏ</button>
              </div>
            </div>

            <div style={{ border: '1px solid #E5E7EB', borderRadius: '8px', padding: '16px', background: '#fff' }}>
              <span style={{ fontSize: '11px', background: '#FEF3C7', color: '#92400E', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>RECOMMENDED AI</span>
              <h3 style={{ margin: '8px 0 4px 0', fontSize: '18px' }}>Trà Đào Cam Sả Tươi</h3>
              <p style={{ margin: 0, color: '#6B7280', fontSize: '13px' }}>Trà sả thơm mát cùng đào miếng giòn sần sật</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#059669' }}>45.000đ</span>
                <button style={{ padding: '6px 12px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>+ Thêm Vào Giỏ</button>
              </div>
            </div>

            <div style={{ border: '1px solid #E5E7EB', borderRadius: '8px', padding: '16px', background: '#fff' }}>
              <span style={{ fontSize: '11px', background: '#F3F4F6', color: '#374151', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>TRÁNG MIỆNG</span>
              <h3 style={{ margin: '8px 0 4px 0', fontSize: '18px' }}>Bánh Tiramisu Ý</h3>
              <p style={{ margin: 0, color: '#6B7280', fontSize: '13px' }}>Lớp kem mascarpone mềm mịn cùng hương cacao</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#059669' }}>55.000đ</span>
                <button style={{ padding: '6px 12px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>+ Thêm Vào Giỏ</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub Tab 2: Shared Group Order Cart */}
      {activeSubTab === 'group' && (
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '20px' }}>
          <h2 style={{ fontSize: '18px', marginTop: 0 }}>Giỏ Hàng Nhóm Realtime (Bàn 04)</h2>
          <p style={{ color: '#6B7280', fontSize: '14px' }}>Tất cả thành viên quét QR tại bàn 04 đều có thể thêm món và theo dõi đơn hàng đồng thời.</p>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px' }}>
            <thead>
              <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB', textAlign: 'left' }}>
                <th style={{ padding: '10px' }}>Thành viên chọn</th>
                <th style={{ padding: '10px' }}>Tên món</th>
                <th style={{ padding: '10px' }}>Tùy chọn Modifier</th>
                <th style={{ padding: '10px' }}>Đơn giá</th>
                <th style={{ padding: '10px' }}>Số lượng</th>
                <th style={{ padding: '10px' }}>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {groupCart.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td style={{ padding: '12px 10px', fontWeight: 'bold' }}>{item.addedBy}</td>
                  <td style={{ padding: '12px 10px', fontWeight: 'bold' }}>{item.name}</td>
                  <td style={{ padding: '12px 10px', fontSize: '13px', color: '#4B5563' }}>
                    Nước đá {item.ice}%, Đường {item.sugar}%, Topping: {item.toppings.join(', ')}
                  </td>
                  <td style={{ padding: '12px 10px' }}>{item.price.toLocaleString('vi-VN')}đ</td>
                  <td style={{ padding: '12px 10px' }}>x{item.quantity}</td>
                  <td style={{ padding: '12px 10px', fontWeight: 'bold', color: '#059669' }}>{(item.price * item.quantity).toLocaleString('vi-VN')}đ</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Voucher Section */}
          <div style={{ marginTop: '24px', background: '#F9FAFB', padding: '16px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input type="text" placeholder="Nhập mã voucher (Mẫu: VIP2026)" value={voucherCode} onChange={(e) => setVoucherCode(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #D1D5DB', borderRadius: '6px', width: '240px' }} />
              <button onClick={applyVoucher} style={{ padding: '8px 16px', background: '#4F46E5', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Áp dụng mã</button>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '14px', color: '#4B5563' }}>Tạm tính: {totalRaw.toLocaleString('vi-VN')}đ</div>
              {appliedVoucher && <div style={{ fontSize: '14px', color: '#DC2626' }}>Giảm giá ({appliedVoucher.code}): -{appliedVoucher.discount.toLocaleString('vi-VN')}đ</div>}
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#059669', marginTop: '4px' }}>Tổng thanh toán: {finalTotal.toLocaleString('vi-VN')}đ</div>
            </div>
          </div>

          <div style={{ marginTop: '20px', textAlign: 'right' }}>
            <button onClick={() => alert('Đã gửi đơn nhóm xuống quầy thu ngân và trạm bếp!')} style={{ padding: '12px 28px', background: '#059669', color: '#fff', fontSize: '15px', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>GỬI ĐƠN XUỐNG BẾP & QUẦY</button>
          </div>
        </div>
      )}

      {/* Sub Tab 3: At-table Bill Split */}
      {activeSubTab === 'split' && (
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '20px' }}>
          <h2 style={{ fontSize: '18px', marginTop: 0 }}>Công Cụ Tính Toán Chia Tiền Hóa Đơn Tại Bàn</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '16px' }}>
            <div style={{ border: '1px solid #E5E7EB', borderRadius: '8px', padding: '16px' }}>
              <h3 style={{ marginTop: 0 }}>Cách 1: Chia Đều Theo Số Người</h3>
              <p style={{ fontSize: '14px', color: '#6B7280' }}>Tổng bill: {finalTotal.toLocaleString('vi-VN')}đ</p>
              <div style={{ margin: '16px 0' }}>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>Số lượng khách tại bàn:</label>
                <input type="number" defaultValue={3} min={1} style={{ padding: '8px', width: '100px', border: '1px solid #D1D5DB', borderRadius: '6px' }} />
              </div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#2563EB' }}>Mỗi người cần trả: {Math.round(finalTotal / 3).toLocaleString('vi-VN')}đ</div>
            </div>

            <div style={{ border: '1px solid #E5E7EB', borderRadius: '8px', padding: '16px' }}>
              <h3 style={{ marginTop: 0 }}>Cách 2: Chia Tiền Theo Món Đã Chọn</h3>
              <p style={{ fontSize: '14px', color: '#6B7280' }}>Tự động tách tiền dựa theo người tạo món trong giỏ hàng nhóm.</p>
              <ul style={{ paddingLeft: '20px', fontSize: '14px', lineHeight: '1.8' }}>
                <li>Bạn (Bàn 04): <strong>70.000đ</strong> (2x Cà Phê Sữa)</li>
                <li>Minh Tuấn: <strong>45.000đ</strong> (1x Trà Đào)</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Sub Tab 4: Loyalty Wallet */}
      {activeSubTab === 'loyalty' && (
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '20px' }}>
          <h2 style={{ fontSize: '18px', marginTop: 0 }}>Ví Điểm Thưởng & Thẻ Hội Viên VIP</h2>
          <div style={{ background: '#1F2937', color: '#fff', borderRadius: '8px', padding: '24px', marginBottom: '24px' }}>
            <div style={{ fontSize: '13px', color: '#9CA3AF' }}>Mã hội viên: #CUST-99201</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', margin: '6px 0' }}>Nguyễn Văn A</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>{memberTier}</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#10B981' }}>{loyaltyPoints} Điểm Tích Lũy</div>
            </div>
          </div>

          <h3 style={{ fontSize: '16px' }}>Danh Sách Đổi Quà Tích Điểm</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
            <div style={{ border: '1px solid #E5E7EB', borderRadius: '8px', padding: '16px', textAlign: 'center' }}>
              <h4 style={{ margin: '0 0 8px 0' }}>Voucher Giảm 20k</h4>
              <p style={{ color: '#059669', fontWeight: 'bold', margin: '0 0 12px 0' }}>200 Điểm</p>
              <button style={{ padding: '6px 16px', background: '#059669', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Đổi quà ngay</button>
            </div>
            <div style={{ border: '1px solid #E5E7EB', borderRadius: '8px', padding: '16px', textAlign: 'center' }}>
              <h4 style={{ margin: '0 0 8px 0' }}>1 Ly Cà Phê Miễn Phí</h4>
              <p style={{ color: '#059669', fontWeight: 'bold', margin: '0 0 12px 0' }}>350 Điểm</p>
              <button style={{ padding: '6px 16px', background: '#059669', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Đổi quà ngay</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerQrPage;
