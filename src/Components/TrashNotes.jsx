import React, { useContext } from "react";
// material ui icons
import { RestoreFromTrashOutlined } from "@mui/icons-material";
import DeleteOutlineOutlined from "@mui/icons-material/DeleteOutlineOutlined";
import { deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { DataContext } from "../Context/DataContext";

function TrashNotes({ note }) {

  const { handleNote } = useContext(DataContext);
  const [user] = useAuthState(auth);

  // delete note permanently
  function HandleDeleteNote(note) {
    deleteDoc(doc(db, `users/${user?.uid}/trash/${note.id}`));
  }

  return (
    <div className="note" style={{ background: note?.color }}>
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
      </div>
      <div className="icon-container">
        <div className="tool-icon" onClick={() => handleNote("notes","trash",note)}>
          <RestoreFromTrashOutlined
            className="icon"
            style={{ fontSize: "1.3rem" }} />
          <div className="icon-title">
            <span>Restore</span>
          </div>
        </div>
        <div className="tool-icon" onClick={() => HandleDeleteNote(note)}>
          <DeleteOutlineOutlined
            className="icon"
            style={{ fontSize: "1.3rem" }} />
          <div className="icon-title">
            <span>Delete</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrashNotes;
