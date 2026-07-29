"";

import { create } from "zustand";

type CategoryState = {
    selectedCategory: string | null;
    setCategory: (cat: string | null) => void;
};

export const useCategoryStore = create<CategoryState>((set) => ({
    selectedCategory: null,
    setCategory: (cat) => set({ selectedCategory: cat }),
}));
