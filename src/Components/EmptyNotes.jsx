import React from 'react'
import './CSS/EmptyNotes.css'

function EmptyNotes({icon,title}) {
  return (
    <div className="emptynotes">
        {icon}
        <p className='emptynotes-title'>{title}</p>
    </div>
  )
}

export default EmptyNotes