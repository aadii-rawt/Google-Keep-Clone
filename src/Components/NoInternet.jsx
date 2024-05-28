import React from 'react'
import noInternetImage from '../assets/no-internet.png'
import './CSS/noInternet.css'

function NoInternet() {
    function RefreshPage() {
        window.location.reload()
    }

    return (
        <div className='noInternet-container'>
            <div className="noInternet-box">
                <img src={noInternetImage} alt="no internet img" className='noInternet-img' />
                <h1>Whooops!</h1>
                <p>No Internet connection found check your connection or try again</p>
                <button className='tryagain-btn'
                    onClick={RefreshPage}>Try Again</button>
            </div>
        </div>
    )
}

export default NoInternet