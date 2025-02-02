import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { plaintiff, defendant, fileContent } = req.body;

    if (!plaintiff || !defendant || !fileContent) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Define base directory (change this to your desired location)
    const baseDir = path.join(process.env.HOME || process.env.USERPROFILE, "Documents", "CaseFiles");

    // Create folder with Plaintiff and Defendant names
    const folderName = `${plaintiff}_${defendant}`;
    const folderPath = path.join(baseDir, folderName);

    // Ensure folder exists
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    // Generate dynamic file name with timestamp
    const fileName = `case_${Date.now()}.txt`;
    const filePath = path.join(folderPath, fileName);

    // Write the file
    fs.writeFileSync(filePath, fileContent, "utf8");

    return res.status(200).json({ message: "File saved successfully", filePath });
  } catch (error) {
    return res.status(500).json({ message: "Error saving file", error: error.message });
  }
}
