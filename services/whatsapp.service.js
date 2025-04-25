import axios from "axios";

export const sendWhatsAppMessage = async (phoneNumber, orderDetails) => {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v19.0/${process.env.WA_PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: phoneNumber,
        type: "text",
        text: {
          body: `Thank you for your order!\n\nOrder Summary:\n${orderDetails}`,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WA_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("WhatsApp message sent:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error sending WhatsApp message:", error.response?.data || error.message);
    throw error;
  }
};
