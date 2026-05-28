import { useUiStore } from '@/app/state/ui-store';

export const useCommandPalette = () => {
  return useUiStore((state) => ({
    open: state.commandPaletteOpen,
    openPalette: state.openCommandPalette,
    closePalette: state.closeCommandPalette,
    togglePalette: state.toggleCommandPalette
  }));
};
