import React from 'react';
import './App.scss'
import NoteItApp from "./noteit/NoteItApp";
import PortfolioApp from "./portfolio/PortfolioApp";

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
        case "noteit":
            return <NoteItApp></NoteItApp>
        case "www":
            return <PortfolioApp></PortfolioApp>
        default:
            return <PortfolioApp></PortfolioApp>
    }
}

export default App;
