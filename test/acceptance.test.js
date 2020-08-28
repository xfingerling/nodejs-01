const request = require("supertest");
const MyServer = require("../api/server");

describe("Acceptance test", () => {
  let server;

  before(async () => {
    const myServer = new MyServer();
    server = await myServer.start();
  });

  after(() => {
    server.close();
  });

  describe("PATCH /api/users/avatars", () => {
    const token = null;

    it("shoud return 401 error", async () => {
      await request(server)
        .patch("/api/users/avatars")
        .set({ Authorization: "Bearer " + token })
        .expect(401);
    });

    context("when user did auth", () => {
      let token = null;

      before(async (done) => {
        const res = await request(server)
          .post("/api/auth/login")
          .send({ email: "test@mail.com", password: "test" });

        token = res.body.token;
      });

      it("shoud return 200", async (done) => {
        await request(server)
          .patch("/api/users/avatars")
          .set({
            Authorization: "Bearer " + token,
            "Content-Type": "multipart/form-data",
          })
          .field("avatar", "avatar.jpg")
          .attach("avatar", "public/images/avatar.jpg")
          .expect(200);
      });
    });
  });
});
