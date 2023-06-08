/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema
    .createTable("users", (table) => {
        table.increments("user_id");
        table.string("username").notNullable().unique();
        table.string("password").notNullable();
        table.string("email").notNullable().unique();
      })
      .createTable("posts", (table) => {
        table.increments("post_id");
        table.string("text").notNullable();
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table
          .integer("user_id")
          .notNullable()
          .unsigned()
          .references("user_id")
          .inTable("users")
          .onDelete("CASCADE")
          .onUpdate("CASCADE");
      })
      .createTable("favs", (table) => {
        table
          .integer("user_id")
          .notNullable()
          .unsigned()
          .references("user_id")
          .inTable("users")
          .onDelete("CASCADE")
          .onUpdate("CASCADE");
        table
          .integer("post_id")
          .notNullable()
          .unsigned()
          .references("post_id")
          .inTable("posts")
          .onDelete("CASCADE")
          .onUpdate("CASCADE");
        table.primary(["user_id", "post_id"]);
      })
      .createTable("comments", (table) => {
        table.increments("comment_id");
        table.string("comment").notNullable();
        table
          .integer("user_id")
          .notNullable()
          .unsigned()
          .references("user_id")
          .inTable("users")
          .onDelete("CASCADE")
          .onUpdate("CASCADE");
        table
          .integer("post_id")
          .notNullable()
          .unsigned()
          .references("post_id")
          .inTable("posts")
          .onDelete("CASCADE")
          .onUpdate("CASCADE");
      })
      .createTable("token_blacklist", (t) => {
        t.increments(), t.string("token").notNullable();
        t.timestamp("createdate").defaultTo(knex.fn.now());
      });
      
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = function (knex) {
    return knex.schema
      .dropTableIfExists("token_blacklist")
      .dropTableIfExists("comments")
      .dropTableIfExists("favs")
      .dropTableIfExists("posts")
      .dropTableIfExists("users");
  };
  