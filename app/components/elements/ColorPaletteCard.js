"use client";

const DEFAULT_COLORS = [
    "#E8C97A", "#D4826A", "#C47FA3", "#4E8B7A",
    "#5B8AC2", "#E2A65D", "#8B6FCF", "#D4A5A5",
    "#6BB5A0",
];

export default function ColorPaletteCard({ el, isSelected, updateElement }) {
    const colors = el.colors || DEFAULT_COLORS;

    const handleColorChange = (index, newColor) => {
        const updated = [...colors];
        updated[index] = newColor;
        updateElement(el.id, "colors", updated);
    };

    const addColor = () => {
        const updated = [...colors, "#ffffff"];
        updateElement(el.id, "colors", updated);
    };

    const removeColor = (index) => {
        const updated = colors.filter((_, i) => i !== index);
        updateElement(el.id, "colors", updated);
    };

    return (
        <div style={{ position: "relative", minWidth: "200px" }}>
            <h3
                className="font-display text-primary"
                style={{ fontSize: "18px", marginBottom: "14px", fontStyle: "italic" }}
            >
                {el.title || "Palette"}
            </h3>

            {/* Swatch Grid */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(36px, 1fr))",
                gap: "8px",
            }}>
                {colors.map((color, i) => (
                    <div key={i} style={{ position: "relative" }}>
                        <div
                            style={{
                                width: "36px",
                                height: "36px",
                                borderRadius: "10px",
                                background: color,
                                border: "1.5px solid rgba(255,255,255,0.1)",
                                cursor: "pointer",
                                transition: "transform 0.15s, box-shadow 0.15s",
                                boxShadow: "0 2px 8px -2px rgba(0,0,0,0.4)",
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.transform = "scale(1.1)";
                                e.target.style.boxShadow = `0 4px 12px -2px ${color}40`;
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = "scale(1)";
                                e.target.style.boxShadow = "0 2px 8px -2px rgba(0,0,0,0.4)";
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {isSelected && (
                                <input
                                    type="color"
                                    value={color}
                                    onChange={(e) => handleColorChange(i, e.target.value)}
                                    onMouseDown={(e) => e.stopPropagation()}
                                    style={{
                                        position: "absolute",
                                        inset: 0,
                                        opacity: 0,
                                        cursor: "pointer",
                                        width: "100%",
                                        height: "100%",
                                    }}
                                />
                            )}
                        </div>
                        {/* Color label */}
                        <div
                            className="font-ui"
                            style={{
                                fontSize: "9px",
                                color: "var(--text-placeholder)",
                                textAlign: "center",
                                marginTop: "4px",
                                textTransform: "uppercase",
                            }}
                        >
                            {color}
                        </div>
                    </div>
                ))}

                {/* Add color button */}
                {isSelected && (
                    <div
                        style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "10px",
                            border: "1.5px dashed rgba(255,255,255,0.12)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            color: "var(--text-placeholder)",
                            fontSize: "18px",
                            transition: "border-color 0.2s, color 0.2s",
                        }}
                        onClick={(e) => { e.stopPropagation(); addColor(); }}
                        onMouseEnter={(e) => {
                            e.target.style.borderColor = "var(--gold)";
                            e.target.style.color = "var(--gold)";
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.borderColor = "rgba(255,255,255,0.12)";
                            e.target.style.color = "var(--text-placeholder)";
                        }}
                    >
                        +
                    </div>
                )}
            </div>
        </div>
    );
}
