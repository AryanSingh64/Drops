import { create } from 'zustand';

const useBoardStore = create((set) => ({
    // The state
    elements: [],
    selectedId: null,
    editingId: null,

    // The actions (functions to update state)
    setElements: (callbackOrArray) => set((state) => ({
        elements: typeof callbackOrArray === 'function' ? callbackOrArray(state.elements) : callbackOrArray
    })),
    setSelectedId: (id) => set({ selectedId: id }),
    setEditingId: (id) => set({ editingId: id }),
}));

export default useBoardStore;
