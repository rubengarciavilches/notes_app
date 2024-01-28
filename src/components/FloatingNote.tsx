import React, {MutableRefObject, useEffect, useRef, useState} from 'react';
import {Note} from "../types";
import {adjustHeight} from "../helper";

interface Props {
    note: Note;
    onClose: () => void;
    onDelete: (note: Note) => void;
    onSave: (note: Note) => void;
}

function FloatingNote({note, onClose, onDelete, onSave}: Props) {
    const [title, setTitle] = useState<string>(note.title);
    const [content, setContent] = useState<string>(note.content);
    const titleRef = useRef<HTMLTextAreaElement | null>(null);
    const contentRef = useRef<HTMLTextAreaElement | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
    const [unsavedChanges, setUnsavedChanges] = useState<boolean>(false);

    useEffect(() => {
        adjustHeight(titleRef);
        adjustHeight(contentRef);
    }, []);

    function handleTitleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        setTitle(event.target.value);
        adjustHeight(titleRef);
        setUnsavedChanges(true);
    }

    function handleContentChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        setContent(event.target.value);
        adjustHeight(contentRef);
        setUnsavedChanges(true);
    }

    function handleSave() {
        const newNote: Note = {...note, title: title, content: content}
        onSave(newNote);
        setUnsavedChanges(false);
    }

    return (
        <div className={"floating-window floating-note thin-border padding-20"}>
            <textarea
                ref={titleRef}
                className={"h2-like better-input"}
                placeholder={"Title"}
                value={title}
                onChange={handleTitleChange}
            />
            <textarea
                ref={contentRef}
                className={"better-input"}
                placeholder={"Take a note..."}
                value={content}
                onChange={handleContentChange}
            />
            <div className={"bottom-menu"}>
                <div className={"right"}>
                    {confirmDelete && (
                        <div className={"right"}>
                            <p className={"no-margin-padding"}>Confirm delete?</p>
                            <button className={"button"} onClick={() =>
                                setConfirmDelete(false)
                            }>Cancel
                            </button>
                            <button className={"button"} onClick={() => {
                                onDelete(note);
                            }}>Delete
                            </button>
                        </div>
                    )}
                    {!confirmDelete && (
                        <div className={"right"}>
                            {unsavedChanges && (<p className={"no-margin-padding"}>There are unsaved changes!</p>)}
                            <button className={unsavedChanges ? "button highlight-shadow" : "button"} onClick={handleSave}>Save
                            </button>
                            <button className={"button"} onClick={() => {
                                setConfirmDelete(true);
                            }}>Delete
                            </button>
                            <button className={"button"} onClick={onClose}>Close</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default FloatingNote;