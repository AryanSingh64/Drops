"use client"
import { useEffect, useState, useRef } from "react"

export default function Resizable({
    width, height, onResize, children, isSelected, scale
}) {

    const [isResizing, setIsResizing] = useState(false);



    useEffect(() => {

        const handleMouseMove = (e) => {
            console.log("Resizing!", e.movementX);
            if (!isResizing) return;

            const newWidth = width + (e.movementX / scale);
            const newHeight = height + (e.movementY / scale);

            onResize(newWidth, newHeight);
        }

        const handleMouseUp = () => {
            setIsResizing(false);
        }

        if (isResizing) {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
        }

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
            console.log("Resizable Props:", "Width:", width, "Height:", height, "Scale:", scale);
        }
    }, [isResizing, width, height, onResize, scale])
    return (
        <div style={{
            position: "relative",
            width, height
        }}>
            {children}
            {isSelected && (
                <>
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-white cursor-nwse-resize" />

                    <div
                        onMouseDown={(e) => {
                            e.stopPropagation();
                            setIsResizing(true);
                        }}
                        style={{
                            position: "absolute",
                            right: -5,
                            bottom: -5,
                            width: 10,
                            height: 10,
                            backgroundColor: "#0099ff",
                            cursor: "nwse-resize",
                            borderRadius: "50%"
                        }}
                    />
                </>
            )}
        </div>
    )
}