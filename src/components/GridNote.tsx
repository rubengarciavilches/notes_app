import React from 'react';
import {Note} from "../types";

interface Props{
    note: Note;
    onClick: (note: Note) => void;
}

function GridNote({note, onClick}: Props) {
    return (
        <div className={"note thin-border padding-20"}
             onClick={() => {onClick(note)}}>
            <h3>{note.title}</h3>
            <p>{note.content}</p>
        </div>
    )
}

export default GridNote;