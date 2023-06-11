const router = require("express").Router();
const commentMdl = require("./comments-model");
const commentMw = require("./comments-middleware");
// yorum gönderdiğimiz yer 
router.post(
  "/:user_id/:post_id",
  commentMw.checkPayload,
  async (req, res, next) => {
    try {
      const userId = req.params.user_id;
      const postId = req.params.post_id;
      const added = await commentMdl.create(
        userId,
        postId,
        req.body.comment
      );
      if (added) {
        res.status(200).json({ message: "Comment submitted successfully." });
      } else {
        res.status(400).json({ message: "Cannot submit comment." });
      }
    } catch (error) {
      next(error);
    }
  }
);
// yorumun id sine göre dülteiyor.
router.put("/:comment_id", async (req, res, next) => {
  try {
    const commentId = req.params.comment_id;
    const updatedContent = req.body.comment;

    const existingComment = await commentMdl.getById(commentId);
    if (!existingComment) {
      return res.status(404).json({ message: "Yorum bulunamadı." });
    }

    // Yorum güncellenir
    const updatedComment = await commentMdl.update(commentId, {
      comment: updatedContent,
    });

    res.status(200).json({ message: "Yorum güncellendi.", updatedComment });
  } catch (error) {
    next(error);
  }
});
//oluşturulan yorumu silme.
router.delete("/:comment_id", async (req, res, next) => {
  try {
    const commentId = req.params.comment_id;
    const deletedComment = await commentMdl.deleteComment(commentId);
    if (deletedComment) {
      res.status(200).json({ message: "Comment deleted successfully." });
    } else {
      res.status(400).json({ message: "Cannot delete comment." });
    }
  } catch (error) {
    next(error);
  }
});


module.exports = router;