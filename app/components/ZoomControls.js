"use client"
import useBoardStore from "../store/useBoardStore"

const plusIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

const minusIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

export default function ZoomControl() {
    const { scale, zoomIn, zoomOut } = useBoardStore();
    return (
    <div className="glass-strong" style={{
        position: "fixed",
        bottom: "24px",
        right: "20px",
        zIndex: 50,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "6px",
        borderRadius: "16px",
    }}>
        {/* Zoom In Button */}
        <button className="toolbar-btn" onClick={zoomIn}>
            {plusIcon}
        </button>
        {/* Percentage Display */}
        <span className="font-ui" style={{
            fontSize: "11px",
            color: "var(--text-secondary)",
            padding: "2px 0",
            minWidth: "40px",
            textAlign: "center",
        }}>
            {scale * 100}%
        </span>
        {/* Zoom Out Button */}
        <button className="toolbar-btn" onClick={zoomOut}>
            {minusIcon}
        </button>
    </div>
    );
}