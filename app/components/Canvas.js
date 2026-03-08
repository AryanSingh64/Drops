"use client"
import { useRef, useState, useEffect, useCallback } from "react";
import Toolbar from "./Toolbar";
import Header from "./Header";
import AiPanel from "./AiPanel";
import ContextMenu from "./ContextMenu";
import TextElement from "./elements/TextElement";
import ChecklistCard from "./elements/ChecklistCard";
import LinkPreviewCard from "./elements/LinkPreviewCard";
import ColorPaletteCard from "./elements/ColorPaletteCard";
import { Rnd } from "react-rnd";
import useBoardStore from "../store/useBoardStore";
import ZoomControl from "./ZoomControls";



// Delete button component for all cards
function DeleteButton({ onClick, isVisible }) {
    return (
        <div
            className="delete-dot"
            style={{ opacity: isVisible ? 1 : undefined }}
            onClick={(e) => {
                e.stopPropagation();
                onClick();
            }}
        >
            <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3">
                <path d="M6 18L18 6M6 6l12 12" />
            </svg>
        </div>
    );
}

export default function Canvas() {
    // const [offset, setOffset] = useState({ x: 0, y: 0 });
    // const [scale, setScale] = useState(1);
    const [isPanning, setIsPanning] = useState(false);
    const [contextMenu, setContextMenu] = useState(null);
    const viewportRef = useRef(null);

    const {
        elements, setElements,
        editingId, selectedId,
        setSelectedId, setEditingId,
        activeTool, setActiveTool,
        deletingId, deleteElement,
        folderPath,
        scale, offset, setScale, setOffset,
    } = useBoardStore();

    // Nesting depth tint
    const nestingDepth = folderPath.length;
    const depthTint = nestingDepth > 0
        ? `rgba(212, 130, 106, ${Math.min(0.04 * nestingDepth, 0.12)})`
        : 'transparent';

    // === Keyboard Delete ===
    useEffect(() => {
        if (!selectedId) return;
        if (editingId) return;
        const handleKeyDown = (e) => {
            if (e.key === "Backspace" || e.key === "Delete") {
                deleteElement(selectedId);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectedId, editingId, deleteElement]);

    // === Image Drop ===
    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (!file || !file.type.startsWith("image/")) return;

        const rect = viewportRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const worldX = (mouseX - offset.x) / scale;
        const worldY = (mouseY - offset.y) / scale;

        const reader = new FileReader();
        reader.onload = (loadEvent) => {
            const imageUrl = loadEvent.target.result;
            const img = new Image();
            img.src = imageUrl;
            img.onload = () => {
                const ratio = img.naturalHeight / img.naturalWidth;
                const initialWidth = 300;
                const initialHeight = initialWidth * ratio;
                const newImage = {
                    id: Date.now(),
                    type: "image",
                    x: worldX,
                    y: worldY,
                    content: imageUrl,
                    width: initialWidth,
                    height: initialHeight,
                    aspectRatio: ratio,
                };
                setElements((prev) => [...prev, newImage]);
            };
        };
        reader.readAsDataURL(file);
    };

    // === Add Element ===
    const addElement = (type, content = "") => {
        const centerX = window.innerWidth / 2 - offset.x;
        const centerY = window.innerHeight / 2 - offset.y;
        const worldX = centerX / scale + (Math.random() * 80 - 40);
        const worldY = centerY / scale + (Math.random() * 80 - 40);

        if (type === "image" && content) {
            const img = new Image();
            img.src = content;
            img.onload = () => {
                const ratio = img.naturalHeight / img.naturalWidth;
                const initialWidth = 300;
                const initialHeight = initialWidth * ratio;
                setElements((prev) => [...prev, {
                    id: Date.now(), type: "image",
                    x: worldX, y: worldY,
                    content, width: initialWidth, height: initialHeight, aspectRatio: ratio,
                }]);
            };
            return;
        }

        if (type === "checklist") {
            setElements((prev) => [...prev, {
                id: Date.now(), type: "checklist",
                x: worldX, y: worldY,
                width: 280, height: 220,
                title: "Checklist",
                items: [
                    { id: 1, text: "First item", checked: false },
                    { id: 2, text: "Second item", checked: false },
                ],
            }]);
            return;
        }

        if (type === "link") {
            setElements((prev) => [...prev, {
                id: Date.now(), type: "link",
                x: worldX, y: worldY,
                width: 280, height: 140,
                url: "", linkTitle: "", favicon: null,
            }]);
            return;
        }

        if (type === "palette") {
            setElements((prev) => [...prev, {
                id: Date.now(), type: "palette",
                x: worldX, y: worldY,
                width: 320, height: 260,
                title: "Palette",
                colors: ["#E8C97A", "#D4826A", "#C47FA3", "#4E8B7A", "#E2A65D", "#8B6FCF"],
            }]);
            return;
        }

        // Default: text
        setElements((prev) => [...prev, {
            id: Date.now(), type,
            x: worldX, y: worldY,
            width: 240, height: 100,
            content: "", title: "",
        }]);
    };

    // === Panning ===
    const handleCanvasMouseDown = (e) => {
        // If the user clicked inside a react-rnd card, don't deselect or start panning.
        // react-rnd wraps cards in divs with class "react-draggable".
        if (e.target.closest('.react-draggable')) return;

        if (activeTool === 'pan' || e.button === 1) {
            setIsPanning(true);
        }
        setEditingId(null);
        setSelectedId(null);
        setContextMenu(null);
    };

    const handleCanvasMouseUp = () => {
        setIsPanning(false);
    };

    const handleCanvasMouseMove = (e) => {
        // Only preventDefault when actually panning — otherwise it kills react-rnd's drag
        if (isPanning) {
            e.preventDefault();
            setOffset((prev) => ({
                x: prev.x + e.movementX,
                y: prev.y + e.movementY,
            }));
        }
    };

    const updateElement = (id, field, value) => {
        setElements((prev) =>
            prev.map((el) => el.id === id ? { ...el, [field]: value } : el)
        );
    };

    // Common Rnd drag/resize handlers
    const handleDragStop = (el, e, data) => {
        setElements((prev) => prev.map((item) =>
            item.id === el.id ? { ...item, x: data.x, y: data.y } : item
        ));
    };

    const handleResizeStop = (el, e, direction, ref, delta, position) => {
        setElements((prev) => prev.map((item) => {
            if (item.id === el.id) {
                return {
                    ...item,
                    width: parseInt(ref.style.width, 10),
                    height: parseInt(ref.style.height, 10),
                    x: position.x,
                    y: position.y,
                };
            }
            return item;
        }));
    };

    const handleRndMouseDown = (el, e) => {
        e.stopPropagation();
        setSelectedId(el.id);
    };

    const onDoubleClick = (id, e) => {
        e.stopPropagation();
        setEditingId(id);
    };

    const handleCardContextMenu = (el, e) => {
        e.preventDefault();
        e.stopPropagation();
        setContextMenu({ x: e.clientX, y: e.clientY, elementId: el.id });
    };

    // === Zoom ===
    const handleWheel = useCallback((e) => {
        e.preventDefault();
        const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
        const minZoom = 0.15;
        const maxZoom = 5;
        let rawScale = scale * zoomFactor;
        const newScale = Math.max(minZoom, Math.min(maxZoom, rawScale));
        if (newScale === scale) return;

        const rect = viewportRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const appliedFactor = newScale / scale;
        const newX = mouseX - (mouseX - offset.x) * appliedFactor;
        const newY = mouseY - (mouseY - offset.y) * appliedFactor;

        setScale(newScale);
        setOffset({ x: newX, y: newY });
    }, [scale, offset]);

    // Attach wheel with passive: false
    useEffect(() => {
        const el = viewportRef.current;
        if (!el) return;
        el.addEventListener('wheel', handleWheel, { passive: false });
        return () => el.removeEventListener('wheel', handleWheel);
    }, [handleWheel]);

    // === Cursor Logic ===
    const getCursor = () => {
        if (isPanning) return "grabbing";
        if (activeTool === 'pan') return "grab";
        return "default";
    };

    return (
        <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            style={{
                width: "100vw",
                height: "100vh",
                overflow: "hidden",
                position: "fixed",
                top: 0,
                left: 0,
                cursor: getCursor(),
            }}
            onMouseDown={handleCanvasMouseDown}
            onMouseUp={handleCanvasMouseUp}
            onMouseMove={handleCanvasMouseMove}
            ref={viewportRef}
            className="canvas-bg"
        >
            {/* Dot Grid Overlay */}
            <div
                className="dot-grid"
                style={{
                    position: "absolute",
                    inset: 0,
                    pointerEvents: "none",
                    zIndex: 0,
                }}
            />

            {/* Depth tint overlay for subfolder nesting */}
            {nestingDepth > 0 && (
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        background: depthTint,
                        pointerEvents: "none",
                        zIndex: 0,
                    }}
                />
            )}

            {/* Toolbar */}
            <Toolbar onAddElement={addElement} />

            {/* Canvas Layer */}
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
                    transformOrigin: "top left",
                    position: "absolute",
                    inset: 0,
                }}
            >
                {elements.map((el) => {
                    const isBeingDeleted = deletingId === el.id;
                    const isSelected_ = selectedId === el.id;
                    const isEditing_ = editingId === el.id;

                    // === IMAGE CARD (locked aspect ratio) ===
                    if (el.type === "image") {
                        return (
                            <Rnd
                                key={el.id}
                                position={{ x: el.x, y: el.y }}
                                size={{ width: el.width || 300, height: el.height || 200 }}
                                scale={scale}
                                lockAspectRatio={true}
                                onDragStart={(e) => {
                                    e.stopPropagation();
                                    setSelectedId(el.id);
                                }}
                                onDragStop={(e, data) => handleDragStop(el, e, data)}
                                onResizeStop={(e, dir, ref, delta, pos) => handleResizeStop(el, e, dir, ref, delta, pos)}
                                onMouseDown={(e) => handleRndMouseDown(el, e)}
                                onContextMenu={(e) => handleCardContextMenu(el, e)}
                                style={{
                                    zIndex: isSelected_ ? 10 : 1,
                                }}
                                resizeHandleStyles={{
                                    bottomRight: { width: '14px', height: '14px', right: '-4px', bottom: '-4px', cursor: 'nwse-resize' },
                                    bottomLeft: { width: '14px', height: '14px', left: '-4px', bottom: '-4px', cursor: 'nesw-resize' },
                                    topRight: { width: '14px', height: '14px', right: '-4px', top: '-4px', cursor: 'nesw-resize' },
                                    topLeft: { width: '14px', height: '14px', left: '-4px', top: '-4px', cursor: 'nwse-resize' },
                                }}
                            >
                                <div
                                    className={`card-glass anim-fade-up ${isSelected_ ? 'selected' : ''} ${isBeingDeleted ? 'anim-shrink-fade' : ''}`}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        overflow: "hidden",
                                        padding: 0,
                                    }}
                                >
                                    <DeleteButton onClick={() => deleteElement(el.id)} isVisible={isSelected_} />
                                    <img
                                        src={el.content}
                                        draggable={false}
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            display: "block",
                                            pointerEvents: "none",
                                            objectFit: "cover",
                                            borderRadius: "calc(var(--card-radius) - 1px)",
                                        }}
                                        alt="canvas element"
                                    />
                                </div>
                            </Rnd>
                        );
                    }

                    // === ALL OTHER CARDS (text, checklist, link, palette) — Rnd-wrapped ===
                    return (
                        <Rnd
                            key={el.id}
                            position={{ x: el.x, y: el.y }}
                            size={{ width: el.width || 240, height: el.height || 100 }}
                            scale={scale}
                            minWidth={140}
                            minHeight={60}
                            onDragStart={(e) => {
                                if (isEditing_) return false; // don't drag when editing
                                e.stopPropagation();
                                setSelectedId(el.id);
                            }}
                            onDragStop={(e, data) => handleDragStop(el, e, data)}
                            onResizeStop={(e, dir, ref, delta, pos) => handleResizeStop(el, e, dir, ref, delta, pos)}
                            onMouseDown={(e) => handleRndMouseDown(el, e)}
                            onContextMenu={(e) => handleCardContextMenu(el, e)}
                            enableResizing={true}
                            style={{
                                zIndex: isSelected_ ? 10 : 1,
                            }}
                            resizeHandleStyles={{
                                bottomRight: { width: '14px', height: '14px', right: '-4px', bottom: '-4px', cursor: 'nwse-resize' },
                                bottomLeft: { width: '14px', height: '14px', left: '-4px', bottom: '-4px', cursor: 'nesw-resize' },
                                topRight: { width: '14px', height: '14px', right: '-4px', top: '-4px', cursor: 'nesw-resize' },
                                topLeft: { width: '14px', height: '14px', left: '-4px', top: '-4px', cursor: 'nwse-resize' },
                            }}
                        >
                            <div
                                className={`card-glass anim-fade-up ${isSelected_ ? 'selected' : ''} ${isBeingDeleted ? 'anim-shrink-fade' : ''}`}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    padding: "18px",
                                    overflow: "hidden",
                                }}
                                onDoubleClick={(e) => onDoubleClick(el.id, e)}
                            >
                                {/* Delete button on every card */}
                                <DeleteButton onClick={() => deleteElement(el.id)} isVisible={isSelected_} />

                                {/* Render card content by type */}
                                {el.type === "text" && (
                                    <TextElement
                                        el={el}
                                        isEditing={isEditing_}
                                        updateElement={updateElement}
                                        setEditingId={setEditingId}
                                        isSelected={isSelected_}
                                        onDelete={() => deleteElement(el.id)}
                                    />
                                )}

                                {el.type === "checklist" && (
                                    <ChecklistCard
                                        el={el}
                                        isSelected={isSelected_}
                                        updateElement={updateElement}
                                        onDelete={() => deleteElement(el.id)}
                                    />
                                )}

                                {el.type === "link" && (
                                    <LinkPreviewCard
                                        el={el}
                                        isSelected={isSelected_}
                                        updateElement={updateElement}
                                    />
                                )}

                                {el.type === "palette" && (
                                    <ColorPaletteCard
                                        el={el}
                                        isSelected={isSelected_}
                                        updateElement={updateElement}
                                    />
                                )}
                            </div>
                        </Rnd>
                    );
                })}
            </div>

            {/* Header */}
            <Header />

            {/* AI Panel */}
            <AiPanel />
            
            {/* Zoom Control */}
            <ZoomControl />
            
            {/* Context Menu */}
            {contextMenu && (
                <ContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    elementId={contextMenu.elementId}
                    onClose={() => setContextMenu(null)}
                />
            )}
        </div>
    );
}
