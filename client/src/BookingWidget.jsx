import axios from 'axios'
import {differenceInCalendarDays} from 'date-fns'
import { useContext, useEffect, useState } from "react"
import { Navigate } from 'react-router-dom'
import { UserContext } from './UserContext'

export default function BookingWidget({place}){
    const [checkIn,setCheckIn]=useState('')
    const [checkOut,setCheckOut]=useState('')
    const [numberOfGuests,setNumberOfGuests]=useState(1)
    const [name,setName]=useState('')
    const [phone,setPhone]=useState('')
    const [redirect,setRedirect]=useState('')
    const {user}=useContext(UserContext)

    useEffect(()=>{
        if(user){
            setName(user.name)
        }
    },[user])

    let numberOfDays=0
    if(checkIn && checkOut){
        numberOfDays=differenceInCalendarDays(new Date(checkOut),new Date(checkIn))
    }

    async function bookThisPLace(){
        const data={checkIn,checkOut,numberOfGuests,name,phone,place:place._id,price:numberOfDays*place.price}
        const response=await axios.post('/bookings',data)
        const bookingId=response.data._id;
        setRedirect(`/account/bookings/${bookingId}`);
    }
    
    if(redirect){
        return <Navigate to={redirect}></Navigate>
    }

    return(
        <div className="bg-white shadow p-4 rounded-2xl">
                    <div className="text-2xl text-center p-2">
                    Price: ${place.price} /per night
                    </div>
                   <div className="border rounded-2xl ">
                    <div className="flex">
                    <div className="px-4 py-3 border-t"> 
                        <label>Check in:</label>
                        <input type="date" value={checkIn} onChange={ev=>setCheckIn(ev.target.value)} ></input>
                    </div>
                    <div className="px-4 py-3 border-t">
                        <label>Check out:</label>
                        <input type="date" value={checkOut} onChange={ev=>setCheckOut(ev.target.value)} ></input>
                    </div>
                    </div>
                    <div className="px-4 py-3 border-t">
                        <label>Number of guests:</label>
                        <input type="number" value={numberOfGuests} onChange={ev=>setNumberOfGuests(ev.target.value)} ></input>
                    </div> {
                        numberOfDays>0 && (
                            <div className="px-4 py-3 border-t">
                                <label>Your full name: </label>
                                <input type="text" placeholder='John Doe' value={name} onChange={ev=>setName(ev.target.value)}></input>
                                <label>Your Phone number: </label>
                                <input type="tel" value={phone} onChange={ev=>setPhone(ev.target.value)}></input>
                                </div>
                        )
                    }
                   </div>
                    
                    <button onClick={bookThisPLace} className="primary mt-4"> Book this place
                        {
                            numberOfDays>0 && (
                                <span> ${numberOfDays*place.price}</span>
                            )
                        }
                    </button>
                </div>
    )
}