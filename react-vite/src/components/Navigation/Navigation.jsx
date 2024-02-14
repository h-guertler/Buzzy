import { useNavigate } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import honeycomb from "../../../src/honeycomb.svg";
import "./Navigation.css";

function Navigation() {

  const navigate = useNavigate();

  return (
    <div className="nav-div">
        <div className="logo-div clickable" onClick={() => navigate("/")}>
          <div>Buzzy</div>
          <img src={honeycomb} alt="honeycomb logo" />
        </div>
        <div className="header-inner-div">
          <ProfileButton />
        </div>
    </div>
  );
}

export default Navigation;
