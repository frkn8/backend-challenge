const router = require("express").Router();
const postsModel = require("./posts-model");
const postsMw = require("./posts-middleware");
const favsMw = require("../favs/favs-middleware");
const usersMw = require("../users/users-middleware");
const commentsMw = require("../comments/comments-middleware");


// brings all posts for feed
router.get("/", async (req, res, next) => {
  try {
    const posts = await postsModel.getAll();
    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
});

// brings all posts of user with id
router.get("/:id", usersMw.isIdExist, async (req, res, next) => {
  try {
    const id = req.params.id;
    const userposts = await postsModel.getBy({ user_id: id }); // Kullanıcının postlerini alın
    res.status(200).json(userposts);
  } catch (error) {
    next(error);
  }
});

//creates new post
router.post("/", postsMw.checkPayload, async (req, res, next) => {
  try {
    const { text, user_id } = req.body;
    const newpost = { user_id: user_id, text: text };
    const insertedpost = await postsModel.create(newpost);
    if (!insertedpost) {
      next(error);
    } else {
      res
        .status(200)
        .json({ message: "New post successfully submitted.", insertedpost });
    }
  } catch (error) {
    next(error);
  }
});

//updates post

router.put("/:id", postsMw.checkPayload, async (req, res, next) => {
  try {
  const id = req.params.id;
  const { text, user_id } = req.body;
  const updatedpost = await postsModel.update(id, { text, user_id });
  if (!updatedpost) {
  next(error);
  } else {
  res.status(200).json({ message: "Edited post successfully submitted.", updatedpost });
  }
  } catch (error) {
  next(error);
  }
  });

//deletes post

router.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const deletedPost = await postsModel.remove(id);
    if (!deletedPost) {
      res.status(400).json({ message: `Post with id: ${id} is not found.` });
    } else {
      res.status(200).json({ message: "Post removed successfully." });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;