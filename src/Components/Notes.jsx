import React, { useContext, useEffect, useRef, useState } from "react";
import "./CSS/Notes.css";
// material ui icon
import { Close, NotificationAdd, PaletteOutlined, WatchLaterOutlined } from "@mui/icons-material";
import { ImageOutlined } from "@mui/icons-material";
import { ArchiveOutlined } from "@mui/icons-material";
import DeleteOutlineOutlined from "@mui/icons-material/DeleteOutlineOutlined";
import { PushPinOutlined } from "@mui/icons-material";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, imgDb } from "../firebase";
import {
  doc,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Reminder from "./Reminder";
import { DataContext } from "../Context/DataContext";

function Notes({ note, HandleEditeNote}) {
  const [colorPalette, setColorPalette,onChangeColor, colors ] = useState(false);
  const noteRef = useRef();
  const colorPaletteRef = useRef();
  const [user] = useAuthState(auth);
  const { notes, setNotes, handleNote} = useContext(DataContext);

  // Add Image or update image
  async function HandleNoteImage(e, note) {
    const imgs = ref(imgDb, `imgs/${crypto.randomUUID()}`);
    const data = await uploadBytes(imgs, e.target.files[0]);
    const imgURL = await getDownloadURL(data.ref);
    updateDoc(doc(db, `users/${user?.uid}/notes/${note.id}`), {
      image: imgURL,
    });
  }

  useEffect(() => {
    notes.forEach((note) => {
      if (note.reminder !== null) {
        scheduleReminder(note);
      }
    });
  }, [notes]);

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
    setNotes(notes.map((note) => (note.id === id ? { ...note, reminder } : note)));
  }

  function deleteReminder(id) {
    const note = notes.find((note) => note.id === id);
    if (note.timeoutId) {
      clearTimeout(note.timeoutId);
    }
    note.reminder = ''
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
          {
            note.reminder &&
            <div className="reminderTime" onClick={() => deleteReminder(note.id)}>
              <p><WatchLaterOutlined style={{ fontSize: "12px" }} /> {note?.reminder} <Close style={{ fontSize: "15px" }} /></p>
            </div>
          }
        </div>
        <div className="icon-container" onClick={(e) => e.stopPropagation()}>
          <div
            className="tool-icon"
            onClick={() => setColorPalette(!colorPalette)} >
            <PaletteOutlined className="icon" style={{ fontSize: "1.2rem" }} />
            <div className="icon-title">
              <span>Background options</span>
            </div>
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
          <div className="tool-icon" onClick={() => handleNote("archiveNotes", "notes", note)}>
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
          <div className="tool-icon" onClick={() => handleNote("trash", "notes", note)}>
            <DeleteOutlineOutlined
              className="icon"
              style={{ fontSize: "1.2rem" }} />
            <div className="icon-title">
              <span>Delete</span>
            </div>
          </div>
          <div className="tool-icon" onClick={() => handleNote("pinNotes", "notes", note)}>
            <PushPinOutlined className="icon" style={{ fontSize: "1.2rem" }} />
            <div className="icon-title">
              <span>Pin</span>
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

export default Notes;
