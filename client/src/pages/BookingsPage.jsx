import axios from "axios";
import { differenceInCalendarDays, format } from "date-fns";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import AccountNav from "../AccountNav";
import PlaceImg from "../PlaceImg";
import BookingDates from "../BookingDates";

export default function BookingsPage(){
    const [bookings,setBookings]=useState([])
    useEffect(()=>{
        axios.get('/bookings').then(response=>{
            setBookings(response.data)
            console.log(bookings)
        })
    },[])
    return(
       <div>
         <AccountNav/>  
         <div className="mt-6">
            
            {bookings?.length>0 && bookings.map(booking=>(
                <Link to={`/account/bookings/${booking._id}`} className="flex gap-4 bg-gray-200 rounded-2xl overflow-hidden">
                    <div className="w-40">
                        <PlaceImg place={booking.place} />
                    </div>
                        <BookingDates booking={booking} className='mb-2 mt-4 text-gray-500'/>
                </Link> 
            ))}
         </div>
       </div> 
    )
}