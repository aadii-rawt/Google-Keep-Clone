import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Close,
  NotificationAdd,
  PaletteOutlined,
  WatchLaterOutlined,
} from "@mui/icons-material";
import { ImageOutlined } from "@mui/icons-material";
import { ArchiveOutlined } from "@mui/icons-material";
import DeleteOutlineOutlined from "@mui/icons-material/DeleteOutlineOutlined";
import { PushPin } from "@mui/icons-material";
import { DataContext } from "../Context/DataContext";
// import EditPinNote from "./EditPinNote";
import { auth, db, imgDb } from "../firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Reminder from "./Reminder";

function PinedNotes({ note, HandleEditeNote}) {
  const { pinNotes, setPinNotes, handleNote,onChangeColor, colors  } = useContext(DataContext);
  const [colorPalette, setColorPalette] = useState(false);
  const noteRef = useRef();
  const colorPaletteRef = useRef();
  const [user] = useAuthState(auth);

  async function HandleNoteImage(e, note) {
    const imgs = ref(imgDb, `imgs/${crypto.randomUUID()}`);
    const data = await uploadBytes(imgs, e.target.files[0]);
    const imgURL = await getDownloadURL(data.ref);
    updateDoc(doc(db, `users/${user?.uid}/pinNotes/${note.id}`), {
      id: note.id,
      image: imgURL,
      text: note.text,
      title: note.title,
    });
  }

  useEffect(() => {
    pinNotes.forEach((note) => {
      if (note.reminder !== null) {
        scheduleReminder(note);
      }
    });
  }, [pinNotes]);

  const [isReminder, setIsReminder] = useState(false);
  function scheduleReminder(note) {
    const now = new Date().getTime();
    const reminderTime = new Date(note.reminder).getTime();
    const timeDiff = reminderTime - now;
    if (timeDiff > 0) {
      note.timeoutId = setTimeout(() => {
        new Notification(note.text, {
          body: `Reminder for your note`,
        });
        deleteReminder(note.id);
      }, timeDiff);
    }
  }

  function handleSetReminder(id, reminder) {
    setPinNotes(
      pinNotes.map((note) => (note.id === id ? { ...note, reminder } : note))
    );
  }

  function deleteReminder(id) {
    const note = pinNotes.find((note) => note.id === id);
    if (note.timeoutId) {
      clearTimeout(note.timeoutId);
    }
    note.reminder = "";
    console.log("delete");
  }

  return (
    <>
      <div
        className="note"
        style={{ background: note?.color }}
        ref={noteRef}
        onClick={() => HandleEditeNote(note)}
      >
        <div className="note-content">
          {!note.text && !note.title && !note.image ? (
            <p className="empty-content">Empty Note</p>
          ) : (
            <>
              {note.image && (
                <img src={note.image} alt={note.image} className="note-img" />
              )}
              <h3 className="heading">{note.title}</h3>
              <pre className="text">{note.text}</pre>
            </>
          )}
          {note.reminder && (
            <div
              className="reminderTime"
              onClick={() => deleteReminder(note.id)}
            >
              <p>
                <WatchLaterOutlined style={{ fontSize: "12px" }} />{" "}
                {note?.reminder} <Close style={{ fontSize: "15px" }} />
              </p>
            </div>
          )}
        </div>
        <div className="icon-container" onClick={(e) => e.stopPropagation()}>
          <div
            className="tool-icon"
            onClick={() => setColorPalette(!colorPalette)}
          >
            <PaletteOutlined className="icon" style={{ fontSize: "1.2rem" }} />
            {colorPalette && (
              <div className="color-palette" ref={colorPaletteRef}>
                {colors.map((color) => (
                  <div
                    key={color}
                    className="color"
                    style={{ background: color }}
                    onClick={() => onChangeColor(note, color)}
                  ></div>
                ))}
              </div>
            )}
            <div className="icon-title">
              <span>Background options</span>
            </div>
          </div>
          <div className="tool-icon">
            <input
              type="file"
              id="image"
              className="img-input"
              onChange={(e) => HandleNoteImage(e, note)}
            />
            <ImageOutlined className="icon" style={{ fontSize: "1.2rem" }} />
            <div className="icon-title">
              <span>Image</span>
            </div>
          </div>
          <div
            className="tool-icon"
            onClick={() => handleNote("archiveNotes", "pinNotes", note)}
          >
            <ArchiveOutlined className="icon" style={{ fontSize: "1.2rem" }} />
            <div className="icon-title">
              <span>Archive</span>
            </div>
          </div>
          <div className="tool-icon" onClick={() => setIsReminder(!isReminder)}>
            <NotificationAdd className="icon" style={{ fontSize: "1.2rem" }} />
            <div className="icon-title">
              <span>Reminder</span>
            </div>
          </div>
          <div
            className="tool-icon"
            onClick={() => handleNote("trash", "pinNotes", note)}
          >
            <DeleteOutlineOutlined
              className="icon"
              style={{ fontSize: "1.2rem" }}
            />
            <div className="icon-title">
              <span>Delete</span>
            </div>
          </div>
          <div
            className="tool-icon"
            onClick={() => handleNote("notes", "pinNotes", note)}
          >
            <PushPin className="icon" style={{ fontSize: "1.2rem" }} />
            <div className="icon-title">
              <span>Unpin</span>
            </div>
          </div>
        </div>
      </div>
      {isReminder && (
        <Reminder
          isReminder={isReminder}
          setIsReminder={setIsReminder}
          note={note}
          onsetReminder={handleSetReminder}
        />
      )}
    </>
  );
}

export default PinedNotes;
