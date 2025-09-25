import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Cog, Moon, Sun, Palette, Globe, Type, X } from "lucide-react";
import { languages } from "../data/i18n";
import { useLanguage } from "./LanguageContext";

// Persist helpers
const storage = {
  get: (k: string) => {
    try { return localStorage.getItem(k) } catch { return null }
  },
  set: (k: string, v: string) => {
    try { localStorage.setItem(k, v) } catch { /* noop */ }
  }
}

const ACCENTS: { key: string; from: string; to: string; label: string }[] = [
  { key: "default", from: "rgb(236 72 153)", to: "rgb(147 51 234)", label: "Default" },
  { key: "red", from: "#ef4444", to: "#b91c1c", label: "Red" },
  { key: "orange", from: "#f97316", to: "#ea580c", label: "Orange" },
  { key: "yellow", from: "#f59e0b", to: "#eab308", label: "Yellow" },
  { key: "green", from: "#22c55e", to: "#16a34a", label: "Green" },
  { key: "cyan", from: "#06b6d4", to: "#0891b2", label: "Cyan" },
  { key: "blue", from: "#3b82f6", to: "#2563eb", label: "Blue" },
  { key: "purple", from: "#8b5cf6", to: "#6d28d9", label: "Purple" },
  { key: "pink", from: "#ec4899", to: "#db2777", label: "Pink" },
  { key: "custom", from: "#000000", to: "#111111", label: "Custom" },
];

const FONTS: { key: string; label: string; css: string }[] = [
  { key: "Inter", label: "Inter (Default)", css: "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, \"Apple Color Emoji\", \"Segoe UI Emoji\"" },
  { key: "Poppins", label: "Poppins", css: "Poppins, Inter, ui-sans-serif, system-ui" },
  { key: "Rubik", label: "Rubik", css: "Rubik, Inter, ui-sans-serif, system-ui" },
  { key: "Space Grotesk", label: "Space Grotesk", css: "Space Grotesk, Inter, ui-sans-serif, system-ui" },
  { key: "Nunito", label: "Nunito", css: "Nunito, Inter, ui-sans-serif, system-ui" },
  { key: "Lato", label: "Lato", css: "Lato, Inter, ui-sans-serif, system-ui" },
  { key: "Merriweather", label: "Merriweather (Serif)", css: "Merriweather, Georgia, Cambria, \"Times New Roman\", Times, serif" },
  { key: "Roboto Mono", label: "Roboto Mono", css: "Roboto Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace" },
  { key: "VT323", label: "VT323 (Pixel)", css: "VT323, monospace" },
  { key: "Press Start 2P", label: "Press Start 2P (Pixel)", css: "\"Press Start 2P\", monospace" },
  { key: "IBM Plex Sans", label: "IBM Plex Sans", css: "IBM Plex Sans, Inter, ui-sans-serif, system-ui" },
  { key: "Manrope", label: "Manrope", css: "Manrope, Inter, ui-sans-serif, system-ui" },
  { key: "Sora", label: "Sora", css: "Sora, Inter, ui-sans-serif, system-ui" },
  { key: "Urbanist", label: "Urbanist", css: "Urbanist, Inter, ui-sans-serif, system-ui" },
  { key: "Outfit", label: "Outfit", css: "Outfit, Inter, ui-sans-serif, system-ui" },
  { key: "Montserrat", label: "Montserrat", css: "Montserrat, Inter, ui-sans-serif, system-ui" },
  { key: "Raleway", label: "Raleway", css: "Raleway, Inter, ui-sans-serif, system-ui" },
  { key: "Oswald", label: "Oswald", css: "Oswald, Inter, ui-sans-serif, system-ui" },
  { key: "Archivo", label: "Archivo", css: "Archivo, Inter, ui-sans-serif, system-ui" },
  { key: "Exo 2", label: "Exo 2", css: "'Exo 2', Inter, ui-sans-serif, system-ui" },
  { key: "JetBrains Mono", label: "JetBrains Mono (Mono)", css: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace" },
  { key: "Fira Code", label: "Fira Code (Mono)", css: "'Fira Code', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace" },
  { key: "Open Sans", label: "Open Sans", css: "'Open Sans', Inter, ui-sans-serif, system-ui" },
  { key: "Source Sans Pro", label: "Source Sans Pro", css: "'Source Sans Pro', Inter, ui-sans-serif, system-ui" },
  { key: "Roboto", label: "Roboto", css: "Roboto, Inter, ui-sans-serif, system-ui" },
  { key: "Playfair Display", label: "Playfair Display (Serif)", css: "'Playfair Display', Georgia, Cambria, 'Times New Roman', Times, serif" },
  { key: "Crimson Text", label: "Crimson Text (Serif)", css: "'Crimson Text', Georgia, Cambria, 'Times New Roman', Times, serif" },
  { key: "Libre Baskerville", label: "Libre Baskerville (Serif)", css: "'Libre Baskerville', Georgia, Cambria, 'Times New Roman', Times, serif" },
  { key: "Work Sans", label: "Work Sans", css: "'Work Sans', Inter, ui-sans-serif, system-ui" },
  { key: "DM Sans", label: "DM Sans", css: "'DM Sans', Inter, ui-sans-serif, system-ui" },
  { key: "Plus Jakarta Sans", label: "Plus Jakarta Sans", css: "'Plus Jakarta Sans', Inter, ui-sans-serif, system-ui" },
  { key: "Lexend", label: "Lexend", css: "Lexend, Inter, ui-sans-serif, system-ui" },
  { key: "Quicksand", label: "Quicksand", css: "Quicksand, Inter, ui-sans-serif, system-ui" },
  { key: "Comfortaa", label: "Comfortaa", css: "Comfortaa, Inter, ui-sans-serif, system-ui" },
  { key: "Righteous", label: "Righteous", css: "Righteous, Inter, ui-sans-serif, system-ui" },
  { key: "Fredoka", label: "Fredoka", css: "Fredoka, Inter, ui-sans-serif, system-ui" },
  { key: "Caveat", label: "Caveat (Handwriting)", css: "Caveat, cursive" },
  { key: "Dancing Script", label: "Dancing Script (Handwriting)", css: "'Dancing Script', cursive" },
  { key: "Pacifico", label: "Pacifico (Display)", css: "Pacifico, cursive" },
  { key: "Bebas Neue", label: "Bebas Neue (Display)", css: "'Bebas Neue', cursive" },
  { key: "Orbitron", label: "Orbitron (Futuristic)", css: "Orbitron, monospace" },
  { key: "Chakra Petch", label: "Chakra Petch (Tech)", css: "'Chakra Petch', monospace" },
  { key: "Source Code Pro", label: "Source Code Pro (Mono)", css: "'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace" },
  { key: "Inconsolata", label: "Inconsolata (Mono)", css: "Inconsolata, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace" },
  { key: "Ubuntu Mono", label: "Ubuntu Mono", css: "'Ubuntu Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace" },
  { key: "Cascadia Code", label: "Cascadia Code (Mono)", css: "'Cascadia Code', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace" },
];

// Generate a nice gradient from a single hex by shifting hue/lightness
function generateGradientStops(hex: string): { from: string; to: string } {
  // Fallback
  if (!/^#([0-9a-fA-F]{3}){1,2}$/.test(hex)) return { from: hex, to: hex };
  const toHsl = (h: string) => {
    let r = 0, g = 0, b = 0;
    if (h.length === 4) {
      r = parseInt(h[1] + h[1], 16);
      g = parseInt(h[2] + h[2], 16);
      b = parseInt(h[3] + h[3], 16);
    } else {
      r = parseInt(h.slice(1, 3), 16);
      g = parseInt(h.slice(3, 5), 16);
      b = parseInt(h.slice(5, 7), 16);
    }
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let hDeg = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: hDeg = (g - b) / d + (g < b ? 6 : 0); break;
        case g: hDeg = (b - r) / d + 2; break;
        case b: hDeg = (r - g) / d + 4; break;
      }
      hDeg *= 60;
    }
    return { h: hDeg, s: s * 100, l: l * 100 };
  };
  const clamp = (n: number, a: number, b: number) => Math.max(a, Math.min(b, n));
  const hsl = toHsl(hex);
  const toHslStr = (h: number, s: number, l: number) => `hsl(${Math.round(h)} ${Math.round(s)}% ${Math.round(l)}%)`;
  const from = toHslStr(hsl.h, clamp(hsl.s, 45, 95), clamp(hsl.l, 35, 65));
  const to = toHslStr((hsl.h + 25) % 360, clamp(hsl.s + 5, 45, 98), clamp(hsl.l - 10, 25, 70));
  return { from, to };
}

export const SettingsMenu: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">(() => (document.documentElement.classList.contains("dark") ? "dark" : (storage.get("theme") as any) || "light"));
  const [accent, setAccent] = useState<string>(() => storage.get("accent") || "default");
  const [font, setFont] = useState<string>(() => storage.get("font") || "Inter");
  const [customHex, setCustomHex] = useState<string>(() => storage.get("accentHex") || "#ec4899");
  const ref = useRef<HTMLDivElement>(null);
  // new: simple tabs for a cleaner layout
  const [tab, setTab] = useState<"theme" | "accent" | "font" | "language">("accent");

  const resetAll = () => {
    setTheme("light");
    setAccent("default");
    setFont("Inter");
    setCustomHex("#ec4899");
    setLanguage("en");
    try {
      localStorage.removeItem("theme");
      localStorage.removeItem("accent");
      localStorage.removeItem("accentHex");
      localStorage.removeItem("font");
      // language persistence (if any) will be overwritten by setLanguage("en")
    } catch {}
  };

  // Close on outside click (modal overlay handles, but keep Escape support)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (open) {
      const prevBodyOverflow = document.body.style.overflow;
      const prevHtmlOverflow = document.documentElement.style.overflow;
      const prevBodyTouch = (document.body.style as any).touchAction;
      const prevHtmlOverscroll = (document.documentElement.style as any).overscrollBehavior;
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      (document.body.style as any).touchAction = 'none';
      (document.documentElement.style as any).overscrollBehavior = 'contain';
      return () => {
        document.body.style.overflow = prevBodyOverflow;
        document.documentElement.style.overflow = prevHtmlOverflow;
        (document.body.style as any).touchAction = prevBodyTouch;
        (document.documentElement.style as any).overscrollBehavior = prevHtmlOverscroll;
      };
    }
  }, [open]);

  // Apply theme
  useEffect(() => {
    if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    storage.set("theme", theme);
  }, [theme]);

  // Apply accent as CSS variables
  useEffect(() => {
    const chosen = ACCENTS.find(a => a.key === accent) || ACCENTS[0];
    let from = chosen.from, to = chosen.to;
    if (accent === 'custom') {
      const gen = generateGradientStops(customHex);
      from = gen.from; to = gen.to;
    }
    const root = document.documentElement;
    root.style.setProperty("--grad-from", from);
    root.style.setProperty("--grad-to", to);
    storage.set("accent", accent);
    if (accent === 'custom') storage.set('accentHex', customHex);
  }, [accent, customHex]);

  // Apply font via CSS variable
  useEffect(() => {
    const chosen = FONTS.find(f => f.key === font) || FONTS[0];
    document.documentElement.style.setProperty("--app-font", chosen.css);
    storage.set("font", font);
  }, [font]);

  const currentFlagUrl = useMemo(() => {
    const flagCode = language === 'en' ? 'US' : language === 'dk' ? 'DK' : 'US';
    return `https://flagsapi.com/${flagCode}/flat/24.png`;
  }, [language]);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(true)}
        className="p-2 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="Open settings"
      >
        <Cog className="w-5 h-5" />
      </button>

      {open && createPortal(
        <div className="fixed inset-0 z-[9999]" aria-modal="true" role="dialog">
          {/* Backdrop */}
          <div onClick={() => setOpen(false)} aria-label="Close settings overlay" className="fixed inset-0 bg-black/70 backdrop-blur-sm" />

          {/* Modal */}
          <div ref={ref} className="fixed inset-0 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl sm:rounded-2xl rounded-none bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-200/60 dark:border-gray-700/50 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[88vh]">
              {/* Header */}
              <div className="sticky top-0 z-10 px-4 py-3 border-b border-gray-200 dark:border-gray-700/50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-white">
                    <Cog className="w-4 h-4" /> Settings
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={resetAll} className="px-3 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">Reset</button>
                    <button onClick={() => setOpen(false)} aria-label="Close settings" className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                      <X className="w-5 h-5 text-gray-600 dark:text-gray-200" />
                    </button>
                  </div>
                </div>
                {/* Tabs */}
                <div className="mt-3 grid grid-cols-4 gap-2 sm:hidden">
                  <button onClick={() => setTab('theme')} className={`flex items-center justify-center gap-2 px-3 py-2 rounded-xl border text-sm text-gray-700 dark:text-gray-200 ${tab==='theme'? 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600' : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                    <Moon className="w-4 h-4"/> Theme
                  </button>
                  <button onClick={() => setTab('accent')} className={`flex items-center justify-center gap-2 px-3 py-2 rounded-xl border text-sm text-gray-700 dark:text-gray-200 ${tab==='accent'? 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600' : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                    <Palette className="w-4 h-4"/> Accent
                  </button>
                  <button onClick={() => setTab('font')} className={`flex items-center justify-center gap-2 px-3 py-2 rounded-xl border text-sm text-gray-700 dark:text-gray-200 ${tab==='font'? 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600' : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                    <Type className="w-4 h-4"/> Font
                  </button>
                  <button onClick={() => setTab('language')} className={`flex items-center justify-center gap-2 px-3 py-2 rounded-xl border text-sm text-gray-700 dark:text-gray-200 ${tab==='language'? 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600' : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                    <Globe className="w-4 h-4"/> Language
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-1 sm:grid-cols-[280px,1fr] gap-4">
                  {/* Sidebar (desktop) */}
                  <div className="hidden sm:flex flex-col gap-2">
                    <button onClick={() => setTab('theme')} className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm text-gray-700 dark:text-gray-200 ${tab==='theme'? 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600' : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                      <Moon className="w-4 h-4"/> Theme
                    </button>
                    <button onClick={() => setTab('accent')} className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm text-gray-700 dark:text-gray-200 ${tab==='accent'? 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600' : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                      <Palette className="w-4 h-4"/> Accent
                    </button>
                    <button onClick={() => setTab('font')} className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm text-gray-700 dark:text-gray-200 ${tab==='font'? 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600' : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                      <Type className="w-4 h-4"/> Font
                    </button>
                    <button onClick={() => setTab('language')} className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm text-gray-700 dark:text-gray-200 ${tab==='language'? 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600' : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                      <Globe className="w-4 h-4"/> Language
                    </button>
                  </div>
                  {/* Content */}
                  <div>
                    {tab === 'theme' && (
                      <div className="space-y-3">
                        <div className="text-sm font-semibold text-gray-700 dark:text-white">Choose theme</div>
                        <div className="grid grid-cols-2 gap-2">
                          <button onClick={() => setTheme("light")} className={`flex items-center justify-center gap-2 px-3 py-3 rounded-xl border text-gray-700 dark:text-gray-200 ${theme==='light'? 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600' : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                            <Sun className="w-4 h-4" /> Light
                          </button>
                          <button onClick={() => setTheme("dark")} className={`flex items-center justify-center gap-2 px-3 py-3 rounded-xl border text-gray-700 dark:text-gray-200 ${theme==='dark'? 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600' : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                            <Moon className="w-4 h-4" /> Dark
                          </button>
                        </div>
                        <div>
                          <button onClick={resetAll} className="mt-2 px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">Reset to defaults</button>
                        </div>
                      </div>
                    )}

                    {tab === 'accent' && (
                      <div className="space-y-3">
                        <div className="text-sm font-semibold text-gray-700 dark:text-white">Accent gradient</div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                          {ACCENTS.map(a => (
                            <button key={a.key} onClick={() => setAccent(a.key)} className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-gray-700 dark:text-gray-200 ${accent===a.key? 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600' : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                              {a.key === 'custom' ? (
                                <span className="w-6 h-6 rounded-md border border-gray-300 dark:border-gray-600 bg-black" />
                              ) : (
                                <span className="w-6 h-6 rounded-md" style={{ backgroundImage: `linear-gradient(90deg, ${a.from}, ${a.to})` }} />
                              )}
                              <span>{a.label}</span>
                            </button>
                          ))}
                        </div>
                        {accent === 'custom' && (
                          <div className="flex flex-col gap-2 rounded-xl border border-gray-200 dark:border-gray-600 p-3">
                            <label className="text-xs text-gray-600 dark:text-gray-300">Pick a base color</label>
                            <div className="flex items-center gap-3">
                              <input type="color" value={customHex} onChange={(e) => setCustomHex(e.target.value)} aria-label="Pick accent color" className="h-10 w-10 rounded-md border border-gray-300 dark:border-gray-600" />
                              <div className="flex-1 h-10 rounded-md border border-gray-200 dark:border-gray-600" style={{ backgroundImage: `linear-gradient(90deg, ${generateGradientStops(customHex).from}, ${generateGradientStops(customHex).to})` }} />
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {tab === 'font' && (
                      <div className="space-y-2">
                        <div className="text-sm font-semibold text-gray-700 dark:text-white">Global font</div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-auto pr-1">
                          {FONTS.map(f => (
                            <button key={f.key} onClick={() => setFont(f.key)} className={`px-3 py-2 rounded-xl border text-left text-gray-700 dark:text-gray-200 ${font===f.key? 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600' : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'}`} style={{ fontFamily: f.css }}>
                              {f.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {tab === 'language' && (
                      <div className="space-y-2">
                        <div className="text-sm font-semibold text-gray-700 dark:text-white">Language</div>
                        <div className="grid grid-cols-2 gap-2">
                          {languages.map(({ name, shortname }) => (
                            <button key={shortname} onClick={() => setLanguage(shortname)} className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-gray-700 dark:text-gray-200 ${language===shortname? 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600' : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                              <img src={`https://flagsapi.com/${shortname === 'en' ? 'US' : 'DK'}/flat/24.png`} alt={`${name} flag`} className="w-5 h-5 rounded-sm"/>
                              <span>{name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      , document.body)}
    </div>
  );
}

export default SettingsMenu;