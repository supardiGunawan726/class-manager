import { InferType, number, object, string } from "yup";

export const DEFAULT_FUND_DOC_ID = "default-fund";

export const BILLING_PERIODS = {
  DAILY: {
    value: "daily",
    label: "Setiap hari",
  },
  WEEKLY: {
    value: "weekly",
    label: "Setiap minggu",
  },
  FORTNIGHTLY: {
    value: "fortnightly",
    label: "Setiap dua minggu",
  },
  MONTHLY: {
    value: "monthly",
    label: "Setiap bulan",
  },
} as const;

const FundSchema = object().shape({
  id: string().required(),
  billing_amount: number().required(),
  billing_period: string().oneOf(
    Object.values(BILLING_PERIODS).map((period) => period.value)
  ),
  billing_start_date: object().shape({
    seconds: number().required(),
    nanoseconds: number().required(),
  }),
  total_funding: number().required(),
});

const UserFundingInformationSchema = object().shape({
  id: string().required(),
  user_id: string().required(),
  total_funding: number().required(),
});

export type Fund = InferType<typeof FundSchema>;
export type UserFundingInformation = InferType<
  typeof UserFundingInformationSchema
>;
