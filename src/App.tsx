import React from 'react';
import './App.scss'
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
} from "react-router-dom";
import NoteItApp from "./noteit/NoteItApp";
import DisplayValentineApp from "./valentine/DisplayValentineApp";
import CreateValentineApp from "./valentine/CreateValentineApp";

function getSubdomain() {
    const parts = window.location.hostname.split('.');
    console.log(parts);
    if (parts.length > 1) {
        return parts[0];
    } else {
        return 'www'; // Default subdomain
    }
}

function App() {
    const subdomain = getSubdomain();
    console.log("The subdomain is " + subdomain);
    switch (subdomain) {
        case "valentine":
            return <Router>
                <Routes>
                    <Route path={"/:valentineId"} Component={DisplayValentineApp}> </Route>
                    <Route path={"/"} Component={CreateValentineApp}> </Route>
                </Routes>
            </Router>
        case "noteit":
            return <NoteItApp></NoteItApp>
        default:
            return <NoteItApp></NoteItApp>
    }
}

export default App;
