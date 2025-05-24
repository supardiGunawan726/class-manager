import { boolean, InferType, number, object, string } from "yup";

export const TransactionSchema = object().shape({
  id: string().required(),
  amount: number().required(),
  billing_date: object().shape({
    seconds: number().required(),
    nanoseconds: number().required(),
  }),
  date: object().shape({
    seconds: number().required(),
    nanoseconds: number().required(),
  }),
  proof: string().required(),
  user_id: string().required(),
  verified: boolean().required(),
});

export type Transaction = InferType<typeof TransactionSchema>;
