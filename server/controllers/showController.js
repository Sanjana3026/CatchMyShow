import axios from "axios";
import Movie from "../models/Movie.js";
import Show from "../models/Shows.js";

//API to get now-playing movies from TMDB API
export const getNowPlayingMovies =  async (req,res) =>{
    try{
        const {data } = await axios.get('https://api.themoviedb.org/3/movie/now_playing' ,  {
            headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}`
            }
        })

        const movies = data.results;
        res.json({success:true , movies : movies})
    } catch(err){
        console.log(err);
        res.json({success:false, message: err.message})
    }
}

//API to add new shows to the db

export const addShow = async (req,res) => {
    try{
        const {movieId , showsInput , showPrice} = req.body;

        let movie = await Movie.findById(movieId);

        if(!movie){
            //fetch movie details from TMDB API
            const [movieDetailsResponse, movieCreditRespose] = await Promise.all([
                axios.get(`https://api.themoviedb.org/3/movie/${movieId}` ,{
                headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` }}) , 

                axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits` ,{
                headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` }} )
            ]);

            const movieApiData = movieDetailsResponse.data;
            const movieCreditData = movieCreditRespose.data;

            const movieDetails = {
                _id : movieId, 
                title : movieApiData.title,
                overview : movieApiData.overview,
                poster_path : movieApiData.poster_path,
                backdrop_path : movieApiData.backdrop_path,
                genres : movieApiData.genres.map(genre => genre.name),
                casts : movieCreditData.cast.map(cast => cast.name),
                release_date : movieApiData.release_date,
                original_language : movieApiData.original_language,
                tag_line : movieApiData.tagline || " ",
                vote_average : movieApiData.vote_average,
                runtime : movieApiData.runtime
            }

            // Add movie to DB
            movie = await Movie.create(movieDetails);
        }

        const showsToCreate = [];
        showsInput.forEach((show) => {
            const showDate = show.date;
            show.time.forEach((time )=> {
                const dateTimeString = `${showDate}T${time}`;
                showsToCreate.push({
                    movie: movie._id,
                    showDateTime : new Date(dateTimeString) ,
                    showPrice : showPrice,
                    occupiedSeats : {}
                })
            })
        });

        if(showsToCreate.length > 0) {
            await Show.insertMany(showsToCreate);
        }

        res.json({success:true, message: "Shows added successfully"})
    }catch(err){
         console.log(err);
        res.json({success:false, message: err.message})
    }
}

// API to get all shows from the database
export const getShows = async (req, res) => {
  try {
    const shows = await Show.find({ showDateTime: { $gte: new Date() } })
      .populate("movie")
      .sort({ showDateTime: 1 });

    // filter unique shows
    const uniqueShows = new Set(shows.map((show) => show.movie));

    res.json({ success: true, shows: Array.from(uniqueShows) });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

//API to get a show  from the db

export const getShow = async (req,res) => {
    try{
        const {movieId} = req.params;
        const shows = await Show.find({movie:movieId , showDateTime:{$gte:new Date()}});

        const movie = await Movie.findById(movieId);
        const dateTime = {};

        shows.forEach((show) => {
            const date = show.showDateTime.toISOString().split("T")[0];

            if(!dateTime[date]){
                dateTime[date] = [];
            }
            dateTime[date].push({time : show.showDateTime , showId: show._id});
        })
        res.json({success:true , movie , dateTime});
    }catch(err){
        res.json({success:false , message: err.message})
    }
}
