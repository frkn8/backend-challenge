const db = require("../../data/db-config");

//brings favorited post with fav_id
async function getByFavId(user_id, post_id) {
  const favedPost = await db("favs").where({user_id :user_id ,fav_id: fav_id}).first();
  return favedPost;
}

//gets users liked post 
async function getById(user_id) {
  const favPosts = await db("favs as f")
    .join("posts as p", "f.post_id", "=", "p.post_id")
    .where("f.user_id", user_id)
    .select("p.*");

  return favPosts;
}

//gets users who favorited the tweet (returns array with users)
async function getByPostId(post_id) {
  const favoritedByUsers = await db("favs as f")
    .join("users as u", "f.user_id", "=", "u.user_id")
    .where("f.post_id", post_id)
    .select("u.username", "u.user_id")
  

  return favoritedByUsers;
}

async function create(user_id, post_id) {
  await db("favs").insert({

    user_id: user_id,
    post_id: post_id,
  });
  const favoritedPost = await getByFavId(user_id, post_id);
  return favoritedPost;
}

function remove(user_id, post_id) {
  return db("favs")
    .where({ user_id: user_id, post_id: post_id })
    .del();
}

module.exports = { getByFavId, getById, getByPostId, create, remove };