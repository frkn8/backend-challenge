const db = require("../../data/db-config");


async function getById(id) {
  const commentsOfUser = await db("comments as c")
    .where("c.user_id", id)
    .select("c.*");

  return commentsOfUser;
}

async function getByPostId(id) {
  const commentsForPost = await db("comments as c")
    .where("c.post_id", id)
    .select("c.*");

  return commentsForPost;
}

async function create(user_id, post_id, comment) {
  const [commendId] = await db("comments").insert({
    user_id: user_id,
    post_id: post_id,
    comment: comment,
  });
  return commendId;
}


async function update(textId, updatedFields) {
  await db("comments").where({ comment_id: textId }).update(updatedFields);
  
  const updatedComment = await db("comments").where({ comment_id: textId }).first();
  return updatedComment;
}


async function deleteComment(textId) {
  const deletedComment = await db("comments as c").where("c.comment_id", textId).delete();
  return deletedComment;
}


module.exports = { getById, getByPostId, create, deleteComment, update};