const mongoose = require('mongoose');
const Actor = require('../models/actor');
const Movie = require('../models/movie');

module.exports = {
    getAll: function (req, res) {
        Actor.find({}).populate("movies").exec(function (err, actors) {
            if (err) {
                return res.status(404).json(err);
            } else {
                res.json(actors);
            }
        });
    },
    createOne: function (req, res) {
        let newActorDetails = req.body;
        newActorDetails._id = new mongoose.Types.ObjectId();
        Actor.create(newActorDetails, function(err, actor){
            if(err) return res.status(400).json(err);
            res.json(actor)
        })
    },
    getOne: function (req, res) {
        Actor.findOne({ _id: req.params.id })
            .populate('movies')
            .exec(function (err, actor) {
                if (err) return res.status(400).json(err);
                if (!actor) return res.status(404).json();
                res.json(actor);
            });
    },
    updateOne: function (req, res) {
        Actor.findOneAndUpdate({ _id: req.params.id }, req.body, function (err, actor) {
            if (err) return res.status(400).json(err);
            if (!actor) return res.status(404).json();
            res.json(actor);
        });
    },
    deleteOne: function (req, res) {
        Actor.findOneAndRemove({ _id: req.params.id }, function (err) {
            if (err) return res.status(400).json(err);
            res.json({
                message: "Actor successfully deleted"
            });
        });
    },
    addMovie: function (req, res) {
        Actor.findOne({ _id: req.params.id }, function (err, actor) {
            if (err) return res.status(400).json(err);
            if (!actor) return res.status(404).json();
            Movie.findOne({ _id: req.body.id }, function (err, movie) {
                if (err) return res.status(400).json(err);
                if (!movie) return res.status(404).json();
                actor.movies.push(movie._id);
                actor.save(function (err) {
                    if (err) return res.status(500).json(err);
                    res.json(actor);
                });
            })
        });
    },
    deleteActorAndMovies: function(req, res){
        Actor.findByIdAndDelete({_id: req.params.id}, function(err, actor){
            if(err) return res.status(404).json(err);
            for(let i = 0; i < actor.movies.length; i++){
                Movie.findByIdAndDelete({_id: actor.movies[i]}, function(err, movie){
                    if(err) return res.status(400).json(err);
                });
            }
            res.json(actor);
        });
    },
    removeMovie: function(req, res){
        Actor.findOne({_id: req.params.actorID}, function(err, actor){
            if(err) return res.status(500).json(err);
            Movie.findOne({_id: req.params.movieID}, function(err, movie){
                if(err) return res.status(500).json(err);
                if(!movie) return res.status(404).json({
                    message: "Movie not found"
                });

                for(let i = 0; i < actor.movies.length; i++){
                    if(actor.movies[i].equals(movie._id)){
                        actor.movies.splice(i, 1);
                        break;
                    }
                }

                actor.save(function(err){
                    if(err) return res.status(500).json(err);
                    res.json(actor);
                });
            })
        });
    }
};