import React, {useEffect, useState} from 'react';
import './App.css';
import GridNote from "./components/GridNote";
import FloatingNote from "./components/FloatingNote";
import {Note} from "./types";
import NewNote from "./components/NewNote";
import SupabaseAuth from "./components/SupabaseAuth";
import BasicAuth from "./components/BasicAuth";
import {getAllNotes} from "./dbcalls";
import {useSession} from "./SessionContext";

function App() {
    const {session, setSession} = useSession();
    const [activeNote, setActiveNote] = useState<Note | null>(null);
    const [notes, setNotes] = useState<Note[]>([
        {
            id: 1,
            title: "Note Title",
            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec rutrum varius nulla. Aliquam eu volutpatpurus. Nullam luctus feugiat viverra. Curabitur a mauris scelerisque, egestas justo sed, lobortis erat."
        },
        {
            id: 2,
            title: "Note Title",
            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec rutrum varius nulla. Aliquam eu volutpatpurus. Nullam luctus feugiat viverra. Curabitur a mauris scelerisque, egestas justo sed, lobortis erat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec rutrum varius nulla. Aliquam eu volutpatpurus. Nullam luctus feugiat viverra. Curabitur a mauris scelerisque, egestas justo sed, lobortis erat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec rutrum varius nulla. Aliquam eu volutpatpurus. Nullam luctus feugiat viverra. Curabitur a mauris scelerisque, egestas justo sed, lobortis erat."
        },
        {
            id: 3,
            title: "Note Title",
            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec rutrum varius nulla. Aliquam eu volutpatpurus. Nullam luctus feugiat viverra. Curabitur a mauris scelerisque, egestas justo sed, lobortis erat."
        },
        {
            id: 4,
            title: "Note Title",
            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec rutrum varius nulla. Aliquam eu volutpatpurus. Nullam luctus feugiat viverra. Curabitur a mauris scelerisque, egestas justo sed, lobortis erat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec rutrum varius nulla. Aliquam eu volutpatpurus. Nullam luctus feugiat viverra. Curabitur a mauris scelerisque, egestas justo sed, lobortis erat."
        },
    ]);

    useEffect(() => {
        console.log("Trying to retrieve session")
        if (!session) return;
        console.log(session);
        getAllNotes(session.user.id).then((notes) => {
            if(!notes) return;
            setNotes(notes);
        });
    }, [session]);

    function handleCloseFloatingNote() {
        setActiveNote(null);
    }

    function handleDeleteNote(note: Note) {
        let newNotes: Note[] = notes.filter((tempNote) => tempNote.id !== note.id)
        setNotes(newNotes);
        handleCloseFloatingNote();
    }

    function handleOpenFloatingNote(note: Note) {
        setActiveNote(note);
    }

    function handleSaveNewNote(title: string, content: string) {
        let tempNote: Note = {id: notes[notes.length - 1].id + 1, title: title, content: content};
        setNotes(notes.concat(tempNote));
    }

    function handleUpdateNote(note: Note) {
        const updatedNotes = notes.map(noteTemp =>
            noteTemp.id === note.id ? {...noteTemp, title: note.title, content: note.content} : noteTemp
        );
        setNotes(updatedNotes);
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
                    .sort((a, b) => b.id - a.id)
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
