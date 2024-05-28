import React, { useContext, useEffect } from "react";
import { DataContext } from "../Context/DataContext";
// Components
import TrashNotes from "../Components/TrashNotes";
import EmptyNotes from "../Components/EmptyNotes";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

function Trash() {
  const { deletedNotes, setDeletedNotes, searchQuery } =
    useContext(DataContext);
  const [user] = useAuthState(auth);
  useEffect(() => {
    // fetch data from database
    if (navigator.onLine) {
      const notesQuery = query(
        collection(db, `users/${user?.uid}/trash`),
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
        setDeletedNotes(notesData);
      });
      return () => unsubscribe();
    } else {
      console.warn("No Internet Connetion");
    }
  }, [db, user]);
  return (
    <main>
      <div className="notes">
        {deletedNotes.length > 0 ? (
          <div className="notes">
            {deletedNotes
              .filter((note) => note.text.includes(searchQuery))
              .map((note, index) => {
                return <TrashNotes key={index} note={note} />;
              })}
          </div>
        ) : (
          <EmptyNotes
            icon={
              <DeleteOutlineOutlinedIcon
                style={{ fontSize: "10rem", fill: "#E5E5E5" }}
              />
            }
            title="Notes you deleted appear here"
          />
        )}
      </div>
    </main>
  );
}

export default Trash;
