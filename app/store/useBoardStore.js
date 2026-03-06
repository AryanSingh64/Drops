import { create } from 'zustand';

const useBoardStore = create((set, get) => ({
    // === Canvas Elements ===
    elements: [],
    selectedId: null,
    editingId: null,

    // === Active Tool ===
    // 'select' | 'pan' | 'text' | 'image' | 'link' | 'checklist' | 'palette' | 'line' | 'subfolder' | 'draw' | 'comment'
    activeTool: 'select',

    // === Subfolder Navigation ===
    currentFolderId: null, // null = root
    folderPath: [], // breadcrumb: [{ id, name }, ...]

    // === Panels ===
    sidebarOpen: false,
    propertiesPanelOpen: false,
    aiPanelOpen: false,

    // === Boards ===
    boards: [{ id: 'default', name: 'My Board', elements: [] }],
    activeBoardId: 'default',

    // === Deleting Animation ===
    deletingId: null,

    // ========== ACTIONS ==========

    setElements: (callbackOrArray) => set((state) => ({
        elements: typeof callbackOrArray === 'function' ? callbackOrArray(state.elements) : callbackOrArray
    })),
    setSelectedId: (id) => set({ selectedId: id }),
    setEditingId: (id) => set({ editingId: id }),
    setActiveTool: (tool) => set({ activeTool: tool }),

    // Delete with animation
    deleteElement: (id) => {
        set({ deletingId: id });
        setTimeout(() => {
            set((state) => ({
                elements: state.elements.filter(el => el.id !== id),
                deletingId: null,
                selectedId: state.selectedId === id ? null : state.selectedId,
            }));
        }, 250); // matches anim-shrink-fade duration
    },

    // Add element at world position
    addElement: (type, worldX, worldY, extra = {}) => {
        const newEl = {
            id: Date.now(),
            type,
            x: worldX,
            y: worldY,
            content: '',
            ...extra,
        };
        set((state) => ({
            elements: [...state.elements, newEl],
            selectedId: newEl.id,
        }));
        return newEl.id;
    },

    // --- Subfolder Navigation ---
    enterFolder: (folderId, folderName) => set((state) => ({
        currentFolderId: folderId,
        folderPath: [...state.folderPath, { id: folderId, name: folderName }],
        selectedId: null,
        editingId: null,
    })),

    exitFolder: () => set((state) => {
        const newPath = [...state.folderPath];
        newPath.pop();
        return {
            currentFolderId: newPath.length > 0 ? newPath[newPath.length - 1].id : null,
            folderPath: newPath,
            selectedId: null,
            editingId: null,
        };
    }),

    jumpToFolder: (index) => set((state) => {
        // -1 = root
        if (index < 0) return { currentFolderId: null, folderPath: [], selectedId: null, editingId: null };
        const newPath = state.folderPath.slice(0, index + 1);
        return {
            currentFolderId: newPath[newPath.length - 1].id,
            folderPath: newPath,
            selectedId: null,
            editingId: null,
        };
    }),

    // --- Panels ---
    toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    togglePropertiesPanel: () => set((state) => ({ propertiesPanelOpen: !state.propertiesPanelOpen })),
    toggleAiPanel: () => set((state) => ({ aiPanelOpen: !state.aiPanelOpen })),
    setAiPanelOpen: (open) => set({ aiPanelOpen: open }),
    setSidebarOpen: (open) => set({ sidebarOpen: open }),

    // --- Deleting ---
    setDeletingId: (id) => set({ deletingId: id }),
}));

export default useBoardStore;
