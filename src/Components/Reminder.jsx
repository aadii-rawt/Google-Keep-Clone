import React, { useState } from 'react'
import { createPortal } from 'react-dom'

function Reminder({ isReminder, setIsReminder, note, onsetReminder, onDeleteReminder }) {
    const [date, setDate] = useState('')
    const [time, setTime] = useState('')

    if ("Notification" in window) {
        Notification.requestPermission().then((permission) => {
            if (Notification.permission !== "granted") {
                alert("Please allow Notification access")
            }
        })
    }
    function handleSetReminder(e) {
        e.preventDefault()
        if (date || time) {
            const now = new Date().getTime();
            const reminderTime = date + " " + time;
            const checkValidDate = new Date(date + " " + time).getTime();
            const timeDiff = checkValidDate - now;
            if (timeDiff > 0) {
                onsetReminder(note.id, reminderTime)
                setIsReminder(!isReminder)
            } else {
                alert("Time is in past");
            }
        }else{
            alert("Please enter Date or Time")
        }
    }
    const reminderBox = {
        padding: "20px"
    }
    const label = {
        marginBlock: "10px"
    }
    const btn = {
        all: "unset",
        padding: "5px 15px",
        background: "var(--btn-bg)",
        borderRadius: "5px",
        cursor: "pointer"
    }
    return (
        createPortal(
            <div className='model-container' onClick={() => setIsReminder(false)}>
                <div className="model-box" style={reminderBox} onClick={(e) => e.stopPropagation()}>
                    <form action="" >
                        <label htmlFor="date" style={label}>Date</label>
                        <input type="date" value={date} id="date" onChange={(e) => setDate(e.target.value)} />
                        <label htmlFor="time">Time</label>
                        <input type="time" value={time} id="time" onChange={(e) => setTime(e.target.value)} />
                        <button style={btn} onClick={(e) => handleSetReminder(e)}>Add</button>
                    </form>
                </div>
            </div>,
            document.getElementById("portal")
        )
    )
}
export default Reminder
