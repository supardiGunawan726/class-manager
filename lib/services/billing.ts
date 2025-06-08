import { Timestamp } from "firebase/firestore";
import { Billing } from "../firebase/model/billing";
import { BILLING_PERIODS, Fund } from "../firebase/model/fund";

export async function getBillingsByClassId(
  class_id: string,
  q?: { datePeriod?: { seconds: number; nanoseconds: number } }
): Promise<Billing[]> {
  const searchParams = new URLSearchParams();

  if (q?.datePeriod) {
    searchParams.set("datePeriod_seconds", q.datePeriod.seconds.toString());
    searchParams.set(
      "datePeriod_nanoseconds",
      q.datePeriod.nanoseconds.toString()
    );
  }

  const res = await fetch(
    `/api/classes/${class_id}/billings?${searchParams.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "json/application",
      },
    }
  );
  return await res.json();
}

export function getBillingDateInterval(fund: Fund) {
  const start = new Timestamp(
    fund.billing_start_date.seconds,
    fund.billing_start_date.nanoseconds
  ).toDate();
  const end = new Date();

  const billingDateInterval = [];

  do {
    const timestamp = Timestamp.fromDate(start);
    billingDateInterval.push({ ...timestamp });

    switch (fund.billing_period) {
      case BILLING_PERIODS.DAILY.value:
        start.setDate(start.getDate() + 1);
        break;
      case BILLING_PERIODS.WEEKLY.value:
        start.setDate(start.getDate() + 7);
        break;
      case BILLING_PERIODS.MONTHLY.value:
        start.setMonth(start.getMonth() + 1);
        break;
      default:
        throw new Error("Billing period is unknown");
    }
  } while (start.getTime() < end.getTime());

  return billingDateInterval;
}
