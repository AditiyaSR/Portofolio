"use client";

import { useEffect, useState } from "react";
import { Globe } from "lucide-react";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "id", label: "Indonesian" },
  { code: "ja", label: "Japanese" },
  { code: "de", label: "German" },
  { code: "es", label: "Spanish" }
];

export function TranslateWidget() {
  const [lang, setLang] = useState("en");

  useEffect(() => {
    // Check current cookie
    const match = document.cookie.match(/googtrans=\/auto\/(.{2})/);
    if (match) {
      setLang(match[1]);
    }
    
    const win = window as any;
    win.googleTranslateElementInit = () => {
      if (!win.google?.translate?.TranslateElement) return;
      new win.google.translate.TranslateElement(
        { pageLanguage: "auto", autoDisplay: false },
        "google_translate_element"
      );
    };

    // Dynamically inject script to prevent React 19 hydration / script tag warning
    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handleChange = (e: any) => {
    const selected = e.target.value;
    setLang(selected);
    
    // Set cookie
    if (selected === "en") {
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + location.hostname;
    } else {
      document.cookie = `googtrans=/auto/${selected}; path=/`;
    }
    
    // Reload to apply translation
    window.location.reload();
  };

  return (
    <div className="flex items-center gap-2">
      <Globe size={16} className="text-[var(--theme-text-muted)] hidden sm:block" />
      <div className="relative">
        <select 
          value={lang} 
          onChange={handleChange}
          className="appearance-none bg-[var(--theme-bg-card)] text-sm font-medium text-[var(--theme-text-primary)] border border-[var(--theme-border)] rounded-full px-4 py-1.5 pr-8 cursor-pointer outline-none hover:border-[var(--theme-accent)] transition-colors"
        >
          {LANGUAGES.map(l => (
            <option key={l.code} value={l.code} className="bg-[var(--theme-bg-card)]">
              {l.label}
            </option>
          ))}
        </select>
        {/* Custom Dropdown Arrow */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[var(--theme-text-muted)]">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
      
      {/* Hidden element for google to hook into */}
      <div id="google_translate_element" className="hidden" />
    </div>
  );
}
