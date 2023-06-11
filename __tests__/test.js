const server = require("../api/server");
const request = require("supertest");
const userModel = require('../api/users/users-model');
const postsModel = require('../api/posts/posts-model');
const db = require("../data/db-config");



beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

beforeEach(async () => {
  await db.seed.run();
});

test("[0]Sanity cheeck", () => {
  expect(process.env.NODE_ENV).toBe("testing");
});

const newUser = {
  username: "gulsen",
  password: "1234",
  email: "gul@sen.com",
};

const newUser2 = {
  username: "muslum_gurses",
  password: "1234",
  email: "muslum@gurses.com",
};


describe("___AUTH____", () => {
  test("[1]create a new user", async () => {
    const res = await request(server).post("/api/auth/register").send(newUser);
    const user = await db("users")
      .where({
        username: "gulsen",
      })
      .first();

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("User successfully created.");
    expect(res.body.savedUser.username).toBe(user.username);
  });

  test("[2]new user can login", async () => {
    await request(server).post("/api/auth/register").send(newUser);
    const res = await request(server).post("/api/auth/login").send(newUser);

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  test("[3]user can logout", async () => {
    await request(server).post("/api/auth/register").send(newUser);
    const res = await request(server).post("/api/auth/login").send(newUser);
    const token = res.body.token;

    await request(server).get("/api/auth/logout").set("Authorization", token);
    const res2 = await request(server)
      .get("/api/users")
      .set("Authorization", token);

    expect(res2.status).toBe(200);
  });
});

describe("___USERS____", () => {
  let token;
  beforeEach(async () => {
    await request(server).post("/api/auth/register").send(newUser);
    const res = await request(server).post("/api/auth/login").send(newUser);
    token = res.body.token;

    
  });

  test("[4] create a new user", async () => {
    const res = await request(server)
      .get("/api/users")
      .set("Authorization", token);

    expect(res.body).toHaveLength(3);
  });

  test("[5] should return user with specified id", async () => {
    const insertedUser = await userModel.create(newUser2);
    const userId = insertedUser.user_id;
    const res = await request(server)
      .get(`/api/users/${userId}`) 
      .set("Authorization", token);

    expect(res.status).toBe(200);
    expect(res.body.username).toBe(newUser2.username);
    expect(res.body.email).toBe(newUser2.email);
  });

  test("[6] should delete user with specified id", async () => {
    const insertedUser = await userModel.create(newUser2);
    const userId = insertedUser.user_id;
  
    const res = await request(server)
      .delete(`/api/users/${userId}`)
      .set("Authorization", token);
  
    expect(res.status).toBe(200);
    expect(res.body.message).toBe(`${userId}'li kullanıcı silindi.`);
  
    const deletedUser = await userModel.getById(userId);
    expect(deletedUser).toBeUndefined();
  });
  
  test("[7] should return 404 if user with specified id does not exist", async () => {
    const res = await request(server)
      .delete(`/api/users/999`)
      .set("Authorization", token);
  
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("999 id'li kullanıcı bulunamadı!...");
  });
  
});


describe("___USERS____", () => {
  let token;
  

  beforeEach(async () => {

    await request(server).post("/api/auth/register").send(newUser);
    const res = await request(server).post("/api/auth/login").send(newUser);
    token = res.body.token;
  
    
  });
  



  test("[8] should return posts by user_id", async () => {
    const userId = 1; 
    const response = await request(server).get(`/api/posts/${userId}`).set("Authorization", token);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
  
});

describe("___Success___", () => {

test("[9]creates user", async () => {
    const user = await userModel.create(newUser);
    //assertion
    expect(user).toHaveProperty("user_id");
    expect(user.user_id).toBe(3);
    expect(user).toHaveProperty("user_id", 3);
  });


describe("[10]tests for spesific user", () => {
  let user;
  beforeAll(async () => {
    user = await userModel.getById(2);
  });

  test("[11]gets user by id", async () => {
    const expectedUser = {
      user_id: 2,
      username: "Justin_timberlake",
      password: "1234",
      email: "justin@timberlake.com",

    }
    expect(user).not.toBe(expectedUser);
    expect(user).toEqual(expectedUser);
    expect(user).toMatchObject({
      user_id: 2,
      username: "Justin_timberlake",
      password: "1234",
    });
  });

  test("[12]checks property values for spesific user", async () => {
    expect(user.username).toMatch(/ustin_tim/);
  })
})

})