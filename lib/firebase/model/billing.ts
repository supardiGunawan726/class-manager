import { boolean, InferType, number, object, string } from "yup";
import { TransactionSchema } from "./transaction";

const BillingSchema = object().shape({
  name: string().required(),
  amount_paid: number().required(),
  amount_bill: number().required(),
  status: string().oneOf(["paid", "unpaid", "partial"]),
  verified: boolean().required(),
  last_transaction: TransactionSchema.optional(),
  total_funding: number().default(0),
});

export type Billing = InferType<typeof BillingSchema>;
