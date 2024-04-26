import GridNote from "./components/GridNote";
import FloatingNote from "./components/FloatingNote";
import {Note, Apps} from "../types";
import NewNote from "./components/NewNote";
import BasicAuth from "./components/BasicAuth";
import {useTranslation} from 'react-i18next';
import {addNewNote, deleteNote, getAllNotes, updateNote} from "../dbcalls";
import {useSession} from "../SessionContext";
import React, {useEffect, useState} from "react";
import './NoteIt.scss'

interface Props {
    toggleApp: (name: Apps) => void
}

function NoteItApp({toggleApp}: Props) {
    const {session, setSession} = useSession();
    const [activeNote, setActiveNote] = useState<Note | null>(null);
    const [notes, setNotes] = useState<Note[]>([]);
    const {t} = useTranslation();

    useEffect(() => {
        console.log("Trying to retrieve session")
        if (!session) {
            setNotes([]);
            return;
        }
        console.log(session);
        getAllNotes(session.user.id, session.token).then((notes) => {
            if (!notes) return;
            setNotes(notes);
        });
    }, [session]);

    function handleCloseFloatingNote() {
        setActiveNote(null);
    }

    function handleDeleteNote(note: Note) {
        if (!session) return;
        deleteNote(session.user.id, note.id, session.token).then(() => {
            console.log("Note deleted.");
            let newNotes: Note[] = notes.filter((tempNote) => tempNote.id !== note.id)
            setNotes(newNotes);
            handleCloseFloatingNote();
        })
    }

    function handleOpenFloatingNote(note: Note) {
        setActiveNote(note);
    }

    function handleSaveNewNote(title: string, content: string) {
        if (!session) return;
        addNewNote(session.user.id, title, content, session.token).then((note) => {
            if (!note) return;
            console.log("Added note: ", note);
            setNotes(notes.concat(note));
        });
    }

    function handleUpdateNote(note: Note) {
        if (!session) return;
        updateNote(session.user.id, note.id, note.title, note.content, session.token).then((note) => {
            if (!note) return;
            const updatedNotes = notes.map(noteTemp =>
                noteTemp.id === note.id ? {...noteTemp, title: note.title, content: note.content} : noteTemp
            );
            setNotes(updatedNotes);
        });
    }

    return (
        <div className="container">
            <div className={"top-menu"}>
                <div>
                    <div className={"display-row"}>
                        <div className={"display-row clickable-img"}>
                            <img className={"margin-right-32"} src={"./logo512.png"} alt={"birb"} height={"48px"}
                                 onClick={() => toggleApp(Apps.PortfolioApp)}></img>
                        </div>
                        <h1>NoteIt</h1>
                    </div>
                    <h2>{t("notes_app.header")}</h2>
                </div>
                <BasicAuth></BasicAuth>
            </div>
            <NewNote onSave={handleSaveNewNote}></NewNote>
            <div className={"grid-container"}>
                {notes
                    .slice() //Generates a copy of the array
                    // .sort((a, b) => b.id - a.id) //TODO sort by date updated
                    .map((note) => (
                        <GridNote key={note.id} note={note} onClick={handleOpenFloatingNote}></GridNote>
                    ))}
            </div>
            <div className={activeNote ? "grayed-out-background" : ""}></div>
            {activeNote != null && (
                <FloatingNote
                    note={activeNote}
                    onClose={handleCloseFloatingNote}
                    onDelete={handleDeleteNote}
                    onSave={handleUpdateNote}
                ></FloatingNote>
            )}
        </div>
    );
}

export default NoteItApp;