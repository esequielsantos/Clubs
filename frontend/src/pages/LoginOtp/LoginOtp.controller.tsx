import { environment } from "@/env";
import { useTranslation } from 'react-i18next';

export const sendEmail = async (email: string): Promise<string> => {
  const { t } = useTranslation();
  try {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      const msg = t('email_invalid', { email });
      return msg;
    }

    const response = await fetch(environment.api + "/auth/loginotp", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ email }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      const msg = data.message;
      return msg;
    } else {
      throw new Error(t('error_sending_email', { status: response.status, statusText: response.statusText }));
    }
  } catch (error) {
    console.error("Request error:", error);
    throw error; // Propagates the error for handling in the component
  }
};

export const validateOtpCode = async (email: string, otpCode: string): Promise<string> => {
  const { t } = useTranslation();
  try {
    const response = await fetch(environment.api + "/auth/loginotp", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({
        email: email,
        otpCode: otpCode,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    if (data.status === 200) {      
      return t('login_successful');
    } else if(data.status === 400) {
      return data.message;
    } else {
      return t('error_validating_otp', { status: response.status });
    }
  } catch (error) {
    console.error("Request error:", error);
    throw error; // Propagates the error for handling in the component
  }
};
