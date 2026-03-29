function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function getOtpHtml(otp) {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>OTP Verification</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
          }
              .container {
              background-color: #fff;
              padding: 20px;
              border-radius: 5px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
              .otp{
              font-size: 24px;
              font-weight: bold;
              color: #333;
          }
      </style>
  </head>
  <body>
      <div class="container">
      <h2>Your OTP code</h2>
          <p class="otp">${otp}</p>
          <p>Please use this code to verify your Email ID.</p>
      </div>
  </body>
  </html>`;
}

export { generateOtp, getOtpHtml };
