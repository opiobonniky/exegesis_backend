import { createTransporter, mailOptions } from "../config/email.js";
import { prisma } from "../config/db.js";

const MAX_RETRIES = 3;

export const sendEmail = async (to, subject, htmlContent) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: `"Exegesis App" <${process.env.MAIL_USERNAME}>`,
    to,
    subject,
    html: htmlContent,
  };

  return transporter.sendMail(mailOptions);
};

export const processPendingMessages = async () => {
  const pendingMessages = await prisma.message.findMany({
    where: {
      status: "PENDING",
      failCount: { lt: MAX_RETRIES },
    },
    take: 10,
  });

  if (pendingMessages.length === 0) {
    console.log("No pending messages to process");
    return;
  }

  console.log(`Processing ${pendingMessages.length} pending messages`);

  for (const msg of pendingMessages) {
    try {
      await sendEmail(msg.recipient, msg.subject || "Exegesis App Notification", msg.message);
      
      await prisma.message.update({
        where: { id: msg.id },
        data: {
          status: "SENT",
          sentOn: new Date(),
          sendCount: { increment: 1 },
          updatedOn: new Date(),
        },
      });
      
      console.log(`Email sent successfully to ${msg.recipient}`);
    } catch (error) {
      console.error(`Failed to send email to ${msg.recipient}:`, error.message);
      
      const newFailCount = msg.failCount + 1;
      const shouldStop = newFailCount >= MAX_RETRIES;
      
      await prisma.message.update({
        where: { id: msg.id },
        data: {
          failCount: newFailCount,
          lastError: error.message,
          sendCount: { increment: 1 },
          status: shouldStop ? "FAILED" : "PENDING",
          updatedOn: new Date(),
        },
      });
      
      if (shouldStop) {
        console.log(`Message ${msg.id} failed after ${MAX_RETRIES} attempts. Stopping.`);
      }
    }
  }
};