var Actor = require('../models/actor');
var Movie = require('../models/movie');
const mongoose = require('mongoose');

module.exports = {
    getAll: function (req, res) {
        Movie.find({}).populate("actors").exec(function (err, movies) {
            if (err) return res.status(400).json(err);
            res.json(movies);
        });
    },
    createOne: function (req, res) {
        let newMovieDetails = req.body;
        newMovieDetails._id = new mongoose.Types.ObjectId();
        Movie.create(newMovieDetails, function (err, movie) {
            if (err) return res.status(400).json(err);
            res.json(movie);
        });
    },
    getOne: function (req, res) {
        Movie.findOne({ _id: req.params.id })
            .populate('actors')
            .exec(function (err, movie) {
                if (err) return res.status(400).json(err);
                if (!movie) return res.status(404).json();
                res.json(movie);
            });
    },
    updateOne: function (req, res) {
        Movie.findOneAndUpdate({ _id: req.params.id }, req.body, function (err, movie) {
            if (err) return res.status(400).json(err);
            if (!movie) return res.status(404).json();
            res.json(movie);
        });
    },
    deleteOne: function(req, res){
        Movie.findOneAndDelete({_id: req.params.id}, function(err, movie){
            if(err) return res.status(404).json(err);
            res.json(movie);
        });
    },
    removeActor: function(req, res){
        Movie.findOne({_id: req.params.movieID}, function(err, movie){
            if(err) return res.status(500).json(err);
            if(!movie) return res.status(404).json({
                message: "Movie not found"
            });
            Actor.findOne({_id: req.params.actorID}, function(err, actor){
                if(err) return res.status(500).json(err);
                if(!actor) return res.status(404).json({
                    message: "Actor not found"
                });
                console.log(movie.actors);
                for(let i = 0; i < movie.actors.length; i++){
                    if(movie.actors[i]._id.equals(actor._id)){
                        movie.actors.splice(i, 1);
                        break;
                    }
                }
                console.log(movie.actors);

                movie.save(function(err){
                    if(err) return res.status(500).json(err);
                    res.json(movie);
                });
            })
        })
    },
    addActor: function(req, res){
        Movie.findOne({_id: req.params.id}, function(err, movie){
            if(err) return res.status(500).json(err);
            if(!movie) return res.status(404).json({
                message: "Movie not found"
            });

            Actor.findOne({_id: req.body.id}, function(err, actor){
                if(err) return res.status(500).json(err);
                if(!actor) return res.status(404).json({
                    message: "Actor not found"
                });

                movie.actors.push(actor._id);
                movie.save(function(err){
                    if(err) return res.status(500).json(err);
                    res.json(movie);
                });
            })
        })
    },
    getYearMovie: function(req, res){
        Movie.where("year").gte(parseInt(req.params.year1)
        ).lte(parseInt(req.params.year2)).exec(function(err, movies){
            if(err) return res.status(500).json(err);
            res.json(movies);
        });
    }
};