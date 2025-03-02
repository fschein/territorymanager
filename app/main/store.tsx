import { TerritoryProps } from "@/types/TerritoryProps";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type CoordinatesProps = [number, number][][];

export interface State {
  id: string;
  sideInfoOpen: boolean;
  mapStyle: string;
  coordinates: CoordinatesProps;
  territory: TerritoryProps | null;
}

export interface Actions {
  openSideInfo: (props: { id: string; coordinates?: CoordinatesProps }) => void;
  closeSideInfo: () => void;
  toggleMapStyle: () => void;
  setIdTerritory: (id: string) => void;
  setTerritory: (territory?: TerritoryProps) => void;
}

export const useStoreTerritory = create<State & Actions>()(
  persist(
    (set) => ({
      id: "",
      sideInfoOpen: false,
      mapStyle: "mapbox://styles/mapbox/streets-v11",
      coordinates: [],
      territory: null,
      openSideInfo: ({ id, coordinates }) => {
        set({ id, coordinates, sideInfoOpen: true });
      },
      closeSideInfo: () => {
        set({ id: "", sideInfoOpen: false, coordinates: [], territory: null });
      },
      setIdTerritory: (id: string) => set({ id }),

      toggleMapStyle: () => {
        set((state) => ({
          mapStyle:
            state.mapStyle === "mapbox://styles/mapbox/streets-v11"
              ? "mapbox://styles/mapbox/satellite-streets-v11"
              : "mapbox://styles/mapbox/streets-v11",
        }));
      },
      setTerritory(territory) {
        set({ territory });
      },
    }),
    {
      name: "territory-storage", // Nome da chave no localStorage
      partialize: (state) => ({ mapStyle: state.mapStyle }), // Persiste apenas 'territories'
    }
  )
);
