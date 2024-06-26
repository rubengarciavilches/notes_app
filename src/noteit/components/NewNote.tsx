import React, {useRef, useState} from "react";
import {Note} from "../../types";
import {adjustHeight} from "../../helper";
import {t} from "i18next";

interface Props {
    onSave: (title: string, content: string) => void;
}

function NewNote({onSave}: Props) {
    const [editingNote, setEditingNote] = useState<boolean>(false);
    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const titleRef = useRef<HTMLTextAreaElement | null>(null);
    const contentRef = useRef<HTMLTextAreaElement | null>(null);

    function handleTitleClick() {
        if (!editingNote) {
            setEditingNote(true);
        }
    }

    function handleTitleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        setTitle(event.target.value);
        adjustHeight(titleRef);
    }

    function handleContentChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        setContent(event.target.value);
        adjustHeight(contentRef);
    }

    function handleCloseButton() {
        reset();
    }

    function handleSaveButton() {
        if (title.length > 0 || content.length > 0)
            onSave(title, content);
        reset();
    }

    function reset() {
        setTitle("");
        setContent("");
        setEditingNote(false);
    }

    return (
        <div className={"new-note thin-border padding-20"}>
            {!editingNote && (
                <h2 className={"placeholder"} onClick={handleTitleClick}>
                    {t("notes_app.note.note_placeholder")}
                </h2>
            )}
            {editingNote && (
                <div>
                    <textarea
                        ref={titleRef}
                        className={"h2-like better-input"}
                        placeholder={t("notes_app.note.title")}
                        value={title}
                        onChange={handleTitleChange}
                    />
                    <textarea
                        ref={contentRef}
                        className={"better-input"}
                        placeholder={t("notes_app.note.note_placeholder")}
                        value={content}
                        onChange={handleContentChange}
                    />
                    <div className={"bottom-menu"}>
                        <div className={"right"}>
                            <button className={"button"} onClick={handleSaveButton}>{t("notes_app.note.save")}</button>
                            <button className={"button"} onClick={handleCloseButton}>{t("notes_app.note.close")}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default NewNote;