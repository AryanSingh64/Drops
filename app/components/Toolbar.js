"use client";
import { useState, useRef } from "react";
import useBoardStore from "../store/useBoardStore";

// === SVG Icon Components ===
const icons = {
    select: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
        </svg>
    ),
    pan: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 11V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2v1" />
            <path d="M14 10V4a2 2 0 0 0-2-2 2 2 0 0 0-2 2v2" />
            <path d="M10 10.5V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2v8" />
            <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8H12a8 8 0 0 1-8-8V8" />
        </svg>
    ),
    text: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="4 7 4 4 20 4 20 7" />
            <line x1="9" y1="20" x2="15" y2="20" />
            <line x1="12" y1="4" x2="12" y2="20" />
        </svg>
    ),
    image: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
        </svg>
    ),
    link: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
    ),
    checklist: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 11l3 3L22 4" />
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
    ),
    palette: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="13.5" cy="6.5" r="0.5" fill="currentColor" />
            <circle cx="17.5" cy="10.5" r="0.5" fill="currentColor" />
            <circle cx="8.5" cy="7.5" r="0.5" fill="currentColor" />
            <circle cx="6.5" cy="12.5" r="0.5" fill="currentColor" />
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
        </svg>
    ),
    line: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 19L19 5" strokeDasharray="4 3" />
            <circle cx="5" cy="19" r="2" />
            <circle cx="19" cy="5" r="2" />
        </svg>
    ),
    subfolder: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            <line x1="12" y1="11" x2="12" y2="17" />
            <line x1="9" y1="14" x2="15" y2="14" />
        </svg>
    ),
    draw: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 19l7-7 3 3-7 7-3-3z" />
            <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
            <path d="M2 2l7.586 7.586" />
            <circle cx="11" cy="11" r="2" />
        </svg>
    ),
    comment: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
    ),
    ai: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
    ),
    trash: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
    ),
};

function ToolButton({ icon, label, toolName, isActive, onClick }) {
    return (
        <button
            className={`toolbar-btn ${isActive ? 'active' : ''}`}
            onClick={onClick}
            aria-label={label}
        >
            {icon}
            <span className="tooltip">{label}</span>
        </button>
    );
}

export default function Toolbar({ onAddElement }) {
    const { activeTool, setActiveTool, selectedId, deleteElement, toggleAiPanel } = useBoardStore();
    const [shaking, setShaking] = useState(false);
    const fileInputRef = useRef(null);

    const handleToolClick = (tool) => {
        setActiveTool(tool);
        // For content tools, create element immediately
        if (tool === 'text') {
            onAddElement('text');
            setActiveTool('select');
        }
        if (tool === 'checklist') {
            onAddElement('checklist');
            setActiveTool('select');
        }
        if (tool === 'palette') {
            onAddElement('palette');
            setActiveTool('select');
        }
        if (tool === 'link') {
            onAddElement('link');
            setActiveTool('select');
        }
    };

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        e.target.value = "";
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            onAddElement("image", event.target.result);
        };
        reader.readAsDataURL(file);
        setActiveTool('select');
    };

    const handleTrashClick = () => {
        if (selectedId) {
            deleteElement(selectedId);
        } else {
            setShaking(true);
            setTimeout(() => setShaking(false), 400);
        }
    };

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 px-3 py-2 toolbar-pill">
            {/* Navigation Group */}
            <ToolButton icon={icons.select} label="Select" toolName="select" isActive={activeTool === 'select'} onClick={() => handleToolClick('select')} />
            <ToolButton icon={icons.pan} label="Pan" toolName="pan" isActive={activeTool === 'pan'} onClick={() => handleToolClick('pan')} />

            <div className="toolbar-divider" />

            {/* Content Group */}
            <ToolButton icon={icons.text} label="Text" toolName="text" isActive={activeTool === 'text'} onClick={() => handleToolClick('text')} />

            <button className="toolbar-btn" onClick={handleImageClick} aria-label="Image">
                {icons.image}
                <span className="tooltip">Image</span>
            </button>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
            />

            <ToolButton icon={icons.link} label="Link" toolName="link" isActive={activeTool === 'link'} onClick={() => handleToolClick('link')} />
            <ToolButton icon={icons.checklist} label="Checklist" toolName="checklist" isActive={activeTool === 'checklist'} onClick={() => handleToolClick('checklist')} />
            <ToolButton icon={icons.palette} label="Palette" toolName="palette" isActive={activeTool === 'palette'} onClick={() => handleToolClick('palette')} />
            <ToolButton icon={icons.line} label="Line" toolName="line" isActive={activeTool === 'line'} onClick={() => handleToolClick('line')} />
            <ToolButton icon={icons.subfolder} label="Subfolder" toolName="subfolder" isActive={activeTool === 'subfolder'} onClick={() => handleToolClick('subfolder')} />

            <div className="toolbar-divider" />

            {/* Utilities Group */}
            <ToolButton icon={icons.draw} label="Draw" toolName="draw" isActive={activeTool === 'draw'} onClick={() => handleToolClick('draw')} />
            <ToolButton icon={icons.comment} label="Comment" toolName="comment" isActive={activeTool === 'comment'} onClick={() => handleToolClick('comment')} />

            <div className="toolbar-divider" />

            {/* AI Button */}
            <button className="ai-btn" onClick={() => toggleAiPanel()} aria-label="AI Assistant">
                {icons.ai}
                <span style={{ position: 'relative', zIndex: 1 }}>AI</span>
                <span className="tooltip">AI Assistant</span>
            </button>

            {/* Trash Button */}
            <button
                className={`toolbar-btn trash-btn ${shaking ? 'anim-shake' : ''}`}
                onClick={handleTrashClick}
                aria-label="Delete"
            >
                {icons.trash}
                <span className="tooltip">Delete</span>
            </button>
        </div>
    );
}