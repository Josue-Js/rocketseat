import { Module } from "@nestjs/common";
import { CryptographyModule } from "../cryptography/cryptography.module";
import { DatabaseModule } from "../database/database.module";
import { AuthenticateController } from "./controllers/authenticate.controller";
import { AuthenticateUseCase } from "@/application/use-cases/authenticate";
import { CreateAccountController } from "./controllers/create-account.controller";
import { CreateAccountUseCase } from "@/application/use-cases/create-account";
import { GetCourierController } from "./controllers/get-courier.controller";
import { GetCourierUseCase } from "@/application/use-cases/get-courier";
import { CreateRecipientController } from "./controllers/create-recipient.controller";
import { CreateRecipientUseCase } from "@/application/use-cases/create-recipient";
import { EditRecipientController } from "./controllers/edit-recipient.controller";
import { EditRecipientUseCase } from "@/application/use-cases/edit-recipient";
import { DeleteRecipientController } from "./controllers/delete-recipient.controller";
import { DeleteRecipientUseCase } from "@/application/use-cases/delete-recipient";
import { CreateOrderController } from "./controllers/create-order.controller";
import { CreateOrderUseCase } from "@/application/use-cases/create-order";
import { DeleteOrderController } from "./controllers/delete-order.controller";
import { DeleteOrderUseCase } from "@/application/use-cases/delete-order";
import { GetRecipientController } from "./controllers/get-recipient.controller";
import { GetRecipientUseCase } from "@/application/use-cases/get-recipient";
import { DeleteCourierController } from "./controllers/delete-courier.controller";
import { DeleteCourierUseCase } from "@/application/use-cases/delete-courier";
import { EditOrderController } from "./controllers/edit-order.controller";
import { EditOrderUseCase } from "@/application/use-cases/edit-order";
import { ResetPasswordController } from "./controllers/reset-password.controller";
import { ResetPasswordUseCase } from "@/application/use-cases/reset-password";
import { MarkOrderWithCollectedUseCase } from "@/application/use-cases/mark-order-with-collected";
import { MarkOrderWithCollectedController } from "./controllers/mark-order-with-collected.controller";
import { MarkOrderWithDeliveredController } from "./controllers/mark-order-with-delivered.controller";
import { MarkOrderWithDeliveredUseCase } from "@/application/use-cases/mark-order-with-delivered";
import { MarkOrderWithReturnedUseCase } from "@/application/use-cases/mark-order-with-returned";
import { MarkOrderWithReturnedController } from "./controllers/mark-order-with-returned.controller";
import { CourierGetOrdersController } from "./controllers/courier-get-orders.controller";
import { CourierGetOrdersUseCase } from "@/application/use-cases/courier-get-orders";
import { StorageModule } from "../storage/storage.module";
import { UploadAttachmentController } from "./controllers/upload-atthcment.controller";
import { UploadAndCreateAttachmentUseCase } from "@/application/use-cases/upload-and-create-attachment";

@Module({
  imports: [DatabaseModule, CryptographyModule, StorageModule],
  controllers: [
    AuthenticateController,
    CreateAccountController,
    GetCourierController,
    CreateRecipientController,
    GetRecipientController,
    EditRecipientController,
    DeleteRecipientController,
    CreateOrderController,
    DeleteOrderController,
    DeleteCourierController,
    EditOrderController,
    ResetPasswordController,
    MarkOrderWithCollectedController,
    MarkOrderWithDeliveredController,
    MarkOrderWithReturnedController,
    CourierGetOrdersController,
    UploadAttachmentController,
  ],
  providers: [
    AuthenticateUseCase,
    CreateAccountUseCase,
    GetCourierUseCase,
    CreateRecipientUseCase,
    GetRecipientUseCase,
    EditRecipientUseCase,
    DeleteRecipientUseCase,
    CreateOrderUseCase,
    DeleteOrderUseCase,
    DeleteCourierUseCase,
    EditOrderUseCase,
    ResetPasswordUseCase,
    MarkOrderWithCollectedUseCase,
    MarkOrderWithDeliveredUseCase,
    MarkOrderWithReturnedUseCase,
    CourierGetOrdersUseCase,
    UploadAndCreateAttachmentUseCase,
  ],
})
export class HttpModule {}
