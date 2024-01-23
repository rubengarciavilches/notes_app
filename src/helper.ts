import React from "react";


export function adjustHeight(ref: React.MutableRefObject<HTMLTextAreaElement | null>) {
    if (ref.current) {
        ref.current.style.height = "auto";
        let newHeight = ref.current.scrollHeight;
        ref.current.style.height = `${newHeight}px`;
    }
}

