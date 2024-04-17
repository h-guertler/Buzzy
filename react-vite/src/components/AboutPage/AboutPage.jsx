import { Link } from "react-router-dom";
import "./AboutPage.css";
import githublogo from "../../../src/githublogo.png";
import linkedinlogo from "../../../src/linkedinlogo.png";

function AboutPage() {
    return (
        <div id="about-page-div">
            <br></br>
            <h2>This site is created and updated by Hannah Guertler</h2>
            <ul>
                <li id="github-li">
                    <img src={githublogo} alt="github" className="logo-img"/>
                    <Link to="https://github.com/h-guertler" className="social-link">Github</Link>
                </li>
                <li id="linkedin-li">
                    <img src={linkedinlogo} alt="linkedin" className="logo-img"/>
                    <Link to="https://www.linkedin.com/in/hannah-guertler-00b4112ba/" className="social-link">LinkedIn</Link>
                </li>
            </ul>
        </div>
    )
}

export default AboutPage;
