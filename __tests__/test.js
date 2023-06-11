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
//node env ayarı testing de çalışıyor mu onu kontrol ediyor.
//test etmek için yeni 2 kullanıcı tanımladık

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

// burada önce kayıt olmayı test ettik.
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
// satır 52 de tekrar kayıt oluşturduk sonra login olmayı test ettik.
  test("[2]new user can login", async () => {
    await request(server).post("/api/auth/register").send(newUser);
    const res = await request(server).post("/api/auth/login").send(newUser);

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });
// tekrar kayıt olup giriş yapıyoruz, token i request bodyden alıp, sonra log outta o taken i kullanıp çıkış yapma işlemini test ettik.
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
  // bu kısımda auth da ki routerları  test ettik

describe("___USERS____", () => {
  let token;
  beforeEach(async () => {
    await request(server).post("/api/auth/register").send(newUser);
    const res = await request(server).post("/api/auth/login").send(newUser);
    token = res.body.token; // takeni burada doldurduk
//bu sefer before ache de yazdık, (token before eache nin içinde tanımladık) 
    
  });
//yeni bir kullanıcı eeklemeye baktık. userdaki routerlara baktık.
//kaaç kullanıcı olduğunun sayısına baktık
  test("[4] create a new user", async () => {
    const res = await request(server)
      .get("/api/users")
      .set("Authorization", token);

    expect(res.body).toHaveLength(3);
  });
// id ye göre belli bir kullanıcının bilgilerini getirip, kontrol ettik
//mail kullanıcı adı vs doğrumu onlar kontrol edildi
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
//belli bir id ye göre kullanıcıyı silmeyi test ettik
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
  //kayıtlı olmayan kullanıcı olduğunda hata mesajı dönüyor mu onu test ettik.
  test("[7] should return 404 if user with specified id does not exist", async () => {
    const res = await request(server)
      .delete(`/api/users/999`)
      .set("Authorization", token);
  //999 vermemizin sebebi o id de kullanıcı olmayacağı
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("999 id'li kullanıcı bulunamadı!...");
  });
  
});

describe("___USERS____", () => {
  let token;
  //bu kısımda postları kontrol ettik, post atmayı vs

  beforeEach(async () => {

    await request(server).post("/api/auth/register").send(newUser);
    const res = await request(server).post("/api/auth/login").send(newUser);
    token = res.body.token;
  
    
  });
  

//belli bir kullanıcı adı yazında o kişşinin tweetleri geliyor mu onu kontrol ettik

  test("[8] should return posts by user_id", async () => {
    const userId = 1; 
    const response = await request(server).get(`/api/posts/${userId}`).set("Authorization", token);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
  
});

describe("___Success___", () => {
//kullanıcı bilgilerini kontrol ettik, kullanıcı bilgilerine göre doğru sonuçlar geliyor mu onu kontrol ettik
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