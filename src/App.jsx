import React, { useState, useEffect, useMemo } from 'react';
import { jsPDF } from 'jspdf';
import {
  Download,
  FileText,
  Bell,
  ArrowLeft,
  ArrowRight,
  MessageSquare,
  Calendar as CalendarIcon,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Check,
  X,
  Building2,
  CreditCard,
  ShieldCheck,
  RefreshCw,
  TrendingUp,
  Users,
  MapPin,
  Clock,
  MessageCircle,
  Search,
  Sparkles,
  Home,
  User,
  Phone,
  Mail,
  Shield,
  Layers
} from 'lucide-react';

// ============================================================================
// FORMATOS (CLP / CHILE)
// ============================================================================
const formatCLP = (amount) => '$' + Number(amount).toLocaleString('es-CL') + ' CLP';
const formatCLPShort = (amount) => '$' + Number(amount).toLocaleString('es-CL');

// ============================================================================
// CATÁLOGO DE CABAÑAS Y TINAJAS
// ============================================================================
const BASE_CABINS = [
  {
    id: 'cabana-copihue',
    name: 'Cabaña Copihue',
    type: 'Cabaña',
    capacity: '2 pers.',
    basePrice: 85000,
    priceLabel: '$85.000/n',
    subtitle: 'Tinaja a leña privada · Cama King',
    tag: 'Más popular',
  },
  {
    id: 'cabana-canelo',
    name: 'Cabaña Canelo',
    type: 'Cabaña',
    capacity: '4 pers.',
    basePrice: 120000,
    priceLabel: '$120.000/n',
    subtitle: 'Tinaja a leña · 1 Queen + 2 Camas',
    tag: 'Familiar',
  },
  {
    id: 'cabana-arrayan',
    name: 'Cabaña Arrayán Deluxe',
    type: 'Cabaña',
    capacity: '3 pers.',
    basePrice: 145000,
    priceLabel: '$145.000/n',
    subtitle: 'Hidromasaje & Tinaja · 1 Super King',
    tag: 'Deluxe',
  },
  {
    id: 'cabana-roble',
    name: 'Cabaña Roble Andino',
    type: 'Cabaña',
    capacity: '6 pers.',
    basePrice: 180000,
    priceLabel: '$180.000/n',
    subtitle: 'Gran Tinaja a leña · 1 King + 4 Camas',
    tag: 'Grupal',
  },
  {
    id: 'tinaja-bosque',
    name: 'Tinaja del Bosque & Hidromasaje',
    type: 'Tinaja',
    capacity: '4 pers.',
    basePrice: 45000,
    priceLabel: '$45.000/s',
    subtitle: 'Sesión privada 2 hrs · 39°C constante',
    tag: 'Sesión Relax',
  },
  {
    id: 'pack-pareja',
    name: 'Pack Pareja: Tinaja + Tabla & Vino',
    type: 'Tinaja',
    capacity: '2 pers.',
    basePrice: 65000,
    priceLabel: '$65.000/s',
    subtitle: 'Sesión 2.5 hrs · Tabla de quesos y Pinot Noir',
    tag: 'Romántico',
  },
];

// ============================================================================
// RESERVAS INICIALES
// ============================================================================
const INITIAL_BOOKINGS = [
  {
    id: 'ALW-9041',
    guestName: 'Camila Valdés',
    guestEmail: 'cvaldes@estudio.cl',
    guestPhone: '+56 9 8412 3390',
    guestRut: '18.432.910-4',
    cabinId: 'cabana-copihue',
    cabinName: 'Cabaña Copihue',
    unitType: 'Cabaña',
    checkIn: '2026-10-19',
    checkOut: '2026-10-20',
    nights: 1,
    amount: 85000,
    status: 'Pagado Webpay',
    authCode: 'AUTH-774910',
    time: '15:00',
    createdAt: 'Hoy, 10:14',
    isToday: true,
    isFinalized: false,
    isNew: false,
  },
  {
    id: 'ALW-9040',
    guestName: 'Matías Izquierdo',
    guestEmail: 'mizquierdo@sur.cl',
    guestPhone: '+56 9 7654 1120',
    guestRut: '16.998.120-K',
    cabinId: 'pack-pareja',
    cabinName: 'Pack Pareja: Tinaja + Tabla & Vino',
    unitType: 'Tinaja',
    checkIn: '2026-10-21',
    checkOut: '2026-10-22',
    nights: 1,
    amount: 65000,
    status: 'Pagado Webpay',
    authCode: 'AUTH-693012',
    time: '18:30',
    createdAt: 'Ayer, 16:30',
    isToday: false,
    isFinalized: false,
    isNew: false,
  },
  {
    id: 'ALW-9039',
    guestName: 'Francisca Donoso',
    guestEmail: 'fran.donoso@gmail.com',
    guestPhone: '+56 9 9120 4487',
    guestRut: '19.504.221-8',
    cabinId: 'tinaja-bosque',
    cabinName: 'Tinaja del Bosque & Hidromasaje',
    unitType: 'Tinaja',
    checkIn: '2026-10-23',
    checkOut: '2026-10-24',
    nights: 1,
    amount: 45000,
    status: 'Pagado Webpay',
    authCode: 'AUTH-651209',
    time: '16:00',
    createdAt: 'Ayer, 11:20',
    isToday: false,
    isFinalized: false,
    isNew: false,
  },
  {
    id: 'ALW-9038',
    guestName: 'Sebastián Ugarte',
    guestEmail: 'sugarte@clinica.cl',
    guestPhone: '+56 9 6301 9982',
    guestRut: '15.210.894-2',
    cabinId: 'cabana-canelo',
    cabinName: 'Cabaña Canelo',
    unitType: 'Cabaña',
    checkIn: '2026-10-25',
    checkOut: '2026-10-27',
    nights: 2,
    amount: 240000,
    status: 'Pagado Webpay',
    authCode: 'AUTH-590441',
    time: '15:00',
    createdAt: 'Hace 2 días',
    isToday: false,
    isFinalized: false,
    isNew: false,
  },
  {
    id: 'ALW-9037',
    guestName: 'Valentina Riquelme',
    guestEmail: 'vriquelme@diseno.cl',
    guestPhone: '+56 9 5412 8765',
    guestRut: '20.112.498-7',
    cabinId: 'cabana-arrayan',
    cabinName: 'Cabaña Arrayán Deluxe',
    unitType: 'Cabaña',
    checkIn: '2026-10-12',
    checkOut: '2026-10-14',
    nights: 2,
    amount: 290000,
    status: 'Pagado Webpay',
    authCode: 'AUTH-512088',
    time: '15:00',
    createdAt: 'Semana pasada',
    isToday: false,
    isFinalized: true,
    isNew: false,
  },
];

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

const formatDateRange = (inStr, outStr, nights) => {
  if (!inStr || !outStr) return '';
  const inParts = inStr.split('-');
  const outParts = outStr.split('-');
  if (inParts.length === 3 && outParts.length === 3) {
    const inDay = parseInt(inParts[2], 10);
    const outDay = parseInt(outParts[2], 10);
    const inMonthIdx = parseInt(inParts[1], 10) - 1;
    const outMonthIdx = parseInt(outParts[1], 10) - 1;
    const inMonthName = MONTH_NAMES[inMonthIdx] || 'Octubre';
    const outMonthName = MONTH_NAMES[outMonthIdx] || 'Octubre';
    const nightCount = nights || (outDay > inDay ? outDay - inDay : 1);
    const nightLabel = nightCount === 1 ? '1 noche' : `${nightCount} noches`;
    if (inMonthIdx === outMonthIdx) {
      return `${inDay} al ${outDay} de ${inMonthName}, ${inParts[0]} (${nightLabel})`;
    }
    return `${inDay} ${inMonthName.slice(0, 3)} al ${outDay} ${outMonthName.slice(0, 3)}, ${inParts[0]} (${nightLabel})`;
  }
  return `${inStr} al ${outStr} (${nights}n)`;
};

export default function App() {
  // Vista general: 'guest' | 'admin'
  const [activeView, setActiveView] = useState('guest');

  // Pestaña activa en Vista Huésped Móvil: 'cabins' | 'dates' | 'checkout'
  const [guestMobileTab, setGuestMobileTab] = useState('cabins');

  // Filtro de categoría en catálogo: 'all' | 'cabana' | 'tinaja'
  const [cabinCategoryFilter, setCabinCategoryFilter] = useState('all');

  // Navegación del Panel Admin: 'reservas' | 'ingresos' | 'clientes'
  const [adminSection, setAdminSection] = useState('reservas');

  // Modal de calendario en móvil para Admin
  const [isAdminCalendarModalOpen, setIsAdminCalendarModalOpen] = useState(false);

  // Temporada Alta (+20%)
  const [isHighSeason, setIsHighSeason] = useState(() => {
    try {
      return localStorage.getItem('demo_high_season') === 'true';
    } catch {
      return false;
    }
  });

  // Catálogo dinámico según temporada
  const cabins = useMemo(() => {
    return BASE_CABINS.map((c) => {
      const price = isHighSeason ? Math.round(c.basePrice * 1.2) : c.basePrice;
      const unit = c.type === 'Tinaja' ? '/s' : '/n';
      return {
        ...c,
        price,
        priceLabel: `${formatCLPShort(price)}${unit}`,
      };
    });
  }, [isHighSeason]);

  const [selectedCabin, setSelectedCabin] = useState(cabins[0]);

  useEffect(() => {
    const updated = cabins.find((c) => c.id === selectedCabin.id) || cabins[0];
    setSelectedCabin(updated);
  }, [isHighSeason]);

  // Cabañas filtradas por categoría
  const filteredCabins = useMemo(() => {
    if (cabinCategoryFilter === 'cabana') return cabins.filter((c) => c.type === 'Cabaña');
    if (cabinCategoryFilter === 'tinaja') return cabins.filter((c) => c.type === 'Tinaja');
    return cabins;
  }, [cabins, cabinCategoryFilter]);

  // Calendario (Octubre 2026)
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(9); // Octubre

  // Selección de fechas Huésped
  const [checkInDay, setCheckInDay] = useState(null);
  const [checkOutDay, setCheckOutDay] = useState(null);

  // Formulario Huésped
  const [guestForm, setGuestForm] = useState({
    name: '',
    phone: '',
    email: '',
  });

  // Modal Webpay Plus
  const [isWebpayModalOpen, setIsWebpayModalOpen] = useState(false);
  const [webpayMethod, setWebpayMethod] = useState('debito');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedReservation, setCompletedReservation] = useState(null);

  // Reservas en memoria / localStorage
  const [reservations, setReservations] = useState(() => {
    try {
      const s = localStorage.getItem('demo_reservas_editorial_v2');
      if (s) return JSON.parse(s);
    } catch {}
    return INITIAL_BOOKINGS;
  });

  // Días bloqueados por mantención
  const [blockedDays, setBlockedDays] = useState(() => {
    try {
      const s = localStorage.getItem('demo_blocked_days_v2');
      if (s) return JSON.parse(s);
    } catch {}
    return [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
  });

  // Filtros Admin
  const [adminTimeFilter, setAdminTimeFilter] = useState('all');
  const [adminUnitFilter, setAdminUnitFilter] = useState('all');
  const [adminSelectedDay, setAdminSelectedDay] = useState(null);
  const [isCalendarDropdownOpen, setIsCalendarDropdownOpen] = useState(false);
  const [calendarActionMode, setCalendarActionMode] = useState('filter');

  // Buscador Clientes
  const [clientSearch, setClientSearch] = useState('');

  // Toast
  const [toast, setToast] = useState(null);

  useEffect(() => {
    localStorage.setItem('demo_reservas_editorial_v2', JSON.stringify(reservations));
  }, [reservations]);

  useEffect(() => {
    localStorage.setItem('demo_blocked_days_v2', JSON.stringify(blockedDays));
  }, [blockedDays]);

  useEffect(() => {
    localStorage.setItem('demo_high_season', String(isHighSeason));
  }, [isHighSeason]);

  const showToast = (title, desc) => {
    setToast({ title, desc });
    setTimeout(() => setToast(null), 3800);
  };

  // Cálculo de noches y montos
  const nightsCount = useMemo(() => {
    if (!checkInDay || !checkOutDay) return 0;
    const diff = checkOutDay - checkInDay;
    return diff > 0 ? diff : 0;
  }, [checkInDay, checkOutDay]);

  const totalPrice = useMemo(() => {
    if (nightsCount > 0) return nightsCount * selectedCabin.price;
    return 0;
  }, [nightsCount, selectedCabin]);

  const payAmount = useMemo(() => {
    if (nightsCount > 0) return totalPrice;
    return selectedCabin.price;
  }, [nightsCount, totalPrice, selectedCabin]);

  // Selección de días en el calendario
  const handleDayClick = (day) => {
    if (blockedDays.includes(day)) return;

    if (!checkInDay || (checkInDay && checkOutDay)) {
      setCheckInDay(day);
      setCheckOutDay(null);
    } else if (checkInDay && !checkOutDay) {
      if (day > checkInDay) {
        setCheckOutDay(day);
      } else {
        setCheckInDay(day);
        setCheckOutDay(null);
      }
    }
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  // Días del mes para el calendario
  const monthDays = useMemo(() => {
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const offset = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();

    const blanks = Array.from({ length: offset }).map((_, i) => ({
      blank: true,
      key: `b-${i}`,
    }));

    const days = Array.from({ length: totalDays }).map((_, i) => {
      const d = i + 1;
      const isBlocked = blockedDays.includes(d);
      const isCheckIn = checkInDay === d;
      const isCheckOut = checkOutDay === d;
      const isInRange = checkInDay && checkOutDay && d > checkInDay && d < checkOutDay;

      return {
        day: d,
        isBlocked,
        isCheckIn,
        isCheckOut,
        isInRange,
        key: `d-${d}`,
      };
    });

    return [...blanks, ...days];
  }, [currentYear, currentMonth, blockedDays, checkInDay, checkOutDay]);

  // Iniciar pago Webpay
  const handlePayClick = (e) => {
    if (e) e.preventDefault();
    if (!guestForm.name.trim()) {
      showToast('Datos requeridos', 'Por favor ingresa tu Nombre y Apellido');
      return;
    }
    if (!guestForm.phone.trim()) {
      showToast('Datos requeridos', 'Por favor ingresa tu Teléfono WhatsApp');
      return;
    }
    setIsWebpayModalOpen(true);
  };

  // Confirmar pago en Webpay Plus
  const handleConfirmWebpay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const auth = 'AUTH-' + Math.floor(100000 + Math.random() * 900000);
      const order = 'ALW-' + Math.floor(9045 + Math.random() * 900);

      // Control estricto de fechas: Garantiza que check-out sea siempre posterior a check-in
      const startDay = checkInDay || 20;
      let endDay = checkOutDay;
      if (!endDay || endDay <= startDay) {
        endDay = startDay + (nightsCount > 0 ? nightsCount : 1);
      }
      const finalNights = endDay - startDay;

      const inDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(startDay).padStart(2, '0')}`;
      const outDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(endDay).padStart(2, '0')}`;
      const finalAmount = finalNights > 0 ? finalNights * selectedCabin.price : selectedCabin.price;

      const newRes = {
        id: order,
        guestName: guestForm.name.trim(),
        guestPhone: guestForm.phone.trim(),
        guestEmail: guestForm.email.trim() || 'contacto@demo.cl',
        guestRut: '17.892.410-5',
        cabinId: selectedCabin.id,
        cabinName: selectedCabin.name,
        unitType: selectedCabin.type,
        checkIn: inDate,
        checkOut: outDate,
        nights: finalNights,
        amount: finalAmount,
        status: 'Pagado Webpay',
        authCode: auth,
        time: '15:00',
        createdAt: 'Justo ahora',
        isToday: false,
        isFinalized: false,
        isNew: true,
      };

      setReservations((prev) => [newRes, ...prev]);
      setCompletedReservation(newRes);
      setIsProcessing(false);
      showToast('¡Pago Aprobado!', `Reserva ${order} confirmada`);

      // AUTO-DESCARGA INMEDIATA DEL COMPROBANTE EN PDF TRAS CONFIRMAR EL PAGO
      setTimeout(() => {
        handleDownloadPDFReceipt(newRes);
      }, 350);
    }, 1400);
  };

  // Generar y descargar Comprobante oficial en PDF
  const handleDownloadPDFReceipt = (res) => {
    if (!res) return;

    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const margin = 20;
      const pageWidth = 210;
      const contentWidth = pageWidth - margin * 2;
      let y = 24;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(26);
      doc.setTextColor(9, 9, 11);
      doc.text('demo.', margin, y);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(9, 9, 11);
      doc.text('COMPROBANTE DE RESERVA', pageWidth - margin, y - 6, { align: 'right' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(113, 113, 122);
      doc.text(`N° Reserva: ${res.id}`, pageWidth - margin, y - 1, { align: 'right' });
      doc.text(`Cod. Autorización: ${res.authCode || 'AUTH-811176'}`, pageWidth - margin, y + 3.5, { align: 'right' });
      const nowStr = new Date().toLocaleDateString('es-CL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      doc.text(`Fecha Emisión: ${nowStr}`, pageWidth - margin, y + 8, { align: 'right' });

      y += 16;
      doc.setDrawColor(228, 228, 231);
      doc.setLineWidth(0.3);
      doc.line(margin, y, pageWidth - margin, y);
      y += 8;

      doc.setFillColor(250, 250, 250);
      doc.rect(margin, y, contentWidth, 11, 'F');
      doc.setDrawColor(228, 228, 231);
      doc.rect(margin, y, contentWidth, 11, 'S');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(5, 150, 105);
      doc.text('ESTADO: PAGO APROBADO CON WEBPAY PLUS', margin + 5, y + 7);

      y += 18;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(9, 9, 11);
      doc.text('1. Datos del Huésped Titular', margin, y);
      y += 6;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(113, 113, 122);
      doc.text(`Nombre: ${res.guestName}`, margin, y);
      doc.text(`RUT: ${res.guestRut || '17.892.410-5'}`, margin + 80, y);
      y += 5;
      doc.text(`WhatsApp: ${res.guestPhone}`, margin, y);
      doc.text(`Correo: ${res.guestEmail || 'cvaldes@estudio.cl'}`, margin + 80, y);

      y += 12;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(9, 9, 11);
      doc.text('2. Detalle del Alojamiento & Fechas', margin, y);
      y += 6;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(113, 113, 122);
      doc.text(`Unidad: ${res.cabinName} (${res.unitType || 'Cabaña'})`, margin, y);
      y += 5;
      const formattedDates = formatDateRange(res.checkIn, res.checkOut, res.nights);
      doc.text(`Estadía: ${formattedDates}`, margin, y);
      y += 5;
      doc.text(`Horarios: Check-in 15:00 hrs  —  Check-out 12:00 hrs`, margin, y);

      y += 14;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(9, 9, 11);
      doc.text('3. Desglose del Pago', margin, y);
      y += 6;

      doc.setDrawColor(228, 228, 231);
      doc.line(margin, y, pageWidth - margin, y);
      y += 6;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(113, 113, 122);
      doc.text(`Tarifa total estadía (${res.nights} noche/s)`, margin, y);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(9, 9, 11);
      doc.text(formatCLP(res.amount), pageWidth - margin, y, { align: 'right' });
      y += 6;

      doc.setDrawColor(228, 228, 231);
      doc.line(margin, y, pageWidth - margin, y);
      y += 8;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(9, 9, 11);
      doc.text('TOTAL PAGADO WEBPAY:', margin, y);
      doc.text(formatCLP(res.amount), pageWidth - margin, y, { align: 'right' });

      y += 18;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(9, 9, 11);
      doc.text('Información de Contacto & Check-in:', margin, y);
      y += 5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(113, 113, 122);
      doc.text('WhatsApp Recepción Anfitrión: +56 9 9459 7751', margin, y);
      y += 4.5;
      doc.text('Nuestro equipo te enviará la ubicación exacta y coordinará el encendido de la tinaja.', margin, y);

      y = 270;
      doc.setFontSize(8);
      doc.setTextColor(161, 161, 170);
      doc.text('demo. — Plataforma de Gestión y Reservas de Alojamientos Turísticos & Tinajas.', margin, y);

      doc.save(`Comprobante-demo-${res.id}.pdf`);
      showToast('Descarga completada', `Comprobante PDF ${res.id} descargado`);
    } catch (err) {
      console.error('Error al generar PDF:', err);
      showToast('Error', 'No se pudo generar el PDF del comprobante');
    }
  };

  const handleDownloadReceipt = handleDownloadPDFReceipt;

  // Exportar CSV en Admin
  const handleExportCSV = () => {
    const headers = ['ID,Huesped,Email,Telefono,Unidad,Tipo,CheckIn,CheckOut,Monto,Estado,AuthCode'];
    const rows = reservations.map(
      (r) =>
        `"${r.id}","${r.guestName}","${r.guestEmail}","${r.guestPhone}","${r.cabinName}","${r.unitType || 'Cabaña'}","${r.checkIn}","${r.checkOut}",${r.amount},"${r.status}","${r.authCode}"`
    );
    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Planilla-Ventas-Webpay-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Exportación exitosa', 'Planilla de ventas y códigos Webpay descargada');
  };

  // Simular nueva reserva entrante
  const handleSimulateIncoming = () => {
    const auth = 'AUTH-' + Math.floor(100000 + Math.random() * 900000);
    const order = 'ALW-' + Math.floor(9100 + Math.random() * 899);
    const simulated = {
      id: order,
      guestName: 'Juan Pérez',
      guestEmail: 'juan.perez@gmail.com',
      guestPhone: '+56 9 9401 2280',
      guestRut: '17.892.410-5',
      cabinId: 'cabana-copihue',
      cabinName: 'Cabaña Copihue',
      unitType: 'Cabaña',
      checkIn: '2026-10-19',
      checkOut: '2026-10-20',
      nights: 1,
      amount: 85000,
      status: 'Pagado Webpay',
      authCode: auth,
      time: '18:00',
      createdAt: 'Justo ahora',
      isToday: true,
      isFinalized: false,
      isNew: true,
    };
    setReservations((prev) => [simulated, ...prev]);
    showToast(
      '¡Nueva reserva pagada!',
      'Juan Pérez acaba de reservar Cabaña Copihue ($85.000 CLP)'
    );
  };

  // Toggle Temporada Alta
  const handleToggleHighSeason = () => {
    const next = !isHighSeason;
    setIsHighSeason(next);
    showToast(
      next ? 'Modo Temporada Alta' : 'Tarifa Estándar',
      next
        ? 'Tarifas actualizadas a Temporada Alta (+20%)'
        : 'Tarifas restablecidas a temporada regular'
    );
  };

  // Liberar o bloquear días en bloque
  const handleToggleMaintenance = () => {
    if (blockedDays.length > 0) {
      setBlockedDays([]);
      showToast('Disponibilidad actualizada', 'Todos los días fueron liberados');
    } else {
      setBlockedDays([5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]);
      showToast('Mantención activada', 'Días 5 al 18 bloqueados por mantención');
    }
  };

  // Bloquear/Desbloquear un día individual desde el mini calendario
  const handleAdminCalendarDayClick = (day) => {
    if (calendarActionMode === 'block') {
      setBlockedDays((prev) =>
        prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
      );
    } else {
      setAdminSelectedDay((prev) => (prev === day ? null : day));
      setIsCalendarDropdownOpen(false);
      setIsAdminCalendarModalOpen(false);
    }
  };

  // Reservas mapeadas por día
  const adminBookingsByDay = useMemo(() => {
    const map = {};
    reservations.forEach((r) => {
      if (adminUnitFilter !== 'all' && r.cabinId !== adminUnitFilter) return;
      const parts = r.checkIn.split('-');
      if (parts.length === 3) {
        const d = parseInt(parts[2], 10);
        if (!map[d]) map[d] = [];
        map[d].push(r);
      }
    });
    return map;
  }, [reservations, adminUnitFilter]);

  // Contadores de pestañas
  const tabCounts = useMemo(() => {
    const today = reservations.filter((r) => r.isToday || r.checkIn === '2026-10-19').length;
    const next7 = reservations.filter(
      (r) => r.checkIn >= '2026-10-19' && r.checkIn <= '2026-10-26'
    ).length;
    const fin = reservations.filter((r) => r.isFinalized).length;
    return { all: 28 + (reservations.length - 5), today, next7, fin };
  }, [reservations]);

  // Reservas filtradas
  const filteredBookings = useMemo(() => {
    return reservations.filter((r) => {
      if (adminUnitFilter !== 'all') {
        if (adminUnitFilter === 'type-cabana' && r.unitType !== 'Cabaña') return false;
        if (adminUnitFilter === 'type-tinaja' && r.unitType !== 'Tinaja') return false;
        if (
          adminUnitFilter !== 'type-cabana' &&
          adminUnitFilter !== 'type-tinaja' &&
          r.cabinId !== adminUnitFilter
        ) {
          return false;
        }
      }

      if (adminSelectedDay) {
        const d = parseInt(r.checkIn.split('-')[2], 10);
        if (d !== adminSelectedDay) return false;
      }

      if (adminTimeFilter === 'today') return r.isToday || r.checkIn === '2026-10-19';
      if (adminTimeFilter === 'next7') {
        return r.checkIn >= '2026-10-19' && r.checkIn <= '2026-10-26';
      }
      if (adminTimeFilter === 'finalized') return r.isFinalized;
      return true;
    });
  }, [reservations, adminTimeFilter, adminUnitFilter, adminSelectedDay]);

  // Clientes únicos
  const clientsList = useMemo(() => {
    const map = new Map();
    reservations.forEach((r) => {
      const key = r.guestPhone || r.guestName;
      if (!map.has(key)) {
        map.set(key, {
          name: r.guestName,
          phone: r.guestPhone,
          email: r.guestEmail,
          rut: r.guestRut,
          lastCabin: r.cabinName,
          lastDate: r.checkIn,
          totalSpent: r.amount,
          visits: 1,
        });
      } else {
        const existing = map.get(key);
        existing.totalSpent += r.amount;
        existing.visits += 1;
      }
    });
    const arr = Array.from(map.values());
    if (!clientSearch.trim()) return arr;
    const q = clientSearch.toLowerCase();
    return arr.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        c.lastCabin.toLowerCase().includes(q)
    );
  }, [reservations, clientSearch]);

  // Ingresos agrupados por unidad
  const revenueByUnit = useMemo(() => {
    return BASE_CABINS.map((c) => {
      const unitBookings = reservations.filter(
        (r) => r.cabinId === c.id || r.cabinName === c.name
      );
      const sum = unitBookings.reduce((acc, b) => acc + b.amount, 0) + c.basePrice * 3;
      return {
        id: c.id,
        name: c.name,
        type: c.type,
        bookingsCount: unitBookings.length + 3,
        revenue: sum,
      };
    });
  }, [reservations]);

  return (
    <div className="min-h-screen bg-[#FBFBFB] lg:bg-white text-[#09090B] font-sans antialiased selection:bg-[#18181B] selection:text-white flex flex-col justify-between pb-24 lg:pb-0">
      {/* ===================================================================
          BARRA SUPERIOR (HEADER / APP BAR NATIVO)
         =================================================================== */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E4E4E7] px-4 sm:px-6 py-2.5 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#18181B] text-white flex items-center justify-center font-bold text-xs">
            d.
          </div>
          <div>
            <span className="font-display text-sm sm:text-base font-bold tracking-tight text-[#09090B] select-none block leading-tight">
              demo<span className="text-[#18181B]">.</span>
            </span>
            <span className="text-[10px] text-[#71717A] tracking-wider uppercase hidden sm:block">
              Refugio & Tinajas
            </span>
          </div>
        </div>

        {/* CONTROLES DERECHA */}
        <div className="flex items-center gap-2">
          {isHighSeason && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              Alta +20%
            </span>
          )}

          <div className="inline-flex p-0.5 rounded-full bg-[#F4F4F5] border border-[#E4E4E7]">
            <button
              onClick={() => setActiveView('guest')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeView === 'guest'
                  ? 'bg-white text-[#09090B] shadow-2xs'
                  : 'text-[#71717A] hover:text-[#09090B]'
              }`}
            >
              Huésped
            </button>
            <button
              onClick={() => setActiveView('admin')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeView === 'admin'
                  ? 'bg-[#18181B] text-white shadow-2xs'
                  : 'text-[#71717A] hover:text-[#09090B]'
              }`}
            >
              <span>Admin</span>
              {reservations.some((r) => r.isNew) && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ===================================================================
          TOAST NOTIFICATION NATIVO
         =================================================================== */}
      {toast && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 max-w-sm w-[92%] bg-white/95 backdrop-blur-md border border-[#E4E4E7] shadow-[0_12px_32px_rgba(0,0,0,0.12)] rounded-2xl p-3.5 flex items-center gap-3 animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0 text-xs">
            <p className="font-bold text-[#09090B]">{toast.title}</p>
            <p className="text-[#71717A] truncate">{toast.desc}</p>
          </div>
          <button onClick={() => setToast(null)} className="text-neutral-400 hover:text-black">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ===================================================================
          VISTA 1: MODO HUÉSPED
         =================================================================== */}
      {activeView === 'guest' ? (
        <div className="flex-1 w-full max-w-6xl mx-auto flex flex-col items-center">
          {/* HEADER HUÉSPED (LOGO EDITORIAL) */}
          <div className="text-center pt-4 pb-2 sm:py-6 flex flex-col items-center px-4">
            <svg
              className="w-9 h-9 sm:w-10 sm:h-10 text-[#09090B] mb-2"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="4"
                y="4"
                width="32"
                height="32"
                rx="9"
                stroke="currentColor"
                strokeWidth="1.75"
              />
              <path
                d="M12 26L20 13L28 26H12Z"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16.5 26L20 20.2L23.5 26"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="20" cy="9.5" r="1.25" fill="currentColor" />
            </svg>
            <h1 className="font-display text-base sm:text-lg font-bold tracking-[0.25em] text-[#09090B] uppercase">
              Tu logo
            </h1>
          </div>

          {/* ===============================================================
              EXPERIENCIA MÓVIL APP (Pestañas de Paso / Segmented Control)
              Visible solo en móvil (< lg)
             =============================================================== */}
          <div className="lg:hidden w-full px-4 mb-4">
            <div className="grid grid-cols-3 p-1 rounded-2xl bg-[#EFEFEF] border border-[#E4E4E7] text-xs font-semibold">
              <button
                onClick={() => setGuestMobileTab('cabins')}
                className={`py-2 px-1 rounded-xl transition-all flex items-center justify-center gap-1.5 active-press ${
                  guestMobileTab === 'cabins'
                    ? 'bg-[#18181B] text-white shadow-2xs font-bold'
                    : 'text-[#71717A]'
                }`}
              >
                <Home className="w-3.5 h-3.5" />
                <span>1. Unidad</span>
              </button>

              <button
                onClick={() => setGuestMobileTab('dates')}
                className={`py-2 px-1 rounded-xl transition-all flex items-center justify-center gap-1.5 active-press ${
                  guestMobileTab === 'dates'
                    ? 'bg-[#18181B] text-white shadow-2xs font-bold'
                    : 'text-[#71717A]'
                }`}
              >
                <CalendarIcon className="w-3.5 h-3.5" />
                <span>2. Fechas</span>
                {checkInDay && checkOutDay && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                )}
              </button>

              <button
                onClick={() => setGuestMobileTab('checkout')}
                className={`py-2 px-1 rounded-xl transition-all flex items-center justify-center gap-1.5 active-press ${
                  guestMobileTab === 'checkout'
                    ? 'bg-[#18181B] text-white shadow-2xs font-bold'
                    : 'text-[#71717A]'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>3. Pago</span>
              </button>
            </div>
          </div>

          {/* ===============================================================
              CONTENEDOR PRINCIPAL:
              - En móvil: muestra la pestaña activa (Unidad / Fechas / Pago)
              - En desktop (lg): muestra las 3 columnas en paralelo
             =============================================================== */}
          <div className="w-full px-4 sm:px-6">
            <div className="w-full flex flex-col lg:flex-row items-stretch lg:items-start justify-center gap-4 lg:gap-5">
              
              {/* -------------------------------------------------------------
                  COLUMNA 1: CATÁLOGO DE CABAÑAS Y TINAJAS
                 ------------------------------------------------------------- */}
              <div
                className={`w-full lg:w-[330px] bg-white border border-[#E4E4E7] rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between shrink-0 ${
                  guestMobileTab !== 'cabins' ? 'hidden lg:flex' : 'flex'
                }`}
              >
                <div>
                  {/* Filtro por Categoría en Móvil/Desktop */}
                  <div className="flex items-center justify-between pb-3 border-b border-[#E4E4E7] mb-3">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#71717A] block">
                        Elige tu espacio
                      </span>
                      <span className="text-[10px] text-[#A1A1AA]">
                        {filteredCabins.length} opciones disponibles
                      </span>
                    </div>
                    <div className="inline-flex p-0.5 rounded-lg bg-[#F4F4F5] text-[10px] font-semibold">
                      <button
                        onClick={() => setCabinCategoryFilter('all')}
                        className={`px-2 py-1 rounded-md cursor-pointer transition-colors ${
                          cabinCategoryFilter === 'all'
                            ? 'bg-white text-[#09090B] shadow-2xs font-bold'
                            : 'text-[#71717A] hover:text-[#09090B]'
                        }`}
                      >
                        Todas ({cabins.length})
                      </button>
                      <button
                        onClick={() => setCabinCategoryFilter('cabana')}
                        className={`px-2 py-1 rounded-md cursor-pointer transition-colors ${
                          cabinCategoryFilter === 'cabana'
                            ? 'bg-white text-[#09090B] shadow-2xs font-bold'
                            : 'text-[#71717A] hover:text-[#09090B]'
                        }`}
                      >
                        Cabañas
                      </button>
                      <button
                        onClick={() => setCabinCategoryFilter('tinaja')}
                        className={`px-2 py-1 rounded-md cursor-pointer transition-colors ${
                          cabinCategoryFilter === 'tinaja'
                            ? 'bg-white text-[#09090B] shadow-2xs font-bold'
                            : 'text-[#71717A] hover:text-[#09090B]'
                        }`}
                      >
                        Tinajas
                      </button>
                    </div>
                  </div>

                  {/* Lista de Tarjetas estilizadas, compactas y balanceadas en Desktop */}
                  <div className="space-y-1.5 lg:max-h-[320px] overflow-y-auto pr-1 slim-scrollbar">
                    {filteredCabins.map((cabin) => {
                      const isSelected = selectedCabin.id === cabin.id;
                      return (
                        <button
                          key={cabin.id}
                          onClick={() => setSelectedCabin(cabin)}
                          className={`w-full text-left px-3 py-2.5 rounded-xl border transition-all cursor-pointer active-press ${
                            isSelected
                              ? 'bg-[#18181B] text-white border-[#18181B] shadow-sm ring-1 ring-[#18181B]'
                              : 'bg-[#FAFAFA] hover:bg-neutral-100 text-[#09090B] border-[#E4E4E7]'
                          }`}
                        >
                          {/* Fila 1: Nombre, Tag/Badge y Precio */}
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span className="font-bold text-xs truncate">{cabin.name}</span>
                              {isSelected ? (
                                <span className="inline-flex items-center gap-0.5 text-[9px] font-bold bg-[#F0A71D] text-[#18181B] px-1.5 py-0.2 rounded-full shrink-0">
                                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                                  Elegida
                                </span>
                              ) : cabin.tag ? (
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-neutral-200/60 text-[#71717A] font-medium shrink-0">
                                  {cabin.tag}
                                </span>
                              ) : null}
                            </div>
                            <span
                              className={`text-xs font-bold tabular-nums shrink-0 ${
                                isSelected ? 'text-[#F0A71D]' : 'text-[#09090B]'
                              }`}
                            >
                              {cabin.priceLabel}
                            </span>
                          </div>

                          {/* Fila 2: Subtítulo descriptivo y Capacidad */}
                          <div className="flex items-center justify-between gap-2 mt-1">
                            <p
                              className={`text-[11px] truncate ${
                                isSelected ? 'text-white/75' : 'text-[#71717A]'
                              }`}
                            >
                              {cabin.subtitle}
                            </p>
                            <span
                              className={`text-[10px] font-semibold shrink-0 ${
                                isSelected ? 'text-white/70' : 'text-[#71717A]'
                              }`}
                            >
                              {cabin.capacity}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Resumen inferior de cabaña seleccionada en Desktop */}
                <div className="pt-3 mt-3 border-t border-[#E4E4E7] hidden lg:flex items-center justify-between text-xs text-[#71717A]">
                  <span className="truncate">
                    Seleccionado: <strong className="text-[#09090B]">{selectedCabin.name}</strong>
                  </span>
                  <span className="font-bold text-[#09090B] tabular-nums shrink-0">
                    {selectedCabin.priceLabel}
                  </span>
                </div>

                {/* Botón continuar en Móvil (Pestaña 1) */}
                <div className="lg:hidden pt-3 border-t border-[#E4E4E7]">
                  <button
                    onClick={() => setGuestMobileTab('dates')}
                    className="w-full py-3.5 px-4 rounded-xl bg-[#18181B] active-press text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
                  >
                    <span>Elegir Fechas para {selectedCabin.name}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* -------------------------------------------------------------
                  COLUMNA 2: CALENDARIO HUÉSPED
                 ------------------------------------------------------------- */}
              <div
                className={`w-full lg:w-[330px] bg-white border border-[#E4E4E7] rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between shrink-0 ${
                  guestMobileTab !== 'dates' ? 'hidden lg:flex' : 'flex'
                }`}
              >
                <div>
                  {/* Resumen de cabaña elegida en móvil */}
                  <div className="lg:hidden p-2.5 rounded-xl bg-[#FAFAFA] border border-[#E4E4E7] mb-3.5 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#71717A] block">
                        Alojamiento seleccionado:
                      </span>
                      <span className="text-xs font-bold text-[#09090B]">
                        {selectedCabin.name}
                      </span>
                    </div>
                    <button
                      onClick={() => setGuestMobileTab('cabins')}
                      className="text-[10px] font-semibold text-emerald-700 underline"
                    >
                      Cambiar
                    </button>
                  </div>

                  <div className="flex items-center justify-between mb-3.5">
                    <h2 className="font-bold text-xs sm:text-sm text-[#09090B]">
                      {MONTH_NAMES[currentMonth]} {currentYear}
                    </h2>
                    <div className="flex items-center gap-1 text-[#71717A]">
                      <button
                        onClick={handlePrevMonth}
                        className="p-1.5 hover:text-black cursor-pointer active-press"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleNextMonth}
                        className="p-1.5 hover:text-black cursor-pointer active-press"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-[#71717A] mb-2">
                    <span>Lu</span>
                    <span>Ma</span>
                    <span>Mi</span>
                    <span>Ju</span>
                    <span>Vi</span>
                    <span>Sá</span>
                    <span>Do</span>
                  </div>

                  <div className="grid grid-cols-7 gap-1 text-center text-xs">
                    {monthDays.map((item) => {
                      if (item.blank) return <div key={item.key} className="h-9" />;
                      const isSelected = item.isCheckIn || item.isCheckOut;
                      const isInBetween = item.isInRange;

                      return (
                        <button
                          key={item.key}
                          disabled={item.isBlocked}
                          onClick={() => handleDayClick(item.day)}
                          className={`h-9 w-9 mx-auto rounded-full flex items-center justify-center text-xs transition-all active-press ${
                            item.isBlocked
                              ? 'text-neutral-300 line-through cursor-not-allowed bg-neutral-50/50'
                              : isSelected
                              ? 'bg-[#18181B] text-white font-bold shadow-xs'
                              : isInBetween
                              ? 'bg-[#F4F4F5] text-[#09090B] font-semibold'
                              : 'text-[#09090B] hover:bg-[#F4F4F5] cursor-pointer'
                          }`}
                        >
                          {item.day}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-3.5 mt-3 border-t border-[#E4E4E7] text-xs text-[#71717A] flex items-center justify-between">
                  <span>
                    {checkInDay && checkOutDay
                      ? `${checkInDay} ${MONTH_NAMES[currentMonth].slice(0, 3)} — ${checkOutDay} ${MONTH_NAMES[
                          currentMonth
                        ].slice(0, 3)} (${nightsCount}n)`
                      : checkInDay
                      ? `Entrada: ${checkInDay} ${MONTH_NAMES[currentMonth].slice(0, 3)} (Elige salida)`
                      : 'Selecciona tus fechas'}
                  </span>
                  {nightsCount > 0 && (
                    <span className="font-bold text-[#09090B] tabular-nums">
                      {formatCLPShort(totalPrice)}
                    </span>
                  )}
                </div>

                {/* Acciones móviles en Pestaña 2 */}
                <div className="lg:hidden pt-4 flex gap-2">
                  <button
                    onClick={() => setGuestMobileTab('cabins')}
                    className="flex-1 py-3 px-3 rounded-xl border border-[#E4E4E7] text-xs font-semibold text-[#71717A] active-press"
                  >
                    ← Volver
                  </button>
                  <button
                    onClick={() => setGuestMobileTab('checkout')}
                    disabled={!checkInDay}
                    className={`flex-2 py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 active-press ${
                      checkInDay
                        ? 'bg-[#18181B] text-white shadow-xs'
                        : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                    }`}
                  >
                    <span>Continuar al Pago</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* -------------------------------------------------------------
                  COLUMNA 3: DATOS Y PAGO WEBPAY
                 ------------------------------------------------------------- */}
              <div
                className={`w-full lg:w-[330px] bg-white border border-[#E4E4E7] rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between shrink-0 space-y-3 ${
                  guestMobileTab !== 'checkout' ? 'hidden lg:flex' : 'flex'
                }`}
              >
                {/* Resumen móvil de la selección */}
                <div className="p-3 rounded-xl bg-[#FAFAFA] border border-[#E4E4E7] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#09090B]">{selectedCabin.name}</span>
                    <span className="text-[10px] text-[#71717A]">{selectedCabin.capacity}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#71717A] pt-1 border-t border-[#E4E4E7]/60">
                    <span>
                      {checkInDay && checkOutDay
                        ? `${checkInDay} al ${checkOutDay} ${MONTH_NAMES[currentMonth].slice(0, 3)}`
                        : checkInDay
                        ? `${checkInDay} ${MONTH_NAMES[currentMonth].slice(0, 3)} (1 noche)`
                        : 'Fecha sugerida: 20-21 Oct'}
                    </span>
                    <span className="font-bold text-[#09090B]">
                      {nightsCount > 0 ? `${nightsCount} noche(s)` : '1 noche'}
                    </span>
                  </div>
                </div>

                <form onSubmit={handlePayClick} className="space-y-2.5">
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-[#71717A] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Nombre y Apellido"
                      value={guestForm.name}
                      onChange={(e) => setGuestForm((p) => ({ ...p, name: e.target.value }))}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#E4E4E7] text-xs text-[#09090B] focus:outline-none focus:border-[#09090B] placeholder:text-[#71717A] bg-white"
                    />
                  </div>

                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-[#71717A] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      placeholder="Teléfono WhatsApp (+56 9...)"
                      value={guestForm.phone}
                      onChange={(e) => setGuestForm((p) => ({ ...p, phone: e.target.value }))}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#E4E4E7] text-xs text-[#09090B] focus:outline-none focus:border-[#09090B] placeholder:text-[#71717A] bg-white"
                    />
                  </div>

                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-[#71717A] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      placeholder="Correo electrónico"
                      value={guestForm.email}
                      onChange={(e) => setGuestForm((p) => ({ ...p, email: e.target.value }))}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#E4E4E7] text-xs text-[#09090B] focus:outline-none focus:border-[#09090B] placeholder:text-[#71717A] bg-white"
                    />
                  </div>

                  <div className="bg-[#FAFAFA] text-[#09090B] border border-[#E4E4E7] rounded-xl py-2.5 px-3 text-center text-xs font-medium">
                    {isHighSeason ? (
                      <span className="text-emerald-700 font-semibold">
                        Tarifa Temporada Alta (+20%): 100% ({formatCLPShort(payAmount)})
                      </span>
                    ) : (
                      <span>Tarifa Oficial Webpay: 100% ({formatCLPShort(payAmount)})</span>
                    )}
                  </div>

                  <div className="flex justify-between items-center pt-1 text-xs text-[#71717A]">
                    <span>Total a autorizar:</span>
                    <span className="font-bold text-sm text-[#09090B] tabular-nums">
                      {formatCLPShort(payAmount)}
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#18181B] hover:bg-neutral-800 active-press text-white font-bold text-xs py-3.5 px-4 rounded-xl transition-all cursor-pointer shadow-xs mt-1 flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Pagar con Webpay ({formatCLPShort(payAmount)})</span>
                  </button>
                </form>

                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() =>
                      setGuestForm({
                        name: 'Camila Valdés',
                        phone: '+56 9 8412 3390',
                        email: 'cvaldes@estudio.cl',
                      })
                    }
                    className="text-[11px] text-[#71717A] hover:text-[#09090B] underline cursor-pointer active-press"
                  >
                    Autocompletar datos demo
                  </button>
                </div>

                <div className="pt-2 border-t border-[#E4E4E7] flex items-center justify-center gap-3 text-[10px] text-[#71717A]">
                  <span className="flex items-center gap-1">
                    <Shield className="w-3 h-3 text-emerald-600" /> Webpay Plus
                  </span>
                  <span>·</span>
                  <span>Confirmación WhatsApp</span>
                  <span>·</span>
                  <span>Sin comisión extra</span>
                </div>
              </div>

            </div>
          </div>

          {/* Enlace discreto a administración en desktop */}
          <div className="hidden lg:flex w-full max-w-4xl justify-end mt-8 pr-1">
            <button
              onClick={() => setActiveView('admin')}
              className="text-xs font-mono text-[#71717A] hover:text-[#09090B] transition-colors cursor-pointer"
            >
              administración +
            </button>
          </div>
        </div>
      ) : (
        /* ===================================================================
           VISTA 2: PANEL ADMINISTRADOR (MOBILE & DESKTOP NATIVO)
           =================================================================== */
        <div className="flex-1 flex flex-col md:flex-row max-w-6xl w-full mx-auto">
          {/* ---------------------------------------------------------------
              SIDEBAR (Visible en Desktop md+)
             --------------------------------------------------------------- */}
          <aside className="hidden md:flex w-56 shrink-0 border-r border-[#E4E4E7] bg-[#FAFAFA]/70 p-5 flex-col justify-between gap-4">
            <div>
              <div className="pb-4 mb-4 border-b border-[#E4E4E7]">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#71717A]">
                  Administración
                </p>
                <h2 className="text-sm font-bold text-[#09090B] mt-0.5">Tu logo · Refugio</h2>
              </div>

              <nav className="flex flex-col gap-1.5">
                {[
                  {
                    id: 'reservas',
                    label: 'Reservas & Días',
                    icon: CalendarIcon,
                    badge: tabCounts.all,
                  },
                  {
                    id: 'ingresos',
                    label: 'Ingresos & Ventas',
                    icon: TrendingUp,
                    badge: null,
                  },
                  {
                    id: 'clientes',
                    label: 'Clientes',
                    icon: Users,
                    badge: clientsList.length,
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  const active = adminSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setAdminSection(item.id)}
                      className={`flex items-center justify-between gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        active
                          ? 'bg-[#18181B] text-white shadow-2xs'
                          : 'text-[#71717A] hover:text-[#09090B] hover:bg-white'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Icon className="w-3.5 h-3.5" />
                        <span>{item.label}</span>
                      </span>
                      {item.badge !== null && (
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded-full tabular-nums ${
                            active
                              ? 'bg-white/20 text-white'
                              : 'bg-[#E4E4E7]/70 text-[#09090B]'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="flex flex-col gap-2 pt-4 border-t border-[#E4E4E7]">
              <div className="p-3 rounded-xl bg-white border border-[#E4E4E7] mb-1">
                <span className="text-[10px] uppercase font-bold text-[#71717A] block">
                  Ingresos del Mes
                </span>
                <span className="text-sm font-bold text-[#09090B] tabular-nums mt-0.5 block">
                  $1.850.000 CLP
                </span>
                <span className="text-[10px] text-emerald-600 font-medium">+18% vs anterior</span>
              </div>

              <button
                onClick={handleSimulateIncoming}
                className="w-full py-2 px-3 rounded-xl bg-[#18181B] hover:bg-neutral-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer active-press"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Simular Reserva</span>
              </button>

              <button
                onClick={() => setActiveView('guest')}
                className="w-full py-2 px-3 rounded-xl bg-white hover:bg-neutral-50 border border-[#E4E4E7] text-xs font-semibold text-[#71717A] hover:text-[#09090B] flex items-center justify-center gap-1.5 cursor-pointer active-press"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>← Volver a Huésped</span>
              </button>
            </div>
          </aside>

          {/* ---------------------------------------------------------------
              ÁREA PRINCIPAL DEL PANEL ADMIN
             --------------------------------------------------------------- */}
          <main className="flex-1 p-4 sm:p-8 bg-white">
            {/* Header Admin */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 sm:pb-5 border-b border-[#E4E4E7]">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-[#71717A] font-semibold">
                  Panel Administrador
                </p>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#09090B] mt-0.5">
                  {adminSection === 'reservas' && 'Control de Reservas'}
                  {adminSection === 'ingresos' && 'Ingresos y Ventas Webpay'}
                  {adminSection === 'clientes' && 'Directorio de Clientes'}
                </h1>
              </div>

              {/* Botones de acción rápida */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                <button
                  onClick={handleSimulateIncoming}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#18181B] text-white text-xs font-bold cursor-pointer active-press shrink-0"
                >
                  <Bell className="w-3.5 h-3.5 text-emerald-400" />
                  <span>+ Simular</span>
                </button>

                <button
                  onClick={handleExportCSV}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-[#FAFAFA] border border-[#E4E4E7] text-xs font-semibold text-[#09090B] cursor-pointer active-press shrink-0"
                >
                  <Download className="w-3.5 h-3.5 text-[#71717A]" />
                  <span>CSV</span>
                </button>
              </div>
            </div>

            {/* SECCIÓN 1: RESERVAS & DÍAS */}
            {adminSection === 'reservas' && (
              <div className="space-y-4 mt-4 sm:mt-5">
                {/* Controles Operativos: Mantención, Temporada y Calendario */}
                <div className="p-3.5 rounded-2xl bg-[#FAFAFA] border border-[#E4E4E7] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[#09090B]">Mantención:</span>
                      <button
                        onClick={handleToggleMaintenance}
                        className="px-2.5 py-1 rounded-lg bg-white border border-[#E4E4E7] font-semibold text-[#09090B] hover:bg-neutral-50 cursor-pointer active-press"
                      >
                        {blockedDays.length > 0 ? `${blockedDays.length}d bloqueados (Liberar)` : 'Bloquear 5-18'}
                      </button>
                    </div>

                    <span className="hidden sm:inline text-neutral-300">|</span>

                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[#09090B]">Temporada Alta (+20%):</span>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={isHighSeason}
                        onClick={handleToggleHighSeason}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors active-press ${
                          isHighSeason ? 'bg-[#18181B]' : 'bg-[#E4E4E7]'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-2xs transition ${
                            isHighSeason ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Botón Calendario Oct 2026 */}
                  <div className="relative">
                    <button
                      onClick={() => {
                        setIsCalendarDropdownOpen((o) => !o);
                        setIsAdminCalendarModalOpen(true);
                      }}
                      className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer active-press ${
                        adminSelectedDay
                          ? 'bg-[#18181B] text-white border-[#18181B]'
                          : 'bg-white text-[#09090B] border-[#E4E4E7] hover:bg-neutral-50'
                      }`}
                    >
                      <CalendarIcon className="w-3.5 h-3.5" />
                      <span>
                        {adminSelectedDay
                          ? `Día ${adminSelectedDay} Oct seleccionado`
                          : 'Calendario Oct 2026'}
                      </span>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>

                    {/* Popover en Desktop */}
                    {isCalendarDropdownOpen && (
                      <div className="hidden sm:block absolute right-0 mt-2 z-30 w-72 bg-white border border-[#E4E4E7] rounded-2xl p-4 shadow-[0_16px_36px_rgba(0,0,0,0.12)]">
                        <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-[#E4E4E7]">
                          <span className="text-xs font-bold text-[#09090B]">Octubre 2026</span>
                          <div className="inline-flex p-0.5 rounded-lg bg-[#F4F4F5] text-[10px] font-semibold">
                            <button
                              onClick={() => setCalendarActionMode('filter')}
                              className={`px-2 py-0.5 rounded-md cursor-pointer ${
                                calendarActionMode === 'filter'
                                  ? 'bg-white text-[#09090B] shadow-2xs'
                                  : 'text-[#71717A]'
                              }`}
                            >
                              Ver día
                            </button>
                            <button
                              onClick={() => setCalendarActionMode('block')}
                              className={`px-2 py-0.5 rounded-md cursor-pointer ${
                                calendarActionMode === 'block'
                                  ? 'bg-white text-[#09090B] shadow-2xs'
                                  : 'text-[#71717A]'
                              }`}
                            >
                              Bloquear
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-[#71717A] mb-1">
                          {['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'].map((d) => (
                            <span key={d}>{d}</span>
                          ))}
                        </div>

                        <div className="grid grid-cols-7 gap-1 text-center text-xs">
                          {Array.from({ length: 3 }).map((_, i) => (
                            <div key={`empty-${i}`} className="h-7" />
                          ))}
                          {Array.from({ length: 31 }).map((_, i) => {
                            const day = i + 1;
                            const isBlocked = blockedDays.includes(day);
                            const hasRes = (adminBookingsByDay[day] || []).length > 0;
                            const isSel = adminSelectedDay === day;

                            return (
                              <button
                                key={day}
                                onClick={() => handleAdminCalendarDayClick(day)}
                                className={`h-7 w-7 mx-auto rounded-lg flex flex-col items-center justify-center text-[11px] relative transition-all cursor-pointer ${
                                  isSel
                                    ? 'bg-[#18181B] text-white font-bold'
                                    : isBlocked
                                    ? 'bg-neutral-100 text-neutral-400 line-through'
                                    : hasRes
                                    ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200'
                                    : 'hover:bg-[#F4F4F5] text-[#09090B]'
                                }`}
                              >
                                <span>{day}</span>
                                {hasRes && !isSel && (
                                  <span className="w-1 h-1 rounded-full bg-emerald-600 absolute bottom-0.5" />
                                )}
                              </button>
                            );
                          })}
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-[#E4E4E7] flex items-center justify-between text-[11px] text-[#71717A]">
                          <span>
                            {calendarActionMode === 'filter'
                              ? 'Clic en día para filtrar'
                              : 'Clic para bloquear/liberar'}
                          </span>
                          {adminSelectedDay && (
                            <button
                              onClick={() => setAdminSelectedDay(null)}
                              className="text-[#09090B] font-semibold underline cursor-pointer"
                            >
                              Ver todos
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Filtros de Pestañas de Tiempo y Selector de Unidad */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  <div className="inline-flex p-1 rounded-xl bg-[#F4F4F5] border border-[#E4E4E7] self-start overflow-x-auto no-scrollbar max-w-full">
                    {[
                      { id: 'all', label: `Todas (${tabCounts.all})` },
                      { id: 'today', label: `Hoy (${tabCounts.today})` },
                      { id: 'next7', label: `7 días (${tabCounts.next7})` },
                      { id: 'finalized', label: 'Finalizadas' },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setAdminTimeFilter(tab.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap active-press ${
                          adminTimeFilter === tab.id
                            ? 'bg-[#18181B] text-white shadow-2xs'
                            : 'text-[#71717A] hover:text-[#09090B]'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#71717A] font-medium whitespace-nowrap">
                      Unidad:
                    </span>
                    <select
                      value={adminUnitFilter}
                      onChange={(e) => setAdminUnitFilter(e.target.value)}
                      className="w-full sm:w-auto px-3 py-1.5 rounded-xl bg-white border border-[#E4E4E7] text-xs font-semibold text-[#09090B] focus:outline-none focus:border-[#09090B] cursor-pointer"
                    >
                      <option value="all">Todas las Unidades</option>
                      <option value="type-cabana">Solo Cabañas</option>
                      <option value="type-tinaja">Solo Tinajas</option>
                      <optgroup label="Por unidad específica">
                        {BASE_CABINS.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </optgroup>
                    </select>
                  </div>
                </div>

                {/* Listado de Tarjetas de Reservas */}
                <div className="space-y-2.5">
                  {filteredBookings.length === 0 ? (
                    <div className="p-8 rounded-2xl border border-[#E4E4E7] text-center text-xs text-[#71717A]">
                      No hay reservas para este filtro.
                    </div>
                  ) : (
                    filteredBookings.map((b) => {
                      const dayNum = b.checkIn.split('-')[2] || '19';
                      return (
                        <div
                          key={b.id}
                          className="p-4 rounded-2xl bg-white border border-[#E4E4E7] hover:border-neutral-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 shadow-2xs"
                        >
                          <div className="flex items-start sm:items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-[#FAFAFA] border border-[#E4E4E7] flex flex-col items-center justify-center shrink-0">
                              <span className="text-[9px] font-bold uppercase text-[#71717A]">
                                OCT
                              </span>
                              <span className="text-base font-bold text-[#09090B] tabular-nums leading-none mt-0.5">
                                {dayNum}
                              </span>
                            </div>

                            <div className="space-y-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <h4 className="font-bold text-xs sm:text-sm text-[#09090B] truncate">
                                  {b.guestName}
                                </h4>
                                <span className="px-2 py-0.5 rounded-md bg-[#F4F4F5] text-[#09090B] text-[10px] font-semibold">
                                  {b.unitType || 'Cabaña'}
                                </span>
                                {b.isNew && (
                                  <span className="text-[9px] font-bold bg-[#18181B] text-white px-2 py-0.5 rounded-full">
                                    Nueva
                                  </span>
                                )}
                              </div>

                              <p className="text-xs font-medium text-[#09090B] truncate">
                                {b.cabinName}
                              </p>

                              <div className="flex flex-wrap items-center gap-2 text-xs text-[#71717A]">
                                <span className="tabular-nums">
                                  {b.checkIn} → {b.checkOut} ({b.nights}n)
                                </span>
                                <span>·</span>
                                <span className="font-bold text-[#09090B] tabular-nums">
                                  {formatCLP(b.amount)}
                                </span>
                                <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px] font-medium">
                                  ● Pagado Webpay
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Botones de Acción */}
                          <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E4E4E7]/60 justify-end shrink-0">
                            <button
                              onClick={() => handleDownloadPDFReceipt(b)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white hover:bg-[#FAFAFA] border border-[#E4E4E7] text-xs font-semibold text-[#09090B] active-press cursor-pointer"
                              title="Descargar Comprobante PDF"
                            >
                              <FileText className="w-3.5 h-3.5 text-[#71717A]" />
                              <span className="hidden sm:inline">PDF</span>
                            </button>

                            <a
                              href={`https://wa.me/${b.guestPhone.replace(
                                /\D/g,
                                ''
                              )}?text=${encodeURIComponent(
                                `Hola ${b.guestName}, te enviamos las indicaciones y protocolo de acceso para tu reserva en ${b.cabinName} (${b.checkIn}).`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white hover:bg-[#FAFAFA] border border-[#E4E4E7] text-xs font-semibold text-[#09090B] active-press"
                            >
                              <MapPin className="w-3.5 h-3.5 text-[#71717A]" />
                              <span>Llegada</span>
                            </a>

                            <a
                              href={`https://wa.me/${b.guestPhone.replace(/\D/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold text-emerald-800 active-press"
                            >
                              <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                              <span>WhatsApp</span>
                            </a>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* SECCIÓN 2: INGRESOS & VENTAS */}
            {adminSection === 'ingresos' && (
              <div className="space-y-5 mt-4 sm:mt-5">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="bg-[#FAFAFA] border border-[#E4E4E7] rounded-2xl p-3.5 sm:p-4">
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#71717A]">
                      Ingresos Mes
                    </span>
                    <p className="text-lg sm:text-xl font-bold text-[#09090B] tabular-nums mt-1 sm:mt-2">
                      $1.850.000
                    </p>
                    <span className="text-[11px] text-emerald-600 font-medium">+18% vs anterior</span>
                  </div>

                  <div className="bg-[#FAFAFA] border border-[#E4E4E7] rounded-2xl p-3.5 sm:p-4">
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#71717A]">
                      Reservas
                    </span>
                    <p className="text-lg sm:text-xl font-bold text-[#09090B] tabular-nums mt-1 sm:mt-2">
                      {tabCounts.all}
                    </p>
                    <span className="text-[11px] text-zinc-500">100% Webpay</span>
                  </div>

                  <div className="bg-[#FAFAFA] border border-[#E4E4E7] rounded-2xl p-3.5 sm:p-4">
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#71717A]">
                      Ahorro Comisiones
                    </span>
                    <p className="text-lg sm:text-xl font-bold text-[#09090B] tabular-nums mt-1 sm:mt-2">
                      $333.000
                    </p>
                    <span className="text-[11px] text-zinc-500">18% íntegro directo</span>
                  </div>

                  <div className="bg-[#FAFAFA] border border-[#E4E4E7] rounded-2xl p-3.5 sm:p-4">
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#71717A]">
                      Ocupación
                    </span>
                    <p className="text-lg sm:text-xl font-bold text-[#09090B] tabular-nums mt-1 sm:mt-2">
                      85%
                    </p>
                    <span className="text-[11px] text-emerald-600 font-medium">Fin de semana 100%</span>
                  </div>
                </div>

                <div className="bg-white border border-[#E4E4E7] rounded-2xl p-4 sm:p-5">
                  <h3 className="text-xs sm:text-sm font-bold text-[#09090B] mb-3">
                    Ingresos desglosados por Cabaña y Tinaja
                  </h3>
                  <div className="space-y-3">
                    {revenueByUnit.map((u) => (
                      <div
                        key={u.id}
                        className="flex items-center justify-between py-2 border-b border-[#E4E4E7] last:border-0 text-xs"
                      >
                        <div>
                          <span className="font-bold text-[#09090B]">{u.name}</span>
                          <span className="ml-2 text-[10px] px-2 py-0.5 rounded bg-[#F4F4F5] text-[#71717A]">
                            {u.type}
                          </span>
                          <p className="text-[11px] text-[#71717A] mt-0.5">
                            {u.bookingsCount} reservas registradas
                          </p>
                        </div>
                        <span className="font-bold text-xs sm:text-sm text-[#09090B] tabular-nums">
                          {formatCLP(u.revenue)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SECCIÓN 3: CLIENTES */}
            {adminSection === 'clientes' && (
              <div className="space-y-4 mt-4 sm:mt-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="w-3.5 h-3.5 text-[#71717A] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Buscar por nombre o teléfono..."
                      value={clientSearch}
                      onChange={(e) => setClientSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 rounded-xl border border-[#E4E4E7] text-xs text-[#09090B] focus:outline-none focus:border-[#09090B]"
                    />
                  </div>
                  <span className="text-xs text-[#71717A]">
                    {clientsList.length} clientes registrados
                  </span>
                </div>

                <div className="space-y-2.5">
                  {clientsList.map((c, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-2xl bg-white border border-[#E4E4E7] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[#09090B]">{c.name}</span>
                          <span className="text-[11px] text-[#71717A] tabular-nums">
                            ({c.rut})
                          </span>
                        </div>
                        <p className="text-[#71717A]">
                          Última visita: <strong className="text-[#09090B]">{c.lastCabin}</strong> ({c.lastDate})
                        </p>
                        <p className="text-[11px] text-[#71717A] tabular-nums">
                          WhatsApp: <strong className="text-[#09090B]">{c.phone}</strong>
                        </p>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-auto">
                        <div className="text-right">
                          <span className="text-[10px] text-[#71717A] block">Total abonado</span>
                          <span className="font-bold text-xs text-[#09090B] tabular-nums">
                            {formatCLP(c.totalSpent)}
                          </span>
                        </div>

                        <a
                          href={`https://wa.me/${c.phone.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold text-emerald-800 active-press"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      )}

      {/* ===================================================================
          BARRA DE NAVEGACIÓN INFERIOR MÓVIL (BOTTOM APP BAR / TAB BAR)
          Visible únicamente en dispositivos móviles (lg:hidden)
         =================================================================== */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E4E4E7] pb-safe shadow-[0_-4px_24px_rgba(0,0,0,0.06)]">
        {activeView === 'guest' ? (
          <div className="grid grid-cols-4 h-14">
            <button
              onClick={() => setGuestMobileTab('cabins')}
              className={`flex flex-col items-center justify-center gap-0.5 active-press transition-colors ${
                guestMobileTab === 'cabins' ? 'text-[#18181B] font-bold' : 'text-[#71717A]'
              }`}
            >
              <Home className={`w-4 h-4 ${guestMobileTab === 'cabins' ? 'stroke-[2.5]' : ''}`} />
              <span className="text-[10px]">Unidad</span>
            </button>

            <button
              onClick={() => setGuestMobileTab('dates')}
              className={`flex flex-col items-center justify-center gap-0.5 active-press transition-colors relative ${
                guestMobileTab === 'dates' ? 'text-[#18181B] font-bold' : 'text-[#71717A]'
              }`}
            >
              <CalendarIcon className={`w-4 h-4 ${guestMobileTab === 'dates' ? 'stroke-[2.5]' : ''}`} />
              <span className="text-[10px]">Fechas</span>
              {checkInDay && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 absolute top-2 right-6" />
              )}
            </button>

            <button
              onClick={() => setGuestMobileTab('checkout')}
              className={`flex flex-col items-center justify-center gap-0.5 active-press transition-colors ${
                guestMobileTab === 'checkout' ? 'text-[#18181B] font-bold' : 'text-[#71717A]'
              }`}
            >
              <CreditCard className={`w-4 h-4 ${guestMobileTab === 'checkout' ? 'stroke-[2.5]' : ''}`} />
              <span className="text-[10px]">Pagar</span>
            </button>

            <button
              onClick={() => setActiveView('admin')}
              className="flex flex-col items-center justify-center gap-0.5 active-press text-[#71717A] hover:text-[#09090B] relative"
            >
              <ShieldCheck className="w-4 h-4" />
              <span className="text-[10px]">Admin</span>
              {reservations.some((r) => r.isNew) && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 absolute top-2 right-6 animate-pulse" />
              )}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-4 h-14">
            <button
              onClick={() => setAdminSection('reservas')}
              className={`flex flex-col items-center justify-center gap-0.5 active-press transition-colors relative ${
                adminSection === 'reservas' ? 'text-[#18181B] font-bold' : 'text-[#71717A]'
              }`}
            >
              <CalendarIcon className={`w-4 h-4 ${adminSection === 'reservas' ? 'stroke-[2.5]' : ''}`} />
              <span className="text-[10px]">Reservas</span>
              <span className="text-[9px] px-1 rounded-full bg-neutral-200 text-neutral-800 absolute top-1 right-5 tabular-nums">
                {tabCounts.all}
              </span>
            </button>

            <button
              onClick={() => setAdminSection('ingresos')}
              className={`flex flex-col items-center justify-center gap-0.5 active-press transition-colors ${
                adminSection === 'ingresos' ? 'text-[#18181B] font-bold' : 'text-[#71717A]'
              }`}
            >
              <TrendingUp className={`w-4 h-4 ${adminSection === 'ingresos' ? 'stroke-[2.5]' : ''}`} />
              <span className="text-[10px]">Finanzas</span>
            </button>

            <button
              onClick={() => setAdminSection('clientes')}
              className={`flex flex-col items-center justify-center gap-0.5 active-press transition-colors ${
                adminSection === 'clientes' ? 'text-[#18181B] font-bold' : 'text-[#71717A]'
              }`}
            >
              <Users className={`w-4 h-4 ${adminSection === 'clientes' ? 'stroke-[2.5]' : ''}`} />
              <span className="text-[10px]">Clientes</span>
            </button>

            <button
              onClick={() => setActiveView('guest')}
              className="flex flex-col items-center justify-center gap-0.5 active-press text-[#71717A] hover:text-[#09090B]"
            >
              <Home className="w-4 h-4" />
              <span className="text-[10px]">Huésped</span>
            </button>
          </div>
        )}
      </nav>

      {/* ===================================================================
          MODAL WEBPAY PLUS & CONFIRMACIÓN (DISEÑO EDITORIAL PERFECCIONADO)
         =================================================================== */}
      {isWebpayModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white border border-[#E4E4E7] rounded-3xl max-w-[420px] w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
            {!completedReservation ? (
              <div className="overflow-y-auto pb-safe">
                <div className="px-5 py-3.5 bg-[#FAFAFA] border-b border-[#E4E4E7] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="bg-[#18181B] text-white font-bold text-xs px-2 py-0.5 rounded">
                      webpay<span className="text-emerald-400 font-normal ml-0.5">plus</span>
                    </div>
                    <p className="text-xs font-bold text-[#09090B]">Transbank Seguro</p>
                  </div>
                  <button
                    disabled={isProcessing}
                    onClick={() => setIsWebpayModalOpen(false)}
                    className="text-neutral-400 hover:text-black cursor-pointer p-1 active-press"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-[#FAFAFA] border border-[#E4E4E7] flex justify-between items-center">
                    <div>
                      <span className="text-[10px] text-[#71717A] block uppercase font-bold">
                        Monto a autorizar:
                      </span>
                      <span className="font-bold text-lg text-[#09090B] tabular-nums">
                        {formatCLP(payAmount)}
                      </span>
                    </div>
                    <span className="text-[#71717A] font-medium text-right text-[11px]">
                      {selectedCabin.name}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setWebpayMethod('debito')}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer active-press ${
                        webpayMethod === 'debito'
                          ? 'bg-[#FAFAFA] border-[#18181B] ring-1 ring-[#18181B]'
                          : 'bg-white border-[#E4E4E7]'
                      }`}
                    >
                      <Building2 className="w-3.5 h-3.5 text-[#18181B] mb-1" />
                      <p className="text-xs font-bold text-[#09090B]">Débito</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setWebpayMethod('credito')}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer active-press ${
                        webpayMethod === 'credito'
                          ? 'bg-[#FAFAFA] border-[#18181B] ring-1 ring-[#18181B]'
                          : 'bg-white border-[#E4E4E7]'
                      }`}
                    >
                      <CreditCard className="w-3.5 h-3.5 text-[#18181B] mb-1" />
                      <p className="text-xs font-bold text-[#09090B]">Crédito</p>
                    </button>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#FAFAFA] border border-[#E4E4E7] flex justify-between text-[#71717A]">
                    <span>Tarjeta Redcompra:</span>
                    <span className="font-mono font-bold text-[#09090B]">**** 4092</span>
                  </div>

                  <button
                    disabled={isProcessing}
                    onClick={handleConfirmWebpay}
                    className="w-full py-3.5 rounded-xl bg-[#18181B] hover:bg-neutral-800 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs mt-2 active-press"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Conectando con Transbank...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Pagar {formatCLP(payAmount)}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              /* PANTALLA DE COMPROBANTE EXACTA Y PULIDA SEGÚN LA CAPTURA */
              <div className="p-6 text-xs space-y-4 overflow-y-auto pb-safe">
                <div className="text-center pb-1">
                  <div className="font-display text-2xl font-bold tracking-tight text-[#09090B] mb-2 select-none">
                    demo<span className="text-[#18181B]">.</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-200">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Reserva confirmada · Webpay Plus</span>
                  </div>
                  <h3 className="font-bold text-base text-[#09090B] mt-2 tracking-tight">
                    ¡Muchas gracias{completedReservation.guestName
                      ? `, ${completedReservation.guestName.trim().split(' ')[0]}`
                      : ''}!
                  </h3>
                  <p className="text-[11px] text-[#71717A] mt-0.5 leading-relaxed">
                    Tu pago fue procesado correctamente y la reserva ha quedado registrada.
                  </p>
                </div>

                <div className="text-center px-1">
                  <p className="text-xs text-[#52525B] leading-relaxed">
                    Nos comunicaremos contigo vía WhatsApp al{' '}
                    <strong className="font-semibold text-[#09090B] tabular-nums">
                      {completedReservation.guestPhone}
                    </strong>{' '}
                    para coordinar tu llegada y entrega de indicaciones de acceso.
                  </p>
                </div>

                <div className="bg-[#FAFAFA] border border-[#E4E4E7] rounded-2xl p-4 space-y-2.5 text-xs">
                  <div className="flex justify-between items-center text-[#71717A]">
                    <span>Folio Reserva:</span>
                    <span className="font-mono font-bold text-[#09090B]">
                      {completedReservation.id}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[#71717A]">
                    <span>Código Autorización:</span>
                    <span className="font-mono text-[#09090B]">
                      {completedReservation.authCode || 'AUTH-811176'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[#71717A]">
                    <span>Alojamiento:</span>
                    <span className="font-semibold text-[#09090B]">
                      {completedReservation.cabinName}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[#71717A]">
                    <span>Fechas:</span>
                    <span className="font-medium text-[#09090B] tabular-nums">
                      {formatDateRange(completedReservation.checkIn, completedReservation.checkOut, completedReservation.nights)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[#71717A]">
                    <span>WhatsApp Recepción:</span>
                    <a
                      href="https://wa.me/56994597751"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-[#09090B] hover:text-emerald-700 tabular-nums flex items-center gap-1.5 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                      <span>+56 9 9459 7751</span>
                    </a>
                  </div>
                  <div className="pt-2.5 border-t border-[#E4E4E7] flex justify-between items-center">
                    <span className="font-bold text-[#09090B]">Total Pagado:</span>
                    <span className="text-base font-bold text-[#09090B] tabular-nums">
                      {formatCLP(completedReservation.amount)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5 pt-1">
                  <button
                    onClick={() => handleDownloadPDFReceipt(completedReservation)}
                    className="w-full py-3.5 px-4 rounded-xl bg-[#18181B] hover:bg-neutral-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active-press"
                  >
                    <FileText className="w-4 h-4 text-white" />
                    <span>Descargar Comprobante PDF</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={`https://wa.me/56994597751?text=${encodeURIComponent(
                        `Hola, acabo de confirmar mi reserva ${completedReservation.id} para ${completedReservation.cabinName} (${formatDateRange(completedReservation.checkIn, completedReservation.checkOut, completedReservation.nights)}) a nombre de ${completedReservation.guestName}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 px-3 rounded-xl border border-[#E4E4E7] bg-white hover:bg-[#FAFAFA] text-[#09090B] text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer active-press text-center transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                      <span>WhatsApp Recepción</span>
                    </a>

                    <button
                      onClick={() => {
                        setIsWebpayModalOpen(false);
                        setCompletedReservation(null);
                      }}
                      className="py-2.5 px-3 rounded-xl border border-[#E4E4E7] bg-white hover:bg-[#FAFAFA] text-[#71717A] hover:text-[#09090B] text-xs font-semibold cursor-pointer active-press transition-colors"
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================================================================
          BOTTOM SHEET CALENDARIO ADMIN EN MÓVIL
         =================================================================== */}
      {isAdminCalendarModalOpen && (
        <div className="sm:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center">
          <div className="bg-white rounded-t-3xl w-full p-4 max-h-[85vh] overflow-y-auto pb-safe shadow-2xl animate-in slide-in-from-bottom duration-200">
            <div className="w-12 h-1.5 bg-neutral-300 rounded-full mx-auto mb-3" />
            
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E4E4E7]">
              <div>
                <h3 className="font-bold text-sm text-[#09090B]">Calendario Octubre 2026</h3>
                <p className="text-[11px] text-[#71717A]">Toca un día para filtrar o gestionar</p>
              </div>
              <div className="inline-flex p-0.5 rounded-lg bg-[#F4F4F5] text-[10px] font-semibold">
                <button
                  onClick={() => setCalendarActionMode('filter')}
                  className={`px-2 py-1 rounded-md ${
                    calendarActionMode === 'filter'
                      ? 'bg-white text-[#09090B] shadow-2xs font-bold'
                      : 'text-[#71717A]'
                  }`}
                >
                  Ver día
                </button>
                <button
                  onClick={() => setCalendarActionMode('block')}
                  className={`px-2 py-1 rounded-md ${
                    calendarActionMode === 'block'
                      ? 'bg-white text-[#09090B] shadow-2xs font-bold'
                      : 'text-[#71717A]'
                  }`}
                >
                  Bloquear
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-[#71717A] mb-1 font-semibold">
              {['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'].map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1.5 text-center text-xs my-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={`empty-m-${i}`} className="h-10" />
              ))}
              {Array.from({ length: 31 }).map((_, i) => {
                const day = i + 1;
                const isBlocked = blockedDays.includes(day);
                const hasRes = (adminBookingsByDay[day] || []).length > 0;
                const isSel = adminSelectedDay === day;

                return (
                  <button
                    key={`m-day-${day}`}
                    onClick={() => handleAdminCalendarDayClick(day)}
                    className={`h-10 w-10 mx-auto rounded-xl flex flex-col items-center justify-center text-xs relative transition-all active-press ${
                      isSel
                        ? 'bg-[#18181B] text-white font-bold'
                        : isBlocked
                        ? 'bg-neutral-100 text-neutral-400 line-through'
                        : hasRes
                        ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-300'
                        : 'bg-[#FAFAFA] text-[#09090B] hover:bg-[#F4F4F5]'
                    }`}
                  >
                    <span>{day}</span>
                    {hasRes && !isSel && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 absolute bottom-1" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-[#E4E4E7] flex items-center justify-between">
              {adminSelectedDay ? (
                <button
                  onClick={() => {
                    setAdminSelectedDay(null);
                    setIsAdminCalendarModalOpen(false);
                  }}
                  className="text-xs text-[#09090B] font-bold underline"
                >
                  Limpiar filtro (Ver todas)
                </button>
              ) : (
                <span className="text-xs text-[#71717A]">Mostrando todas las reservas</span>
              )}
              <button
                onClick={() => setIsAdminCalendarModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#18181B] text-white text-xs font-bold active-press"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
