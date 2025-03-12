import { environment } from "@/env";
import { HttpStatus, StatusReturn } from "@/provider/useAuth";
import { TFunction } from "i18next";

export interface ResultLogin extends StatusReturn {
  token: string | null;
}


export const sendEmail = async (email: string, t:TFunction): Promise<ResultLogin> => {
  
  try {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      const msg = t('email_invalid', { email });
      return {
        message: msg,
        status: HttpStatus.BAD_REQUEST,
        token: null, 
      }
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
      return data;
    } else {
      throw new Error(t('error_sending_email', { status: response.status, statusText: response.statusText }));
    }
  } catch (error) {
    console.error("Request error:", error);
    throw error; // Propagates the error for handling in the component
  }
};

export const validateOtpCode = async (email: string, otpCode: string): Promise<ResultLogin> => {
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
    return data;
  } catch (error) {
    console.error("Request error:", error);
    throw error;
  }
};
