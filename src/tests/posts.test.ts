import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import postModel from "../models/Post";
import { Express } from "express";
import userModel, { IUser } from "../models/users_model";


var app: Express;

type User = IUser & { token?: string };
const testUser: User = {
  email: "test@user.com",
  password: "testpassword",
}

beforeAll(async () => {
  console.log("beforeAll");
  app = await initApp();
  await postModel.deleteMany();

  await userModel.deleteMany();
  await request(app).post("/auth/register").send(testUser);
  const res = await request(app).post("/auth/login").send(testUser);
  testUser.token = res.body.accessToken;
  testUser._id = res.body._id;
  expect(testUser.token).toBeDefined();

});

afterAll((done) => {
  console.log("afterAll");
  mongoose.connection.close();
  done();
});


let postId = "";
describe("Posts Tests", () => {
    test("Posts test get all", async () => {
      const response = await request(app).get("/posts");
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeDefined();
      expect(response.body.length).toBe(0);
    });
  
    test("Test Create Post", async () => {
      const response = await request(app).post("/posts")
        .set({ authorization: "JWT " + testUser.token })
        .send({
          title: "Test Post",
          content: "Test Content",
          senderId: "TestOwner",
        });
      expect(response.statusCode).toBe(201);
      expect(response.body.title).toBe("Test Post");
      expect(response.body.content).toBe("Test Content");
      postId = response.body._id;
    });
  
    test("Test get post by owner", async () => {
      const response = await request(app).get("/posts?owner=" + testUser._id);
      expect(response.statusCode).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body[0].title).toBe("Test Post");
      expect(response.body[0].content).toBe("Test Content");
    });

    test("Test get post by id", async () => {
      const response = await request(app).get("/posts/" + postId);
      expect(response.statusCode).toBe(200);
      expect(response.body.title).toBe("Test Post");
      expect(response.body.content).toBe("Test Content");
    });
  
    test("Test Create Post 2", async () => {
      const response = await request(app).post("/posts")
        .set({ authorization: "JWT " + testUser.token })
        .send({
          title: "Test Post 2",
          content: "Test Content 2",
          senderId: "TestOwner2",
        });
      expect(response.statusCode).toBe(201);
    });
  
    test("Posts test get all 2", async () => {
      const response = await request(app).get("/posts");
      expect(response.statusCode).toBe(200);
      expect(response.body.length).toBe(2);
    });
  
    test("Test Delete Post", async () => {
      const response = await request(app).delete("/posts/" + postId)
        .set({ authorization: "JWT " + testUser.token });
      expect(response.statusCode).toBe(200);
      const response2 = await request(app).get("/posts/" + postId);
      expect(response2.statusCode).toBe(404);
    });
  
    test("Test Create Post fail", async () => {
      const response = await request(app).post("/posts")
        .set({ authorization: "JWT " + testUser.token })
        .send({
          content: "Test Content 2",
        });
      expect(response.statusCode).toBe(400);
    });

    test("Test get posts by sender ID with no posts", async () => {
      const response = await request(app).get("/posts/sender/NonExistentSenderId");
      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe("No posts found for this sender");
    });    

    test("Test get posts by sender ID with server error", async () => {
      jest.spyOn(postModel, "find").mockImplementationOnce(() => {
        throw new Error("Database error");
      });
    
      const response = await request(app).get("/posts/sender/TestOwner");
      expect(response.statusCode).toBe(500);
      expect(response.body.message).toBe("Error getting posts by sender ID");
      expect(response.body.error).toBe("Database error");
    
      (postModel.find as jest.Mock).mockRestore();
    });
    
    test("Test update post with missing fields", async () => {
      const response = await request(app)
        .put(`/posts/${postId}`)
        .set({ authorization: "JWT " + testUser.token })
        .send({
          title: "Updated Title",
        });
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe("Title and content are required");
    });

    test("Test update post with non-existent ID", async () => {
      const nonExistentId = "64fcb6ae5b19b7e1a1234567"; 
      const response = await request(app)
        .put(`/posts/${nonExistentId}`)
        .set({ authorization: "JWT " + testUser.token })
        .send({
          title: "Updated Title",
          content: "Updated Content",
        });
      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe("Post not found");
    });


    test("Test update post with server error", async () => {
      jest.spyOn(postModel, "findByIdAndUpdate").mockImplementationOnce(() => {
        throw new Error("Database error");
      });
    
      const response = await request(app)
        .put(`/posts/${postId}`)
        .set({ authorization: "JWT " + testUser.token })
        .send({
          title: "Updated Title",
          content: "Updated Content",
        });
      expect(response.statusCode).toBe(500);
      expect(response.body.message).toBe("Error updating post");
      expect(response.body.error).toBe("Database error");
    
      (postModel.findByIdAndUpdate as jest.Mock).mockRestore();
    });
  });