import { FieldPath } from "firebase-admin/firestore";
import { db } from "../../firebase-admin-config";
import { getUsersDataByClassId } from "./user";

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

export async function getTransactionsByDate(classId, { from, to }) {
  try {
    let transactionsRef = db
      .collection("classes")
      .doc(classId)
      .collection("funds")
      .doc(DEFAULT_FUND_DOC_ID)
      .collection("transactions")
      .orderBy("date", "desc");

    if (typeof from !== "undefined" && typeof to !== "undefined") {
      transactionsRef = transactionsRef
        .where("date", ">=", from)
        .where("date", "<=", to);
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

export async function getUsersBillingByDate(classId, { from, to }) {
  try {
    const users = await getUsersDataByClassId(classId);
    const usersFundingInformation = await getUsersFundingInformationByUids(
      classId,
      users.map((user) => user.uid)
    );

    const fund = await getFund(classId);
    const transactions = await getTransactionsByDate(classId, { from, to });

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
        billing.last_transaction_date =
          transactionsByUser[transactionsByUser.length - 1].date;
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
