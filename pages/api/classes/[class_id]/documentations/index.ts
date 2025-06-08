import {
  createNewDocumentation,
  getAllDocumentations,
} from "@/lib/firebase/admin/db/documentation";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const class_id = req.query.class_id as string;
  let data;
  try {
    data = JSON.parse(req.body);
  } catch (error) {
    data = {};
  }

  switch (req.method) {
    case "GET":
      const documentations = await getAllDocumentations(class_id);
      res.status(200).json(documentations);
      break;
    case "POST":
      await createNewDocumentation(class_id, data);
      res.status(200).end();
      break;
    default:
      res.status(404).json({ message: "not found" });
  }
}
