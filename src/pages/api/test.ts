import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../lib/mongodb";
import { User } from "../../lib/models/User";

type ResponseData = {
  message?: string;
  error?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  try {
    await connectToDatabase();

    if (req.method === "POST") {
      const { name, email } = req.body;

      const newUser = new User({ name, email });
      await newUser.save();

      res.status(201).json({ message: "User created successfully." });
    } else {
      res.status(405).json({ error: "Method not allowed." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
}