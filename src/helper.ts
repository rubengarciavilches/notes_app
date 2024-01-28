import React from "react";


export function adjustHeight(ref: React.MutableRefObject<HTMLTextAreaElement | null>) {
    if (ref.current) {
        ref.current.style.height = "auto";
        let newHeight = ref.current.scrollHeight;
        ref.current.style.height = `${newHeight}px`;
    }
}

export function getRandomString(length: number, letters = true, numbers = true): string | null {
    let characters: string = '';
    if (length < 1 || (!letters && !numbers))
        return null;
    if (letters)
        characters += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    if (numbers)
        characters += "0123456789";

    let randomString = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters.charAt(randomIndex);
    }
    return randomString;
}
