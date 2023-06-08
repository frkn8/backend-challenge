const favModel = require("./favs-model");

const checkFavsByPostId = async (req, res, next) => {
  try {
    const id = req.params.id;
    const favUsers = await favModel.getByPostId(id);
    if (!favUsers || favUsers.length <= 0) {
      res
        .status(400)
        .json({ message: `No user found who favd post id: ${id}.` });
    } else {
      req.favUsers = favUsers;
      next();
    }
  } catch (error) {
    next(error);
  }
};

//checks if the post favorited before
const isFavoritedBefore = async (req, res, next) => {
  const user_id = req.params.user_id;
  const post_id = req.params.post_id;
  const favPosts = await favModel.getByPostId(post_id);
  const isFavorited = favPosts.filter((post) => post.user_id == user_id);

  if (isFavorited.length > 0) {
    res
      .status(400)
      .json({ message: `post with the id: ${post_id} already favd!...` });
  } else {
    next();
  }
};

//checks if the post favorited before
const isPostInFavorites = async (req, res, next) => {
  const user_id = req.params.user_id;
  const post_id = req.params.post_id;
  const favPosts = await favModel.getByPostId(post_id);
  const isFavorited = favPosts.filter((post) => post.user_id == user_id);

  if (isFavorited.length > 0) {
    next();
  } else {
    res
      .status(400)
      .json({ message: `post with the id: ${post_id} not found in favs.` });
  }
};



module.exports = {
  checkFavsByPostId,
  isFavoritedBefore,
  isPostInFavorites,
};