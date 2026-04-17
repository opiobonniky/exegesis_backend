export const emailTemplates = {
  verification: (code, firstName) => ({
    subject: "Exegesis App - Verify Your Email",
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f4f4;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 520px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); padding: 40px 40px 30px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #ffffff; letter-spacing: 2px;">
                EXEGESIS
              </h1>
              <p style="margin: 8px 0 0; font-size: 14px; color: rgba(255,255,255,0.8); letter-spacing: 1px;">
                BIBLE APP
              </p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 40px 30px;">
              <h2 style="margin: 0 0 16px; font-size: 24px; font-weight: 600; color: #1e3a5f; text-align: center;">
                Verify Your Email Address
              </h2>
              
              <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #555555; text-align: center;">
                Hello <strong style="color: #1e3a5f;">${firstName || 'there'}</strong>,
              </p>
              
              <p style="margin: 0 0 32px; font-size: 16px; line-height: 1.6; color: #555555; text-align: center;">
                Thank you for creating your Exegesis account. Please use the verification code below to confirm your email address:
              </p>
              
              <!-- Verification Code Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding: 24px; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-radius: 12px; text-align: center; border: 2px dashed #dee2e6;">
                    <p style="margin: 0 0 8px; font-size: 14px; color: #888888; text-transform: uppercase; letter-spacing: 1px;">
                      Your Verification Code
                    </p>
                    <p style="margin: 0; font-size: 36px; font-weight: 700; color: #1e3a5f; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                      ${code}
                    </p>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 24px 0 0; font-size: 14px; color: #888888; text-align: center;">
                This code will expire in <strong>24 hours</strong>. If you didn't request this code, please ignore this email.
              </p>
            </td>
          </tr>
          
          <!-- Scripture Quote -->
          <tr>
            <td style="padding: 0 40px 30px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: linear-gradient(135deg, #fef9f0 0%, #fdf6e3 100%); border-radius: 12px; padding: 20px; border-left: 4px solid #d4a84b;">
                <tr>
                  <td>
                    <p style="margin: 0 0 8px; font-size: 16px; font-style: italic; color: #555555; line-height: 1.6;">
                      "Your word is a lamp for my feet, a light on my path."
                    </p>
                    <p style="margin: 0; font-size: 13px; color: #888888; text-align: right;">
                      — Psalm 119:105
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 24px 40px; text-align: center; border-top: 1px solid #eee;">
              <p style="margin: 0 0 8px; font-size: 14px; color: #888888;">
                Need help? Reply to this email or contact us at
              </p>
              <p style="margin: 0; font-size: 14px; color: #1e3a5f;">
                <a href="mailto:support@exegesis.app" style="color: #1e3a5f; text-decoration: none;">support@exegesis.app</a>
              </p>
              <p style="margin: 16px 0 0; font-size: 12px; color: #aaaaaa;">
                © ${new Date().getFullYear()} Exegesis Bible App. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  }),

  welcome: (firstName) => ({
    subject: "Welcome to Exegesis - Your Spiritual Journey Begins",
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Exegesis</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f4f4;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 520px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); padding: 40px 40px 30px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #ffffff; letter-spacing: 2px;">
                EXEGESIS
              </h1>
              <p style="margin: 8px 0 0; font-size: 14px; color: rgba(255,255,255,0.8); letter-spacing: 1px;">
                BIBLE APP
              </p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 40px 30px;">
              <h2 style="margin: 0 0 16px; font-size: 24px; font-weight: 600; color: #1e3a5f; text-align: center;">
                Welcome, ${firstName}! 🙏
              </h2>
              
              <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #555555; text-align: center;">
                Your account has been successfully created. We're thrilled to have you join our community of believers growing in Scripture daily.
              </p>
              
              <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                <h3 style="margin: 0 0 16px; font-size: 18px; color: #1e3a5f; text-align: center;">
                  What's Next?
                </h3>
                <ul style="margin: 0; padding-left: 20px; color: #555555; line-height: 2;">
                  <li>Complete your daily Bible reading plans</li>
                  <li>Track your spiritual journey</li>
                  <li>Explore verse explanations</li>
                  <li>Connect with other believers</li>
                </ul>
              </div>
              
              <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #555555; text-align: center;">
                <strong>Important:</strong> Please verify your email address using the code sent in a separate email to complete your account setup.
              </p>
            </td>
          </tr>
          
          <!-- Scripture Quote -->
          <tr>
            <td style="padding: 0 40px 30px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: linear-gradient(135deg, #fef9f0 0%, #fdf6e3 100%); border-radius: 12px; padding: 20px; border-left: 4px solid #d4a84b;">
                <tr>
                  <td>
                    <p style="margin: 0 0 8px; font-size: 16px; font-style: italic; color: #555555; line-height: 1.6;">
                      "Trust in the Lord with all your heart and lean not on your own understanding."
                    </p>
                    <p style="margin: 0; font-size: 13px; color: #888888; text-align: right;">
                      — Proverbs 3:5
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 24px 40px; text-align: center; border-top: 1px solid #eee;">
              <p style="margin: 0 0 8px; font-size: 14px; color: #888888;">
                Need help? Reply to this email or contact us at
              </p>
              <p style="margin: 0; font-size: 14px; color: #1e3a5f;">
                <a href="mailto:support@exegesis.app" style="color: #1e3a5f; text-decoration: none;">support@exegesis.app</a>
              </p>
              <p style="margin: 16px 0 0; font-size: 12px; color: #aaaaaa;">
                © ${new Date().getFullYear()} Exegesis Bible App. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  }),

  passwordReset: (code, firstName) => ({
    subject: "Exegesis App - Password Reset Request",
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f4f4;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 520px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); padding: 40px 40px 30px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #ffffff; letter-spacing: 2px;">
                EXEGESIS
              </h1>
              <p style="margin: 8px 0 0; font-size: 14px; color: rgba(255,255,255,0.8); letter-spacing: 1px;">
                BIBLE APP
              </p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 40px 30px;">
              <h2 style="margin: 0 0 16px; font-size: 24px; font-weight: 600; color: #1e3a5f; text-align: center;">
                Reset Your Password
              </h2>
              
              <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #555555; text-align: center;">
                Hello <strong style="color: #1e3a5f;">${firstName || 'there'}</strong>,
              </p>
              
              <p style="margin: 0 0 32px; font-size: 16px; line-height: 1.6; color: #555555; text-align: center;">
                We received a request to reset your password. Use the code below to proceed:
              </p>
              
              <!-- Verification Code Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding: 24px; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-radius: 12px; text-align: center; border: 2px dashed #dee2e6;">
                    <p style="margin: 0 0 8px; font-size: 14px; color: #888888; text-transform: uppercase; letter-spacing: 1px;">
                      Your Reset Code
                    </p>
                    <p style="margin: 0; font-size: 36px; font-weight: 700; color: #1e3a5f; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                      ${code}
                    </p>
                  </td>
                </tr>
              </table>
              
              <div style="background-color: #fff3cd; border-radius: 8px; padding: 16px; margin-top: 24px; border-left: 4px solid #d4a84b;">
                <p style="margin: 0; font-size: 14px; color: #856404; line-height: 1.6;">
                  <strong>⚠️ Security Notice:</strong> If you didn't request this password reset, please ignore this email. Your account is still secure.
                </p>
              </div>
              
              <p style="margin: 24px 0 0; font-size: 14px; color: #888888; text-align: center;">
                This code will expire in <strong>24 hours</strong>.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 24px 40px; text-align: center; border-top: 1px solid #eee;">
              <p style="margin: 0 0 8px; font-size: 14px; color: #888888;">
                Need help? Reply to this email or contact us at
              </p>
              <p style="margin: 0; font-size: 14px; color: #1e3a5f;">
                <a href="mailto:support@exegesis.app" style="color: #1e3a5f; text-decoration: none;">support@exegesis.app</a>
              </p>
              <p style="margin: 16px 0 0; font-size: 12px; color: #aaaaaa;">
                © ${new Date().getFullYear()} Exegesis Bible App. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  }),
};

export default emailTemplates;