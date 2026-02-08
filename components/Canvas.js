"use client"

import { useState } from "react";

export default function Canvas() {
    const viewport = {
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        position: "fixed",

        border: "1px solid black", 
        top: 0,

        left: 0,   
    }
    const canvas = {
        width: "100%",
        height: "100%",
        transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.scale})`,
        transformOrigin: "top left",
        // backgroud: "red",
    }
    return (
    <>
        <div style={viewport}>
            <div style={canvas}>

            </div>
        </div>
    </>
    )
}
