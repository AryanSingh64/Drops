"use client";

export default function TextElement({ el, isEditing, updateElement, setEditingId, isSelected, onDelete }) {
    return (
        <div style={{ position: "relative", width: "100%", height: "100%" }}>

            {/* Title (Instrument Serif italic) */}
            <div
                className="font-display"
                style={{
                    fontSize: "18px",
                    color: "var(--text-primary)",
                    marginBottom: el.content ? "8px" : "0",
                    fontStyle: "italic",
                    display: el.title ? "block" : "none",
                }}
            >
                {el.title}
            </div>

            {/* Invisible Size Controller */}
            <div
                className="font-ui"
                style={{
                    whiteSpace: "pre-wrap",
                    userSelect: "none",
                    visibility: isEditing ? "hidden" : "visible",
                    color: el.content ? "var(--text-primary)" : "var(--text-placeholder)",
                    minWidth: "120px",
                    minHeight: "24px",
                    fontSize: "14px",
                    lineHeight: "1.6",
                }}
            >
                {el.content || "Start typing..."}
            </div>

            {/* Textarea */}
            {isEditing && (
                <textarea
                    autoFocus
                    onFocus={(e) => {
                        const val = e.target.value;
                        e.target.setSelectionRange(val.length, val.length);
                    }}
                    value={el.content}
                    onChange={(e) => updateElement(el.id, "content", e.target.value)}
                    onMouseDown={(e) => e.stopPropagation()}
                    onBlur={() => setEditingId(null)}
                    placeholder="Start typing..."
                    className="font-ui"
                    style={{
                        position: "absolute",
                        top: el.title ? "34px" : "0",
                        left: 0,
                        width: "100%",
                        height: `calc(100% - ${el.title ? '34px' : '0px'})`,
                        background: "transparent",
                        border: "none",
                        outline: "none",
                        resize: "none",
                        padding: 0,
                        margin: 0,
                        overflow: "hidden",
                        fontSize: "14px",
                        lineHeight: "1.6",
                        color: "var(--text-primary)",
                        fontFamily: "inherit",
                    }}
                />
            )}
        </div>
    );
}