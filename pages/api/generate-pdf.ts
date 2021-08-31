// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import PDFDocument from "pdfkit";
import fs from "fs";
import { join } from "path";
import { v4 as uuidV4 } from "uuid";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string;
};

const link = process.env.NEXT_PUBLIC_BASE_URL as string;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const files = req.body.base64Files as Buffer[];
  const fullName = req.body.fullName as string;
  const title = req.body.title as string;

  const filename = `${uuidV4()}.pdf`;
  const doc = new PDFDocument({
    margins: {
      top: 10,
      left: 20,
      right: 20,
      bottom: 5,
    },
  });

  doc.pipe(fs.createWriteStream(join("./public/generated/", filename)));
  doc.font("Helvetica");
  let x = (doc.page.width - doc.x) / 2;
  let y = 200;
  doc
    .fontSize(15)
    .text(title, x - doc.widthOfString(title) / 2, y)
    .text(
      fullName,
      x - doc.widthOfString(fullName) / 2,
      y + doc.heightOfString(title)
    );

  files.forEach((file, idx) => {
    const pageInfo = `${idx + 1} / ${files.length}`;
    doc.addPage();
    doc.image(file, {
      fit: [
        doc.page.width - doc.page.margins.left - doc.page.margins.right,
        doc.page.height - doc.page.margins.bottom - 50,
      ],
      align: "center",
      valign: "center",
    });

    doc.fontSize(10);
    let x = doc.page.width - 2 * doc.x - doc.widthOfString(pageInfo) * 0.5;
    let y = doc.page.height - 2 * doc.y - doc.heightOfString(pageInfo) * 0.5;

    let _x = doc.x;
    let _y = doc.page.height - 2 * doc.y - doc.heightOfString(pageInfo) * 0.5;
    doc.text(pageInfo, x, y).fillColor("darkblue").text(link, _x, _y);
    doc.save();
  });
  doc.end();
  return res.status(200).json({ name: `/generated/${filename}` });
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "500mb",
    },
  },
};
