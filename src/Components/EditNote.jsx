import React, { useContext, useState } from "react";
import "./CSS/Editnote.css";
import { DeleteRounded, ImageOutlined } from "@mui/icons-material";
import { createPortal } from "react-dom";
import { auth, imgDb } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { DataContext } from "../Context/DataContext";

function EditNote({path, selectedEditNote, isEditNote, setIsEditNote }) {
  const {handleUpdate} = useContext(DataContext);
  const [title, setTitle] = useState(selectedEditNote.title);
  const [text, setText] = useState(selectedEditNote.text);
  const [noteImg, setNoteImg] = useState(selectedEditNote.image);
  const [uploadedImg, setUploadedImg] = useState(selectedEditNote.image);
  const [user] = useAuthState(auth);

  async function HandleNoteImage(e) {
    var filepath = e.target.files[0];
    const imgs = ref(imgDb, `imgs/${crypto.randomUUID()}`);
    const data = await uploadBytes(imgs, filepath);
    const val = await getDownloadURL(data.ref);
    setUploadedImg(val);
    setNoteImg(URL.createObjectURL(filepath));
  }

  return createPortal(
    <div className="model-container" onClick={() => setIsEditNote(!isEditNote)}>
      <div className="model-box" onClick={(e) => e.stopPropagation()}>
        <div className="edit-input">
          {noteImg && (
            <div className="update-note-img">
              <img src={noteImg} alt="" />
              <div className="edit-btns">
                <div className="tool-icon">
                  <input
                    type="file"
                    id="image"
                    className="img-input"
                    onChange={(e) => HandleNoteImage(e)} />
                  <ImageOutlined
                    className="icon"
                    style={{ fontSize: "1.3rem" }}
                  />
                </div>
                <div className="tool-icon" onClick={() => { 
                  setUploadedImg("")
                  setNoteImg("")}}>
                  <DeleteRounded
                    className="icon"
                    style={{ fontSize: "1.3rem" }}
                  />
                </div>
              </div>
            </div>
          )}
          <form>
            <input
              id="update-title"
              onChange={(e) => setTitle(e.target.value)}
              name="title"
              value={title}
              placeholder="Title"
            />
            <textarea
              id="modalContent"
              onChange={(e) => setText(e.target.value)}
              value={text}
              name="content"
              placeholder="Add a note..."
            />
          </form>
        </div>
        <div className="update-btn">
          <button onClick={() => {
            handleUpdate(path, selectedEditNote.id, uploadedImg, text, title)
            setIsEditNote(!isEditNote);
          }}>Close</button>
      </div>
    </div>
    </div >,
    document.getElementById("portal")
  );
}

export default EditNote;
