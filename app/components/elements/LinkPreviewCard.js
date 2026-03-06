"use client";

export default function LinkPreviewCard({ el, isSelected, updateElement }) {
    const url = el.url || "";
    const title = el.linkTitle || "Paste a URL";
    const favicon = el.favicon || null;

    const handleUrlChange = (e) => {
        updateElement(el.id, "url", e.target.value);
        // Extract domain for display
        try {
            const domain = new URL(e.target.value).hostname;
            updateElement(el.id, "linkTitle", domain);
            updateElement(el.id, "favicon", `https://www.google.com/s2/favicons?domain=${domain}&sz=32`);
        } catch {
            updateElement(el.id, "linkTitle", "");
            updateElement(el.id, "favicon", null);
        }
    };

    return (
        <div style={{ position: "relative", minWidth: "240px" }}>
            <h3
                className="font-display text-primary"
                style={{ fontSize: "18px", marginBottom: "12px", fontStyle: "italic" }}
            >
                Link
            </h3>

            {/* Preview */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                {favicon ? (
                    <img
                        src={favicon}
                        alt=""
                        style={{ width: "20px", height: "20px", borderRadius: "4px" }}
                    />
                ) : (
                    <div style={{
                        width: "20px", height: "20px", borderRadius: "4px",
                        background: "var(--glass-bg-strong)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-placeholder)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                        </svg>
                    </div>
                )}
                <div>
                    <div className="font-ui text-primary" style={{ fontSize: "13px", fontWeight: 500 }}>
                        {title || "No URL"}
                    </div>
                    {url && (
                        <div className="font-ui text-secondary" style={{ fontSize: "11px", marginTop: "2px" }}>
                            {url.substring(0, 40)}{url.length > 40 ? '...' : ''}
                        </div>
                    )}
                </div>
            </div>

            {/* URL Input */}
            {isSelected && (
                <input
                    className="glass-input"
                    style={{ width: "100%", fontSize: "12px", padding: "6px 10px" }}
                    placeholder="https://example.com"
                    value={url}
                    onChange={handleUrlChange}
                    onMouseDown={(e) => e.stopPropagation()}
                />
            )}
        </div>
    );
}
