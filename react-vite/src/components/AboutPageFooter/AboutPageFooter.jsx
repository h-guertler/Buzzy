import { Link } from 'react-router-dom'
import "./aboutpagefooter.css";

function AboutPageFooter() {
    return (
        <div id="about-link-div">
            <br></br>
            <Link to="/about" id="about-link">Behind the scenes 🎬</Link>
        </div>
    )
}

export default AboutPageFooter;
