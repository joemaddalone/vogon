export interface FontConfig {
  family: string;
  category: 'sans-serif' | 'serif' | 'display';
  google?: boolean;
  fallback?: string;
}

export type FontKey = keyof typeof TITLE_CARD_FONTS;

// Font definitions optimized for title cards
export const TITLE_CARD_FONTS: Record<string, FontConfig> = {
  // Sans-serif fonts
  bebasNeue: {
    family: 'Bebas Neue',
    category: 'sans-serif',
    google: true,
    fallback: 'Arial Black, sans-serif'
  },
  oswald: {
    family: 'Oswald',
    category: 'sans-serif',
    google: true,
    fallback: 'Arial, sans-serif'
  },
  montserrat: {
    family: 'Montserrat',
    category: 'sans-serif',
    google: true,
    fallback: 'Helvetica, sans-serif'
  },
  teko: {
    family: 'Teko',
    category: 'sans-serif',
    google: true,
    fallback: 'Arial, sans-serif'
  },

  // Serif fonts
  cinzel: {
    family: 'Cinzel',
    category: 'serif',
    google: true,
    fallback: 'Georgia, serif'
  },
  playfairDisplay: {
    family: 'Playfair Display',
    category: 'serif',
    google: true,
    fallback: 'Georgia, serif'
  },
  cormorantGaramond: {
    family: 'Cormorant Garamond',
    category: 'serif',
    google: true,
    fallback: 'Georgia, serif'
  },

  // Display fonts
  limelight: {
    family: 'Limelight',
    category: 'display',
    google: true,
    fallback: 'Impact, sans-serif'
  },
  orbitron: {
    family: 'Orbitron',
    category: 'display',
    google: true,
    fallback: 'Courier, monospace'
  },

  // System fallbacks
  systemSans: {
    family: 'system-ui, -apple-system, BlinkMacSystemFont',
    category: 'sans-serif',
    fallback: 'sans-serif'
  },
  systemSerif: {
    family: 'Georgia',
    category: 'serif',
    fallback: 'serif'
  }
};

export class FontManager {
  private loadedFonts: Set<string> = new Set();
  private loadingPromises: Map<string, Promise<void>> = new Map();

  /**
   * Load a Google Font using CSS injection
   */
  async loadFont(fontKey: string): Promise<void> {
    // Return existing promise if already loading
    if (this.loadingPromises.has(fontKey)) {
      return this.loadingPromises.get(fontKey)!;
    }

    // Return early if already loaded
    if (this.loadedFonts.has(fontKey)) {
      return;
    }

    const config = TITLE_CARD_FONTS[fontKey];
    if (!config) {
      throw new Error(`Font configuration not found for: ${fontKey}`);
    }

    // For system fonts, mark as loaded immediately
    if (!config.google) {
      this.loadedFonts.add(fontKey);
      return;
    }

    const loadingPromise = this.loadGoogleFont(config);
    this.loadingPromises.set(fontKey, loadingPromise);

    try {
      await loadingPromise;
      this.loadedFonts.add(fontKey);
      const f = document.createDocumentFragment();
      const s = document.createElement('span');
      s.style.fontFamily = this.getFontFamily(fontKey);
      s.id = `font-test-${fontKey}`;
      s.textContent = 'THIS IS A TEST';
      f.appendChild(s);
      document.body.appendChild(f);
      // remove the span from the DOM
      setTimeout(() => {
        document.getElementById(`font-test-${fontKey}`)?.remove();
      }, 500);

    } catch (error) {
      this.loadingPromises.delete(fontKey);
      throw error;
    }
  }

  private async loadGoogleFont(config: FontConfig): Promise<void> {
    return new Promise((resolve, reject) => {
      // Create link element for Google Fonts
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = `https://fonts.googleapis.com/css2?family=${config.family.replace(/\s+/g, '+')}&display=swap`;

      link.onload = () => {
        console.log(`Font loaded: ${config.family}`);
        // Give the browser a moment to process the font
        setTimeout(resolve, 100);
      };

      link.onerror = () => {
        reject(new Error(`Failed to load font: ${config.family}`));
      };

      document.head.appendChild(link);
    });
  }

  /**
   * Load multiple fonts in parallel
   */
  async loadFonts(fontKeys: string[]): Promise<void> {
    const promises = fontKeys.map(key => this.loadFont(key));
    await Promise.allSettled(promises);
  }

  /**
   * Check if a font is loaded
   */
  isFontLoaded(fontKey: string): boolean {
    return this.loadedFonts.has(fontKey);
  }

  /**
   * Get font family string for Canvas API
   */
  getFontFamily(fontKey: string): string {
    const config = TITLE_CARD_FONTS[fontKey];
    if (!config) {
      return 'sans-serif';
    }

    if (config.fallback) {
      return `"${config.family}", ${config.fallback}`;
    }

    return config.family;
  }

  /**
   * Get all available font configurations
   */
  getAvailableFonts(): Record<string, FontConfig> {
    return { ...TITLE_CARD_FONTS };
  }

  /**
   * Get fonts by category
   */
  getFontsByCategory(category: FontConfig['category']): Record<string, FontConfig> {
    const fonts: Record<string, FontConfig> = {};
    Object.entries(TITLE_CARD_FONTS).forEach(([key, config]) => {
      if (config.category === category) {
        fonts[key] = config;
      }
    });
    return fonts;
  }

  /**
   * Preload commonly used fonts
   */
  async preloadCommonFonts(): Promise<void> {
    const commonFonts = ['bebasNeue', 'oswald', 'cinzel', 'montserrat'];
    await this.loadFonts(commonFonts);
  }
}

// Singleton instance
export const fontManager = new FontManager();