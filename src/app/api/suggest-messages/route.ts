import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST() {
  try {
    //* Use environment variable for the API key
    const genAI = new GoogleGenerativeAI(
      process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY as string
    );

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt =
      "Get 3 new message suggestions for the writer to write message in the true feedback application. The application is used to send anonymous suggestions to another username. This message can be anything. Use a formal tone for the messages.";

    //* Generate content using AI model
    const result = await model.generateContent(prompt);

    //* Check the response type and extract text
    const text = result.response.text();
    console.log(typeof result.response);

    const messages = text
      .split(/\d+\.\s+/) // Split by number followed by period and whitespace
      .filter((msg) => msg.trim()) // Remove empty strings
      .map((msg) => msg.trim().replace(/^"|"$/g, "")); // Remove surrounding quotes

    console.log("Processed messages:", messages);

    // Return the suggested messages in the response
    return Response.json(
      {
        success: true,
        messages,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("An unexpected error occurred:", error);

    //! Return a generic error message with a 500 status
    return Response.json(
      {
        error: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}
