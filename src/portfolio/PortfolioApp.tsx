import './Portfolio.scss';
import {Apps, lngs} from "../types";
import {useTranslation} from "react-i18next";

interface Props {
    toggleApp: (name: Apps) => void
}

function PortfolioApp({toggleApp}: Props) {
    // https://www.figma.com/community/file/1233636966947654065/simple-portfolio
    const {t, i18n} = useTranslation();

    function hireMeMail() {
        const emailTo: string = "rubengarciavilches@gmail.com";
        const emailSub: string = "Looking to hire you."
        window.open('mailto:'+emailTo+'&subject='+emailSub, '_self');
    }

    return (
        <div className={"container width-700"}>
            <div className={"height-200"}></div>
            <div>
                <h1>{t("portfolio.greetings.part1")}</h1>
                <h1>{t("portfolio.greetings.part2")}</h1></div>
            <div className={"width-70p"}>
                <p>{t("portfolio.about_me.part1")}</p>
                <p>{t("portfolio.about_me.part2")}</p>
                <p>{t("portfolio.about_me.part3")}</p>
            </div>
            <div className={"top-menu"}>
                <button
                    className={"button"}
                    onClick={() => {
                        window.open(t("portfolio.buttons.resume_link"), '_blank')
                    }}
                >{t("portfolio.buttons.resume")}
                </button>
                <button className={"button"}
                        onClick={() => {
                            toggleApp(Apps.NoteItApp);
                        }}
                >{t("portfolio.buttons.notes_app")}
                </button>
                <button className={"button"}
                        onClick={() => {
                            window.open("https://github.com/rubengarciavilches", '_blank')
                        }}
                >{t("portfolio.buttons.github")}
                </button>
                <button className={"button"}
                        onClick={hireMeMail}
                >{t("portfolio.buttons.hire_me")}
                </button>
            </div>
        </div>
    );
}

export default PortfolioApp;