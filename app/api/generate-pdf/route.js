import puppeteer from "puppeteer";

export async function POST(req) {
  try {
    const body = await req.json(); // Parse incoming JSON data
    const { id, extraData } = body; // Example: Extract user-specific data

    const browser = await puppeteer.launch({
      headless: "new", // Run Puppeteer in headless mode
    });

    const page = await browser.newPage();

    // Extract Clerk authentication cookies
    const cookies = req.headers.get("cookie");
    if (cookies) {
      await page.setExtraHTTPHeaders({ cookie: cookies });
    }

    // Construct URL dynamically
    const url = `${req.nextUrl.origin}/document_templates/${id}/${extraData}`; // Pass userId if needed
    await page.goto(url, { waitUntil: "networkidle2" });

    // Generate A4 PDF with full styling
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true, // Preserve styles
    });

    await browser.close();

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=page.pdf",
      },
    });
  } catch (error) {
    console.error("PDF Generation Error:", error);
    return new Response(JSON.stringify({ message: "Error generating PDF" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
