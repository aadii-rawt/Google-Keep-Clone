import React, { useState, useEffect, useRef, useContext } from "react";
import { DataContext } from "../Context/DataContext";
import {
  ImageOutlined,
  Mic,
  MicNone,
  MicOff,
  PushPin,
  PushPinOutlined,
  Transcribe,
} from "@mui/icons-material";
import "./CSS/TextInput.css";
import {
  Timestamp,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db, imgDb } from "../firebase";
import "regenerator-runtime/runtime";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useAuthState } from "react-firebase-hooks/auth";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

function TextInput() {
  const [user] = useAuthState(auth);
  const { transcript, browserSupportsSpeechRecognition, resetTranscript } =
    useSpeechRecognition();
  const {setNotes, setPinNotes, userID } = useContext(DataContext);
  const [showTitleInput, setShowTitleInput] = useState(false);
  const [pinActive, setPinActive] = useState(false);
  const inputRef = useRef();
  const textareaRef = useRef();
  const [item, setItem] = useState({
    title: "",
    text: "",
    image: "",
    color: "#fff",
  });

  function HandleData(e) {
    const { name, value } = e.target;
    setItem((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name == "text") {
      adjustTextareaHeight();
    }
  }
  // Voice typing
  const [isMicON, setIsMicON] = useState(false);
  function voiceTyping() {
    if (!browserSupportsSpeechRecognition) {
      alert("browser does not support");
    }
    setIsMicON(!isMicON);
    if (isMicON) {
      SpeechRecognition.stopListening();
      resetTranscript();
    } else {
      SpeechRecognition.startListening({ continuous: true });
    }
  }
  // Add Image
  const [noteImage, setNoteImage] = useState("");
  const [uploadedImg, setUploadedImg] = useState("");
  async function HandleNoteImage(e) {
    var filepath = e.target.files[0];
    const imgs = ref(imgDb, `imgs/${crypto.randomUUID()}`);
    const data = await uploadBytes(imgs, filepath);
    const val = await getDownloadURL(data.ref);
    setUploadedImg(val);
    setNoteImage(URL.createObjectURL(filepath));
  }
  // store data in database
  async function addNote() {
    setIsMicON(false);
    SpeechRecognition.stopListening();
    setShowTitleInput(false);
    if (item.title || item.text || uploadedImg) {
      if (pinActive) {
        await addDoc(collection(db, `users/${user?.uid}/pinNotes`), {
          ...item,
          image: uploadedImg,
          timestamp: serverTimestamp(),
        });
        setPinActive(!pinActive);
      } else {
        await addDoc(collection(db, `users/${user?.uid}/notes`), {
          ...item,
          image: uploadedImg,
          timestamp: serverTimestamp(),
        });
      }
      setItem({
        title: "",
        text: "",
        image: "",
        color: "#fff",
      });
      setNoteImage("");
      setUploadedImg("");
      resetTextareaHeight();
    }
    // resetTranscript();
  }

  // when user click the outside of the input container it will automaticaly add a new note
  useEffect(() => {
    function inputHandler(e) {
      if (!inputRef.current.contains(e.target)) {
        addNote();
      }
    }
    document.addEventListener("mousedown", inputHandler);
    return () => {
      document.removeEventListener("mousedown", inputHandler);
    };
  });

  // adjust height of input when content is too big
  function adjustTextareaHeight() {
    const textarea = textareaRef.current;
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  }
  function resetTextareaHeight() {
    const textarea = textareaRef.current;
    textarea.style.height = "auto";
  }
  useEffect(() => {
    adjustTextareaHeight();
  }, [setNotes]);
  return (
    <div className="input-conatiner">
      <div className="input-box" ref={inputRef}>
        <div className="inputes">
          <div style={{width:"100%"}}>
            {noteImage && <img src={noteImage} alt="" className="note-img" />}
            {showTitleInput && (
              <input
                type="text"
                id="title"
                placeholder="Title"
                value={item.title}
                name="title"
                onChange={HandleData}
              />
            )}
            <textarea
              ref={textareaRef}
              rows="1"
              type="text"
              placeholder="Take a note..."
              value={transcript ? item.text + transcript : item.text}
              onClick={() => setShowTitleInput(true)}
              onChange={HandleData}
              name="text"
            />
          </div>
          {showTitleInput && (
            <div className="tool-icon" onClick={() => setPinActive(!pinActive)}>
              {pinActive ? (
                <PushPin
                  className="icon"
                  style={{ fontSize: "1.3rem", fill: "var(--icon-color)" }}
                />
              ) : (
                <PushPinOutlined
                  className="icon"
                  style={{ fontSize: "1.3rem", fill: "var(--icon-color)" }}
                />
              )}
              <div className="icon-title">
                {pinActive ? <span>Unpin</span> : <span>Pin</span>}
              </div>
            </div>
          )}
        </div>
        {showTitleInput && (
          <div className="add-btn">
            <div className="notes-btns">
              <div className="tool-icon">
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  name="image"
                  className="img-input"
                  onChange={HandleNoteImage}
                />
                <ImageOutlined
                  className="icon"
                  style={{ fontSize: "1.3rem", fill: "var(--icon-color)" }}
                />
                <div className="icon-title">
                  <span>Image</span>
                </div>
              </div>
              <div className="tool-icon" onClick={voiceTyping}>
                {isMicON ? (
                  <>
                    <MicOff
                      className="icon"
                      style={{ fontSize: "1.3rem", fill: "var(--icon-color)" }}
                    />
                    <div className="icon-title">
                      <span>Voice</span>
                    </div>
                  </>
                ) : (
                  <>
                    <Mic
                      className="icon"
                      style={{ fontSize: "1.3rem", fill: "var(--icon-color)" }}
                    />
                    <div className="icon-title">
                      <span>Voice</span>
                    </div>
                  </>
                )}
              </div>
            </div>
            <button onClick={addNote}>Add</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TextInput;
