export default function TextElement({ el, isEditing, updateElement, setEditingId, isSelected, onDelete }) {
    return (
        <div style={{ position: "relative" }}>
            {/* 1. X Button - Shows when selected OR editing */}
            {(isSelected || isEditing) && (
                <div
                    style={{
                        position: "absolute",
                        left: "-20px",
                        top: "-20px",
                        cursor: "pointer",
                        background: "black",
                        borderRadius: "50%",
                        width: "20px",
                        height: "20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 10
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                        if (onDelete) onDelete();
                    }}
                >
                    X
                </div>
            )}

            {/* 2. The Invisible "Size Controller" Div 
                This text is always here. When we type, it updates.
                Because it is a regular div, it forces the container to be the exact right size.
                When we are NOT editing, it becomes visible! */}
            <div
                className="whitespace-pre-wrap select-none"
                style={{
                    visibility: isEditing ? "hidden" : "visible",
                    color: el.content ? "inherit" : "#888",
                    minWidth: "120px",
                    minHeight: "24px"
                }}
            >
                {el.content || "Start Typing..."}
            </div>

            {/* 3. The Absolutely-Positioned Textarea
                This only mounts when we edit. Because it is absolute, it takes up EXACTLY 
                the same space as the invisible div above it. No more jumping! */}
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
                    placeholder="Start Typing..."
                    className="absolute top-0 left-0 w-full h-full bg-transparent border-none outline-none resize-none p-0 m-0 overflow-hidden"
                />
            )}
        </div>
    );
}