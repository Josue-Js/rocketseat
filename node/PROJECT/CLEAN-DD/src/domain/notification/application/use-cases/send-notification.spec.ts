import { InMemoryNotificationRepository } from "test/repositories/in-memory-notification-repository";
import { SendNotificationUseCase } from "./send-notification";

let inMemoryNotificationRepository: InMemoryNotificationRepository;
let sut: SendNotificationUseCase;

describe("Create Notification Use Case", () => {
  beforeEach(() => {
    inMemoryNotificationRepository = new InMemoryNotificationRepository();
    sut = new SendNotificationUseCase(inMemoryNotificationRepository);
  });

  it("should be able to send a notification", async () => {
    const result = await sut.execute({
      recipientId: "1",
      title: "hello",
      content: "bla bla bla",
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryNotificationRepository.items[0]).toEqual(
      result.value?.notification
    );
  });
});
