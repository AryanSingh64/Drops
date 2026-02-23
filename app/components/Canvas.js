"use client"
import { useRef } from "react";
import { useState } from "react";
import Toolbar from "./Toolbar";
import TextElement from "./elements/TextElement";
import ResizableContainer from "./ResizableContainer";


export default function Canvas() {
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [scale, setScale] = useState(1);
    const [isPanning, setIsPanning] = useState(false);
    const [draggingElementId, setDraggingElementId] = useState(null);
    const [elements, setElements] = useState([])
    const [editingId, setEditingId] = useState(null);
    const [selectedId, setSelectedId] = useState(null);


    const handleImageResize = (id, width, height) => {
        const minSize = 90;
        const maxSize = 1000;

        const w = Math.max(minSize, Math.min(maxSize, width));
        const h = Math.max(minSize, Math.min(maxSize, height));

        setElements((prev) => prev.map((el) =>
            el.id === id ? { ...el, width: w, height: h } : el
        ));
    }


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
                    aspectRatio: ratio
                };
                setElements((prev) => [...prev, newImage]);
            };
        };
        reader.readAsDataURL(file);
    }
    const onDoubleClick = (id, e) => {
        e.stopPropagation();
        setEditingId(id);
        setDraggingElementId(null);
        // console.log('clicked');

    }
    const addElement = (type, content = "") => {
        const centerX = window.innerWidth / 2 - offset.x;
        const centerY = window.innerHeight / 2 - offset.y;

        const worldX = centerX / scale;
        const worldY = centerY / scale;

        if (type === "image" && content) {
            // Load the image first to get its natural dimensions
            const img = new Image();
            img.src = content;
            img.onload = () => {
                const ratio = img.naturalHeight / img.naturalWidth;
                const initialWidth = 300;
                const initialHeight = initialWidth * ratio;

                const newItem = {
                    id: Date.now(),
                    type: "image",
                    x: worldX,
                    y: worldY,
                    content: content,
                    width: initialWidth,
                    height: initialHeight,
                    aspectRatio: ratio
                };
                setElements((prev) => [...prev, newItem]);
            };
            return;
        }

        const newItem = {
            id: Date.now(),
            type: type,
            x: worldX,
            y: worldY,
            content: content,
            color: "Blue",
        };
        setElements((prev) => [...prev, newItem]);
    }

    const handleCanvasMouseDown = (e) => {
        setIsPanning(true);
        setEditingId(null);
        setSelectedId(null);
    }

    const handleCanvasMouseUp = () => {
        setIsPanning(false);
        setDraggingElementId(null);
    }

    const handleCanvasMouseMove = (e) => {
        e.preventDefault();
        if (isPanning) {
            setOffset((prev) => {
                return {
                    x: prev.x + e.movementX,
                    y: prev.y + e.movementY
                }

            })
        }
    }

    const updateElement = (id, field, value) => {
        setElements((prev) => {
            return prev.map((el) => {
                if (el.id === id) {
                    return {
                        ...el,
                        [field]: value
                    }
                }
                return el;
            })
        })
    }





    const handleElementMouseMove = (e) => {
        if (draggingElementId === null) return;
        setElements((prev) => {
            return prev.map((el) => {
                if (el.id === draggingElementId) {
                    return {
                        ...el,
                        x: el.x + e.movementX / scale,
                        y: el.y + e.movementY / scale
                    }
                }
                return el;
            })
        })
    }



    const handleElementMouseDown = (id, e) => {
        e.stopPropagation();
        setDraggingElementId(id);
        setSelectedId(id);
    };




    const viewportRef = useRef(null);

    const handleWheel = (e) => {
        e.preventDefault();
        const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
        const minZoom = 0.2;
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
    }


    const viewportStyle = {
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        position: "fixed",
        top: 0,
        left: 0,
        cursor: isPanning ? "grabbing" : "grab",
        border: "1px solid white",
    };

    const canvasStyle = {
        width: "100%",
        height: "100%",
        transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
        transformOrigin: "top left",
        // background: "#111111",
        color: "white",
    };

    return (
        //viewport div
        <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            style={viewportStyle}
            onMouseDown={handleCanvasMouseDown}
            onMouseUp={handleCanvasMouseUp}
            onMouseMove={(e) => {
                handleCanvasMouseMove(e);
                handleElementMouseMove(e);
            }}
            onWheel={handleWheel}
            ref={viewportRef}
            className="bg-neutral-900"
        >

            <Toolbar onAddElement={addElement} />

            <div style={canvasStyle} className="bg-neutral-900">
                {elements.map((el) => {
                    if (el.type === "text") {
                        const isEditing = editingId === el.id;

                        return (
                            <div
                                key={el.id}
                                style={{
                                    left: el.x,
                                    top: el.y,

                                    cursor: isEditing ? "text" : "grab",
                                }}
                                onDoubleClick={(e) => onDoubleClick(el.id, e)}
                                onMouseDown={(e) =>
                                    !isEditing && handleElementMouseDown(el.id, e)}
                                className="bg-[#333333] text-neutral-400 text-sm px-8 py-4 shadow-md absolute hover:bg-neutral-800">

                                <TextElement
                                    el={el}
                                    isEditing={isEditing}
                                    updateElement={updateElement}
                                    onDragStart={(e) => handleElementMouseDown(el.id, e)}
                                    setEditingId={setEditingId}
                                />
                            </div>
                        );

                    }
                    if (el.type === "image") {
                        const isDragging = draggingElementId === el.id;
                        return (
                            <div
                                key={el.id}
                                style={{
                                    position: "absolute",
                                    left: el.x,
                                    top: el.y,
                                    cursor: isDragging ? "grabbing" : "grab",
                                }}
                                onMouseDown={(e) => handleElementMouseDown(el.id, e)}
                            >
                                <ResizableContainer
                                    scale={scale}
                                    width={el.width}
                                    height={el.height}
                                    // isSelected={true}
                                    isSelected={selectedId === el.id}
                                    lockAspect={true}
                                    onResize={(w, h) => handleImageResize(el.id, w, h)}
                                >
                                    <img
                                        src={el.content}
                                        alt="dropped"
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            display: "block",
                                            userSelect: "none",
                                            pointerEvents: "none",
                                        }}
                                        draggable={false}
                                    />
                                </ResizableContainer>
                            </div>
                        )

                    }
                    return null;
                })}

            </div>
        </div>
    );
}
