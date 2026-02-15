"use client"
import { useEffect, useState, useRef } from "react"

export default function Resizable({
    width, height, onResize, children, isSelected, scale
}) {

    const [isResizing, setIsResizing] = useState(false);

    const onResizeRef = useRef(onResize);
    const widthRef = useRef(width);
    const heightRef = useRef(height);
    const scaleRef = useRef(scale);

    onResizeRef.current = onResize;
    widthRef.current = width;
    heightRef.current = height;
    scaleRef.current = scale;


    useEffect(() => {

        const handleMouseMove = (e) => {
            const currentW = widthRef.current;
            const currentH = heightRef.current;
            const ratio = currentH / currentW;
            const newWidth = currentW + (e.movementX / scaleRef.current);
            const newHeight = newWidth * ratio;

            onResizeRef.current(newWidth, newHeight);
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
        }
    }, [isResizing])
    return (
        <div style={{
            position: "relative",
            width, height
        }}>
            {children}
            {isSelected && (
                <>

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