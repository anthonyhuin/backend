const Sauce = require("../models/Sauce");
const fs = require("file-system");

exports.allSauces = (req, res) => {
  Sauce.find()
    .then((sauces) => {
      res.status(200).json(sauces);
    })
    .catch((error) => {
      res.status(404).json({ error });
    });
};

exports.oneSauce = (req, res) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      res.status(200).json(sauce);
    })
    .catch((error) => {
      res.status(404).json({ error });
    });
};

exports.addSauce = async (req, res) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
  });
  try {
    const savedSauce = await sauce.save();
    res.send({ message: "Sauce created !" });
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.deleteSauce = async (req, res) => {
  try {
    let sauce = await Sauce.findOne({ _id: req.params.id });
    const fileName = sauce.imageUrl.split("/images/")[1];
    fs.unlink(`images/${fileName}`, () => {
      Sauce.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: "The sauce has been removed" }))
        .catch((error) => res.status(400).json({ error }));
    });
  } catch (error) {
    res.status(400).json({ error });
  }
};

exports.modifySauce = async (req, res) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
      }
    : { ...req.body };

  try {
    const sauce = await Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id });
    res.status(200).json({ message: "The sauce has been modified" });
  } catch (error) {
    res.status(400).json({ error });
  }
};
exports.likeSauce = (req, res) => {
  const userId = req.body.userId;
  const sauceId = req.params.id;
  const like = req.body.like;

  switch (like) {
    case 1:
      Sauce.updateOne(
        { _id: sauceId },
        {
          $inc: { likes: 1 },
          $push: { usersLiked: userId },
        }
      )
        .then(() => res.status(200).json({ message: "Like added to sauce" }))
        .catch((error) => res.status(400).json({ error }));
      break;
    case 0:
      Sauce.findOne({
        _id: sauceId,
      })
        .then((sauce) => {
          if (sauce.usersLiked.includes(userId)) {
            Sauce.updateOne(
              { _id: sauceId },
              {
                $inc: { likes: -1 },
                $pull: { usersLiked: userId },
              }
            )
              .then(() => res.status(200).json({ message: "Like has been removed" }))
              .catch((error) => res.status(400).json({ error }));
          } else if (sauce.usersDisliked.includes(userId)) {
            Sauce.updateOne(
              { _id: sauceId },
              {
                $inc: { dislikes: -1 },
                $pull: { usersDisliked: userId },
              }
            )
              .then(() => res.status(200).json({ message: "Dislike has been removed" }))
              .catch((error) => res.status(400).json({ error }));
          }
        })
        .catch((error) => res.status(400).json({ error }));
      break;
    case -1:
      Sauce.updateOne(
        { _id: sauceId },
        {
          $inc: { dislikes: 1 },
          $push: { usersDisliked: userId },
        }
      )
        .then(() => res.status(200).json({ message: "Dislike added to sauce" }))
        .catch((error) => res.status(400).json({ error }));
      break;
  }
};
