import React, { useContext, useState } from "react";
import DehazeOutlinedIcon from "@mui/icons-material/DehazeOutlined";
import "./CSS/Header.css";
import Logo from "../assets/logo.png";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { Close, DarkMode, Light, LightMode, Logout, Search } from "@mui/icons-material";
import { DataContext } from "../Context/DataContext";

const Header = ({ setMenu }) => {
  const { searchQuery, setSearchQuery } = useContext(DataContext);
  const navigate = useNavigate()
  function HandleSingOut() {
    auth.signOut()
    navigate('/login')
  }
  const [isDark, setIsDark] = useState(false)
  function handleTheme() {
    setIsDark(!isDark)
    document.querySelector("body").classList.toggle("dark")
  }
  return (
    <header>
      <div className="nav-left">
        <div className="toggle-menu" onClick={() => setMenu((prev) => !prev)}>
          <DehazeOutlinedIcon style={{ fill: `var(--icon-color)` }} />
        </div>
        <div className="logo">
          <img src={Logo} alt="logo" />
        </div>
      </div>
      <div className="search-bar">
        <Search style={{ fill: `var(--icon-color)` }} />
        <input type="text" placeholder="Search here..."
          value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        {
          searchQuery &&
          <div className="tool-icon" >
          <Close style={{ fill: `var(--icon-color)`,fontSize : "1.2rem"}} onClick={() => setSearchQuery('')} />
          </div>
        }
      </div>
      <div className="nav-right">
        <div className="tool-icon" onClick={HandleSingOut}>
          <Logout
            className="icon"
            style={{ fontSize: "1.3rem", fill: `var(--icon-color)` }} />
        </div>
        <div className="tool-icon" onClick={handleTheme} >
          {
            isDark ?
              <LightMode
                className="icon"
                style={{ fontSize: "1.3rem", fill: `var(--icon-color)` }} /> :
              <DarkMode
                className="icon"
                style={{ fontSize: "1.3rem", fill: `var(--icon-color)` }} />
          }
        </div>
      </div>
    </header>
  );
};
export default Header;
