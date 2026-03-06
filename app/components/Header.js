"use client";
import useBoardStore from "../store/useBoardStore";

export default function Header() {
    const { folderPath, jumpToFolder, toggleSidebar } = useBoardStore();

    return (
        <header
            className="glass"
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                height: "52px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 20px",
                zIndex: 40,
                borderTop: "none",
                borderLeft: "none",
                borderRight: "none",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
        >
            {/* Left side: Menu + Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                {/* Hamburger / Sidebar toggle */}
                <button
                    onClick={() => toggleSidebar()}
                    style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--text-secondary)",
                        display: "flex",
                        alignItems: "center",
                        padding: "6px",
                        borderRadius: "8px",
                        transition: "color 0.2s, background 0.2s",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.color = "var(--text-primary)";
                        e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.color = "var(--text-secondary)";
                        e.currentTarget.style.background = "none";
                    }}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <line x1="3" y1="12" x2="21" y2="12" />
                        <line x1="3" y1="18" x2="21" y2="18" />
                    </svg>
                </button>

                {/* Logo */}
                <span
                    className="font-display"
                    style={{
                        fontSize: "20px",
                        color: "var(--text-primary)",
                        fontStyle: "italic",
                        letterSpacing: "-0.02em",
                    }}
                >
                    Drops
                </span>

                {/* Breadcrumb separator */}
                {folderPath.length > 0 && (
                    <span style={{ color: "var(--text-placeholder)", fontSize: "14px" }}>/</span>
                )}

                {/* Breadcrumb trail */}
                <nav style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    {folderPath.length > 0 && (
                        <button
                            onClick={() => jumpToFolder(-1)}
                            className="font-ui"
                            style={{
                                background: "none",
                                border: "none",
                                color: "var(--text-secondary)",
                                cursor: "pointer",
                                fontSize: "13px",
                                padding: "2px 6px",
                                borderRadius: "6px",
                                transition: "color 0.15s, background 0.15s",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.color = "var(--text-primary)";
                                e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.color = "var(--text-secondary)";
                                e.currentTarget.style.background = "none";
                            }}
                        >
                            Root
                        </button>
                    )}

                    {folderPath.map((seg, i) => (
                        <div key={seg.id} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                            <span style={{ color: "var(--text-placeholder)", fontSize: "12px" }}>/</span>
                            <button
                                onClick={() => jumpToFolder(i)}
                                className="font-ui"
                                style={{
                                    background: "none",
                                    border: "none",
                                    color: i === folderPath.length - 1 ? "var(--text-primary)" : "var(--text-secondary)",
                                    cursor: i === folderPath.length - 1 ? "default" : "pointer",
                                    fontSize: "13px",
                                    fontWeight: i === folderPath.length - 1 ? "500" : "400",
                                    padding: "2px 6px",
                                    borderRadius: "6px",
                                    transition: "color 0.15s, background 0.15s",
                                }}
                                onMouseEnter={(e) => {
                                    if (i < folderPath.length - 1) {
                                        e.currentTarget.style.color = "var(--text-primary)";
                                        e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (i < folderPath.length - 1) {
                                        e.currentTarget.style.color = "var(--text-secondary)";
                                        e.currentTarget.style.background = "none";
                                    }
                                }}
                            >
                                {seg.name}
                            </button>
                        </div>
                    ))}
                </nav>
            </div>

            {/* Right side: Share + Avatar */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                {/* Share button */}
                <button
                    style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "10px",
                        padding: "6px 14px",
                        color: "var(--text-secondary)",
                        fontSize: "12px",
                        fontWeight: "500",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        transition: "background 0.2s, border-color 0.2s, color 0.2s",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)";
                        e.currentTarget.style.color = "var(--text-primary)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                        e.currentTarget.style.color = "var(--text-secondary)";
                    }}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="18" cy="5" r="3" />
                        <circle cx="6" cy="12" r="3" />
                        <circle cx="18" cy="19" r="3" />
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                    </svg>
                    Share
                </button>

                {/* Avatar */}
                <div
                    style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, var(--terracotta), var(--gold))",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "var(--void)",
                        cursor: "pointer",
                    }}
                >
                    A
                </div>
            </div>
        </header>
    );
}
