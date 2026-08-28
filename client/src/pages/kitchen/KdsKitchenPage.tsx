import React, { useState, useEffect } from 'react';

interface KdsKitchenPageProps {
  activeTab: string;
}

interface TicketItem {
  id: string;
  name: string;
  quantity: number;
  note: string;
}

interface KdsTicket {
  id: string;
  orderNo: string;
  parentOrderNo?: string;
  table: string;
  pagerId: string;
  station: 'Barista' | 'Kitchen';
  timeElapsedMinutes: number;
  slaStatus: 'Normal' | 'Warning' | 'Overdue';
  isAddOn?: boolean;
  isAddOnNoticePending?: boolean;
  isAdjustment?: boolean;
  isRungReady?: boolean;
  pagerReturned?: boolean;
  items: TicketItem[];
}

interface Item86 {
  id: string;
  name: string;
  category: string;
  is86Locked: boolean;
}

interface RecipeGuide {
  id: string;
  name: string;
  ingredients: string[];
  prepSteps: string[];
  standardTempPressure: string;
}

interface SlaHistoryRecord {
  ticketId: string;
  orderNo: string;
  table: string;
  station: string;
  slaMinutes: number;
  completedTime: string;
}

export const KdsKitchenPage: React.FC<KdsKitchenPageProps> = ({ activeTab }) => {
  const [activeStation, setActiveStation] = useState<'Barista' | 'Kitchen'>('Barista');
  const [activeIotAlert, setActiveIotAlert] = useState<{ pagerId: string; orderNo: string; table: string; isAdjustment?: boolean } | null>(null);
  const [addOnNotice, setAddOnNotice] = useState<KdsTicket | null>(null);

  // 1. DYNAMIC REAL-TIME SLA TICKETS SYNCED FROM CASHIER POS PAYMENTS ONLY
  const [tickets, setTickets] = useState<KdsTicket[]>([]);

  // WEB AUDIO SYNTH CHIME FOR ADD-ON ORDER NOTIFICATION
  const playAddOnSoundChime = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.5, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      }
    } catch (e) {
      console.log('Audio chime error:', e);
    }
  };

  const syncKdsTickets = () => {
    const saved = localStorage.getItem('fnb_kds_tickets');
    if (saved) {
      const parsed: KdsTicket[] = JSON.parse(saved);
      const unacknowledgedAddOn = parsed.find(t => t.isAddOn && t.isAddOnNoticePending && !t.isRungReady);
      if (unacknowledgedAddOn && !addOnNotice) {
        playAddOnSoundChime();
        setAddOnNotice(unacknowledgedAddOn);
      }
      setTickets(parsed);
    } else {
      setTickets([]);
    }
  };

  useEffect(() => {
    syncKdsTickets();
    window.addEventListener('fnb_data_updated', syncKdsTickets);
    const interval = setInterval(syncKdsTickets, 1500);
    return () => {
      window.removeEventListener('fnb_data_updated', syncKdsTickets);
      clearInterval(interval);
    };
  }, [activeTab]);

  const handleAcknowledgeAddOnNotice = () => {
    if (!addOnNotice) return;
    const ticketIdToAck = addOnNotice.id;

    const updatedTickets = tickets.map(t => {
      if (t.id === ticketIdToAck) {
        return { ...t, isAddOnNoticePending: false };
      }
      return t;
    });

    setTickets(updatedTickets);
    localStorage.setItem('fnb_kds_tickets', JSON.stringify(updatedTickets));
    setAddOnNotice(null);
    window.dispatchEvent(new Event('fnb_data_updated'));
  };

  // 2. DYNAMIC SMART BATCH ALGORITHM
  const computeSmartBatches = () => {
    const itemMap: { [dishName: string]: { totalQty: number; unit: string; tablesMap: { [tbl: string]: number } } } = {};

    tickets.filter(t => !t.isRungReady && !t.isAdjustment).forEach(ticket => {
      ticket.items.forEach(item => {
        if (!itemMap[item.name]) {
          const unit = item.name.toLowerCase().includes('bánh') ? 'Cái' : 'Ly';
          itemMap[item.name] = { totalQty: 0, unit, tablesMap: {} };
        }
        itemMap[item.name].totalQty += item.quantity;
        itemMap[item.name].tablesMap[ticket.table] = (itemMap[item.name].tablesMap[ticket.table] || 0) + item.quantity;
      });
    });

    return Object.keys(itemMap)
      .filter(dishName => itemMap[dishName].totalQty >= 2)
      .map(dishName => {
        const info = itemMap[dishName];
        const tableDetails = Object.keys(info.tablesMap).map(tbl => `${tbl} (x${info.tablesMap[tbl]})`);
        return {
          dishName: dishName,
          totalQuantity: info.totalQty,
          unit: info.unit,
          tables: tableDetails
        };
      });
  };

  const smartBatches = computeSmartBatches();

  const handleCompleteBatchItem = (dishName: string) => {
    const updatedTickets = tickets.map(t => ({
      ...t,
      items: t.items.filter(i => i.name !== dishName)
    })).filter(t => t.items.length > 0);

    setTickets(updatedTickets);
    localStorage.setItem('fnb_kds_tickets', JSON.stringify(updatedTickets));
    window.dispatchEvent(new Event('fnb_data_updated'));
    alert(`Đã hoàn tất mẻ chế biến "${dishName}"! Các món trong mẻ đã làm xong và tự động xóa khỏi danh sách gom mẻ.`);
  };

  // 3. 86-LIST MATRIX
  const [items86, setItems86] = useState<Item86[]>([
    { id: '86-1', name: 'Cà Phê Sữa Đá Sài Gòn', category: 'Cà Phê', is86Locked: false },
    { id: '86-2', name: 'Trà Đào Cam Sả Tươi', category: 'Trà & Trà Sữa', is86Locked: false },
    { id: '86-3', name: 'Bánh Tiramisu Ý', category: 'Bánh Ngọt', is86Locked: true },
  ]);

  // 4. BOM RECIPE GUIDES
  const [recipeGuides] = useState<RecipeGuide[]>([
    {
      id: 'REC-1',
      name: 'Cà Phê Sữa Đá Sài Gòn',
      ingredients: ['Hạt Cà Phê Espresso: 18g', 'Sữa Đặc: 30ml', 'Đá Viên: 150g'],
      prepSteps: ['Bước 1: Nén lực 15kg', 'Bước 2: Chiết xuất 30ml cốt Espresso 25s', 'Bước 3: Khuấy đều với sữa đặc'],
      standardTempPressure: 'Nhiệt độ: 92°C | Áp suất: 9 Bar'
    }
  ]);

  // 5. PERSISTENT SLA HISTORY LOGS
  const [slaHistory, setSlaHistory] = useState<SlaHistoryRecord[]>(() => {
    const saved = localStorage.getItem('fnb_kds_sla_history');
    return saved ? JSON.parse(saved) : [
      { ticketId: 'TK-099', orderNo: 'HD-9915', table: 'Bàn 02', station: 'Trạm Barista', slaMinutes: 5.2, completedTime: '20:45:10' },
    ];
  });

  useEffect(() => {
    localStorage.setItem('fnb_kds_sla_history', JSON.stringify(slaHistory));
  }, [slaHistory]);

  const handleBumpAndSaveToHistory = (ticket: KdsTicket) => {
    if (ticket.isAdjustment) {
      // Update complaint status for Staff
      const savedComplaints = JSON.parse(localStorage.getItem('fnb_staff_complaints') || '[]');
      const updatedComplaints = savedComplaints.map((c: any) => {
        if (c.id === ticket.orderNo || c.table === ticket.table) {
          return { ...c, status: 'ReadyToDeliver' };
        }
        return c;
      });
      localStorage.setItem('fnb_staff_complaints', JSON.stringify(updatedComplaints));

      const updatedTickets = tickets.filter(t => t.id !== ticket.id);
      setTickets(updatedTickets);
      localStorage.setItem('fnb_kds_tickets', JSON.stringify(updatedTickets));

      const newHistoryRecord: SlaHistoryRecord = {
        ticketId: ticket.id,
        orderNo: ticket.orderNo,
        table: ticket.table,
        station: ticket.station === 'Barista' ? 'Trạm Barista' : 'Trạm Bếp Nóng',
        slaMinutes: ticket.timeElapsedMinutes || 3.0,
        completedTime: new Date().toLocaleTimeString('vi-VN')
      };
      const updatedHistory = [newHistoryRecord, ...slaHistory];
      setSlaHistory(updatedHistory);
      localStorage.setItem('fnb_kds_sla_history', JSON.stringify(updatedHistory));

      window.dispatchEvent(new Event('fnb_data_updated'));
      setActiveIotAlert({ pagerId: 'Phục Vụ Tận Bàn', orderNo: ticket.orderNo, table: ticket.table, isAdjustment: true });
      return;
    }

    const updatedTickets = tickets.map(t => {
      if (t.id === ticket.id) {
        return { ...t, isRungReady: true };
      }
      return t;
    });

    setTickets(updatedTickets);
    localStorage.setItem('fnb_kds_tickets', JSON.stringify(updatedTickets));

    const newHistoryRecord: SlaHistoryRecord = {
      ticketId: ticket.id,
      orderNo: ticket.orderNo,
      table: ticket.table,
      station: ticket.station === 'Barista' ? 'Trạm Barista' : 'Trạm Bếp Nóng',
      slaMinutes: ticket.timeElapsedMinutes || 5.0,
      completedTime: new Date().toLocaleTimeString('vi-VN')
    };
    const updatedHistory = [newHistoryRecord, ...slaHistory];
    setSlaHistory(updatedHistory);
    localStorage.setItem('fnb_kds_sla_history', JSON.stringify(updatedHistory));

    window.dispatchEvent(new Event('fnb_data_updated'));
    setActiveIotAlert({ pagerId: ticket.pagerId, orderNo: ticket.orderNo, table: ticket.table, isAdjustment: false });
  };

  const handleTransferStation = (ticketId: string) => {
    const updated = tickets.map(t => {
      if (t.id === ticketId) {
        const nextStation = t.station === 'Barista' ? 'Kitchen' : 'Barista';
        return { ...t, station: nextStation };
      }
      return t;
    });
    setTickets(updated);
    localStorage.setItem('fnb_kds_tickets', JSON.stringify(updated));
    window.dispatchEvent(new Event('fnb_data_updated'));
    alert(`Đã chuyển vé ${ticketId} sang Trạm chế biến tương ứng!`);
  };

  const handleToggle86 = (id: string) => {
    setItems86(items86.map(i => i.id === id ? { ...i, is86Locked: !i.is86Locked } : i));
  };

  // FILTER ONLY ACTIVE UNCOMPLETED COOKING TICKETS FOR KITCHEN (EXCLUDE COMPLETED/RUNG TICKETS!)
  const filteredTickets = tickets.filter(t => t.station === activeStation && !t.isRungReady && !t.pagerReturned);

  return (
    <div style={{ width: '100%', maxWidth: '100%', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* 1. VIEW 1: KDS ACTIVE TICKETS SCREEN */}
      {(activeTab === 'kds-tickets' || activeTab === 'kitchen') && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '20px', margin: 0, color: '#0F172A', fontWeight: 'bold' }}>Màn Hình Chế Biến KDS & Kích Hoạt Thẻ Rung IoT</h2>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#475569' }}>Khi chế biến xong, bấm "HOÀN TẤT CHẾ BIẾN (RUNG THẺ)" hoặc "XONG ĐIỀU CHỈNH (MANG RA BÀN)" để hoàn tất vé Bếp.</p>
            </div>
            <div style={{ display: 'flex', gap: '8px', background: '#F1F5F9', padding: '4px', borderRadius: '8px' }}>
              <button
                onClick={() => setActiveStation('Barista')}
                style={{
                  padding: '8px 16px',
                  background: activeStation === 'Barista' ? '#2563EB' : 'transparent',
                  color: activeStation === 'Barista' ? '#fff' : '#475569',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '13px'
                }}
              >
                Trạm Pha Chế (Barista)
              </button>
              <button
                onClick={() => setActiveStation('Kitchen')}
                style={{
                  padding: '8px 16px',
                  background: activeStation === 'Kitchen' ? '#2563EB' : 'transparent',
                  color: activeStation === 'Kitchen' ? '#fff' : '#475569',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '13px'
                }}
              >
                Trạm Bếp Nóng
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
            {filteredTickets.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#64748B', background: '#F8FAFC', borderRadius: '8px', gridColumn: '1 / -1' }}>
                Hiện không có vé nào đang chế biến tại trạm này. Tất cả vé đã hoàn tất!
              </div>
            ) : (
              filteredTickets.map((t) => (
                <div
                  key={t.id}
                  style={{
                    background: t.isAdjustment ? '#FFFBEB' : '#FFFFFF',
                    border: t.isAdjustment ? '3px solid #D97706' : t.isAddOn ? '3px solid #DC2626' : t.slaStatus === 'Overdue' ? '2px solid #EF4444' : t.slaStatus === 'Warning' ? '2px solid #F59E0B' : '1px solid #CBD5E1',
                    borderRadius: '8px',
                    padding: '18px',
                    boxShadow: t.isAdjustment ? '0 0 12px rgba(217, 119, 6, 0.3)' : t.isAddOn ? '0 0 12px rgba(220, 38, 38, 0.3)' : '0 2px 4px rgba(0,0,0,0.05)'
                  }}
                >
                  {t.isAdjustment ? (
                    <div style={{ background: '#D97706', color: '#fff', padding: '6px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', marginBottom: '10px', textAlign: 'center', letterSpacing: '0.5px' }}>
                      YÊU CẦU ĐIỀU CHỈNH / SỬA MÓN (PHỤC VỤ TẬN {t.table})
                    </div>
                  ) : t.isAddOn ? (
                    <div style={{ background: '#DC2626', color: '#fff', padding: '6px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', marginBottom: '10px', textAlign: 'center', letterSpacing: '0.5px' }}>
                      VÉ GỘP CÓ MÓN MỚI BỔ SUNG (THẺ RUNG {t.pagerId})
                    </div>
                  ) : null}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid #E2E8F0', paddingBottom: '10px' }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '18px', color: '#0F172A', fontWeight: 'bold' }}>{t.table}</h3>
                      <span style={{ fontSize: '12px', color: '#64748B' }}>Mã: {t.orderNo}</span>
                    </div>
                    <div>
                      <span style={{ background: t.isAdjustment ? '#FEF3C7' : '#FEF3C7', color: '#92400E', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', border: '1px solid #FDE68A' }}>
                        {t.isAdjustment ? `Phục vụ: ${t.table}` : `Thẻ Rung: ${t.pagerId || 'PAGER-01'}`}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                    {t.items.map((item) => {
                      const isAdjItem = t.isAdjustment;
                      const isNewItem = item.note && item.note.includes('MÓN MỚI');
                      return (
                        <div
                          key={item.id}
                          style={{
                            background: isAdjItem ? '#FEF3C7' : isNewItem ? '#FEE2E2' : '#F8FAFC',
                            padding: '10px',
                            borderRadius: '6px',
                            border: isAdjItem ? '1px solid #F59E0B' : isNewItem ? '1px solid #EF4444' : '1px solid #E2E8F0'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', color: isAdjItem ? '#92400E' : isNewItem ? '#991B1B' : '#0F172A' }}>
                            <span>{item.name}</span>
                            <span style={{ color: isAdjItem ? '#D97706' : isNewItem ? '#DC2626' : '#2563EB', fontSize: '16px' }}>x{item.quantity}</span>
                          </div>
                          {item.note && (
                            <div style={{ fontSize: '12px', color: isAdjItem ? '#B45309' : isNewItem ? '#DC2626' : '#D97706', marginTop: '4px', fontWeight: 'bold' }}>
                              Ghi chú: {item.note}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleTransferStation(t.id)}
                      style={{ flex: 1, padding: '8px', background: '#F1F5F9', color: '#475569', border: '1px solid #CBD5E1', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}
                    >
                      Chuyển Trạm
                    </button>
                    <button
                      onClick={() => handleBumpAndSaveToHistory(t)}
                      style={{
                        flex: 2,
                        padding: '10px 12px',
                        background: t.isAdjustment ? '#D97706' : '#059669',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '13px'
                      }}
                    >
                      {t.isAdjustment ? 'XONG ĐIỀU CHỈNH (MANG RA BÀN)' : 'HOÀN TẤT CHẾ BIẾN (RUNG THẺ)'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 2. VIEW 2: DYNAMIC SMART BATCH COOKING MATRIX */}
      {activeTab === 'kds-batch' && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ fontSize: '20px', marginTop: 0, color: '#0F172A', fontWeight: 'bold' }}>Gom Món Chế Biến Mẻ Lớn (Smart Batch View - Tối Thiểu 2 Món Lặp Nổi)</h2>
          <p style={{ color: '#475569', fontSize: '13px', marginBottom: '20px' }}>Tự động quét các đơn <strong>đang tồn đọng chưa làm</strong> trên màn hình KDS, lọc ra các đồ uống/bánh trùng lặp từ <strong>2 món trở lên (≥ 2)</strong> để làm mẻ lớn.</p>

          {smartBatches.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#64748B', background: '#F8FAFC', borderRadius: '8px' }}>
              Hiện không có món nào trùng lặp từ 2 phần trở lên (≥ 2) trong các đơn đang chờ làm. Bếp pha chế theo vé đơn lẻ.
            </div>
          ) : (
            <div style={{ width: '100%', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0', textAlign: 'left' }}>
                    <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Tên Món Chế Biến Mẻ</th>
                    <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Tổng Số Lượng Cần Pha (≥ 2)</th>
                    <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Chi Tiết Các Bàn Đang Đợi</th>
                    <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Thao Tác Hoàn Tất Mẻ</th>
                  </tr>
                </thead>
                <tbody>
                  {smartBatches.map((b, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#0F172A' }}>{b.dishName}</td>
                      <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#059669', fontSize: '16px' }}>{b.totalQuantity} {b.unit}</td>
                      <td style={{ padding: '14px 12px', color: '#475569' }}>{b.tables.join(', ')}</td>
                      <td style={{ padding: '14px 12px' }}>
                        <button onClick={() => handleCompleteBatchItem(b.dishName)} style={{ padding: '6px 14px', background: '#059669', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>
                          Xong Mẻ {b.totalQuantity} {b.unit}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 3. VIEW 3: 86-LIST LOCK MATRIX */}
      {activeTab === 'kds-86' && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ fontSize: '20px', marginTop: 0, color: '#0F172A', fontWeight: 'bold' }}>Bảng Khóa Món Báo Hết Nguyên Liệu (86-List Toggle Matrix)</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px', marginTop: '16px' }}>
            {items86.map((item) => (
              <div key={item.id} style={{ border: '1px solid #E2E8F0', background: '#F8FAFC', borderRadius: '8px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 'bold', color: '#0F172A' }}>{item.name}</div>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>Danh mục: {item.category}</div>
                </div>
                <button
                  onClick={() => handleToggle86(item.id)}
                  style={{
                    padding: '8px 14px',
                    background: item.is86Locked ? '#DC2626' : '#059669',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '12px'
                  }}
                >
                  {item.is86Locked ? 'ĐANG KHÓA (86)' : 'ĐANG BÁN'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. VIEW 4: BOM RECIPE GUIDE */}
      {activeTab === 'kds-recipe' && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ fontSize: '20px', marginTop: 0, color: '#0F172A', fontWeight: 'bold' }}>Trình Xem Quy Trình & Định Lượng Chế Biến Chuẩn (BOM Recipe Guide)</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginTop: '16px' }}>
            {recipeGuides.map((rg) => (
              <div key={rg.id} style={{ border: '1px solid #E2E8F0', background: '#F8FAFC', borderRadius: '8px', padding: '20px' }}>
                <h3 style={{ margin: '0 0 12px 0', color: '#2563EB', fontSize: '18px', fontWeight: 'bold' }}>{rg.name}</h3>
                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ color: '#0F172A', fontSize: '13px' }}>1. Định lượng nguyên liệu chuẩn:</strong>
                  <ul style={{ margin: '4px 0 0 0', paddingLeft: '20px', fontSize: '13px', color: '#475569' }}>
                    {rg.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. VIEW 5: PERSISTENT SLA HISTORY REPORT */}
      {activeTab === 'kds-history' && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ fontSize: '20px', marginTop: 0, color: '#0F172A', fontWeight: 'bold' }}>Lịch Sử Vé Bếp Đã Chế Biến & Báo Cáo SLA</h2>
          <div style={{ width: '100%', overflowX: 'auto', marginTop: '16px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0', textAlign: 'left' }}>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Mã Vé</th>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Số Hóa Đơn / Khiếu Nại</th>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Bàn Phục Vụ</th>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Trạm Chế Biến</th>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Thời Gian Hoàn Tất (SLA)</th>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Giờ Bấm Xong</th>
                </tr>
              </thead>
              <tbody>
                {slaHistory.map((s, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#0F172A' }}>{s.ticketId}</td>
                    <td style={{ padding: '14px 12px', color: '#475569' }}>{s.orderNo}</td>
                    <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#2563EB' }}>{s.table}</td>
                    <td style={{ padding: '14px 12px', color: '#0F172A' }}>{s.station}</td>
                    <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#059669' }}>{s.slaMinutes} phút</td>
                    <td style={{ padding: '14px 12px', color: '#64748B', fontSize: '13px' }}>{s.completedTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ADD-ON ORDER AUDIO / VISUAL POPUP NOTIFICATION FOR KITCHEN */}
      {addOnNotice && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', maxWidth: '480px', width: '100%', textAlign: 'center', border: '3px solid #DC2626' }}>
            <div style={{ background: '#FEE2E2', color: '#DC2626', padding: '12px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', marginBottom: '12px' }}>
              CẢNH BÁO BẾP: {addOnNotice.isAdjustment ? `Yêu cầu điều chỉnh món cho ${addOnNotice.table}` : `Đơn gộp bổ sung món cho thẻ rung ${addOnNotice.pagerId}`}
            </div>
            <h3 style={{ margin: '0 0 6px 0', color: '#0F172A', fontSize: '20px', fontWeight: 'bold' }}>{addOnNotice.table} | Mã: {addOnNotice.orderNo}</h3>
            <p style={{ fontSize: '13px', color: '#475569', margin: '0 0 16px 0' }}>
              {addOnNotice.isAdjustment ? `Yêu cầu chỉnh sửa món từ phục vụ bàn ${addOnNotice.table}.` : `Món mới đã được gộp trực tiếp vào Thẻ Đơn Hàng hiện tại của ${addOnNotice.pagerId}.`}
            </p>
            
            <button onClick={handleAcknowledgeAddOnNotice} style={{ padding: '10px 24px', background: '#DC2626', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
              ĐÃ XÁC NHẬN CHẾ BIẾN
            </button>
          </div>
        </div>
      )}

      {/* IOT PAGER SIGNAL MODAL */}
      {activeIotAlert && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', maxWidth: '480px', width: '100%', textAlign: 'center', border: activeIotAlert.isAdjustment ? '3px solid #D97706' : '3px solid #059669' }}>
            <div style={{ background: activeIotAlert.isAdjustment ? '#FEF3C7' : '#DCFCE7', color: activeIotAlert.isAdjustment ? '#92400E' : '#166534', padding: '12px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', marginBottom: '12px' }}>
              {activeIotAlert.isAdjustment ? `Đã hoàn tất điều chỉnh cho ${activeIotAlert.table}` : `Kích hoạt rung thẻ IoT ${activeIotAlert.pagerId} thành công`}
            </div>
            <h3 style={{ margin: '0 0 6px 0', color: '#0F172A', fontSize: '22px', fontWeight: 'bold' }}>
              {activeIotAlert.isAdjustment ? `Mang món ra ${activeIotAlert.table}` : `Thẻ Rung IoT: ${activeIotAlert.pagerId}`}
            </h3>
            <p style={{ fontSize: '14px', color: '#475569', margin: '0 0 16px 0' }}>
              {activeIotAlert.isAdjustment ? `Mã yêu cầu: ${activeIotAlert.orderNo} | Phục vụ mang đồ uống đã sửa ra bàn.` : `Đơn hàng: ${activeIotAlert.orderNo} | ${activeIotAlert.table}`}
            </p>
            <button onClick={() => setActiveIotAlert(null)} style={{ padding: '10px 24px', background: '#059669', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
              ĐÓNG THÔNG BÁO
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default KdsKitchenPage;
