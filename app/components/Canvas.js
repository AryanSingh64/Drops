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

export default function Canvas() {
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [scale, setScale] = useState(1);
    const [isPanning, setIsPanning] = useState(false);
    const [draggingElementId, setDraggingElementId] = useState(null);
    const [contextMenu, setContextMenu] = useState(null); // { x, y, elementId }
    const viewportRef = useRef(null);

    const {
        elements, setElements,
        editingId, selectedId,
        setSelectedId, setEditingId,
        activeTool, setActiveTool,
        deletingId, deleteElement,
        folderPath,
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
        const worldX = centerX / scale;
        const worldY = centerY / scale;

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
                url: "", linkTitle: "", favicon: null,
            }]);
            return;
        }

        if (type === "palette") {
            setElements((prev) => [...prev, {
                id: Date.now(), type: "palette",
                x: worldX, y: worldY,
                title: "Palette",
                colors: ["#E8C97A", "#D4826A", "#C47FA3", "#4E8B7A", "#E2A65D", "#8B6FCF"],
            }]);
            return;
        }

        // Default: text
        setElements((prev) => [...prev, {
            id: Date.now(), type,
            x: worldX, y: worldY,
            content: "", title: "",
        }]);
    };

    // === Panning ===
    const handleCanvasMouseDown = (e) => {
        if (activeTool === 'pan' || e.button === 1) {
            setIsPanning(true);
        }
        setEditingId(null);
        setSelectedId(null);
        setContextMenu(null);
    };

    const handleCanvasMouseUp = () => {
        setIsPanning(false);
        setDraggingElementId(null);
    };

    const handleCanvasMouseMove = (e) => {
        e.preventDefault();
        if (isPanning) {
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

    const handleElementMouseMove = (e) => {
        if (draggingElementId === null) return;
        setElements((prev) =>
            prev.map((el) =>
                el.id === draggingElementId
                    ? { ...el, x: el.x + e.movementX / scale, y: el.y + e.movementY / scale }
                    : el
            )
        );
    };

    const handleElementMouseDown = (id, e) => {
        e.stopPropagation();
        setDraggingElementId(id);
        setSelectedId(id);
    };

    const onDoubleClick = (id, e) => {
        e.stopPropagation();
        setEditingId(id);
        setDraggingElementId(null);
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

    // === Render a generic glass card wrapper ===
    const renderCard = (el, children) => {
        const isBeingDeleted = deletingId === el.id;
        const isSelected_ = selectedId === el.id;
        const isEditing_ = editingId === el.id;

        return (
            <div
                key={el.id}
                className={`card-glass anim-fade-up ${isSelected_ ? 'selected' : ''} ${isBeingDeleted ? 'anim-shrink-fade' : ''}`}
                style={{
                    position: "absolute",
                    left: el.x,
                    top: el.y,
                    padding: "18px",
                    cursor: isEditing_ ? "text" : (draggingElementId === el.id ? "grabbing" : "grab"),
                    zIndex: isSelected_ ? 10 : 1,
                    animationDelay: `${(elements.indexOf(el) % 8) * 0.04}s`,
                }}
                onDoubleClick={(e) => onDoubleClick(el.id, e)}
                onMouseDown={(e) => !isEditing_ && handleElementMouseDown(el.id, e)}
                onContextMenu={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setContextMenu({ x: e.clientX, y: e.clientY, elementId: el.id });
                }}
            >
                {/* Corner resize dots */}
                <div className="corner-dot top-left" onMouseDown={(e) => e.stopPropagation()} />
                <div className="corner-dot bottom-left" onMouseDown={(e) => e.stopPropagation()} />
                <div className="corner-dot bottom-right" onMouseDown={(e) => e.stopPropagation()} />

                {children}
            </div>
        );
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
            onMouseMove={(e) => {
                handleCanvasMouseMove(e);
                handleElementMouseMove(e);
            }}
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
                    // === TEXT CARD ===
                    if (el.type === "text") {
                        return renderCard(el,
                            <TextElement
                                el={el}
                                isEditing={editingId === el.id}
                                updateElement={updateElement}
                                setEditingId={setEditingId}
                                isSelected={selectedId === el.id}
                                onDelete={() => deleteElement(el.id)}
                            />
                        );
                    }

                    // === IMAGE CARD ===
                    if (el.type === "image") {
                        const isBeingDeleted = deletingId === el.id;
                        const isSelected_ = selectedId === el.id;
                        return (
                            <Rnd
                                key={el.id}
                                position={{ x: el.x, y: el.y }}
                                size={{ width: el.width, height: el.height }}
                                scale={scale}
                                lockAspectRatio={true}
                                disableDragging={!isSelected_}
                                onDragStop={(e, data) => {
                                    updateElement(el.id, "x", data.x);
                                    updateElement(el.id, "y", data.y);
                                }}
                                onResizeStop={(e, direction, ref, delta, position) => {
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
                                }}
                                onMouseDown={(e) => handleElementMouseDown(el.id, e)}
                                className={`anim-fade-up ${isBeingDeleted ? 'anim-shrink-fade' : ''}`}
                                style={{
                                    cursor: draggingElementId === el.id ? "grabbing" : "grab",
                                    zIndex: isSelected_ ? 10 : 1,
                                }}
                            >
                                {/* Glass wrapper around image */}
                                <div
                                    className={`card-glass ${isSelected_ ? 'selected' : ''}`}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        overflow: "hidden",
                                        padding: 0,
                                    }}
                                >
                                    {/* Delete dot */}
                                    <div
                                        className="delete-dot"
                                        style={{ opacity: isSelected_ ? 1 : undefined }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteElement(el.id);
                                        }}
                                    >
                                        <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3">
                                            <path d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </div>

                                    {/* Corner dots */}
                                    <div className="corner-dot top-left" onMouseDown={(e) => e.stopPropagation()} />
                                    <div className="corner-dot bottom-left" onMouseDown={(e) => e.stopPropagation()} />
                                    <div className="corner-dot bottom-right" onMouseDown={(e) => e.stopPropagation()} />

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

                    // === CHECKLIST CARD ===
                    if (el.type === "checklist") {
                        return renderCard(el,
                            <ChecklistCard
                                el={el}
                                isSelected={selectedId === el.id}
                                updateElement={updateElement}
                                onDelete={() => deleteElement(el.id)}
                            />
                        );
                    }

                    // === LINK CARD ===
                    if (el.type === "link") {
                        return renderCard(el,
                            <LinkPreviewCard
                                el={el}
                                isSelected={selectedId === el.id}
                                updateElement={updateElement}
                            />
                        );
                    }

                    // === PALETTE CARD ===
                    if (el.type === "palette") {
                        return renderCard(el,
                            <ColorPaletteCard
                                el={el}
                                isSelected={selectedId === el.id}
                                updateElement={updateElement}
                            />
                        );
                    }

                    return null;
                })}
            </div>

            {/* Header */}
            <Header />

            {/* AI Panel */}
            <AiPanel />

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
