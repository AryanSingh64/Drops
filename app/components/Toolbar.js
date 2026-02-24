"use client";
import { useState } from "react";


export default function Toolbar({onAddElement}) {
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        // const values = e.target.value;
        // console.log(values);
        e.target.value = "";
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            onAddElement("image", event.target.result);
        };
        reader.readAsDataURL(file);
    }
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

            <label style={style}
            >
                Image
                <input
                 type="file" 
                 accept="image/*" 
                 onChange={handleImageUpload} 
                 style={{display: "none"}} />
            </label>
        </div>
    );
}