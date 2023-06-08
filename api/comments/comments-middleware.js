const commentMdl = require("./comments-model");

const checkCommentsByPostId = async (req, res, next) => {
  try {
    const id = req.params.id;
    const comments = await commentMdl.getByPostId(id);
    if (!comments || comments.length <= 0) {
      res
        .status(400)
        .json({ message: `No comments found for this post id: ${id}.` });
    } else {
      req.comments = comments;
      next();
    }
  } catch (error) {
    next(error);
  }
};

const checkPayload = async (req, res, next) => {
  try {
    const userId = req.params.user_id;
    const postId = req.params.post_id;
    const { comment } = req.body;
    if (!userId || !postId || !comment || comment.trim().length > 280) {
      res
        .status(400)
        .json({ message: `Can not create comment for post id: ${userId}.` });
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { checkCommentsByPostId, checkPayload };