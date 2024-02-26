import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { thunkLogout } from "../../redux/session";
import OpenModalButton from "../OpenModalButton"
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import CreateEventModal from "../CreateEventModal";

function ProfileButton() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const user = useSelector((store) => store.session.user);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(thunkLogout());
    navigate('/')
    closeMenu();
  };

  const directToProfile = (e) => {
    e.preventDefault();
    navigate(`/users/${user.id}`);
    closeMenu();
  }

  return (
    <>
      <button onClick={toggleMenu} className="clickable" id="menu-button-user-icon">
        <i className="fas fa-user-circle fa-2x" />
      </button>
      {showMenu && (
        <ul className={"profile-dropdown menu-ul"} ref={ulRef}>
          {user ? (
            <div className="menu-ul-logged-in">
              <div id="username-and-email">
              <li>Hello, {user.username}</li>
              <li>{user.email}</li>
              </div>
              <div id="not-logout-buttons">
              <li>
                <button onClick={directToProfile} className="user-menu-not-logout-button clickable">My Profile</button>
              </li>
              <li>
              <OpenModalButton
                buttonText="Create Event"
                onItemClick={closeMenu}
                modalComponent={<CreateEventModal />}
              />
              </li>
              </div>
              <div id="logout-button-div">
              <li>
                <button onClick={logout} className="clickable">Log Out</button>
              </li>
              </div>
            </div>
          ) : (
            <div className="not-logged-in-menu">
            <div className="log-in-div">
              <OpenModalButton
                buttonText="Log In"
                onItemClick={closeMenu}
                modalComponent={<LoginFormModal />}
              />
              </div>
              <div className="log-out-div">
              <OpenModalButton
                buttonText="Sign Up"
                onItemClick={closeMenu}
                modalComponent={<SignupFormModal />}
              />
              </div>
            </div>
          )}
        </ul>
      )}
    </>
  );
}

export default ProfileButton;
