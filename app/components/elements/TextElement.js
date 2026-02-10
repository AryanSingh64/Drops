export default function TextElement({el, isEditing, updateElement, setEditingId}) {
    return (
        <div>
            {isEditing ? (
                                    <textarea 
                                        autoFocus 
                                        onFocus={(e) => {
                                            const val = e.target.value;
                                            e.target.setSelectionRange(val.length, val.length);
                                        }}
                                        value={el.content} 
                                        onChange={(e)=> updateElement(el.id, "content", e.target.value)}
                                        onMouseDown={(e)=> e.stopPropagation()}
                                        onBlur={()=> setEditingId(null)}
                                        placeholder="Start Typing..."
                                        className="w-full h-full bg-transparent border-none outline-none resize-none"
                                         style={{ minHeight: "50px" }}
                                         />
                                ): (
                                     <div className="whitespace-pre-wrap select-none" style={{ color: el.content ? "inherit" : "#888" }}>{el.content || "Start Typing..."}</div>
                                )}
        </div>
    );
}   