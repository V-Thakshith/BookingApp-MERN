const express=require('express');
const cors=require('cors')
const mongoose=require('mongoose')
const User=require('./models/User')
const Booking=require('./models/Booking')
const bcrypt=require('bcryptjs')
const Place=require('./models/Place')
const jwt=require('jsonwebtoken')
const cookieParser=require('cookie-parser');
const multer=require('multer')
const fs=require('fs')
const imageDownloader=require('image-downloader');
const { resolve } = require('path');
const { reject } = require('lodash');
require('dotenv').config()
const app=express();

const jwtsecret="alnaidoqibijvjritubpwnklanc"
const bcryptSalt=bcrypt.genSaltSync(10);

function getUserDataFromToken(req){
    return new Promise((resolve,reject)=>{
        jwt.verify(req.cookies.token,jwtsecret,{},async (err,userData)=>{
            if (err) throw err;
            resolve(userData)
        })
    })
}

app.use(cookieParser())
app.use('/uploads',express.static(__dirname+'/uploads'));
app.use(express.json())
app.use(cors({
    credentials:true,
    origin:'http://192.168.0.227:3000',
}));

mongoose.connect(process.env.MONGO_URL);

app.get('/test',(req,res)=>{
    res.json('test ok');
});

app.post('/register',async (req,res)=>{
    try{
        const {name,email,password}=req.body; 
    const user=await User.create({
        name,
        email,
        password:bcrypt.hashSync(password,bcryptSalt),
    })
    res.json(user)
    }
    catch(e){
        res.status(422).json(e)
    }
})

app.post('/login',async(req,res)=>{
    try{
        const {email,password}=req.body;
        const userDoc=await User.findOne({email})
        if(userDoc){
            const passOK=bcrypt.compareSync(password,userDoc.password)
            if(passOK){
                jwt.sign({email:userDoc,id:userDoc._id},jwtsecret,{},(err,token)=>{
                    if(err) throw err;
                    res.cookie('token',token).json(userDoc)
                })                
            }else{
                res.status(422).json('not okay')
            }
        }
        else{
            res.json('not found');
        }
    }
    catch(e){
        res.status(422).json(e)
    }
})

app.get('/profile',(req,res)=>{
    const {token}=req.cookies
    if(token){
        jwt.verify(token,jwtsecret,{},async (err,userData)=>{
            if(err) throw err;
            const {name,email,id}=await User.findById(userData.id)
            res.json({name,email,id})
        })
    }
    else{
        res.json(null)
    }
})

app.post('/logout',(req,res)=>{
    res.cookie('token','').json(true)
})

app.post('/upload-by-link',async (req,res)=>{
    const {link}=req.body
    const newName="photo"+Date.now()+'.jpg'
    await imageDownloader.image({
        url:link,
        dest:__dirname+'/uploads/'+newName
    })
    res.json(newName)
})

const photosMiddleware=multer({dest:'uploads/'})

app.post('/upload',photosMiddleware.array('photos',100),(req,res)=>{
    const uploadedFiles=[]
    for(let i=0;i<req.files.length;i++){
        const {path,originalname}=req.files[i]
        const parts=originalname.split('.')
        const ext=parts[parts.length-1];
        const newPath=path+'.'+ext;
        fs.renameSync(path,newPath);
        uploadedFiles.push(newPath.replace('uploads',''))
        console.log(uploadedFiles)

    }
    res.json(uploadedFiles)
})

app.post('/places',async(req,res)=>{
    const {token}=req.cookies;
    const {title,address,addedPhotos,photoLink,description,perks,extraInfo,checkIn,checkOut,maxGuests,price}=req.body;
    jwt.verify(token,jwtsecret,{},async (err,userData)=>{
        if(err) throw err;
    const placeDoc=await Place.create({
        owner:userData.id,
        title,address,photos:addedPhotos,photoLink,description,perks,extraInfo,checkIn,checkOut,maxGuests,price
    })  
    res.json(placeDoc)
    })
})

app.get('/user-places',async(req,res)=>{
    const {token}=req.cookies;
    jwt.verify(token,jwtsecret,{},async (err,userData)=>{
        const {id}=userData;
        res.json(await Place.find({owner:id}))
    })
})

app.get('/places/:id',async(req,res)=>{
    const {id}=req.params
    res.json((await Place.findById(id)))
})

app.put('/places',async(req,res)=>{
    const {token}=req.cookies;
    const {id,title,address,addedPhotos,photoLink,description,perks,extraInfo,checkIn,checkOut,maxGuests,price}=req.body;
    
    jwt.verify(token,jwtsecret,{},async (err,userData)=>{
        const placeDoc=await Place.findById(id);
        if(userData.id===placeDoc.owner.toString()){
            placeDoc.set({
                title,address,photos:addedPhotos,description,
                perks,extraInfo,checkIn,checkOut,maxGuests,price,
            })
            placeDoc.save();
            res.json('ok')
        }
    })
})

app.get('/places',async(req,res)=>{
    res.json(await Place.find())
})

app.post('/bookings',async(req,res)=>{
    const userData=await getUserDataFromToken(req)
    const {place,checkIn,checkOut,numberOfGuests,name,phone,price}=req.body
    Booking.create({
        place,checkIn,checkOut,numberOfGuests,name,phone,price,user:userData.id
    }).then((doc)=>{
        res.json(doc)
    }).catch((err)=>{
        throw err
    })

})

app.get('/bookings',async (req,res)=>{
    const userData=await getUserDataFromToken(req)
    res.json(await Booking.find({user:userData.id}).populate('place'))
})

app.listen(4000)