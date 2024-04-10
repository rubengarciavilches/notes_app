import React, {useState} from 'react';
import './App.scss'
import NoteItApp from "./noteit/NoteItApp";
import PortfolioApp from "./portfolio/PortfolioApp";
import {Apps} from "./types";

function App() {
    const [activeApp, setActiveApp] = useState<Apps>(Apps.PortfolioApp)
    function getSubdomain() {
        const parts = window.location.hostname.split('.');
        console.log(parts);
        if (parts.length > 1) {
            return parts[0];
        } else {
            return 'www'; // Default subdomain
        }
    }

    function toggleApp(name: Apps){
        setActiveApp(name)
    }

    switch (activeApp) {
        case Apps.NoteItApp:
            return <NoteItApp toggleApp={toggleApp}></NoteItApp>;
        case Apps.PortfolioApp:
        default:
            return <PortfolioApp toggleApp={toggleApp}></PortfolioApp>
    }

    // const subdomain = getSubdomain();
    // console.log("The subdomain is " + subdomain);
    // switch (subdomain) {
    //     case "noteit":
    //         return <NoteItApp></NoteItApp>
    //     case "www":
    //         return <PortfolioApp></PortfolioApp>
    //     default:
    //         return <PortfolioApp></PortfolioApp>
    // }
}

export default App;
