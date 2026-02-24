"use client"
import { useEffect, useState, useRef, useCallback } from "react"

/**
 * ResizableContainer - A reusable wrapper that makes any element resizable.
 * 
 * Props:
 *   width       - Current width of the element (number, in px)
 *   height      - Current height of the element (number, in px)
 *   onResize    - Callback: (newWidth, newHeight) => void
 *   scale       - Current canvas zoom level (to adjust mouse deltas)
 *   isSelected  - Whether to show the resize handle
 *   lockAspect  - If true, maintain aspect ratio while resizing
 *   children    - The content to render inside
 */
export default function ResizableContainer({
    width,
    height,
    onDelete,
    onResize,
    scale = 1,
    isSelected = false,
    lockAspect = false,
    children
}) {
    const [isResizing, setIsResizing] = useState(false);

    // Use refs to always have latest values inside event listeners
    // This avoids stale closure bugs (the useEffect only depends on isResizing)
    const propsRef = useRef({ width, height, onResize, scale, lockAspect });
    propsRef.current = { width, height, onResize, scale, lockAspect };

    useEffect(() => {
        if (!isResizing) return;

        const handleMouseMove = (e) => {
            const { width: w, height: h, onResize: cb, scale: s, lockAspect: lock } = propsRef.current;

            const deltaX = e.movementX / s;
            const deltaY = e.movementY / s;

            let newWidth, newHeight;

            if (lock) {
                // Lock aspect ratio: height follows width
                const ratio = h / w;
                newWidth = w + deltaX;
                newHeight = newWidth * ratio;
            } else {
                newWidth = w + deltaX;
                newHeight = h + deltaY;
            }

            // Enforce minimum size
            newWidth = Math.max(30, newWidth);
            newHeight = Math.max(30, newHeight);

            cb(newWidth, newHeight);
        };

        const handleMouseUp = () => {
            setIsResizing(false);
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isResizing]);

    const handleResizeStart = useCallback((e) => {
        e.stopPropagation();
        e.preventDefault();
        setIsResizing(true);
    }, []);

    return (
        <div
            style={{
                position: "relative",
                width: width,
                height: height,
                display: "inline-block",
            }}
        >
            {/* Children fill the container exactly */}
            <div style={{ width: "100%", height: "100%", overflow: "hidden" }}>
                {children}
            </div>

            {/* Selection border + resize handle */}
            {isSelected && (
                <>
                    {/* Blue border around the element */}
                    <div
                        style={{
                            position: "absolute",
                            inset: -1,
                            border: "2px solid #0099ff",
                            pointerEvents: "none",
                        }}
                    />


                    <div 
                          style={{
                                position: "absolute",
                                left: "-10px",
                                top: "-10px",
                                // cursor: isDragging ? "grabbing" : "grab",
                                cursor:"pointer",
                                background:"black",
                                borderRadius:"50%",
                                width:"20px",
                                height:"20px",
                                display:"flex",
                                alignItems:"center",
                                justifyContent:"center",
                            }}
                    onClick={(e)=>{
                        e.stopPropagation();
                        onDelete();
                    }}
                    >
                        X
                    
                    </div>

                    {/* Resize handle - bottom right corner */}
                    <div
                        onMouseDown={handleResizeStart}
                        style={{
                            position: "absolute",
                            right: -5,
                            bottom: -5,
                            width: 10,
                            height: 10,
                            backgroundColor: "#0099ff",
                            cursor: "nwse-resize",
                            borderRadius: "50%",
                            zIndex: 10,
                        }}
                    />
                </>
            )}
        </div>
    );
}
