import { useState } from 'react';
import { X, Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

interface ScheduleVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Horarios por día de la semana (0 = Domingo, 1 = Lunes, etc.)
const SCHEDULE: Record<number, { morning: string[]; afternoon: string[] } | null> = {
  0: null, // Domingo - Cerrado
  1: { morning: ['9:00', '10:00', '11:00', '12:00'], afternoon: ['14:00', '15:00', '16:00', '17:00', '18:00'] }, // Lunes
  2: { morning: ['9:00', '10:00', '11:00', '12:00'], afternoon: ['14:00', '15:00', '16:00', '17:00', '18:00'] }, // Martes
  3: { morning: ['9:00', '10:00', '11:00', '12:00'], afternoon: ['14:00', '15:00', '16:00', '17:00', '18:00'] }, // Miércoles
  4: { morning: ['9:00', '10:00', '11:00', '12:00'], afternoon: ['14:00', '15:00', '16:00', '17:00', '18:00'] }, // Jueves
  5: { morning: ['9:00', '10:00', '11:00', '12:00'], afternoon: ['14:00', '15:00', '16:00', '17:00', '18:00'] }, // Viernes
  6: { morning: ['11:00', '12:00', '13:00', '14:00'], afternoon: [] }, // Sábado
};

const DAY_NAMES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const DAY_NAMES_SHORT = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTH_NAMES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

export default function ScheduleVisitModal({ isOpen, onClose }: ScheduleVisitModalProps) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  if (!isOpen) return null;

  // Generar días del mes
  const getDaysInMonth = (month: number, year: number) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days: (Date | null)[] = [];

    // Días vacíos al inicio
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }

    // Días del mes
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const days = getDaysInMonth(currentMonth, currentYear);

  const isDateDisabled = (date: Date) => {
    const dayOfWeek = date.getDay();
    const schedule = SCHEDULE[dayOfWeek];

    // Domingo cerrado
    if (!schedule) return true;

    // No permitir días pasados
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    if (date < todayStart) return true;

    return false;
  };

  const isDateSelected = (date: Date) => {
    if (!selectedDate) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const getAvailableTimes = () => {
    if (!selectedDate) return { morning: [], afternoon: [] };
    const dayOfWeek = selectedDate.getDay();
    return SCHEDULE[dayOfWeek] || { morning: [], afternoon: [] };
  };

  const availableTimes = getAvailableTimes();

  const formatTimeRange = (time: string) => {
    const hour = parseInt(time.split(':')[0]);
    const nextHour = hour + 1;
    return `${time} - ${nextHour}:00`;
  };

  const handleSubmit = () => {
    if (!selectedDate || !selectedTime || !name || !phone) return;

    const formattedDate = `${selectedDate.getDate()} de ${MONTH_NAMES[selectedDate.getMonth()]}`;
    const dayName = DAY_NAMES[selectedDate.getDay()];

    const message = encodeURIComponent(
      `Hola, quiero agendar una visita al showroom.\n\n` +
      `Nombre: ${name}\n` +
      `Teléfono: ${phone}\n` +
      `Fecha: ${dayName} ${formattedDate}\n` +
      `Horario: ${formatTimeRange(selectedTime)}`
    );

    window.open(`https://wa.me/56965839601?text=${message}`, '_blank');
    onClose();
  };

  const canSubmit = selectedDate && selectedTime && name.trim() && phone.trim();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-1">
              Showroom
            </p>
            <h2 className="text-xl font-display uppercase tracking-wide">
              Agendar Visita
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 transition-colors"
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Fecha actual */}
          <div className="text-center pb-4 border-b border-gray-100">
            <p className="text-sm text-gray-500">Hoy es</p>
            <p className="text-lg font-medium">
              {DAY_NAMES[today.getDay()]} {today.getDate()} de {MONTH_NAMES[today.getMonth()]} {today.getFullYear()}
            </p>
          </div>

          {/* Calendario */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Calendar size={18} className="text-gray-400" />
              <p className="text-sm font-medium uppercase tracking-wider">Selecciona el día</p>
            </div>

            {/* Navegación del mes */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={handlePrevMonth}
                className="p-2 hover:bg-gray-100 transition-colors"
                aria-label="Mes anterior"
              >
                <ChevronLeft size={20} />
              </button>
              <p className="font-medium">
                {MONTH_NAMES[currentMonth]} {currentYear}
              </p>
              <button
                onClick={handleNextMonth}
                className="p-2 hover:bg-gray-100 transition-colors"
                aria-label="Mes siguiente"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Días de la semana */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {DAY_NAMES_SHORT.map((day) => (
                <div key={day} className="text-center text-xs text-gray-400 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Días del mes */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((date, index) => {
                if (!date) {
                  return <div key={`empty-${index}`} className="aspect-square" />;
                }

                const disabled = isDateDisabled(date);
                const selected = isDateSelected(date);
                const isToday = date.toDateString() === today.toDateString();

                return (
                  <button
                    key={date.toISOString()}
                    onClick={() => {
                      if (!disabled) {
                        setSelectedDate(date);
                        setSelectedTime(null);
                      }
                    }}
                    disabled={disabled}
                    className={`aspect-square flex items-center justify-center text-sm transition-colors ${
                      disabled
                        ? 'text-gray-300 cursor-not-allowed'
                        : selected
                        ? 'bg-black text-white'
                        : isToday
                        ? 'bg-gray-100 hover:bg-gray-200'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Horarios */}
          {selectedDate && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Clock size={18} className="text-gray-400" />
                <p className="text-sm font-medium uppercase tracking-wider">Selecciona el horario</p>
              </div>

              <p className="text-sm text-gray-500 mb-3">
                {DAY_NAMES[selectedDate.getDay()]} {selectedDate.getDate()} de {MONTH_NAMES[selectedDate.getMonth()]}
              </p>

              {/* Mañana */}
              {availableTimes.morning.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Mañana</p>
                  <div className="grid grid-cols-3 gap-2">
                    {availableTimes.morning.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`py-2 px-3 text-sm border transition-colors ${
                          selectedTime === time
                            ? 'bg-black text-white border-black'
                            : 'border-gray-200 hover:border-black'
                        }`}
                      >
                        {formatTimeRange(time)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tarde */}
              {availableTimes.afternoon.length > 0 && (
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Tarde</p>
                  <div className="grid grid-cols-3 gap-2">
                    {availableTimes.afternoon.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`py-2 px-3 text-sm border transition-colors ${
                          selectedTime === time
                            ? 'bg-black text-white border-black'
                            : 'border-gray-200 hover:border-black'
                        }`}
                      >
                        {formatTimeRange(time)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Datos de contacto */}
          {selectedTime && (
            <div className="space-y-4">
              <p className="text-sm font-medium uppercase tracking-wider">Tus datos</p>
              <div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nombre completo"
                  className="w-full border-b border-gray-300 py-3 text-sm focus:outline-none focus:border-black transition-colors bg-transparent placeholder:text-gray-400"
                />
              </div>
              <div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Teléfono"
                  className="w-full border-b border-gray-300 py-3 text-sm focus:outline-none focus:border-black transition-colors bg-transparent placeholder:text-gray-400"
                />
              </div>
            </div>
          )}

          {/* Resumen */}
          {canSubmit && (
            <div className="bg-gray-50 p-4">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Resumen de tu visita</p>
              <p className="text-sm">
                <span className="font-medium">{name}</span> - {phone}
              </p>
              <p className="text-sm text-gray-600">
                {DAY_NAMES[selectedDate!.getDay()]} {selectedDate!.getDate()} de {MONTH_NAMES[selectedDate!.getMonth()]} a las {formatTimeRange(selectedTime!)}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`w-full py-4 text-sm uppercase tracking-wider transition-colors ${
              canSubmit
                ? 'bg-black text-white hover:bg-gray-900'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Confirmar por WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
