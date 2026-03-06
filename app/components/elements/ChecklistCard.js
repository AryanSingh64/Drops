"use client";
import { useState } from "react";

export default function ChecklistCard({ el, isSelected, updateElement, onDelete }) {
    const items = el.items || [{ id: 1, text: "First item", checked: false }];
    const [newItemText, setNewItemText] = useState("");

    const toggleItem = (itemId) => {
        const updated = items.map(item =>
            item.id === itemId ? { ...item, checked: !item.checked } : item
        );
        updateElement(el.id, "items", updated);
    };

    const addItem = () => {
        if (!newItemText.trim()) return;
        const updated = [...items, { id: Date.now(), text: newItemText.trim(), checked: false }];
        updateElement(el.id, "items", updated);
        setNewItemText("");
    };

    const removeItem = (itemId) => {
        const updated = items.filter(item => item.id !== itemId);
        updateElement(el.id, "items", updated);
    };

    return (
        <div style={{ position: "relative", minWidth: "220px" }}>
            {/* Title */}
            <h3
                className="font-display text-primary"
                style={{ fontSize: "18px", marginBottom: "14px", fontStyle: "italic" }}
            >
                {el.title || "Checklist"}
            </h3>

            {/* Items */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {items.map((item) => (
                    <div
                        key={item.id}
                        style={{ display: "flex", alignItems: "center", gap: "10px" }}
                    >
                        <div
                            className={`custom-check ${item.checked ? 'checked' : ''}`}
                            onClick={(e) => { e.stopPropagation(); toggleItem(item.id); }}
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        </div>
                        <span
                            className="font-ui"
                            style={{
                                fontSize: "13px",
                                color: item.checked ? "var(--text-placeholder)" : "var(--text-primary)",
                                textDecoration: item.checked ? "line-through" : "none",
                                transition: "color 0.2s, text-decoration 0.2s",
                                flex: 1,
                            }}
                        >
                            {item.text}
                        </span>
                        <button
                            onClick={(e) => { e.stopPropagation(); removeItem(item.id); }}
                            style={{
                                background: "none",
                                border: "none",
                                color: "var(--text-placeholder)",
                                cursor: "pointer",
                                fontSize: "14px",
                                padding: "2px",
                                opacity: 0.5,
                                transition: "opacity 0.15s",
                            }}
                            onMouseEnter={(e) => e.target.style.opacity = 1}
                            onMouseLeave={(e) => e.target.style.opacity = 0.5}
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>

            {/* Add Item Input */}
            {isSelected && (
                <div style={{ display: "flex", gap: "6px", marginTop: "10px" }}>
                    <input
                        className="glass-input"
                        style={{ flex: 1, fontSize: "12px", padding: "6px 10px" }}
                        placeholder="Add item..."
                        value={newItemText}
                        onChange={(e) => setNewItemText(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") addItem(); }}
                        onMouseDown={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </div>
    );
}
