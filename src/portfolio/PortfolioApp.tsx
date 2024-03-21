import './Portfolio.scss';

function PortfolioApp() {
    // https://www.figma.com/community/file/1233636966947654065/simple-portfolio

    return (
        <div className={"container width-700"}>
            <div className={"height-200"}></div>
            {/*<div className={"center"}>*/}
            {/*    <h4>about</h4>*/}
            {/*    <h4>resume</h4>*/}
            {/*    <h4>projects</h4>*/}
            {/*    <h4>contact</h4>*/}
            {/*</div>*/}
            <div>
                <h1>Hello, I am Ruben</h1>
                <h1>I design and build things</h1></div>
            <div className={"width-70p"}>
                {/*<h2>About me</h2>*/}
                <p>University student with an affinity to tinkering, weightlifting, video games, cooking and baking.</p>
                <p>Enrolled in Computer Engineering at the Polytechnic University of Madrid (UPM).</p>
                <p>Worked at Accenture as a Developer.</p>
            </div>
            <div className={"top-menu"}>
                <button
                    className={"button"}
                    onClick={()=>{
                        window.open("./resume_ruben_garcia_vilches.pdf", '_blank')
                    }}
                >Get my Resume</button>
                <button className={"button"}>Hire me</button>
            </div>
        </div>
    );
}

export default PortfolioApp;