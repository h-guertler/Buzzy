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
            <>
              <li>Hello, {user.username}</li>
              <li>{user.email}</li>
              <li>
                <button onClick={directToProfile}>My Profile</button>
              </li>
              <li>
              <OpenModalButton
                buttonText="Create Event"
                onItemClick={closeMenu}
                modalComponent={<CreateEventModal />}
              />
              </li>
              <li>
                <button onClick={logout} className="clickable">Log Out</button>
              </li>
            </>
          ) : (
            <>
              <OpenModalButton
                buttonText="Log In"
                onItemClick={closeMenu}
                modalComponent={<LoginFormModal />}
              />
              <OpenModalButton
                buttonText="Sign Up"
                onItemClick={closeMenu}
                modalComponent={<SignupFormModal />}
              />
            </>
          )}
        </ul>
      )}
    </>
  );
}

export default ProfileButton;
