const router = require("express").Router();
const favModel = require("./favs-model");
const favMw = require("./favs-middleware");
const userMdl = require("../users/users-model");
const postModel = require("../posts/posts-model");

// adds post to favs// 
router.post(
  "/:user_id/:post_id",
  favMw.isFavoritedBefore,
  async (req, res, next) => {
    try {
      const userId = req.params.user_id;
      const postId = req.params.post_id;

      // Kullanıcı veya post bulunamazsa hata mesajı döndürülür
      const userExists = await userMdl.getById(userId);
      const postExists = await postModel.getById(postId);
      if (!userExists) {
        return res.status(404).json({ message: "Kullanıcı bulunamadı." });
      }
      if (!postExists) {
        return res.status(404).json({ message: "post bulunamadı." });
      }

      const favoritedpost = await favModel.create(userId, postId);
      res
        .status(200)
        .json({ message: "post beğenilere eklendi.", favoritedpost });
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/:user_id/:post_id",
  favMw.isPostInFavorites,
  async (req, res, next) => {
    try {
      const userId = req.params.user_id;
      const postId = req.params.post_id;
      if (userId && postId) {
        await favModel.remove(userId, postId);
        res
          .status(200)
          .json({ message: `post with id: ${postId} removed from favs.` });
      }
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
