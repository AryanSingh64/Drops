"use client";
import useBoardStore from "../store/useBoardStore";

export default function AiPanel() {
    const { aiPanelOpen, setAiPanelOpen } = useBoardStore();

    if (!aiPanelOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={() => setAiPanelOpen(false)}
                style={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 55,
                }}
                onKeyDown={(e) => {
                    if (e.key === "Escape") setAiPanelOpen(false);
                }}
            />

            {/* Panel */}
            <div
                className="glass-strong"
                style={{
                    position: "fixed",
                    bottom: "90px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "420px",
                    maxWidth: "calc(100vw - 40px)",
                    borderRadius: "20px",
                    padding: "24px",
                    zIndex: 56,
                    animation: "fadeUp 0.3s var(--ease-spring) both",
                    borderColor: "rgba(232, 201, 122, 0.12)",
                }}
            >
                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                    <h2
                        className="font-display"
                        style={{
                            fontSize: "22px",
                            color: "var(--text-primary)",
                            fontStyle: "italic",
                            margin: 0,
                        }}
                    >
                        AI Assistant
                    </h2>
                    <button
                        onClick={() => setAiPanelOpen(false)}
                        style={{
                            background: "none",
                            border: "none",
                            color: "var(--text-placeholder)",
                            cursor: "pointer",
                            padding: "4px",
                            transition: "color 0.15s",
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = "var(--text-primary)"}
                        onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-placeholder)"}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Textarea */}
                <textarea
                    autoFocus
                    className="glass-input font-ui"
                    placeholder="Describe what you'd like to create or change..."
                    style={{
                        width: "100%",
                        minHeight: "80px",
                        resize: "vertical",
                        fontSize: "13px",
                        lineHeight: "1.6",
                        borderRadius: "12px",
                        padding: "12px 14px",
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Escape") setAiPanelOpen(false);
                    }}
                />

                {/* Suggestion Chips */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "14px" }}>
                    {["Generate moodboard", "Suggest colors", "Add inspiration", "Organize cards", "Create layout"].map((chip) => (
                        <button
                            key={chip}
                            className="font-ui"
                            style={{
                                background: "rgba(255,255,255,0.03)",
                                border: "1px solid rgba(255,255,255,0.08)",
                                borderRadius: "20px",
                                padding: "5px 14px",
                                fontSize: "11px",
                                color: "var(--text-secondary)",
                                cursor: "pointer",
                                transition: "background 0.15s, border-color 0.15s, color 0.15s",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = "rgba(232, 201, 122, 0.06)";
                                e.currentTarget.style.borderColor = "rgba(232, 201, 122, 0.2)";
                                e.currentTarget.style.color = "var(--gold)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                                e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                                e.currentTarget.style.color = "var(--text-secondary)";
                            }}
                        >
                            {chip}
                        </button>
                    ))}
                </div>
            </div>
        </>
    );
}
