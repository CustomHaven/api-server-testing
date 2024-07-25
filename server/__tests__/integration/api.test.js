const { resetTestDB } = require("./config");
const app = require("../../app");
const request = require("supertest");

describe("Goat API Endpoints", () => {
    let api;
    beforeEach(async () => {
        await resetTestDB();
    });

    // Run our test APP
    beforeAll(() => {
        api = app.listen(5000, () => {
            console.log("Test server running on port 5000");
        })
    });


    afterAll((done) => {
        api.close(done);
    });

    describe("GET /", () => {
        it("responds to GET / with a message and description", async () => {
            // Arrange & Act
            const response = await request(api).get("/");

            // Assert
            expect(response.statusCode).toBe(200);
            expect(response.body.message).toBe("welcome");
            expect(response.body.description).toBe("GOAT API");
        });
    });


    describe("GET /goats", () => {
        it("should return all  goats with status code of 200", async () => {
            // Arrange & Act
            const response = await request(api).get("/goats");

            // Assert
            expect(response.statusCode).toBe(200);
            expect(response.body.data.length).toBeGreaterThan(0);
            expect(response.body.data).toBeInstanceOf(Array);
        });
    });

    describe("GET /goats/:id", () => {
        it("should return a goat with status code of 200 with 1 as id", async () => {
            // Arrange & Act
            const response = await request(api).get("/goats/1");

            // Assert
            expect(response.statusCode).toBe(200);
            expect(response.body.data.id).toBe(1);
            // expect(response.body.data.length).toBeGreaterThan(0);
            expect(response.body.data).toBeInstanceOf(Object);
        });

        it("should return fail when goat id does not exist status code of 404", async () => {
            // Arrange & Act
            const response = await request(api).get("/goats/4");

            // Assert
            expect(response.statusCode).toBe(404);
            expect(response.body.error).toBe("This goat does not exist!");
        });
    });

    describe("POST /goats", () => {
        it("should create a new goat and return it", async () => {
            // Arrange & Act
            const newGoat = { name: "Cristiano Ronaldo", age: 39 }
            const response = await request(api).post("/goats").send(newGoat);

            // Assert
            expect(response.statusCode).toBe(201);
            expect(response.body.data).toHaveProperty("name", "Cristiano Ronaldo");
            expect(response.body.data).toHaveProperty("age", 39);
            expect(response.body.data.id).toBe(4);
            expect(response.body.data).toBeInstanceOf(Object);
        });

        it("should return error if required fields are missing", async () => {
            // Arrange & Act
            const newGoat = { name: "Cristiano Ronaldo" }
            const response = await request(api).post("/goats").send(newGoat);

            // Assert
            expect(response.status).toBe(400);
            expect(response.body.error).toBe("age is missing");
        });
    });

    describe("PATCH /goats/:id", () => {
        it("should update a goat and return it", async () => {
            // Arrange & Act
            const goatId = 2;
            const newGoat = { name: "Cristiano Ronaldo", age: 39 }
            const response = await request(api).patch("/goats/" + goatId).send(newGoat);

            // Assert
            expect(response.statusCode).toBe(200);
            expect(response.body.data).toHaveProperty("name", "Cristiano Ronaldo");
            expect(response.body.data).toHaveProperty("age", 39);
            expect(response.body.data.id).toBe(2);
            expect(response.body.data).toBeInstanceOf(Object);
        });

        it("should return error if id is not found", async () => {
            // Arrange & Act
            const newGoat = { name: "Cristiano Ronaldo", age: 39 }
            const response = await request(api).patch("/goats/5").send(newGoat);
            
            // Assert
            expect(response.status).toBe(400);
            expect(response.body.error).toBe("This goat does not exist!"); 
        });


        // it("should return error if required fields are missing", async () => {
        //     // Arrange & Act
        //     const newGoat = { }
        //     const response = await request(api).patch("/goats/2").send(newGoat);

        //     // Assert
        //     expect(response.status).toBe(400);
        //     expect(response.body.error).toBe("age or name missing");
        // });
    });

    describe("DELETE /goats/:id", () => {
        it("should update a goat and return it", async () => {
            // Arrange & Act
            const goatId = 2;
            const response = await request(api).delete("/goats/" + goatId);

            // Assert
            expect(response.statusCode).toBe(204);
            expect(Object.keys(response.body).length).toBe(0);
            expect(response.body).toBeInstanceOf(Object);
        });

        it("should return error if id is not found", async () => {
            // Arrange & Act
            const response = await request(api).delete("/goats/5");
            
            // Assert
            expect(response.status).toBe(404);
            expect(response.body.error).toBe("This goat does not exist!");
        });
    });


});