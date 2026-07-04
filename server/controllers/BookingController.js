import Show from "../models/Shows.js";
import Booking from "../models/Booking.js";

// function to check availability of selected seats 

const checkSeatsAvailability =  async(showId , selectedSeats) =>{
    try{
        const showData = await Show.findById(showId)
        if(!showData) return false;

        const occupiedSeats = showData.occupiedSeats;

        const isAnySeatTaken = selectedSeats.some(seat => occupiedSeats[seat]);

        return !isAnySeatTaken;

    }catch(err){
        console.log(err.message);
        return false
    }
}

export const createBooking = async(req,res) =>{
    try{
        const {userId} = req.auth();
        const {showId, selectedSeats} = req.body;
        const {origin} = req.headers;

        // check if seats are availabe for show 
        const isAvailable = await checkSeatsAvailability(showId , selectedSeats);

        if(!isAvailable){
            return res.json({success:false , message:"Selected seats are already booked. Please select different seats."})
        }

        //get show deatils

        const showData = await Show.findById(showId).populate("movie"); 

        //create new booking

        const booking = await Booking.create({
            user: userId,
            show: showId,
            amount: showData.showPrice * selectedSeats.length,
            bookedSeats: selectedSeats
        })

        selectedSeats.map((seat) =>{
            showData.occupiedSeats[seat] = userId;
        })

        showData.markModified("occupiedSeats");
        
        await showData.save();

        //payment gateway - stripe

        res.json({success:true , message:"Booking created successfully" })

    }catch(err){
        console.log(err.message);
        res.json({success:false , message:err.message})
    }
}

export const getOccupiedSeats = async(req,res) =>{
    try{
        const {showId} = req.params;
        const showData = await Show.findById(showId);

        const occupiedSeats = Object.keys(showData.occupiedSeats);

        res.json({success:true , occupiedSeats })

    }catch(err){
        console.log(err.message);
        res.json({success:false , message:err.message})
    }
}