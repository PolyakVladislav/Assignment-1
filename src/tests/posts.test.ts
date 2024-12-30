// import request from "supertest";
// import mongoose from "mongoose";
// import initApp from "../server";
// import postModel from "../models/Post";
// import commentModel from "../models/Comment";
// import { Express } from "express";
// let app: Express;

// beforeAll(async () => {
//   console.log("beforeAll");
//   app = await initApp();
//   await postModel.deleteMany();
//   await commentModel.deleteMany();
// });

// afterAll(async () => {
//   console.log("afterAll");
//   await mongoose.connection.close();
// });

// describe("Posts and Comments test suite", () => {
//   // POSTS TESTS
//   beforeEach(async () => {
//     await postModel.deleteMany(); // Clear posts before each test
//   });

//   test("Get all posts when no posts exist", async () => {
//     const response = await request(app).get("/posts");
//     expect(response.statusCode).toBe(200);
//     expect(response.body).toHaveLength(0);
//   });

//   test("Create a new post successfully", async () => {
//     const response = await request(app).post("/posts").send({
//       title: "Test Post",
//       content: "Test Content",
//       senderId: "TestSenderId",
//     });
//     expect(response.statusCode).toBe(201);
//     expect(response.body.title).toBe("Test Post");
//     expect(response.body.content).toBe("Test Content");
//     expect(response.body.senderId).toBe("TestSenderId");
//   });

//   test("Fail to create a post without required fields", async () => {
//     const response = await request(app)
//       .post("/posts")
//       .send({ title: "Missing Fields" });
//     expect(response.statusCode).toBe(400);
//     expect(response.body.message).toBe("All fields are required");
//   });

//   test("Get all posts after creating one", async () => {
//     await postModel.create({
//       title: "Test Post",
//       content: "Test Content",
//       senderId: "TestSenderId",
//     });
//     const response = await request(app).get("/posts");
//     expect(response.statusCode).toBe(200);
//     expect(response.body).toHaveLength(1);
//     expect(response.body[0].title).toBe("Test Post");
//   });

//   test("Get a post by ID successfully", async () => {
//     const post = await postModel.create({
//       title: "Test Post",
//       content: "Test Content",
//       senderId: "TestSenderId",
//     });
//     const response = await request(app).get(`/posts/${post._id}`);
//     expect(response.statusCode).toBe(200);
//     expect(response.body.title).toBe("Test Post");
//     expect(response.body.content).toBe("Test Content");
//   });

//   test("Fail to get a post with invalid ID", async () => {
//     const response = await request(app).get("/posts/invalidId");
//     expect(response.statusCode).toBe(500); // MongoDB throws a CastError
//   });

//   test("Fail to get a post that does not exist", async () => {
//     const nonExistentId = new mongoose.Types.ObjectId();
//     const response = await request(app).get(`/posts/${nonExistentId}`);
//     expect(response.statusCode).toBe(404);
//     expect(response.body.message).toBe("Post not found");
//   });

//   test("Get posts by sender ID successfully", async () => {
//     await postModel.create({
//       title: "Test Post",
//       content: "Test Content",
//       senderId: "TestSenderId",
//     });
//     const response = await request(app).get("/posts/sender/TestSenderId");
//     expect(response.statusCode).toBe(200);
//     expect(response.body).toHaveLength(1);
//     expect(response.body[0].title).toBe("Test Post");
//   });

//   test("Fail to get posts for a non-existent sender ID", async () => {
//     const response = await request(app).get("/posts/sender/NonExistentSender");
//     expect(response.statusCode).toBe(404);
//     expect(response.body.message).toBe("No posts found for this sender");
//   });

//   test("Update a post successfully", async () => {
//     const post = await postModel.create({
//       title: "Test Post",
//       content: "Test Content",
//       senderId: "TestSenderId",
//     });
//     const response = await request(app)
//       .put(`/posts/${post._id}`)
//       .send({ title: "Updated Title", content: "Updated Content" });
//     expect(response.statusCode).toBe(200);
//     expect(response.body.title).toBe("Updated Title");
//     expect(response.body.content).toBe("Updated Content");
//   });

//   test("Fail to update a post with missing fields", async () => {
//     const post = await postModel.create({
//       title: "Test Post",
//       content: "Test Content",
//       senderId: "TestSenderId",
//     });
//     const response = await request(app).put(`/posts/${post._id}`).send({});
//     expect(response.statusCode).toBe(400);
//     expect(response.body.message).toBe("Title and content are required");
//   });

//   test("Fail to update a non-existent post", async () => {
//     const nonExistentId = new mongoose.Types.ObjectId();
//     const response = await request(app)
//       .put(`/posts/${nonExistentId}`)
//       .send({ title: "Updated Title", content: "Updated Content" });
//     expect(response.statusCode).toBe(404);
//     expect(response.body.message).toBe("Post not found");
//   });

//   // COMMETNS TESTS
//   test("Test adding new comment", async () => {
//     const post = await postModel.create({
//       title: "Test Post",
//       content: "Test Content",
//       senderId: "testSender",
//     });
//     const response = await request(app).post(`/comments`).send({
//       postId: post._id,
//       content: "Test comment",
//       author: "testAuthor",
//     });

//     expect(response.statusCode).toBe(201);
//     expect(response.body.content).toBe("Test comment");
//     expect(response.body.author).toBe("testAuthor");
//     expect(response.body.postId).toBe(post._id.toString());
//   });

//   test("Fail to create comment with missing fields", async () => {
//     const response = await request(app)
//       .post("/comments")
//       .send({ content: "Missing fields" });
//     expect(response.statusCode).toBe(400);
//     expect(response.body.message).toBe("All fields are required");
//   });

//   test("Successfully get comment by id", async () => {
//     const comment = await commentModel.findOne();
//     if (!comment) {
//       throw new Error("No comment found");
//     }
//     const response = await request(app).get(`/comments/comment/${comment._id}`);
//     expect(response.statusCode).toBe(200);
//     expect(response.body.content).toBe("Test comment");
//   });

//   test("Fail to update comment with invalid id", async () => {
//     const response = await request(app)
//       .put("/comments/invalidId")
//       .send({ content: "Updated comment" });
//     expect(response.statusCode).toBe(500);
//   });

//   test("Successfully update a comment", async () => {
//     const comment = await commentModel.findOne();
//     if (!comment) {
//       throw new Error("No comment found");
//     }
//     const response = await request(app)
//       .put(`/comments/${comment._id}`)
//       .send({ content: "Updated comment" });
//     expect(response.statusCode).toBe(200);
//     expect(response.body.content).toBe("Updated comment");
//   });

//   test("Successfully delete a comment", async () => {
//     const comment = await commentModel.findOne();
//     if (!comment) {
//       throw new Error("No comment found");
//     }
//     const response = await request(app).delete(`/comments/${comment._id}`);
//     expect(response.statusCode).toBe(200);
//     expect(response.body.message).toBe("Comment deleted successfully");
//   });

//   test("Fail to delete comment with invalid id", async () => {
//     const response = await request(app).delete("/comments/invalidId");
//     expect(response.statusCode).toBe(500);
//   });
//   test("Fail to create a comment without postId", async () => {
//     const response = await request(app)
//       .post("/comments")
//       .send({ content: "Test Comment", author: "Test Author" });
//     expect(response.statusCode).toBe(400);
//     expect(response.body.message).toBe("All fields are required");
//   });

//   test("Fail to update comment when not found", async () => {
//     const nonExistentId = new mongoose.Types.ObjectId();
//     const response = await request(app)
//       .put(`/comments/${nonExistentId}`)
//       .send({ content: "Updated Content" });
//     expect(response.statusCode).toBe(404);
//     expect(response.body.message).toBe("Comment not found");
//   });
// });
