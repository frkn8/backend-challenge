/**
 * @param { import("knex").Knex } knex
 * @awaits { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  
 await knex("users").truncate();
  await knex("posts").truncate(); 
  
   await knex("favs").truncate();
   await knex("comments").truncate();
  
  

  await knex("users").insert([
    {
      
      username: "britney_spaers",
      password: "$2a$10$l.bP2RQgng16HnJA3DPdxuvjfJxlDVWVw8XO9f8sTtrcNUl4DQ5k6", //1234
      email: "britney@spears.com",
    },
    {
      
      username: "Justin_timberlake",
      password: "1234",
      email: "justin@timberlake.com",
    },
  ]);

  await knex("posts").insert([
    { user_id: 1, text: "Hello im singer" },
    { user_id: 2, text: "Hello im best pop singer :)" },
    { user_id: 1, text: "Hello :P" },
    { user_id: 2, text: "Hello r u ready for tonight?" },
  ]);

  await knex("favs").insert([
    { user_id: 1, post_id: 1 },
    { user_id: 2, post_id: 2 },
  ]);

  await knex("comments").insert([
    { user_id: 1, post_id: 2, comment: "It's true" },
    { user_id: 2, post_id: 2, comment: "It's perfect!..." },
  ]);
};