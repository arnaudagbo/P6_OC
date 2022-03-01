const Sauce = require ('../models/Sauce');
const User = require ('../models/User');
const fs = require('fs');

/**
 * CRÉER UNE SAUCE
 */
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: []
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
    .catch(error => res.status(400).json({ error }));
};

/**
 * MODIFIER UNE SAUCE
 */
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
  {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };
Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
  .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
  .catch(error => res.status(400).json({ error }));
};

/**
 * SUPPRIMER UNE SAUCE
 */
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
  .then(sauce => {
    const filename = sauce.imageUrl.split('/images/')[1];
    fs.unlink(`images/${filename}`, () => {
      Sauce.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce supprimée!'}))
        .catch(error => res.status(400).json({ error }));
    });
  })
  .catch(error => res.status(500).json({ error }));
};

/**
 * AFFICHER UNE SEULE SAUCE
 */
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

/**
 * AFFICHER TOUTES LES SAUCES
 */
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
};

/**
 *  LIKER OU DISLIKER UNE SAUCE
 */
exports.likeSauce = (req, res, next) => {
  let message = '';
  Sauce.findOne({ _id: req.params.id })
  .then(sauce => { 
    if (req.body.like == 1 && !sauce.usersLiked.includes(req.body.userId))
      {
        Sauce.updateOne(
          { _id: req.params.id}, 
          {
            $inc: {likes: 1},
            $push: {usersLiked: req.body.userId},
            _id: req.params.id
          } )
          .then(() => res.status(201).json({ message: 'Sauce Likée'}))
          .catch(error => res)
      }
    // Cas ou l'utilisateur dislike une sauce
    else if (req.body.like == -1 && !sauce.usersDisliked.includes(req.body.userId)) 
    {
      Sauce.updateOne(
        { _id: req.params.id}, 
        {
          $inc: {dislikes: 1},
          $push: {usersDisliked: req.body.userId},
          _id: req.params.id
        } )
        .then(() => res.status(201).json({ message: 'Sauce Dislikée'}))
        .catch(error => res)
    }
    // check si l'user est inclus dans un des deux tableaux pour faire une double condition   
    // else if (req.body.like == 0)
    else if (req.body.like == 0)
    {
      if (sauce.usersLiked.includes(req.body.userId))
        {
          Sauce.updateOne(
          { _id: req.params.id}, 
          {
            $inc: {likes: -1},
            $pull: {usersLiked: req.body.userId},
            _id: req.params.id
          } )
          .then(() => res.status(201).json({ message: 'Annulation like'}))
          .catch(error => res)
        }
      else
        {
            Sauce.updateOne(
          { _id: req.params.id}, 
          {
            $inc: {dislikes: -1},
            $pull: {usersDisliked: req.body.userId},
            _id: req.params.id
          } )
          .then(() => res.status(201).json({ message: 'Annulation dislike'}))
          .catch(error => res)
        }
    }
  });}