import { InMemoryCourierRepository } from "test/repositories/in-memory-courier-repository";
import { GetCourierUseCase } from "./get-courier";
import { makeCourier } from "test/factories/make-courier";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

let inMemoryCourierRepository: InMemoryCourierRepository;
let sut: GetCourierUseCase;

describe("Get Courier Use Case", () => {
  beforeEach(() => {
    inMemoryCourierRepository = new InMemoryCourierRepository();
    sut = new GetCourierUseCase(inMemoryCourierRepository);
  });

  it("should be able to get a courier", async () => {
    const courier = makeCourier(
      {
        name: "John Doe",
      },
      new UniqueEntityID("courier-01"),
    );
    inMemoryCourierRepository.create(courier);

    const result = await sut.execute({
      courier_id: "courier-01",
    });

    expect(result).toMatchObject({
      id: courier.id,
      name: "John Doe",
    });
  });
});
