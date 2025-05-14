// store/navigationStore.ts
import { create } from 'zustand';

interface NavigationItem {
  label: string;
  slug: string;
}

interface NavigationState {
  route: NavigationItem[];
  setRoute: (newRoute: NavigationItem[]) => void;
}

const useNavigationStore = create<NavigationState>((set) => ({
  route: [], // Inicializa la ruta como un array vacío
  setRoute: (newRoute) => set({ route: newRoute }),
}));

export default useNavigationStore;