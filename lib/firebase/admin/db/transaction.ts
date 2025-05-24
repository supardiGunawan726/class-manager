import { bucket, db } from "../../firebase-admin-config";
import { Query, Timestamp } from "firebase-admin/firestore";
import { cleanUndefined } from "@/lib/utils";
import { Transaction } from "../../model/transaction";
import { DEFAULT_FUND_DOC_ID, UserFundingInformation } from "../../model/fund";
import { getUsersFundingInformationByUids } from "./fund";

export async function createTransaction(
  classId: string,
  data: Omit<Transaction, "id">
) {
  try {
    const { user_id, amount, billing_date, date, proof, verified } = data;

    const transactionDoc = db
      .collection("classes")
      .doc(classId)
      .collection("funds")
      .doc(DEFAULT_FUND_DOC_ID)
      .collection("transactions")
      .doc();

    // const convertedDate = new Timestamp(date.seconds, date.nanoseconds);

    // const buffer = new Buffer(proof, "base64")

    // const arrayBuffer = await proof.arrayBuffer();
    // const buffer = Buffer.from(arrayBuffer);
    // const fileRef = bucket.file(
    //   `classes/${classId}/transactions/${transactionDoc.id}/${user_id}_${convertedDate.toMillis()}`
    // );

    // await fileRef.save(proof, {

    // })

    // await fileRef.save(buffer, {
    //   contentType: proof.type,
    // });

    // await fileRef.makePublic();

    const transaction = {
      user_id,
      amount,
      billing_date: new Timestamp(
        billing_date.seconds,
        billing_date.nanoseconds
      ),
      date: new Timestamp(date.seconds, date.nanoseconds),
      proof,
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
      const userFundingInformationData =
        userFundingInformationDoc.data() as Pick<
          UserFundingInformation,
          "total_funding"
        >;
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

export async function getTransaction(classId: string, transactionId: string) {
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

    const transactionData = transactionDoc.data() as Omit<Transaction, "id">;
    return {
      id: transactionDoc.id,
      amount: transactionData.amount,
      billing_date: {
        seconds: transactionData.billing_date.seconds,
        nanoseconds: transactionData.billing_date.nanoseconds,
      },
      date: {
        seconds: transactionData.date.seconds,
        nanoseconds: transactionData.date.nanoseconds,
      },
      proof: transactionData.proof,
      user_id: transactionData.user_id,
      verified: transactionData.verified,
    };
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function getTransactionsByClassId(classId: string) {
  try {
    let transactionsRef: Query = db
      .collection("classes")
      .doc(classId)
      .collection("funds")
      .doc(DEFAULT_FUND_DOC_ID)
      .collection("transactions");

    const transactionsDoc = await transactionsRef.get();

    const transactions = [];
    for (const doc of transactionsDoc.docs) {
      const transactionData = doc.data();
      transactions.push({
        id: doc.id,
        user_id: transactionData.user_id,
        amount: transactionData.amount,
        date: {
          seconds: transactionData.date.seconds,
          nanoseconds: transactionData.date.nanoseconds,
        },
        proof: transactionData.proof,
        verified: transactionData.verified,
        billing_date: {
          seconds: transactionData.billing_date.seconds,
          nanoseconds: transactionData.billing_date.nanoseconds,
        },
      });
    }

    return transactions;
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function getTransactionsByBillingDate(
  classId: string,
  {
    from,
    to,
  }: {
    from: { seconds: number; nanoseconds: number };
    to: { seconds: number; nanoseconds: number };
  }
) {
  try {
    let transactionsRef: Query = db
      .collection("classes")
      .doc(classId)
      .collection("funds")
      .doc(DEFAULT_FUND_DOC_ID)
      .collection("transactions")
      .where("billing_date", ">=", from)
      .where("billing_date", "<", to);

    const transactionsDoc = await transactionsRef.get();

    const transactions = [];
    for (const doc of transactionsDoc.docs) {
      const transactionData = doc.data();
      transactions.push({
        id: doc.id,
        user_id: transactionData.user_id,
        amount: transactionData.amount,
        date: {
          seconds: transactionData.date.seconds,
          nanoseconds: transactionData.date.nanoseconds,
        },
        proof: transactionData.proof,
        verified: transactionData.verified,
        billing_date: {
          seconds: transactionData.billing_date.seconds,
          nanoseconds: transactionData.billing_date.nanoseconds,
        },
      });
    }

    return transactions;
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function getAllTransactions(classId: string) {
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
        billing_date: {
          seconds: data.billing_date.seconds,
          nanoseconds: data.billing_date.nanoseconds,
        },
        date: {
          seconds: data.date.seconds,
          nanoseconds: data.date.nanoseconds,
        },
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

export async function getTransactionsByUserId(classId: string, userId: string) {
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
        billing_date: {
          seconds: data.billing_date.seconds,
          nanoseconds: data.billing_date.nanoseconds,
        },
        date: {
          seconds: data.date.seconds,
          nanoseconds: data.date.nanoseconds,
        },
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

export async function updateTransaction(
  classId: string,
  transactionId: string,
  data: Transaction
) {
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
