import React, {useEffect, useState} from 'react';
import './App.css';
import GridNote from "./components/GridNote";
import FloatingNote from "./components/FloatingNote";
import {Note, User} from "./types";
import NewNote from "./components/NewNote";
import SupabaseAuth from "./components/SupabaseAuth";
import BasicAuth from "./components/BasicAuth";
import {addNewNote, deleteNote, getAllNotes, updateNote} from "./dbcalls";
import {useSession} from "./SessionContext";
import {stringify} from "querystring";

function App() {
    const {session, setSession} = useSession();
    const [activeNote, setActiveNote] = useState<Note | null>(null);
    const [notes, setNotes] = useState<Note[]>([
        {
            id: "1",
            user_id: "1",
            title: "Note Title",
            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec rutrum varius nulla. Aliquam eu volutpatpurus. Nullam luctus feugiat viverra. Curabitur a mauris scelerisque, egestas justo sed, lobortis erat.",
            created_at: "2024-01-28T14:23:34.768883",
            updated_at: "2024-01-28T14:23:34.768883"
        },
        {
            id: "2",
            user_id: "1",
            title: "Note Title",
            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec rutrum varius nulla. Aliquam eu volutpatpurus. Nullam luctus feugiat viverra. Curabitur a mauris scelerisque, egestas justo sed, lobortis erat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec rutrum varius nulla. Aliquam eu volutpatpurus. Nullam luctus feugiat viverra. Curabitur a mauris scelerisque, egestas justo sed, lobortis erat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec rutrum varius nulla. Aliquam eu volutpatpurus. Nullam luctus feugiat viverra. Curabitur a mauris scelerisque, egestas justo sed, lobortis erat.",
            created_at: "2024-01-28T14:23:34.768883",
            updated_at: "2024-01-28T14:23:34.768883"
        },
        {
            id: "3",
            user_id: "1",
            title: "Note Title",
            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec rutrum varius nulla. Aliquam eu volutpatpurus. Nullam luctus feugiat viverra. Curabitur a mauris scelerisque, egestas justo sed, lobortis erat.",
            created_at: "2024-01-28T14:23:34.768883",
            updated_at: "2024-01-28T14:23:34.768883"
        },
        {
            id: "4",
            user_id: "1",
            title: "Note Title",
            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec rutrum varius nulla. Aliquam eu volutpatpurus. Nullam luctus feugiat viverra. Curabitur a mauris scelerisque, egestas justo sed, lobortis erat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec rutrum varius nulla. Aliquam eu volutpatpurus. Nullam luctus feugiat viverra. Curabitur a mauris scelerisque, egestas justo sed, lobortis erat.",
            created_at: "2024-01-28T14:23:34.768883",
            updated_at: "2024-01-28T14:23:34.768883"
        },
    ]);

    useEffect(() => {
        console.log("Trying to retrieve session")
        if (!session){
            setNotes([]);
            return;
        }
        console.log(session);
        getAllNotes(session.user.id).then((notes) => {
            if (!notes) return;
            setNotes(notes);
        });
    }, [session]);

    function handleCloseFloatingNote() {
        setActiveNote(null);
    }

    function handleDeleteNote(note: Note) {
        if(!session) return;
        deleteNote(session.user.id, note.id).then(() => {
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
        addNewNote(session.user.id, title, content).then((note: Note | null) => {
            if (!note) return;
            console.log("Added note: ", note);
            setNotes(notes.concat(note));
        });
    }

    function handleUpdateNote(note: Note) {
        if (!session) return;
        updateNote(session.user.id, note.id, note.title, note.content).then((note: Note | null) => {
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
                    <h1>NoteIt</h1>
                    <h2>Easily organize all your notes</h2>
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

export default App;
