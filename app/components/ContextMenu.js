"use client";
import { useEffect, useRef } from "react";
import useBoardStore from "../store/useBoardStore";

export default function ContextMenu({ x, y, elementId, onClose }) {
    const { deleteElement, setEditingId, setElements, elements } = useBoardStore();
    const menuRef = useRef(null);

    // Close on outside click or Escape
    useEffect(() => {
        const handleClose = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) onClose();
        };
        const handleKey = (e) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("mousedown", handleClose);
        document.addEventListener("keydown", handleKey);
        return () => {
            document.removeEventListener("mousedown", handleClose);
            document.removeEventListener("keydown", handleKey);
        };
    }, [onClose]);

    const element = elements.find(el => el.id === elementId);

    const menuItems = [
        {
            label: "Duplicate",
            icon: (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
            ),
            onClick: () => {
                if (element) {
                    const dupe = { ...element, id: Date.now(), x: element.x + 30, y: element.y + 30 };
                    setElements((prev) => [...prev, dupe]);
                }
                onClose();
            },
        },
        {
            label: "Rename",
            icon: (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
            ),
            onClick: () => {
                if (element) setEditingId(elementId);
                onClose();
            },
        },
        {
            label: "Add link",
            icon: (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
            ),
            onClick: () => onClose(),
        },
        ...(element?.type === 'subfolder' ? [{
            label: "Enter subfolder",
            icon: (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                </svg>
            ),
            onClick: () => onClose(),
        }] : []),
        {
            label: "Delete",
            icon: (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
            ),
            danger: true,
            onClick: () => {
                deleteElement(elementId);
                onClose();
            },
        },
    ];

    return (
        <div
            ref={menuRef}
            className="glass-strong anim-fade-up"
            style={{
                position: "fixed",
                left: x,
                top: y,
                minWidth: "180px",
                borderRadius: "14px",
                padding: "6px",
                zIndex: 60,
                borderColor: "rgba(255,255,255,0.08)",
            }}
        >
            {menuItems.map((item, i) => (
                <button
                    key={item.label}
                    className="font-ui"
                    onClick={item.onClick}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        width: "100%",
                        padding: "8px 12px",
                        border: "none",
                        borderRadius: "10px",
                        background: "transparent",
                        color: item.danger ? "rgba(239, 68, 68, 0.8)" : "var(--text-primary)",
                        fontSize: "13px",
                        cursor: "pointer",
                        transition: "background 0.15s, color 0.15s",
                        textAlign: "left",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = item.danger
                            ? "rgba(239, 68, 68, 0.08)"
                            : "rgba(255,255,255,0.04)";
                        if (item.danger) e.currentTarget.style.color = "#ef4444";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = item.danger ? "rgba(239, 68, 68, 0.8)" : "var(--text-primary)";
                    }}
                >
                    <span style={{ color: item.danger ? "inherit" : "var(--text-secondary)", display: "flex" }}>
                        {item.icon}
                    </span>
                    {item.label}
                </button>
            ))}
        </div>
    );
}
