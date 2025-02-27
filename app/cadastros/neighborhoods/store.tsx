import { create } from "zustand";

interface useStoreNeighborhoods {
  id: string;
  modalEditing: boolean;
  modalOpen: boolean;

  openModal: (id: string) => void;
  closeModal: () => void;
  editModal: (bool: boolean) => void;
}

export const useStoreNeighborhoods = create<useStoreNeighborhoods>((set) => ({
  id: "",
  modalEditing: false,
  modalOpen: false,

  openModal: (id: string) => set({ modalOpen: true, id: id, modalEditing: !id }),
  closeModal: () => set({ modalOpen: false }),
  editModal: (bool) => set({ modalEditing: bool }),
}));
