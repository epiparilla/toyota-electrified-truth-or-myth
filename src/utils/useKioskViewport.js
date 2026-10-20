import { useEffect } from 'react';

const PORTRAIT_RATIO = 9 / 16;
const MIN_KIOSK_WIDTH = 700;

export function useKioskViewport() {
  useEffect(() => {
    const root = document.documentElement;
    const viewport = window.visualViewport;

    const updateViewport = () => {
      const width = Math.round(viewport?.width ?? window.innerWidth);
      const height = Math.round(viewport?.height ?? window.innerHeight);
      const isLargePortrait = width >= MIN_KIOSK_WIDTH && height > width;

      if (!isLargePortrait) {
        delete root.dataset.kioskViewport;
        ['--kiosk-canvas-width', '--kiosk-canvas-height', '--kiosk-rem', '--kiosk-content-padding', '--kiosk-logo-size', '--header-top-clearance', '--welcome-action-bottom-clearance', '--kiosk-button-width'].forEach((property) => root.style.removeProperty(property));
        return;
      }

      const canvasWidth = Math.round(Math.min(width, height * PORTRAIT_RATIO));
      const scale = Math.min(Math.max(canvasWidth / 520, 1), 1.5);

      root.dataset.kioskViewport = 'large-portrait';
      root.style.setProperty('--kiosk-canvas-width', `${canvasWidth}px`);
      root.style.setProperty('--kiosk-canvas-height', `${height}px`);
      root.style.setProperty('--kiosk-rem', `${Math.round(16 * scale)}px`);
      root.style.setProperty('--kiosk-content-padding', `${Math.round(24 * scale)}px`);
      root.style.setProperty('--kiosk-logo-size', `${Math.round(104 * scale)}px`);
      root.style.setProperty('--header-top-clearance', `${Math.round(30 * scale)}px`);
      root.style.setProperty('--welcome-action-bottom-clearance', `${Math.round(48 * scale)}px`);
      root.style.setProperty('--kiosk-button-width', `${Math.round(Math.min(canvasWidth * 0.62, 650))}px`);
    };

    updateViewport();
    window.addEventListener('resize', updateViewport);
    viewport?.addEventListener('resize', updateViewport);

    return () => {
      window.removeEventListener('resize', updateViewport);
      viewport?.removeEventListener('resize', updateViewport);
    };
  }, []);
}
