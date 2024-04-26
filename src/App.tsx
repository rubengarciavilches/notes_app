import React, {useEffect, useState} from 'react';
import './App.scss'
import NoteItApp from "./noteit/NoteItApp";
import PortfolioApp from "./portfolio/PortfolioApp";
import {Apps, lngs} from "./types";
import i18n from "i18next";

function App() {
    const [activeApp, setActiveApp] = useState<Apps>(Apps.PortfolioApp);
    const [language, setLanguage] = useState<string>("en");

    useEffect(() => {
        if (i18n.language !== undefined && (i18n.language === "en" || i18n.language === "es"))
            setLanguage(i18n.language);
    }, []);

    function toggleApp(name: Apps) {
        setActiveApp(name)
    }

    function toggleLanguage() {
        if (language === "en") {
            i18n.changeLanguage("es");
            setLanguage("es");
        } else {
            i18n.changeLanguage("en");
            setLanguage("en");
        }
    }

    function languageButton() {
        return (
            <div className={"top-right-abs"}>
                <button className={"button display-row"} onClick={() => toggleLanguage()}>
                    <img
                        src={language === "en" ? "./icons8-great-britain-48.png" : "./icons8-spain-48.png"}
                        alt={language === "en" ? "GB Flag" : "Spain Flag"} height={"24px"}
                    ></img>
                    {lngs[language].capsName}
                </button>
            </div>
        )
    }

    switch (activeApp) {
        case Apps.NoteItApp:
            return <div>
                {languageButton()}
                <NoteItApp toggleApp={toggleApp}></NoteItApp>
            </div>;
        case Apps.PortfolioApp:
        default:
            return <div>
                {languageButton()}
                <PortfolioApp toggleApp={toggleApp}></PortfolioApp>
            </div>
    }
}

export default App;
