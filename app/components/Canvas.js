"use client"
import { useRef } from "react";
import { useState } from "react";

export default function Canvas() {
    const [offset,  setOffset] = useState({ x: 0, y: 0 });
    const [scale, setScale] = useState(1);
    const [isDragging, setIsDragging] = useState(false);

    const handleMouseDown = (e) =>{
        e.preventDefault();
        setIsDragging(true);
    }
    const handleMouseUp = () => {
        setIsDragging(false);
    }
    const handleMouseMove = (e) => {
        e.preventDefault();
        if(isDragging){
            setOffset((prev) => {
               return{ 
                x:prev.x + e.movementX,
                y:prev.y + e.movementY
                }
                
            })
            console.log("movement", e.movementX, e.movementY);
        }
    }

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
        cursor: isDragging ? "grabbing" : "grab",
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
        <div
         style={viewportStyle}
         onMouseDown={handleMouseDown}
         onMouseUp={handleMouseUp}
         onMouseMove={handleMouseMove}
         onWheel={handleWheel}
         ref={viewportRef}
         className="bg-neutral-900"
        >
            <div style={canvasStyle} className="bg-neutral-900">

                {/* <h1>{handleMouseMove}</h1> */}
                Canvas Content
            </div>
        </div>
    );
}
