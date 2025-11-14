
export const verifyEmailTemplate = (data) => {
const { fullName, otp: OTP, expiry_minutes, company_name } = data
  const html = `<!DOCTYPE html>
<html lang="en">

<head>
    <title>Verify your email address | ${company_name} </title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
</head>

<body style="background:#F9F9F9; margin:0; padding:0; font-family: Arial, sans-serif;">

    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%"
        style="max-width:600px; background:#ffffff; margin:40px auto; border-radius:8px; box-shadow:0 2px 6px rgba(0,0,0,0.1);">
        <tr>
            <td
                style="background:#ff5724; padding:30px; text-align:center; color:#ffffff; font-size:24px; font-weight:bold; border-radius:8px 8px 0 0;">
                Verify Your Email
            </td>
        </tr>

        <tr>
            <td style="padding:30px; color:#333333; font-size:16px; line-height:24px;">
                <p>Hi <strong>${fullName}</strong>,</p>
                <p>Thanks for signing up! Please verify your email address to complete your registration.</p>
                <p>You can verify using either of the following methods:</p>
                <div
                    style="margin:20px 0; font-size:24px; font-weight:bold; text-align:center; letter-spacing:4px; color:#ff5724;">
                    ${OTP}
                </div>
                <p style="text-align:center; font-size:14px; color:#555;">(This OTP will expire in ${expiry_minutes}
                    minutes)</p>
                <p>If you did not request this, please ignore this email or contact our support team.</p>
                <p style="margin-top:30px;">Thanks,<br><strong>${company_name}</strong></p>
            </td>
        </tr>

        <tr>
            <td
                style="background:#f4f4f4; text-align:center; padding:15px; font-size:12px; color:#999999; border-radius:0 0 8px 8px;">
                © 2025 ${company_name}. All rights reserved.
            </td>
        </tr>
    </table>
</body>

</html>`;

return html
}