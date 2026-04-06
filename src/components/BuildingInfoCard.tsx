import { useState, useEffect, useCallback, useRef } from 'react';
import { ExternalLink, X, Clock, Users, Layers } from 'lucide-react';
import { Building, Campus, getBuildingStatus, categoryLabels } from '@/data/campusData';

interface BuildingInfoCardProps {
  building: Building;
  campus: Campus;
  onClose: () => void;
}

// Animated count-up hook
const useCountUp = (target: number, duration = 800) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    setValue(0);
    const start = performance.now();
    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return value;
};

const BuildingInfoCard = ({ building, campus, onClose }: BuildingInfoCardProps) => {
  const status = getBuildingStatus(building);
  const [exiting, setExiting] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const floorsCount = useCountUp(building.floors || 0);
  const capacityCount = useCountUp(building.capacity || 0);

  const handleClose = useCallback(() => {
    setExiting(true);
    setTimeout(() => onClose(), 300);
  }, [onClose]);

  const handleDirections = () => {
    const dest = `${building.lat},${building.lng}`;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const origin = `${pos.coords.latitude},${pos.coords.longitude}`;
          window.open(
            `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}&travelmode=walking`,
            '_blank'
          );
        },
        () => {
          const gate = campus.buildings.find((b) => b.name === 'Main Gate');
          const origin = gate ? `${gate.lat},${gate.lng}` : `${campus.center[0]},${campus.center[1]}`;
          window.open(
            `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}&travelmode=walking`,
            '_blank'
          );
        }
      );
    }
  };

  // 3D parallax tilt
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -8;
    card.style.transform = `perspective(1200px) rotateX(${y}deg) rotateY(${x}deg)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (card) card.style.transform = '';
  }, []);

  const statusColorClass = status.status === 'open'
    ? 'bg-aurora-3/20 text-aurora-3 border-aurora-3/30'
    : status.status === 'closing'
    ? 'bg-solar/20 text-solar border-solar/30'
    : 'bg-nova/20 text-nova border-nova/30';

  const statusDotClass = status.status === 'open'
    ? 'bg-aurora-3 status-open'
    : status.status === 'closing'
    ? 'bg-solar status-closing'
    : 'bg-nova';

  // Staggered section delays
  const sectionStyle = (delay: number) => ({
    animation: `fade-up 350ms ease-out ${delay}ms both`,
  });

  return (
    <div
      className="absolute bottom-4 right-4 md:top-20 md:bottom-auto z-[1000] w-[calc(100%-2rem)] md:w-[360px]"
      style={{
        animation: exiting
          ? 'slide-out-right 300ms cubic-bezier(0.4,0,0.2,1) forwards'
          : 'slide-in-right-enhanced 500ms cubic-bezier(0.34,1.56,0.64,1) forwards',
      }}
    >
      <div
        ref={cardRef}
        className="glass-card overflow-hidden transition-transform duration-[600ms]"
        style={{
          borderColor: `${campus.color}30`,
          transitionTimingFunction: 'cubic-bezier(0.34,1.56,0.64,1)',
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Status bar */}
        <div className="px-5 py-3 border-b border-border flex items-center gap-3" style={sectionStyle(0)}>
          <div className={`w-2.5 h-2.5 rounded-full ${statusDotClass}`} />
          <span className={`font-mono text-xs font-semibold px-2 py-0.5 rounded-md border ${statusColorClass}`}>
            {status.label}
          </span>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-4" style={sectionStyle(80)}>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="text-2xl"
                  style={{ animation: 'icon-float 4s ease-in-out infinite' }}
                >
                  {building.icon}
                </span>
                <h3
                  className="font-ui text-base font-bold tracking-wider"
                  style={{ color: campus.color }}
                >
                  {building.name}
                </h3>
              </div>
              <span className="font-mono text-xs text-muted-foreground/30 uppercase tracking-widest">
                {categoryLabels[building.category]}
              </span>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground/30 hover:text-foreground transition-all duration-200
                         hover:rotate-90"
            >
              <X className="w-4 h-4 transition-transform duration-200" />
            </button>
          </div>

          {/* Description */}
          <p className="font-body text-sm text-muted-foreground mb-4 leading-relaxed" style={sectionStyle(160)}>
            {building.description}
          </p>

          {/* Meta with count-up */}
          <div className="flex gap-4 mb-5" style={sectionStyle(240)}>
            {building.floors !== undefined && building.floors > 0 && (
              <div className="flex items-center gap-1.5 text-muted-foreground/30">
                <Layers className="w-3.5 h-3.5" />
                <span className="font-mono text-xs">{floorsCount} floors</span>
              </div>
            )}
            {building.capacity && (
              <div className="flex items-center gap-1.5 text-muted-foreground/30">
                <Users className="w-3.5 h-3.5" />
                <span className="font-mono text-xs">{capacityCount} cap.</span>
              </div>
            )}
            {building.schedule?.weekday && (
              <div className="flex items-center gap-1.5 text-muted-foreground/30">
                <Clock className="w-3.5 h-3.5" />
                <span className="font-mono text-xs">
                  {building.schedule.weekday.open}–{building.schedule.weekday.close}
                </span>
              </div>
            )}
          </div>

          {/* Coordinates */}
          <div className="font-mono text-[10px] text-muted-foreground/30 mb-5 tracking-wider" style={sectionStyle(320)}>
            {building.lat.toFixed(4)}°N, {building.lng.toFixed(4)}°E
          </div>

          {/* Directions CTA */}
          <button
            onClick={handleDirections}
            className="group w-full py-3 rounded-xl font-ui text-xs font-bold tracking-wider overflow-hidden relative
                       transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0
                       hover:shadow-[0_0_20px_var(--campus-color)]"
            style={{
              ['--campus-color' as string]: `${campus.color}80`,
              background: `linear-gradient(135deg, ${campus.color}, ${campus.color}90)`,
              color: '#020409',
              boxShadow: `0 4px 20px ${campus.color}40`,
              ...sectionStyle(400),
            }}
          >
            GET DIRECTIONS
            <ExternalLink className="w-3.5 h-3.5 inline-block ml-2 -mt-0.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuildingInfoCard;