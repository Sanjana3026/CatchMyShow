import Booking from "../models/Booking.js";
import { clerkClient } from "@clerk/express";
import Movie from "../models/Movie.js";

//API contoller function to get user bookings
export const getUserBookings = async (req, res) => {
    try{
        const user = req.auth.userId;
        const bookings = await Booking.find({user}).populate({
            path: 'show',
            populate: {path: 'movie'}
        }).sort({createdAt: -1});

        res.json({success: true, bookings});
        
    }catch(err){
        console.log(err);
        res.json({success: false, message: err.message});
    }
}

//API Controller Function to Update Favorite Movie in Clerk User Metadata
export const updateFavorite = async (req, res) => {
    try{
        const {movieId} = req.body;
        const userId = req.auth.userId;

        const user = await clerkClient.users.getUser(userId);

        if(!user.privateMetadata.favorites) {
            user.privateMetadata.favorites = [];
        }

        if(user.privateMetadata.favorites.includes(movieId)){
            user.privateMetadata.favorites.push(movieId);
        }else{
            user.privateMetadata.favorites = user.privateMetadata.favorites.filter(item => item !== movieId);
        }

        await clerkClient.users.updateUserMetadata(userId, {
            privateMetadata: user.privateMetadata
        });

        res.json({success: true, message: "Favorite movie updated successfully"});
    }catch(err){
        console.log(err);
        res.json({success: false, message: err.message});
    }
}

// API Controller Function to Get Favorite Movies from Clerk User Metadata
export const getFavorites = async (req, res) => {
    try{
        const user = await clerkClient.users.getUser(req.auth().userId);
        const favorites = user.privateMetadata.favorites;

        //get movies from db
        const movies = await Movie.find({_id: {$in: favorites}});

        res.json({success: true, movies});
    }catch(err){
        console.log(err);
        res.json({success: false, message: err.message});
    }
}