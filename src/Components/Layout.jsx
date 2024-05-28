import React ,{useState}from "react";
import '../index.css'
import Header from "./Header";
import SideBar from "./SideBar";
import { Outlet } from "react-router-dom";

const Layout = () =>  {
    const [menu,setMenu] = useState(false)
   
    return (
      <>
        <Header setMenu={setMenu} />
        <div className="container">
        <SideBar menu={menu}/>
        <Outlet />
        </div>
      </>
    )
}

export default Layout