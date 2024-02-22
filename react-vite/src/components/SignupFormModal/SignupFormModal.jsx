import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkSignup } from "../../redux/session";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setErrors({
        confirmPassword:
          "Confirm Password field must be the same as the Password field",
      });
    }

    const serverResponse = await dispatch(
      thunkSignup({
        email,
        username,
        password,
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      closeModal();
    }
  };

  return (
    <>
      <h1>Sign Up</h1>
      {errors.server && <p>{errors.server}</p>}
      <form onSubmit={handleSubmit}>
        <div className="label-div">
        <label>
          Email
          <input
            type="text"
            id="email-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        </div>
        {errors.email && <p>{errors.email}</p>}
        <div className="label-div">
        <label>
          Username
          <input
            type="text"
            id="username-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        </div>
        {errors.username && <p>{errors.username}</p>}
        <div className="label-div">
        <label>
          Password
          <input
            type="password"
            id="password-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        </div>
        {errors.password && <p>{errors.password}</p>}
        <div className="label-div">
        <label>
          Confirm Password
          <input
            type="password"
            id="confirm-password-input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        </div>
        {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
        <button type="submit">Sign Up</button>
      </form>
    </>
  );
}

export default SignupFormModal;
