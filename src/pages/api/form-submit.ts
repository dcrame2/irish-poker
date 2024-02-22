// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  message: string;
};

// export default function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<Data>
// ) {
//   res.status(200).json({ name: "John Doe" });
// }

import nodemailer from "nodemailer";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method == "POST") {
    console.log(req.body, " req");
    return new Promise((resolve) => {
      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: false,
        auth: {
          user: `${process.env.GOOGLE_EMAIL}`,
          pass: `${process.env.GOOGLE_APP_PASSWORD}`,
        },
      });
      const formDataObj = req.body;

      function createHTMLTableFromObject(obj: any) {
        let tableHTML =
          '<table style="border-collapse: collapse; width: 100%; background-color: white; border: 1px solid black;">';

        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            tableHTML += `<tr>
                                  <td style="border: 1px solid black; padding: 5px; color: black;">${key}</td>
                                  <td style="border: 1px solid black; padding: 5px; color: black;">${obj[key]}</td>
                                </tr>`;
          }
        }

        tableHTML += "</table>";
        return tableHTML;
      }

      let emailHtml = createHTMLTableFromObject(formDataObj);

      let message = {
        from: `Dylan your ish poppin' ${process.env.GOOGLE_EMAIL}`,
        to: `${process.env.GOOGLE_EMAIL}`,
        subject: `${req.body.email} has submitted a form`,
        html: `${emailHtml}`,
      };
      transporter.sendMail(message, (error: any, info: any): any => {
        if (error) {
          console.log("Error occurred while sending form: ", error);
          resolve(
            res.status(500).json({
              message: "Error occurred while sending form",
            })
          );
        } else {
          console.log("Email sent: ", info.response);
          resolve(
            res.status(200).json({
              message: "Successfully sent form data",
            })
          );
        }
      });
    });
  }
}
