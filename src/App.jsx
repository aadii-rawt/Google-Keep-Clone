import { BrowserRouter as BrowserRouter, Routes, Route, } from "react-router-dom";
import Layout from "./Components/Layout";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import Archive from "./Pages/Archive";
import Trash from "./Pages/Trash";
import NoInternet from "./Components/NoInternet";

function App() {
  // if (!navigator.onLine) return <NoInternet /> 
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="" element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/archive" element={<Archive />} />
            <Route path="/trash" element={<Trash />} />
          </Route>
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
