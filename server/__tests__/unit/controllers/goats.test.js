const goatsController = require("../../../controllers/goats");
const Goat = require("../../../models/Goat");

const mockSend = jest.fn();
const mockEnd = jest.fn();
const mockJson = jest.fn();
const mockStatus = jest.fn(() => ({
    send: mockSend,
    json: mockJson,
    end: mockEnd
}));
const mockRes = { status: mockStatus };

// response.status().send
// first mockRes.status

describe("Goats controller", () => {
    beforeEach(() => jest.clearAllMocks());

    describe("index", () => {

        it("should return goats with status code 200", async () => {
            // Arrange
            // const goatsData = await Goat.getAll()
            jest.spyOn(Goat, "getAll").mockResolvedValueOnce(["g1", "g2"]);

            // Act
            await goatsController.index(null, mockRes);

            // Assert
            // get correct status code and the correct data
            expect(Goat.getAll).toHaveBeenCalledTimes(1);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockSend).toHaveBeenCalledWith({ data: ["g1", "g2"] });
        });

        it("should return an error upon failure", async () => {
            // Arrange
            // const goatsData = await Goat.getAll()
            jest.spyOn(Goat, "getAll").mockRejectedValue(new Error("Something happened to your DB"));

            // Act
            await goatsController.index(null, mockRes);

            // Assert
            // get correct status code and the correct data
            expect(Goat.getAll).toHaveBeenCalledTimes(1);
            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockSend).toHaveBeenCalledWith({ error: "Something happened to your DB" });
        });
    });

    describe("show", () => {
        let mockReq;
        beforeEach(() => {
            mockReq = {
                params: { id: 1 }
            };

            jest.clearAllMocks();
        });

        it("should return a goat with status code 200", async () => {
            // Arrange
            // const goatsData = await Goat.getAll()
            jest.spyOn(Goat, "findById").mockResolvedValueOnce({ id: 1, name: "test goat", age: 22 });

            // Act
            await goatsController.show(mockReq, mockRes);

            // Assert
            // get correct status code and the correct data
            expect(Goat.findById).toHaveBeenCalledTimes(1);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockSend).toHaveBeenCalledWith({ data: { id: 1, name: "test goat", age: 22 } });
        });

        it("should return an error upon failure", async () => {
            // Arrange
            // const goatsData = await Goat.getAll()
            jest.spyOn(Goat, "findById").mockRejectedValue(new Error("Something happened to your DB"));

            // Act
            await goatsController.show(mockReq, mockRes);

            // Assert
            // get correct status code and the correct data
            expect(Goat.findById).toHaveBeenCalledTimes(1);
            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockSend).toHaveBeenCalledWith({ error: "Something happened to your DB" });
        });

    });


    describe("create", () => {
        let mockReq;
        beforeEach(() => {
            mockReq = {
                body: {
                    name: "new Goat",
                    age: 24
                }
            };
        });

        it("should create a goat with status code 201", async () => {
            // Arrange
            // const goatsData = await Goat.getAll()
            jest.spyOn(Goat, "create").mockResolvedValueOnce({ name: "new Goat", age: 24, id: 1 });

            // Act
            await goatsController.create(mockReq, mockRes);

            // Assert
            // get correct status code and the correct data
            expect(Goat.create).toHaveBeenCalledTimes(1);
            expect(mockStatus).toHaveBeenCalledWith(201);
            expect(mockSend).toHaveBeenCalledWith({ data: { id: 1, name: "new Goat", age: 24 } });
        });

        it("should return an error upon failure", async () => {
            // Arrange
            // const goatsData = await Goat.getAll()
            jest.spyOn(Goat, "create").mockRejectedValue(new Error("Something happened to your DB"));

            // Act
            await goatsController.create(mockReq, mockRes);

            // Assert
            // get correct status code and the correct data
            expect(Goat.create).toHaveBeenCalledTimes(1);
            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockSend).toHaveBeenCalledWith({ error: "Something happened to your DB" });
        });

    });



    describe("update", () => {
        let mockReq;
        beforeEach(() => {
            mockReq = {
                params: { id: 1 }, 
                body: {
                    name: "new Goat",
                    age: 24
                }
            };
        });

        it("should update a goat with status code 200", async () => {
            // Arrange
            // const goatsData = await Goat.getAll()
            jest.spyOn(Goat, "findById").mockResolvedValueOnce(new Goat({ id: 1, name: "test goat", age: 23 }));        
            jest.spyOn(Goat.prototype, "update").mockResolvedValueOnce({ id: 1, name: "new goat", age: 24});


            // Act
            // goatToUpdate = new Goat({ name: "test goat", age: 23, id: 1 });
            // const goat = await goatToUpdate.update(mockReq, mockRes);
            await goatsController.update(mockReq, mockRes);

            // Assert
            // get correct status code and the correct data
            expect(Goat.findById).toHaveBeenCalledTimes(1);
            expect(Goat.prototype.update).toHaveBeenCalledTimes(1);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockSend).toHaveBeenCalledWith({ data: { id: 1, name: "new goat", age: 24 } });
        });

        it("should return an error upon failure by id", async () => {
            // Arrange
            // const goatsData = await Goat.getAll()
            jest.spyOn(Goat, "findById").mockRejectedValue(new Error("Something happened to your DB"));

            // Act
            await goatsController.update(mockReq, mockRes);

            // Assert
            // get correct status code and the correct data
            expect(Goat.findById).toHaveBeenCalledTimes(1);
            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockSend).toHaveBeenCalledWith({ error: "Something happened to your DB" });
        });

        it("should return an error upon failure on update method", async () => {
            // Arrange
            // const goatsData = await Goat.getAll()
            jest.spyOn(Goat, "findById").mockResolvedValueOnce(new Goat({ id: 1, name: "test goat", age: 23 }));        
            jest.spyOn(Goat.prototype, "update").mockRejectedValue(new Error("Something happened to your DB"));

            // Act
            await goatsController.update(mockReq, mockRes);

            // Assert
            // get correct status code and the correct data
            expect(Goat.findById).toHaveBeenCalledTimes(1);
            expect(Goat.prototype.update).toHaveBeenCalledTimes(1);
            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockSend).toHaveBeenCalledWith({ error: "Something happened to your DB" });
        });

    });


    describe("destroy", () => {
        let mockReq;
        beforeEach(() => {
            mockReq = {
                params: { id: 5 }, 
            };
        });

        it("should destroy a goat with status code 204", async () => {
            // Arrange
            jest.spyOn(Goat, "findById").mockResolvedValueOnce(new Goat({ id: 5 }));        
            jest.spyOn(Goat.prototype, "destroy").mockResolvedValueOnce({});


            // Act
            await goatsController.destroy(mockReq, mockRes);

            // Assert
            // get correct status code and the correct data
            expect(Goat.findById).toHaveBeenCalledTimes(1);
            expect(Goat.prototype.destroy).toHaveBeenCalledTimes(1);
            expect(mockStatus).toHaveBeenCalledWith(204);
            expect(mockEnd).toHaveBeenCalledTimes(1);
        });

        it("should return an error upon failure by id", async () => {
            // Arrange
            jest.spyOn(Goat, "findById").mockRejectedValue(new Error("Something happened to your DB"));

            // Act
            await goatsController.destroy(mockReq, mockRes);

            // Assert
            // get correct status code and the correct data
            expect(Goat.findById).toHaveBeenCalledTimes(1);
            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockSend).toHaveBeenCalledWith({ error: "Something happened to your DB" });
        });

        it("should return an error upon failure on destroy method", async () => {
            // Arrange
            // const goatsData = await Goat.getAll()
            jest.spyOn(Goat, "findById").mockResolvedValueOnce(new Goat({ id: 1 }));        
            jest.spyOn(Goat.prototype, "destroy").mockRejectedValue(new Error("Something happened to your DB"));

            // Act
            await goatsController.destroy(mockReq, mockRes);

            // Assert
            // get correct status code and the correct data
            expect(Goat.findById).toHaveBeenCalledTimes(1);
            expect(Goat.prototype.destroy).toHaveBeenCalledTimes(1);
            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockSend).toHaveBeenCalledWith({ error: "Something happened to your DB" });
        });

    });

});