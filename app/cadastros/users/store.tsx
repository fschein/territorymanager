import { create } from "zustand";

interface useStoreUsers {
  id: string;
  modalEditing: boolean;
  modalOpen: boolean;

  openModal: (id: string) => void;
  closeModal: () => void;
  editModal: (bool: boolean) => void;
}

export const useStoreUsers = create<useStoreUsers>((set) => ({
  id: "",
  modalEditing: false,
  modalOpen: false,

  openModal: (id: string) => set({ modalOpen: true, id: id, modalEditing: !id }),
  closeModal: () => set({ modalOpen: false }),
  editModal: (bool) => set({ modalEditing: bool }),
}));
