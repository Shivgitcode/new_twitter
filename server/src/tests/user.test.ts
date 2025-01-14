import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import { app } from "..";

vi.mock("../db", () => ({
  prisma: {
    user: {
      create: vi.fn().mockResolvedValue({
        id: 1,
        username: "shivansh",
      }),
      findFirst: vi.fn(),
    },
  },
}));
vi.mock("../cloudinary", () => ({
  cloudinary: {
    uploader: {
      upload: vi.fn(),
    },
  },
}));

describe("user tests", () => {
  it("should get status code 200 and message user created", async () => {
    const res = await request(app).post("/api/v1/signup").send({
      username: "shivansh",
      password: "123456",
      email: "sam@gmail.com",
    });
    console.log(res.body);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("user created");
    expect(res.body.data.username).toBe("shivansh");
  });
});
