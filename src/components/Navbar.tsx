import { useState, useEffect, useRef } from 'react';
import { Compass, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [hoverBurst, setHoverBurst] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const compassRef = useRef<HTMLDivElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);
  const { theme, accentColor, toggleTheme, setAccent } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowColorPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 h-[70px] glass transition-all duration-400"
      style={{
        backdropFilter: scrolled ? 'blur(40px) saturate(200%)' : undefined,
        borderBottom: scrolled ? '1px solid hsl(var(--aurora-1) / 0.25)' : undefined,
        boxShadow: scrolled ?
        '0 4px 32px hsl(0 0% 0% / 0.4), 0 1px 0 hsl(var(--aurora-1) / 0.1) inset' :
        undefined
      }}>

      <div className="container mx-auto h-full flex items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div
            ref={compassRef}
            className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center"
            style={{ animation: scrolled ? 'logo-glow-pulse 3s ease-in-out infinite' : undefined }}
            onMouseEnter={() => setHoverBurst(true)}
            onMouseLeave={() => setHoverBurst(false)}>

            <Compass
              className="w-5 h-5 text-primary"
              style={{
                animation: hoverBurst ?
                'compass-drift 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)' :
                'compass-drift 20s linear infinite'
              }} />

          </div>
          <span className="font-ui text-sm font-bold tracking-wider text-primary">
            CAMPUS NAV
          </span>
        </div>

        {/* Campus labels */}
        <div className="hidden md:flex items-center gap-6 font-ui text-xs tracking-widest">
          {['SJCE', 'SJIT', 'CIT'].map((label) => (
            <span key={label} className="text-muted-foreground/40 hover:text-muted-foreground transition-colors cursor-default">{label}</span>
          ))}
        </div>

        {/* Right side: version + theme toggle */}
        <div className="flex items-center gap-3">
          <div className="font-mono text-xs text-muted-foreground/30 hidden sm:block">
            v1.0 · LUMINA
          </div>

          {/* Theme toggle + accent color picker */}
          <div className="relative" ref={pickerRef}>
            <button
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              onClick={toggleTheme}
              onContextMenu={(e) => {e.preventDefault();setShowColorPicker((p) => !p);}}
              title="Click to toggle theme · Right-click for accent color"
              className="w-9 h-9 rounded-lg glass flex items-center justify-center border border-border hover:border-primary/40 hover:bg-primary/10 transition-all duration-300 group">

              <span
                className="transition-all duration-400 group-hover:scale-110"
                style={{
                  display: 'inline-flex',
                  transform: theme === 'dark' ? 'rotate(0deg) scale(1)' : 'rotate(180deg) scale(1)',
                  transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}>

                {theme === 'dark' ?
                <Moon className="w-[14px] h-[14px] text-primary" /> :
                <Sun className="w-[14px] h-[14px] text-primary" />
                }
              </span>
            </button>

            {/* Accent color picker popover */}
            {showColorPicker &&
            <div
              className="absolute right-0 top-11 glass-card p-3 flex flex-col gap-2 w-44 z-50 animate-fade-up"
              style={{ animationDuration: '0.2s' }}>

                <span className="font-ui text-[9px] tracking-widest text-muted-foreground/50">ACCENT COLOR</span>
                <input
                type="color"
                value={accentColor}
                onChange={(e) => setAccent(e.target.value)}
                aria-label="Choose accent color"
                className="w-full h-8 rounded cursor-pointer border border-border bg-transparent" />

                <div className="grid grid-cols-5 gap-1.5 mt-1">
                  {['#00D2FF', '#7B2FFF', '#00FF9D', '#FF9500', '#FF3B5C'].map((c) =>
                <button
                  key={c}
                  aria-label={`Set accent to ${c}`}
                  onClick={() => {setAccent(c);setShowColorPicker(false);}}
                  className="w-6 h-6 rounded-full border-2 transition-transform hover:scale-125 active:scale-95"
                  style={{ background: c, borderColor: accentColor === c ? 'white' : 'transparent' }} />

                )}
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </nav>);

};

export default Navbar;