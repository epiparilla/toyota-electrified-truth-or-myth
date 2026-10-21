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
        ['--kiosk-canvas-width', '--kiosk-canvas-height', '--kiosk-rem', '--kiosk-content-padding', '--kiosk-logo-size', '--header-top-clearance', '--welcome-action-bottom-clearance', '--kiosk-button-width', '--kiosk-button-height', '--kiosk-result-badge-size', '--kiosk-result-icon-size', '--kiosk-facilitator-control-size', '--kiosk-facilitator-icon-size', '--kiosk-facilitator-edge', '--kiosk-facilitator-bottom-offset', '--kiosk-settings-inline-edge', '--kiosk-settings-block-edge', '--kiosk-settings-card-padding'].forEach((property) => root.style.removeProperty(property));
        return;
      }

      const canvasWidth = Math.round(Math.min(width, height * PORTRAIT_RATIO));
      // The phone captures are the visual reference. Scale from the measured
      // canvas rather than keeping the old small-device cap on a 55-inch kiosk.
      const scale = Math.max(canvasWidth / 520, 1);

      root.dataset.kioskViewport = 'large-portrait';
      root.style.setProperty('--kiosk-canvas-width', `${canvasWidth}px`);
      root.style.setProperty('--kiosk-canvas-height', `${height}px`);
      root.style.setProperty('--kiosk-rem', `${Math.round(16 * scale)}px`);
      root.style.setProperty('--kiosk-content-padding', `${Math.round(canvasWidth * 0.055)}px`);
      root.style.setProperty('--kiosk-logo-size', `${Math.round(canvasWidth * 0.3)}px`);
      root.style.setProperty('--header-top-clearance', `${Math.round(height * 0.035)}px`);
      root.style.setProperty('--welcome-action-bottom-clearance', `${Math.round(height * 0.04)}px`);
      root.style.setProperty('--kiosk-button-width', `${Math.round(canvasWidth * 0.88)}px`);
      root.style.setProperty('--kiosk-button-height', `${Math.round(canvasWidth * 0.125)}px`);
      root.style.setProperty('--kiosk-result-badge-size', `${Math.round(canvasWidth * 0.21)}px`);
      root.style.setProperty('--kiosk-result-icon-size', `${Math.round(canvasWidth * 0.128)}px`);
      root.style.setProperty('--kiosk-facilitator-control-size', `${Math.round(canvasWidth * 0.083)}px`);
      root.style.setProperty('--kiosk-facilitator-icon-size', `${Math.round(canvasWidth * 0.042)}px`);
      root.style.setProperty('--kiosk-facilitator-edge', `${Math.round(canvasWidth * 0.042)}px`);
      root.style.setProperty('--kiosk-facilitator-bottom-offset', `${Math.round(height * 0.04)}px`);
      root.style.setProperty('--kiosk-settings-inline-edge', `${Math.round(canvasWidth * 0.054)}px`);
      root.style.setProperty('--kiosk-settings-block-edge', `${Math.round(height * 0.02)}px`);
      root.style.setProperty('--kiosk-settings-card-padding', `${Math.round(canvasWidth * 0.054)}px`);
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
