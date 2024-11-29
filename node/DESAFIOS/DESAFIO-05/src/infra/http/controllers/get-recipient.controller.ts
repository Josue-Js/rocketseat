import { GetRecipientUseCase } from "@/application/use-cases/get-recipient";
import { Controller, Get, HttpCode, Param } from "@nestjs/common";
import { RecipientPresenter } from "../presenters/recipient-presenter";

@Controller("/recipient/:id")
export class GetRecipientController {
  constructor(private getRecipientUseCase: GetRecipientUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(@Param("id") recipient_id: string) {
    const recipient = await this.getRecipientUseCase.execute({
      recipient_id,
    });

    return RecipientPresenter.toHTTP(recipient);
  }
}
