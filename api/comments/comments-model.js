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
// yorumların tamamını kimin neye göre yazdığını getiriyor.
async function create(user_id, post_id, comment) {
  const [commendId] = await db("comments").insert({
    user_id: user_id,
    post_id: post_id,
    comment: comment,
  });
  return commendId;
}

//textid ye göre yorum güncellemesi,(command id)
async function update(textId, updatedFields) {
  await db("comments").where({ comment_id: textId }).update(updatedFields);
  // güncellenenler
  const updatedComment = await db("comments").where({ comment_id: textId }).first();
  return updatedComment;
}
//silnenler

async function deleteComment(textId) {
  const deletedComment = await db("comments as c").where("c.comment_id", textId).delete();
  return deletedComment;
}


module.exports = { getById, getByPostId, create, deleteComment, update};