export function ForgotPassword(code: number, key: string) {
  return ` <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
            <tr>
              <td style="background-color: #007bff; text-align: center; padding: 10px; color: #ffffff; font-size: 24px; border-radius: 8px 8px 0 0;">
                Password Reset Request
              </td>
            </tr>
            <tr>
              <td style="padding: 20px; color: #333;">
                <p>Hello,</p>
                <p>We received a request to reset the password for your account. Please use the OTP code and Encryption_Key below to reset your password. These are valid for 5 minutes.</p>
 
                <div style="text-align: center; font-size: 28px; font-weight: bold; color: #ffffff; margin: 20px 0;">
                  <p style="color: #007bff">Otp:</p> ${code}
                </div>
                <div style="text-align: center; font-size: 28px; font-weight: bold; color: #ffffff; margin: 20px 0;">
                  <p style="color:#007bff">Encryption_Key:</p> ${key}
                </div>

                <p>If you did not request a password reset, please ignore this email or contact our support team.</p>
                <p>Thanks,<br />The Support Team</p>
              </td>
            </tr>
            <tr>
              <td style="text-align: center; padding: 20px; font-size: 12px; color: #777;">
                &copy; 2024 Your Company. All rights reserved.<br />
                You received this email because you requested a password reset.
              </td>
            </tr>
          </table>
        </div>`;
}
