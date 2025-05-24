import { FieldPath } from "firebase-admin/firestore";
import { db } from "../../firebase-admin-config";
import { DEFAULT_FUND_DOC_ID, Fund } from "../../model/fund";

export async function getFundByClassId(classId: string) {
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

    const fundData = fundDoc.data() as Omit<Fund, "id">;

    return {
      id: fundDoc.id,
      billing_amount: fundData.billing_amount,
      billing_period: fundData.billing_period,
      billing_start_date: {
        seconds: fundData.billing_start_date.seconds,
        nanoseconds: fundData.billing_start_date.nanoseconds,
      },
      total_funding: fundData.total_funding || 0,
    };
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function setFund(classId: string, data: Omit<Fund, "id">) {
  try {
    await db
      .collection("classes")
      .doc(classId)
      .collection("funds")
      .doc(DEFAULT_FUND_DOC_ID)
      .set(
        {
          billing_amount: data.billing_amount,
          billing_period: data.billing_period,
          billing_start_date: data.billing_start_date,
          total_funding: data.total_funding || 0,
        },
        { merge: true }
      );
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function getUsersFundingInformationByUids(
  classId: string,
  uids: string[]
) {
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
