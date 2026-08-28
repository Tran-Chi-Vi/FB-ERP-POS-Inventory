import React, { useState } from 'react';

interface KdsTicket {
  id: string;
  orderNumber: string;
  tableName: string;
  elapsedMinutes: number;
  station: 'bar' | 'kitchen';
  items: { name: string; quantity: number; modifier: string }[];
  status: 'pending' | 'preparing' | 'ready';
}

export const KdsKitchenPage: React.FC = () => {
  const [currentStation, setCurrentStation] = useState<'bar' | 'kitchen'>('bar');
  const [selectedRecipeItem, setSelectedRecipeItem] = useState<string | null>(null);

  const [tickets, setTickets] = useState<KdsTicket[]>([
    {
      id: 'TK-101',
      orderNumber: 'ORD-9921',
      tableName: 'Bàn 04',
      elapsedMinutes: 14, // SLA Violation Red
      station: 'bar',
      items: [
        { name: 'Cà Phê Sữa Đá Sài Gòn', quantity: 2, modifier: 'Nhiều đá, 100% đường' },
        { name: 'Trà Đào Cam Sả Tươi', quantity: 1, modifier: '50% đường, 50% đá, Topping Trân Châu' }
      ],
      status: 'preparing'
    },
    {
      id: 'TK-102',
      orderNumber: 'ORD-9924',
      tableName: 'Bàn 01',
      elapsedMinutes: 8, // SLA Warning Yellow
      station: 'bar',
      items: [
        { name: 'Trà Đào Cam Sả Tươi', quantity: 3, modifier: 'Ít đường, 100% đá' }
      ],
      status: 'pending'
    },
    {
      id: 'TK-103',
      orderNumber: 'ORD-9928',
      tableName: 'Bàn 05',
      elapsedMinutes: 4, // SLA Normal Green
      station: 'kitchen',
      items: [
        { name: 'Bánh Tiramisu Ý', quantity: 1, modifier: 'Kèm dĩa tráng miệng' }
      ],
      status: 'preparing'
    }
  ]);

  const [recalledTickets, setRecalledTickets] = useState<string[]>([]);
  const [outOfStockItems, setOutOfStockItems] = useState<{ [key: string]: boolean }>({
    'Cà Phê Sữa Đá Sài Gòn': false,
    'Trà Đào Cam Sả Tươi': false,
    'Bánh Tiramisu Ý': true, // Currently 86'd
  });

  const getSlaBadge = (minutes: number) => {
    if (minutes > 12) {
      return <span style={{ background: '#DC2626', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold', animation: 'pulse 1s infinite' }}>🚨 TRỄ SLA BẾP ({minutes} phút)</span>;
    }
    if (minutes >= 7) {
      return <span style={{ background: '#D97706', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>⚠️ CẢNH BÁO SLA ({minutes} phút)</span>;
    }
    return <span style={{ background: '#059669', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>✓ ĐÚNG HẠN ({minutes} phút)</span>;
  };

  const handleBumpTicket = (ticketId: string) => {
    setTickets(tickets.filter(t => t.id !== ticketId));
    setRecalledTickets([ticketId, ...recalledTickets]);
  };

  const handleToggleStock = (itemName: string) => {
    setOutOfStockItems(prev => ({ ...prev, [itemName]: !prev[itemName] }));
    alert(`Đã ${!outOfStockItems[itemName] ? 'KHÓA (86-List)' : 'MỞ BÁN LẠI'} món "${itemName}". Tín hiệu SignalR 3s đã phát tới toàn bộ Menu & POS!`);
  };

  const filteredTickets = tickets.filter(t => t.station === currentStation);

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto', background: '#111827', color: '#F9FAFB', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      {/* KDS Station Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#1F2937', padding: '20px', borderRadius: '12px', marginBottom: '24px' }}>
        <div>
          <span style={{ background: '#374151', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', textTransform: 'uppercase', tracking: '1px' }}>KITCHEN DISPLAY SYSTEM (KDS TOUCH)</span>
          <h1 style={{ margin: '8px 0 0 0', fontSize: '26px' }}>
            Trạm Chế Biến: <strong style={{ color: '#60A5FA' }}>{currentStation === 'bar' ? '☕ TRẠM PHA CHẾ (BARISTA)' : '🍳 TRẠM BẾP NÓNG (KITCHEN)'}</strong>
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => setCurrentStation('bar')} style={{ padding: '12px 24px', background: currentStation === 'bar' ? '#2563EB' : '#374151', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Trạm Pha Chế Bar</button>
          <button onClick={() => setCurrentStation('kitchen')} style={{ padding: '12px 24px', background: currentStation === 'kitchen' ? '#2563EB' : '#374151', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Trạm Bếp Nóng</button>
        </div>
      </div>

      {/* Smart Batch Cooking View Bar */}
      <div style={{ background: '#1F2937', border: '1px solid #374151', borderRadius: '8px', padding: '16px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <strong style={{ color: '#F59E0B', fontSize: '16px' }}>⚡ BẢNG GOM MÓN CHẾ BIẾN ĐỒNG THỜI (SMART BATCH VIEW):</strong>
          <div style={{ display: 'flex', gap: '16px', marginTop: '8px', fontSize: '14px' }}>
            <span>• Trà Đào Cam Sả Tươi: <strong style={{ color: '#10B981', fontSize: '16px' }}>4 ly</strong></span>
            <span>• Cà Phê Sữa Đá: <strong style={{ color: '#10B981', fontSize: '16px' }}>2 ly</strong></span>
          </div>
        </div>
        <div>
          {recalledTickets.length > 0 && (
            <button onClick={() => alert(`Khôi phục vé ${recalledTickets[0]} thành công!`)} style={{ padding: '8px 16px', background: '#4F46E5', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>↺ Khôi Phục Vé Bấm Nhầm ({recalledTickets.length})</button>
          )}
        </div>
      </div>

      {/* KDS Active Tickets Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {filteredTickets.map((ticket) => (
          <div key={ticket.id} style={{ background: '#1F2937', border: ticket.elapsedMinutes > 12 ? '2px solid #EF4444' : '1px solid #374151', borderRadius: '10px', padding: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#60A5FA' }}>{ticket.tableName}</span>
              {getSlaBadge(ticket.elapsedMinutes)}
            </div>
            <div style={{ fontSize: '13px', color: '#9CA3AF', marginBottom: '16px' }}>Mã vé: {ticket.id} | Hóa đơn: {ticket.orderNumber}</div>

            {/* Ticket Items List */}
            <div style={{ borderTop: '1px solid #374151', borderBottom: '1px solid #374151', padding: '12px 0', margin: '12px 0' }}>
              {ticket.items.map((item, idx) => (
                <div key={idx} style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{item.name}</span>
                    <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#F59E0B' }}>x{item.quantity}</span>
                  </div>
                  <div style={{ fontSize: '13px', color: '#FBBF24', background: '#374151', padding: '4px 8px', borderRadius: '4px', marginTop: '4px' }}>
                    {item.modifier}
                  </div>
                  <button onClick={() => setSelectedRecipeItem(item.name)} style={{ marginTop: '4px', fontSize: '11px', background: 'transparent', color: '#9CA3AF', border: '1px underline #6B7280', cursor: 'pointer' }}>🔍 Xem quy trình định lượng BOM</button>
                </div>
              ))}
            </div>

            {/* Station Action Controls */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
              <button onClick={() => alert(`Chuyển vé ${ticket.id} sang Trạm Bếp Nóng`)} style={{ flex: 1, padding: '10px', background: '#4B5563', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>🔀 Chuyển Trạm</button>
              <button onClick={() => handleBumpTicket(ticket.id)} style={{ flex: 2, padding: '10px', background: '#059669', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>✔ HOÀN TẤT (BUMP TICKET)</button>
            </div>
          </div>
        ))}
      </div>

      {/* 86-List Quick Lock Matrix Section */}
      <div style={{ background: '#1F2937', border: '1px solid #374151', borderRadius: '10px', padding: '20px' }}>
        <h3 style={{ marginTop: 0, color: '#EF4444' }}>🚫 BẢNG KHÓA MÓN BÁO HẾT NGUYÊN LIỆU ĐỘT XUẤT (86-LIST TOGGLE MATRIX):</h3>
        <p style={{ fontSize: '13px', color: '#9CA3AF' }}>Khi món bị bật khóa 86-List, menu điện tử QR của khách và máy thu ngân POS sẽ tự động gán cờ Hết Hàng trong vòng 3 giây.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px', marginTop: '16px' }}>
          {Object.keys(outOfStockItems).map((item) => (
            <div key={item} style={{ background: '#374151', padding: '12px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{item}</span>
              <button onClick={() => handleToggleStock(item)} style={{ padding: '6px 12px', background: outOfStockItems[item] ? '#DC2626' : '#059669', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>
                {outOfStockItems[item] ? 'ĐANG KHÓA (86)' : 'ĐANG BÁN'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* BOM Recipe Modal */}
      {selectedRecipeItem && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#1F2937', border: '1px solid #4B5563', borderRadius: '12px', padding: '24px', maxWidth: '500px', width: '100%', color: '#fff' }}>
            <h3 style={{ marginTop: 0, color: '#60A5FA' }}>Công Thức Pha Chế Chuẩn (BOM): {selectedRecipeItem}</h3>
            <ul style={{ paddingLeft: '20px', lineHeight: '1.8', fontSize: '14px' }}>
              <li>Hạt Cà Phê Espresso: <strong>18 gram</strong> (Xay mịn Mức 2)</li>
              <li>Sữa Đặc Ngôi Sao Phương Nam: <strong>30 ml</strong></li>
              <li>Đá Viên Tinh Khiết: <strong>150 gram</strong></li>
              <li>Nhiệt độ pha chiết: <strong>92°C - Áp suất 9 Bar</strong></li>
            </ul>
            <button onClick={() => setSelectedRecipeItem(null)} style={{ marginTop: '16px', width: '100%', padding: '10px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Đóng Cửa Sổ</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default KdsKitchenPage;
