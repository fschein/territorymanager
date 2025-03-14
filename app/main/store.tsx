import { TerritoryProps } from "@/types/TerritoryProps";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type CoordinatesProps = [number, number][][];

export interface State {
  id: string;
  sideSquareInfoOpen: boolean;
  sideTerritoryInfoOpen: boolean;
  mapStyle: string;
  coordinates: CoordinatesProps;
  territory: TerritoryProps | null;
  mode: "territory" | "square";
}

export interface Actions {
  openSideInfo: (props: {
    id: string;
    coordinates?: CoordinatesProps;
    mode?: "territory" | "square";
  }) => void;
  closeSideInfo: () => void;
  toggleMapStyle: () => void;
  setIdTerritory: (id: string) => void;
  setTerritory: (territory?: TerritoryProps) => void;
  toggleMode: () => void;
}

export const useStoreTerritory = create<State & Actions>()(
  persist(
    (set) => ({
      id: "",
      sideSquareInfoOpen: false,
      sideTerritoryInfoOpen: false,
      mapStyle: "mapbox://styles/mapbox/streets-v11",
      coordinates: [],
      territory: null,
      mode: "territory",
      openSideInfo: ({ id, coordinates, mode }) => {
        set((state) => ({
          id,
          coordinates,
          sideSquareInfoOpen: mode ? mode === "square" : state.mode === "square",
          sideTerritoryInfoOpen: mode ? mode === "territory" : state.mode === "territory",
        }));
      },
      closeSideInfo: () => {
        set({
          id: "",
          sideSquareInfoOpen: false,
          sideTerritoryInfoOpen: false,
          coordinates: [],
          territory: null,
        });
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
      toggleMode: () => {
        set((state) => ({
          mode: state.mode === "territory" ? "square" : "territory",
        }));
      },
    }),
    {
      name: "territory-storage", // Nome da chave no localStorage
      partialize: (state) => ({ mapStyle: state.mapStyle }), // Persiste apenas 'territories'
    }
  )
);
