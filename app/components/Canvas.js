"use client"

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
        background: "red",
    };

    return (
        <div
         style={viewportStyle}
         onMouseDown={handleMouseDown}
         onMouseUp={handleMouseUp}
         onMouseMove={handleMouseMove}
        >
            <div style={canvasStyle}>

                {/* <h1>{handleMouseMove}</h1> */}
                Canvas Content
            </div>
        </div>
    );
}
