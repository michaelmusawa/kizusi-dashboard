import axios from "axios";

export interface PaymentRequest {
  id: string;
  currency: string;
  amount: number;
  description: string;
  callback_url: string;
  notification_id: string;
  billing_address: {
    email_address: string;
    phone_number: string;
    country_code: string;
    first_name: string;
    last_name: string;
  };
}

const BASE = "https://cybqa.pesapal.com/pesapalv3/api/Transactions";

export async function submitOrder(payload: PaymentRequest) {
  const token = await getToken();
  const res = await axios.post(`${BASE}/SubmitOrderRequest`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return res.data;
}

export async function getTransactionStatus(orderTrackingId: string) {
  const token = await getToken();
  const res = await axios.get(
    `${BASE}/GetTransactionStatus?orderTrackingId=${orderTrackingId}`,
    {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    }
  );
  return res.data;
}

const getToken = async () => {
  const pesapalConsumerKey = "qkio1BGGYAXTu2JOfm7XSXNruoZsrqEW";
  const pesapalConsumerSecret = "osGQ364R49cXKeOYSpaOnT++rHs=";
  const pesapalEndpoint = "https://cybqa.pesapal.com/pesapalv3";

  // Access Token
  try {
    const tokenResponse = await axios.post(
      `${pesapalEndpoint}/api/Auth/RequestToken`,
      {
        consumer_key: pesapalConsumerKey,
        consumer_secret: pesapalConsumerSecret,
      }
    );

    const accessToken = tokenResponse.data.token;

    if (accessToken) {
      return accessToken; // Return the access token
    } else {
      throw new Error("Failed to retrieve access token from Pesapal.");
    }
  } catch (error) {
    console.error("Error fetching access token:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
};
