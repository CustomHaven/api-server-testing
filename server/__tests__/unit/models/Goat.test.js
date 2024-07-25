const Goat = require("../../../models/Goat");
const db = require("../../../database/connect");

describe("Goat model", () => {

    describe("getAll", () => {
        it("resolves with goats on successful db query", async () => {
            // Arrange
            const mockGoats = [
                { id: 1, name: "g1", age: 1 },
                { id: 2, name: "g2", age: 2 },
                { id: 3, name: "g3", age: 3 },
            ];

            // spyOn
            // const response = await db.query("SELECT * FROM goats");
            // response.rows -> {data}
            jest.spyOn(db, "query").mockResolvedValueOnce({ rows: mockGoats });
            
            // Act
            const goats = await Goat.getAll();

            // Assert
            expect(goats).toHaveLength(3);
            expect(goats[0].name).toBe("g1");
            expect(db.query).toHaveBeenCalledWith("SELECT * FROM goats");
        });

        it("should throw an Error if no goats are found", async () => {
            // Arrange
            const mockGoats = [];
            jest.spyOn(db, "query").mockResolvedValueOnce({ rows: mockGoats });

            // Act & Assert
            await expect(Goat.getAll).rejects.toThrow("No goats available.");
            expect(db.query).toHaveBeenCalledWith("SELECT * FROM goats");
        })
    });

    describe("findById", () => {
        it("resolves with goat on successful db query", async () => {
            // Arrange
            const mockGoat = [{ id: 1, name: "g1", age: 1 }];

            // spyOn
            // const response = await db.query("SELECT * FROM goats");
            // response.rows -> {data}
            jest.spyOn(db, "query").mockResolvedValueOnce({ rows: mockGoat });
            
            // Act
            const goat = await Goat.findById(1);

            // Assert
            // expect(goat).toHaveLength(1);
            expect(goat).toBeInstanceOf(Goat);
            expect(goat.name).toBe("g1");
            expect(db.query).toHaveBeenCalledWith("SELECT * FROM goats WHERE id = $1", [1]);
        });

        it("should throw an Error if no goat is found", async () => {
            // Arrange
            const mockGoat = [];
            jest.spyOn(db, "query").mockResolvedValueOnce({ rows: mockGoat });

            // Act & Assert
            await expect(Goat.findById).rejects.toThrow("This goat does not exist!");
            expect(db.query).toHaveBeenCalledWith("SELECT * FROM goats WHERE id = $1", [1]);
        })
    });

    describe("create", () => {
        it("resolves with goat on successful creation", async () => {
            // Arrange
            const newGoat = { name: "cookie", age: 99 };

            // spyOn
            // const response = await db.query("SELECT * FROM goats");
            // response.rows -> {data}
            jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [ { ...newGoat, id: 1 } ] });
            
            // Act
            const goat = await Goat.create(newGoat);

            // Assert
            expect(goat).toBeInstanceOf(Goat);
            expect(goat.name).toBe("cookie");
            expect(goat).toHaveProperty("id", 1)
            expect(db.query).toHaveBeenCalledWith("INSERT INTO goats(name, age) VALUES ($1, $2) RETURNING *", [newGoat.name, newGoat.age]);
        });

        it("should throw an Error if age is missing", async () => {
            // Act & Assert
            await expect(Goat.create({ name: "plum" })).rejects.toThrow("age is missing");
            expect(db.query).toHaveBeenCalledWith("SELECT * FROM goats WHERE id = $1", [1]);
        })

        it("should throw an Error if name is missing", async () => {
            // Act & Assert
            await expect(Goat.create({ age: 5 })).rejects.toThrow("Name is missing");
            expect(db.query).toHaveBeenCalledWith("SELECT * FROM goats WHERE id = $1", [1]);
        })

    });


    describe("update", () => {
        let newGoat;
        beforeEach(() => {
            newGoat = { name: "cookie", age: 75 };
        });

        it("resolves with goat on successful update", async () => {
            // Arrange
            // const newGoat = { name: "cookie", age: 75 };

            // spyOn
            // const response = await db.query("SELECT * FROM goats");
            // response.rows -> {data}
            jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [ { ...newGoat, id: 5 } ] });
            
            // Act
            const goatInstance = new Goat({ name: "test", age: 50, id: 5 });
            const goat = await goatInstance.update(newGoat);

            // Assert
            expect(goat).toBeInstanceOf(Goat);
            expect(goat.name).toBe("cookie");
            expect(goat).toHaveProperty("id", 5)
            expect(db.query).toHaveBeenCalledWith(" UPDATE goats SET name = $1, age = $2 WHERE id = $3 RETURNING * ", [newGoat.name, newGoat.age, goatInstance.id]);
        });

        it("should throw an Error if age is missing", async () => {
            // Act & Assert
            const goat = new Goat({ ...newGoat, id: 5 })
            await expect(goat.update({ name: "test" })).rejects.toThrow("age or name missing");
        })

        it("should throw an Error if name is missing", async () => {
            // Act & Assert
            const goat = new Goat({ ...newGoat, id: 5 })
            await expect(goat.update({ age: 99 })).rejects.toThrow("age or name missing");
        })

    });


    describe("destroy", () => {

        it("deletes a goat on successful process", async () => {
            // Arrange
            // const newGoat = { name: "cookie", age: 75 };

            // spyOn
            // const response = await db.query("SELECT * FROM goats");
            // response.rows -> {data}
            jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [{id: 5}] });
            
            // Act
            const goatInstance = new Goat({ id: 5 });
            const goat = await goatInstance.destroy();

            // Assert
            expect(goat).toBeInstanceOf(Goat);
            // expect(goat.name).toBe("cookie");
            expect(goat).toHaveProperty("id", 5)
            expect(db.query).toHaveBeenCalledWith("DELETE FROM goats WHERE id = $1 RETURNING *", [goatInstance.id]);
        });

        it("should throw an Error if age is missing", async () => {
            // Act & Assert
            jest.spyOn(db, "query").mockRejectedValue(new Error("Something happened to your DB"));
            const goat = new Goat({ id: 5 });
            await expect(goat.destroy()).rejects.toThrow("Cannot delete.");
        })

    });

})