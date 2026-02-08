"use client"
import { useRef } from "react";
import { useState } from "react";

export default function Canvas() {
    const [offset,  setOffset] = useState({ x: 0, y: 0 });
    const [scale, setScale] = useState(1);
    const [isPanning, setIsPanning] = useState(false);
    const [draggingElementId, setDraggingElementId] = useState(null);
    const [elements, setElements] = useState([
        {
            id:1,
            type:"text",
            x:100,
            y:100,
            content:"Hello world"
        },
        {
            id:2,
            type:"box",
            x:400,
            y:200,
            color:"Blue"
        }
    ])

    const handleCanvasMouseDown = (e) =>{
        setIsPanning(true);
    }

    const handleCanvasMouseUp = () =>{
        setIsPanning(false);
        setDraggingElementId(null);
    }

    const handleCanvasMouseMove = (e) =>{
        e.preventDefault();
        if(isPanning){
            setOffset((prev) => {
               return{ 
                x:prev.x + e.movementX,
                y:prev.y + e.movementY
                }
                
            })
            console.log("movement", e.movementX, e.movementY);
        }
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
        <div
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
            <div style={canvasStyle} className="bg-neutral-900">
{elements.map((el) => {
    if (el.type === "text") {
        return (
            <div
                key={el.id}
                 onMouseDown={(e) => handleElementMouseDown(el.id, e)}
                //  onMouseUp={(e) => handleElementMouseUp(el.id, e)}
                style={{
                    position: "absolute",
                    left: el.x,
                    top: el.y,
                    color: "white",
                    cursor: draggingElementId === el.id ? "grabbing" : "grab",
                }}
            >
                {el.content}
            </div>
        );
    }

    if (el.type === "box") {
        return (
            <div
                key={el.id}
                onMouseDown={(e) => handleElementMouseDown(el.id, e)}
                // onMouseUp={(e) => handleElementMouseUp(el.id, e)}
                style={{
                    position: "absolute",
                    left: el.x,
                    top: el.y,
                    width: 100,
                    height: 100,
                    background: el.color,
                    cursor: draggingElementId === el.id ? "grabbing" : "grab",
                }}
            >
                {el.content}
                {console.log("clicked")}
            </div>
        );
    }

    return null;
})}

            </div>
        </div>
    );
}
