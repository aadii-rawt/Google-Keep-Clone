import React from "react";
import './CSS/SideBar.css'
import { LightbulbOutlined } from "@mui/icons-material";
import { ArchiveOutlined } from "@mui/icons-material";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { Link, NavLink } from "react-router-dom";


function SideBar({menu}){
    return (
        <div className={ menu ? "sidebar menu-open" : "sidebar"}>
            <div className="sidebar-links navigation ">
                <ul>
                    <li>
                        <NavLink to='/'>
                        <span className="nav-icons">{<LightbulbOutlined style={{ fill: `var(--icon-color)`, }}/>}</span>
                        <span className="title">Notes</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/archive">
                        <span className="nav-icons">{<ArchiveOutlined style={{ fill: `var(--icon-color)`, }}/>}</span>
                        <span className="title">Archive</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/trash">
                        <span className="nav-icons">{<DeleteOutlineOutlinedIcon style={{ fill: `var(--icon-color)`, }}/>}</span>
                        <span className="title">Trash</span>
                        </NavLink>
                    </li>
                </ul>
            </div>
            <div className="name-title">
                <p> © Aditya Rawat</p>
            </div>
        </div>
    )
}

export default SideBar