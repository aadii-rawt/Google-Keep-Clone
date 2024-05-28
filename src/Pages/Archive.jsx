import React, { useContext, useEffect, useState } from "react";
import { DataContext } from "../Context/DataContext";
// Components
import ArchiveNotes from "../Components/ArchiveNotes";
import EmptyNotes from "../Components/EmptyNotes";
//material ui icons
import { ArchiveOutlined } from "@mui/icons-material";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import EditNote from "../Components/EditNote";
function Archive() {
  const { archiveNotes, setArchiveNotes } = useContext(DataContext);
  const [user] = useAuthState(auth);

  useEffect(() => {
    // fetch data from database
      const notesQuery = query(
        collection(db, `users/${user?.uid}/archiveNotes`),
        orderBy("timestamp", "desc")
      );
      const unsubscribe = onSnapshot(notesQuery, (snapshot) => {
        const notesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          image: doc.data().image,
          text: doc.data().text,
          title: doc.data().title,
          color: doc.data().color,
          timestamp: doc.data().timestamp,
        }));
        setArchiveNotes(notesData);
      });
      return () => unsubscribe();
  }, [db, user]);

  // const [isEditArchive, setIsEditArchive] = useState(false);
  const [isEditNote, setIsEditNote] = useState(false);
  const [selectedEditNote, setselectedEditNote] = useState({});
  function HandleEditeNote(note) {
    setIsEditNote(!isEditNote);
    setselectedEditNote(note);
  }
  return (
    <main>
      {archiveNotes.length > 0 ? (
        <div className="notes">
          {archiveNotes
            .filter((note) => note.text.includes(searchQuery))
            .map((note, index) => {
              return (
                <ArchiveNotes
                  key={index}
                  note={note}
                  HandleEditeNote={HandleEditeNote}
                />
              );
            })}
        </div>
      ) : (
        <EmptyNotes
          icon={
            <ArchiveOutlined style={{ fontSize: "10rem", fill: "#E5E5E5" }} />
          }
          title="Your archived notes appear here"
        />
      )}

      {isEditNote && (
        <EditNote
          path="archiveNotes"
          selectedEditNote={selectedEditNote}
          isEditNote={isEditNote}
          setIsEditNote={setIsEditNote}
        />
      )}
    </main>
  );
}

export default Archive;
