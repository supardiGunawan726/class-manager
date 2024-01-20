import { FieldPath } from "firebase-admin/firestore";
import { bucket, db } from "../../firebase-admin-config";
import { getUsersDataByClassId } from "./user";
import { Timestamp } from "firebase-admin/firestore";
import { BILLING_PERIODS, cleanUndefined } from "@/lib/utils";
import * as DateFns from "date-fns";

export const DEFAULT_FUND_DOC_ID = "default-fund";

export async function getFund(classId) {
  try {
    const fundDoc = await db
      .collection("classes")
      .doc(classId)
      .collection("funds")
      .doc(DEFAULT_FUND_DOC_ID)
      .get();

    if (!fundDoc.exists) {
      throw new Error("Fund haven't setup yet");
    }

    const fundData = fundDoc.data();

    return {
      id: fundDoc.id,
      billing_amount: fundData.billing_amount,
      billing_period: fundData.billing_period,
      billing_start_date: { ...fundData.billing_start_date },
      total_funding: fundData.total_funding || 0,
    };
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function setFund(classId, data) {
  try {
    await db
      .collection("classes")
      .doc(classId)
      .collection("funds")
      .doc(DEFAULT_FUND_DOC_ID)
      .set({
        billing_amount: data.billing_amount,
        billing_period: data.billing_period,
        billing_start_date: data.billing_start_date,
        total_collected: data.total_collected || 0,
      });
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function getUsersFundingInformationByUids(classId, uids) {
  try {
    const usersFundingInformationDoc = await db
      .collection("classes")
      .doc(classId)
      .collection("funds")
      .doc(DEFAULT_FUND_DOC_ID)
      .collection("users-information")
      .where(FieldPath.documentId(), "in", uids)
      .get();

    const usersFundingInformation = [];
    for (const doc of usersFundingInformationDoc.docs) {
      const userFundingInformationData = doc.data();

      usersFundingInformation.push({
        id: doc.id,
        user_id: doc.id,
        total_funding: userFundingInformationData.total_funding,
      });
    }

    return usersFundingInformation;
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function getTransaction(classId, transactionId) {
  try {
    const transactionDoc = await db
      .collection("classes")
      .doc(classId)
      .collection("funds")
      .doc(DEFAULT_FUND_DOC_ID)
      .collection("transactions")
      .doc(transactionId)
      .get();

    if (!transactionDoc.exists) {
      return new Error("Transaction not found");
    }

    const transactionData = transactionDoc.data();
    return {
      id: transactionDoc.id,
      amount: transactionData.amount,
      billing_date: { ...transactionData.billing_date },
      date: { ...transactionData.date },
      proof: transactionData.proof,
      user_id: transactionData.user_id,
      verified: transactionData.verified,
    };
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function getTransactionsByBillingDate(classId, { from, to }) {
  try {
    let transactionsRef = db
      .collection("classes")
      .doc(classId)
      .collection("funds")
      .doc(DEFAULT_FUND_DOC_ID)
      .collection("transactions");

    if (typeof from !== "undefined" && typeof to !== "undefined") {
      transactionsRef = transactionsRef
        .where("billing_date", ">=", from)
        .where("billing_date", "<", to);
    }

    const transactionsDoc = await transactionsRef.get();

    const transactions = [];
    for (const doc of transactionsDoc.docs) {
      const transactionData = doc.data();
      transactions.push({
        id: doc.id,
        user_id: transactionData.user_id,
        amount: transactionData.amount,
        date: { ...transactionData.date },
        proof: transactionData.proof,
        verified: transactionData.verified,
      });
    }

    return transactions;
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function getAllTransactions(classId) {
  try {
    const transactionsDoc = await db
      .collection("classes")
      .doc(classId)
      .collection("funds")
      .doc(DEFAULT_FUND_DOC_ID)
      .collection("transactions")
      .orderBy("date", "desc")
      .get();

    const transactions = [];

    for (const doc of transactionsDoc.docs) {
      const data = doc.data();
      transactions.push({
        id: doc.id,
        amount: data.amount,
        billing_date: { ...data.billing_date },
        date: { ...data.date },
        proof: data.proof,
        user_id: data.user_id,
        verified: data.verified,
      });
    }

    return transactions;
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function getTransactionsByUserId(classId, userId) {
  try {
    const transactionsDoc = await db
      .collection("classes")
      .doc(classId)
      .collection("funds")
      .doc(DEFAULT_FUND_DOC_ID)
      .collection("transactions")
      .where("user_id", "==", userId)
      .get();

    const transactions = [];

    for (const doc of transactionsDoc.docs) {
      const data = doc.data();
      transactions.push({
        id: doc.id,
        amount: data.amount,
        billing_date: { ...data.billing_date },
        date: { ...data.date },
        proof: data.proof,
        user_id: data.user_id,
        verified: data.verified,
      });
    }

    return transactions;
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function updateTransaction(classId, transactionId, data) {
  try {
    await db
      .collection("classes")
      .doc(classId)
      .collection("funds")
      .doc(DEFAULT_FUND_DOC_ID)
      .collection("transactions")
      .doc(transactionId)
      .update(
        cleanUndefined({
          amount: data.amount,
          billing_date: data.billing_date,
          date: data.date,
          proof: data.proof,
          user_id: data.user_id,
          verified: data.verified,
        })
      );
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function getUsersBillingByPeriod(
  classId,
  { fund, datePeriod, billingDateInterval }
) {
  try {
    const users = await getUsersDataByClassId(classId);
    const usersFundingInformation = await getUsersFundingInformationByUids(
      classId,
      users.map((user) => user.uid)
    );

    const convertedbillingDateInterval = billingDateInterval.map((timestamp) =>
      new Timestamp(timestamp._seconds, timestamp._nanoseconds).toDate()
    );
    const convertedDatePeriod = new Timestamp(
      datePeriod._seconds,
      datePeriod._nanoseconds
    ).toDate();
    let closestBillingDateIndex = DateFns.closestIndexTo(
      convertedDatePeriod,
      convertedbillingDateInterval
    );
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

    const transactions = await getTransactionsByBillingDate(classId, {
      from: Timestamp.fromDate(fromDate),
      to: Timestamp.fromDate(toDate),
    });

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

      const billing = {
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

export function getBillingDateInterval(fund) {
  const start = new Timestamp(
    fund.billing_start_date._seconds,
    fund.billing_start_date._nanoseconds
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

export async function createTransaction(classId, data) {
  try {
    const { user_id, amount, billing_date, date, proof, verified } = data;

    const transactionDoc = db
      .collection("classes")
      .doc(classId)
      .collection("funds")
      .doc(DEFAULT_FUND_DOC_ID)
      .collection("transactions")
      .doc();

    const arrayBuffer = await proof.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileRef = bucket.file(
      `classes/${classId}/transactions/${transactionDoc.id}/${proof.name}`
    );

    await fileRef.save(buffer, {
      contentType: proof.type,
    });

    await fileRef.makePublic();

    const transaction = {
      user_id,
      amount,
      billing_date: new Timestamp(
        billing_date._seconds,
        billing_date._nanoseconds
      ),
      date: new Timestamp(date._seconds, date._nanoseconds),
      proof: fileRef.publicUrl(),
      verified,
    };

    await transactionDoc.set(transaction);

    const userFundingInformationRef = db
      .collection("classes")
      .doc(classId)
      .collection("funds")
      .doc(DEFAULT_FUND_DOC_ID)
      .collection("users-information")
      .doc(user_id);
    const userFundingInformationDoc = await userFundingInformationRef.get();

    if (userFundingInformationDoc.exists) {
      const userFundingInformationData = userFundingInformationDoc.data();
      await userFundingInformationRef.update({
        total_funding: (userFundingInformationData.total_funding || 0) + amount,
      });
    } else {
      await userFundingInformationRef.set({
        total_funding: amount,
      });
    }
  } catch (error) {
    return Promise.reject(error);
  }
}