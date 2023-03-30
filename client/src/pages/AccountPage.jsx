import { UserContext } from "../UserContext"
import { useContext, useState } from "react"
import {Navigate,Link, useParams} from "react-router-dom"
import axios from "axios";
import PlacesPage from "./PlacesPages";
import AccountNav from "../AccountNav";

export default function AccountPage(){
    const [redirect,setRedirect]=useState(null)
    const {subpage}=useParams();
    const {ready,user,setUser}=useContext(UserContext);
    
    async function logout(){
        await axios.post('/logout')
        setRedirect('/')
        setUser(null)
    }

    if(!ready){
        return(
            <div>Loading...</div>
        )
    }
    
    if(ready && !user && !redirect){
        return <Navigate to={'/login'}/>
    }

     

    if(redirect){
        return <Navigate to={redirect}/>
    }

    return(
        <div>
            <AccountNav/>
            {subpage === undefined && (
                <div className="text-center max-w-lg mx-auto">
                    Logged in as {user.name} ({user.email})<br/>
                    <button className="primary max-w-sm mt-2" onClick={logout}>Log out</button>
                </div>
            )}
            {subpage === 'places' && (
                <PlacesPage/>
            )}
        </div>
    )
}