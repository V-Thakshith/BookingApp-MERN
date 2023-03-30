import { useParams} from "react-router-dom"
import {useState,useEffect } from 'react'
import AddressLink from "../AddressLink";
import axios from "axios";
import PlaceGallery from "../PlaceGallery";
import BookingDates from "../BookingDates";

export default function BookingPage(){
    const {id}=useParams();
    const [booking,setBooking]=useState(null)
    useEffect(()=>{
        axios.get('/bookings').then(response=>{
            const foundBooking=response.data.find(({_id})=>_id===id)
            if(foundBooking){
                setBooking(foundBooking)
            }
        })
    },[id])

    if(!booking){
        return ''
    }

    return(
        <div className="my-8"> 
             <h1 className="text-3xl">{booking.place.title}</h1>
             <AddressLink className="my-2 block">{booking.place.address}</AddressLink>
            <div className="bg-gray-200 p-6 mb-6 rounded-2xl flex justify-between">
                <div>
                <h2 className="text-xl mb-2"> Your Booking Information</h2>
                <BookingDates booking={booking}/>
                </div>  
            </div>
            <PlaceGallery place={booking.place}/>
            
           
        </div>
    )
}