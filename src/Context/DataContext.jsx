import { addDoc, collection, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { createContext, useState } from "react";
import { auth, db, imgDb } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
export const DataContext = createContext(null);

function DataProvider({ children }) {
  const [notes, setNotes] = useState([]);
  const [archiveNotes, setArchiveNotes] = useState([]);
  const [deletedNotes, setDeletedNotes] = useState([]);
  const [pinNotes, setPinNotes] = useState([]);
  const [user] = useAuthState(auth);
  const [searchQuery, setSearchQuery] = useState('')

  // Archive, Unarchive, pin, unpin, delete, restore Note
  async function handleNote(add, remove, note) {
    await addDoc(collection(db, `users/${user?.uid}/${add}`), { ...note });
    deleteDoc(doc(db, `users/${user?.uid}/${remove}/${note.id}`));
  }

  // edit note image
  async function handleEditImage(e, setUploadedImg, setNoteImg) {
    var filepath = e.target.files[0];
    const imgs = ref(imgDb, `imgs/${crypto.randomUUID()}`);
    const data = await uploadBytes(imgs, filepath);
    const val = await getDownloadURL(data.ref);
    setUploadedImg(val);
    setNoteImg(URL.createObjectURL(filepath));
  }

  function handleUpdate(editPath, id, uploadedImg, text, title) {
    updateDoc(doc(db, `users/${user?.uid}/${editPath}/${id}`), {
      id: id,
      image: uploadedImg,
      text: text,
      title: title,
    });
  }

  // change theme
  const colors = ["#E3DCD1","#D0E4D0","#A7D3C8","#CAB5D3","#E9D3CF","#fff",];
  function onChangeColor(note, color) {
    updateDoc(doc(db, `users/${user?.uid}/pinNotes/${note.id}`), {
      color: color,
    });
  }

  return (
    <DataContext.Provider
      value={{
        notes,
        setNotes,
        archiveNotes,
        setArchiveNotes,
        deletedNotes,
        setDeletedNotes,
        pinNotes,
        setPinNotes,
        handleNote,
        handleEditImage,
        handleUpdate,
        searchQuery, setSearchQuery,
        onChangeColor, colors
      }}>
      {children}
    </DataContext.Provider>
  );
}

export default DataProvider;
