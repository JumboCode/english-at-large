// Email configuration
const EMAIL_CONFIG = {
  from: "English at Large Library <library@englishatlarge.org>",
};

// Reusable email template wrapper
function createEmailTemplate(content: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }
          .email-header {
            background: #1E3A8A;
            color: #ffffff;
            padding: 30px;
            text-align: center;
          }
          .email-header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
          }
          .email-body {
            padding: 30px;
          }
          .info-box {
            background-color: #f8f9fa;
            border-left: 4px solid #1E3A8A;
            padding: 15px 20px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .info-row {
            margin: 10px 0;
          }
          .info-label {
            font-weight: 600;
            color: #1E3A8A;
            display: inline-block;
            min-width: 140px;
          }
          .info-value {
            color: #333;
          }
          .alert-box {
            background-color: #fff3cd;
            border-left: 4px solid 1E3A8A;
            padding: 15px 20px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .email-footer {
            background-color: #f8f9fa;
            padding: 20px 30px;
            text-align: center;
            font-size: 14px;
            color: #6c757d;
            border-top: 1px solid #e9ecef;
          }
          .divider {
            height: 1px;
            background-color: #e9ecef;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          ${content}
          <div class="email-footer">
            <p>English at Large Library System</p>
            <p style="margin: 5px 0; font-size: 12px;">This is an automated notification. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

// Template 1: New Book Request (for Admins/Tutors)
function createBookBorrowedEmail(
  borrowerName: string,
  borrowerId: string,
  bookTitle: string,
  bookId: number,
  borrowedDate: Date
): {
  subject: string;
  text: string;
  html: string;
} {
  const formattedDate = borrowedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return {
    subject: `New Book Request`,
    text: `New Book Request

Borrower: ${borrowerName}
Borrower ID: ${borrowerId}
Book: ${bookTitle}
Book ID: ${bookId}
Request Date: ${formattedDate}

Please process this request at your earliest convenience.

---
English at Large Library System`,

    html: createEmailTemplate(`
      <div class="email-header">
        <h1>📚 New Book Request</h1>
      </div>
      <div class="email-body">
        <p>A new book request has been submitted and requires processing.</p>
        
        <div class="info-box">
          <div class="info-row">
            <span class="info-label">Borrower:</span>
            <span class="info-value">${borrowerName}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Borrower ID:</span>
            <span class="info-value">${borrowerId}</span>
          </div>
          <div class="divider"></div>
          <div class="info-row">
            <span class="info-label">Book Title:</span>
            <span class="info-value">${bookTitle}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Book ID:</span>
            <span class="info-value">${bookId}</span>
          </div>
          <div class="divider"></div>
          <div class="info-row">
            <span class="info-label">Request Date:</span>
            <span class="info-value">${formattedDate}</span>
          </div>
        </div>

        <p style="margin-top: 30px; color: #6c757d; font-size: 14px;">
          Please process this request at your earliest convenience.
        </p>
      </div>
    `),
  };
}

// Template 2: Hold to Pickup Notification (for Borrower)
function createPickupNotificationEmail(
  userName: string,
  bookTitle: string,
  bookId: number,
  requestDate: Date,
  exceededLimit: boolean
): {
  subject: string;
  text: string;
  html: string;
} {
  const formattedDate = requestDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return {
    subject: `Book Ready for Pickup: ${bookTitle}`,
    text: `Hello ${userName},

Great news! Your book is now ready for pickup.

Book: ${bookTitle}
Book ID: ${bookId}
Hold Placed: ${formattedDate}

${exceededLimit ? "IMPORTANT: You have reached the maximum number of borrowed books. Please return a book before picking up this one.\n\n" : ""}Please visit the library to collect your book at your earliest convenience.

Thank you,
English at Large Library System`,

    html: createEmailTemplate(`
      <div class="email-header">
        <h1>Book Ready for Pickup</h1>
      </div>
      <div class="email-body">
        <p>Hello ${userName},</p>
        <p>Great news! Your book hold has been processed and is now ready for pickup.</p>
        
        <div class="info-box">
          <div class="info-row">
            <span class="info-label">Book Title:</span>
            <span class="info-value">${bookTitle}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Book ID:</span>
            <span class="info-value">${bookId}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Hold Placed:</span>
            <span class="info-value">${formattedDate}</span>
          </div>
        </div>

        ${
          exceededLimit
            ? `
        <div class="alert-box">
          <strong>⚠️ Important Notice</strong>
          <p style="margin: 10px 0 0 0;">You have reached the maximum number of borrowed books. Please return a book before picking up this one.</p>
        </div>
        `
            : ""
        }

        <p style="margin-top: 30px;">Please visit the library to collect your book at your earliest convenience.</p>
      </div>
    `),
  };
}

// Template 3: Hold to Pickup Admin Notification
function createPickupAdminNotificationEmail(
  holderName: string,
  holderEmail: string,
  holderId: string,
  bookTitle: string,
  bookId: number,
  requestDate: Date,
  exceededLimit: boolean
): {
  subject: string;
  text: string;
  html: string;
} {
  const formattedDate = requestDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return {
    subject: `Status Update: Hold → Pickup (${holderName})`,
    text: `Hold Status Changed to Pickup

Borrower: ${holderName}
Email: ${holderEmail}
Borrower ID: ${holderId}
Book: ${bookTitle}
Book ID: ${bookId}
Hold Date: ${formattedDate}

${exceededLimit ? "WARNING: This user has exceeded the maximum number of requests. Please ensure they return a book before loaning this one.\n\n" : ""}Please ensure proper handling of this request.

---
English at Large Library System`,

    html: createEmailTemplate(`
      <div class="email-header">
        <h1>📋 Status Update: Hold → Pickup</h1>
      </div>
      <div class="email-body">
        <p>A book hold status has been changed to pickup and is ready for collection.</p>
        
        <div class="info-box">
          <div class="info-row">
            <span class="info-label">Borrower:</span>
            <span class="info-value">${holderName}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Email:</span>
            <span class="info-value">${holderEmail}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Borrower ID:</span>
            <span class="info-value">${holderId}</span>
          </div>
          <div class="divider"></div>
          <div class="info-row">
            <span class="info-label">Book Title:</span>
            <span class="info-value">${bookTitle}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Book ID:</span>
            <span class="info-value">${bookId}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Hold Date:</span>
            <span class="info-value">${formattedDate}</span>
          </div>
        </div>

        ${
          exceededLimit
            ? `
        <div class="alert-box">
          <strong>⚠️ Warning: Maximum Requests Exceeded</strong>
          <p style="margin: 10px 0 0 0;">This user has exceeded the maximum number of requests. Please ensure they return a book before loaning this one.</p>
        </div>
        `
            : ""
        }

        <p style="margin-top: 30px; color: #6c757d; font-size: 14px;">
          Please ensure proper handling of this pickup request.
        </p>
      </div>
    `),
  };
}

// Example usage in your controllers:
export {
  EMAIL_CONFIG,
  createBookBorrowedEmail,
  createPickupNotificationEmail,
  createPickupAdminNotificationEmail,
};

/* 
USAGE EXAMPLE:

// In postRequestController:
const emailContent = createBookBorrowedEmail(
  borrower?.name ?? "[No Username]",
  requestData.userId,
  requestData.bookTitle,
  requestData.bookId,
  requestData.requestedOn
);

const tutorEmails = tutors.map((user) => ({
  to: user.email!,
  from: EMAIL_CONFIG.from,
  ...emailContent
}));

// In putRequestController for tutor notification:
const tutorEmailContent = createPickupNotificationEmail(
  user.name ?? "[No Username]",
  book.title,
  book.id,
  requestData.requestedOn,
  exceededLimit
);

const tutorMsg = {
  to: user.email,
  from: EMAIL_CONFIG.from,
  ...tutorEmailContent
};

// For admin notification:
const adminEmailContent = createPickupAdminNotificationEmail(
  user.name ?? "[No Username]",
  user.email,
  requestData.userId,
  requestData.bookTitle,
  requestData.bookId,
  requestData.requestedOn,
  exceededLimit
);
*/
