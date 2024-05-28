import React, { useContext, useState } from "react";
import "../Components/CSS/login.css";
import { useNavigate } from "react-router-dom";
import { app } from "../firebase";
import Google from "../assets/Google.png";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

function Login() {
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  const [action, setAction] = useState("Sign in");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  // Sign in user
  function HadnleSingin(e) {
    e.preventDefault();
    setAction("Sign in");
    const auth = getAuth();
    if ((email, password)) {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          navigate("/");
          setUsername("");
          setEmail("");
          setPassword("");
        })
        .catch((error) => {
          const errorMessage = error.message;
          setError(errorMessage);
        });
    }
  }
  // Sign up user
  function HadnleSingup(e) {
    e.preventDefault();
    setAction("Sign up");
    if (email || password || username) {
      createUserWithEmailAndPassword(auth, email, password)
        .then((user) => {
          user.displayName = username;
          navigate("/");
          setUsername("");
          setEmail("");
          setPassword("");
        })
        .catch((error) => {
          const errorMessage = error.message;
          setError(errorMessage);
        });
    }
  }
  // Google Sign up
  function HandleGoogleSignup(e) {
    e.preventDefault();
    e.preventDefault();
    console.log("loading..");
    signInWithPopup(auth, provider)
      .then((result) => {
        navigate("/");
      })
      .catch((error) => {
        console.error(error);
      });
    setUsername("");
    setEmail("");
    setPassword("");
  }

  return (
    <div className="register">
      <div className="register-box">
        <h3 className="welcome-title">Welcome to Note App</h3>
        <form action="">
          {action === "Sign up" && (
            <div className="username">
              <label htmlFor="username">Username</label>
              <br />
              <input
                type="username"
                name="username"
                id="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          )}
          <label htmlFor="email">Email</label>
          <br />
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="password">Password</label>
          <br />
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <p style={{ color: "red" }}>{error}</p>
          <div className="register-btns">
            <button
              type="submit"
              className={
                action === "Sign in" ? "active-btn-color" : "disable-btn-color"
              }
              onClick={HadnleSingin}
            >
              Sign in
            </button>
            <button
              type="submit"
              className={
                action === "Sign up" ? "active-btn-color" : "disable-btn-color"
              }
              onClick={HadnleSingup}
            >
              Sign up
            </button>
          </div>
          <div className="sign-up-google-btn" onClick={HandleGoogleSignup}>
            <span>or</span>
            <button>
              <img
                src={Google}
                alt={Google + " icon"}
                className="google-icon"
              />{" "}
              Sign up with Google
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
