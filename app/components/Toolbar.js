"use client";
import { useState } from "react";


export default function Toolbar({onAddElement}) {
    const style = {
        padding: "4px 8px",
        cursor: "pointer",
        border: "1px solid #444",
        borderRadius: "4px",
        marginRight: "4px",
        backgroundColor: "#333",
        color: "white",
        
    }
    return (
        <div
            className="fixed flex flex-col gap-4 top-20 left-20 p-2.5 bg-[#222] text-white z-50"
        >
            <button
            onClick={()=> onAddElement("text")}
            style={style}>
                Text
            </button>
        </div>
    );
}