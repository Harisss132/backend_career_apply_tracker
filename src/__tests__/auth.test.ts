import request from "supertest";
import app from "../app.js";
import { prisma } from "../config/database.js";

describe("Auth API", () => {
  afterAll(async () => {
    await prisma.refreshToken.deleteMany();
    await prisma.user.deleteMany({
      where: { email: { contains: "test@" } },
    });
    await prisma.$disconnect();
  });

  describe("POST /api/auth/register", () => {
    it("berhasil register user baru", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "Test user",
        email: "test@example.com",
        password: "password123",
      });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("id");
      expect(res.body.data.email).toBe("test@example.com");
      expect(res.body.data).not.toHaveProperty("password");
    });

    it("gagal register email sudah terdaftar", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "Test user",
        email: "test@example.com",
        password: "password123",
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("gagal register password terlalu pendek", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "Test user",
        email: "test@example.com",
        password: "12",
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe("POST /api/aut/login", () => {
    it("berhasil login", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "test@example.com",
        password: "password123",
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty("accessToken");
      expect(res.headers["set-cookie"]).toBeDefined();
    });

    it("gagal login jika password salah", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "test@example.com",
        password: "salahpassword",
      });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe("GET /api/auth/profile", () => {
    let accessToken: string;

    beforeAll(async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "test@example.com",
        password: "password123",
      });
      accessToken = res.body.accessToken;
    });

    it("berhasil get profile", async () => {
      const res = await request(app)
        .get("/api/auth/profile")
        .set("Authorization", `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("email");
    });

    it("gagal token tidak ada", async () => {
      const res = await request(app).get("/api/auth/profile");

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it("gagal token salah", async () => {
      const res = await request(app)
        .get("/api/auth/profile")
        .set("Authorization", "Bearer token salah");

      expect(res.status).toBe(401);
    });
  });

  describe("POST /api/auth/profile", () => {
    let authCookie: string;

    beforeAll(async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "test@example.com",
        password: "password123",
      });

      const cookies = res.headers["set-cookie"];
      if (cookies && cookies.length > 0) {
        authCookie = cookies;
      }
    });

    it("Berhasil logout dan menghapus token", async () => {
      const res = await request(app)
        .post("/api/auth/logout")
        .set("Cookie", authCookie);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.headers["set-cookie"]).toBeDefined();
    });

    it("Gagal logout token tidak ada", async () => {
      const res = await request(app)
        .post("/api/auth/logout")

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });
});
