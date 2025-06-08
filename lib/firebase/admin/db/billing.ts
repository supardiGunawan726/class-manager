import { Billing } from "../../model/billing";
import { getFundByClassId, getUsersFundingInformationByUids } from "./fund";
import {
  getTransactionsByBillingDate,
  getTransactionsByClassId,
} from "./transaction";
import { getUsersDataByClassId } from "./user";
import * as DateFns from "date-fns";
import { Transaction } from "../../model/transaction";
import { getBillingDateInterval } from "@/lib/services/billing";
import { Timestamp } from "firebase-admin/firestore";

export async function getBillingsByClassId(
  classId: string,
  query?: {
    datePeriod?: { seconds: number; nanoseconds: number };
  }
) {
  try {
    const { datePeriod } = query ?? {};
    const users = await getUsersDataByClassId(classId);
    const usersFundingInformation = await getUsersFundingInformationByUids(
      classId,
      users.map((user) => user.uid)
    );

    const fund = await getFundByClassId(classId);

    let transactions: Transaction[] = [];
    if (datePeriod) {
      const billingDateInterval = getBillingDateInterval(fund);
      const convertedbillingDateInterval = billingDateInterval.map(
        (timestamp) =>
          new Timestamp(timestamp.seconds, timestamp.nanoseconds).toDate()
      );
      const convertedDatePeriod = new Timestamp(
        datePeriod.seconds,
        datePeriod.nanoseconds
      ).toDate();
      let closestBillingDateIndex =
        DateFns.closestIndexTo(
          convertedDatePeriod,
          convertedbillingDateInterval
        ) ?? 0;
      if (
        closestBillingDateIndex > 0 &&
        convertedDatePeriod.getTime() <
          convertedbillingDateInterval[closestBillingDateIndex].getTime()
      ) {
        closestBillingDateIndex = closestBillingDateIndex - 1;
      }

      const fromDate = convertedbillingDateInterval[closestBillingDateIndex];
      let toDate =
        convertedbillingDateInterval[
          Math.min(closestBillingDateIndex + 1, billingDateInterval.length - 1)
        ];
      if (fromDate === toDate) {
        toDate = new Date();
      }

      transactions = await getTransactionsByBillingDate(classId, {
        from: Timestamp.fromDate(fromDate),
        to: Timestamp.fromDate(toDate),
      });
    } else {
      transactions = await getTransactionsByClassId(classId);
    }

    const billings = [];

    for (const user of users) {
      const transactionsByUser = transactions.filter(
        (transaction) => transaction.user_id === user.uid
      );
      const amountPaidByUser = transactionsByUser.reduce(
        (amount, transaction) => amount + (transaction.amount || 0),
        0
      );
      const amountBill = fund.billing_amount;

      let status = "unpaid";

      if (amountPaidByUser >= amountBill) {
        status = "paid";
      } else if (amountPaidByUser > 0) {
        status = "partial";
      }

      const billing: Billing = {
        name: user.name,
        amount_paid: amountPaidByUser,
        amount_bill: amountBill,
        status,
        verified:
          transactionsByUser.length > 0
            ? transactionsByUser.reduce(
                (verified, transactions) => transactions.verified && verified,
                true
              )
            : false,
        total_funding: 0,
      };

      if (status === "paid" || status === "partial") {
        billing.last_transaction =
          transactionsByUser[transactionsByUser.length - 1];
      }

      const userFundingInformation = usersFundingInformation.find(
        (userFundingInformation) => userFundingInformation.user_id === user.uid
      );
      billing.total_funding = userFundingInformation?.total_funding || 0;
      billings.push(billing);
    }

    return billings;
  } catch (error) {
    return Promise.reject(error);
  }
}
