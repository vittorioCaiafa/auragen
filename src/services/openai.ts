import axios from "axios";
import { OPENAI_API_KEY } from "@env";

export const askAI = async (messages: any[]) => {
  const res = await axios.post("https://api.openai.com/v1/chat/completions", {
    model: "gpt-4o", // you can use gpt-3.5-turbo for cheaper testing
    messages,
  }, {
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    }
  });

  return res.data.choices[0].message.content;
};
