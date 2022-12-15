const mongoose = require("mongoose");
const fs = require("fs");
const PDFDocument = require("pdfkit");
const path = require("path");
const { validationResult } = require("express-validator");

const HttpError = require("../errors/http-error");
const Order = require("../models/order");
const User = require("../models/user");

exports.createOrder = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new HttpError(
      "Invalid inputs passed, please check your data.",
      422
    );
    return next(error);
  }

  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  } = req.body;

  const createdOrder = new Order({
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    creator: req.userId,
  });

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();

    await createdOrder.save({ session: sess });
    await User.updateOne(
      { _id: req.userId },
      { $set: { cart: [] } },
      { session: sess }
    );

    await sess.commitTransaction();
    sess.endSession();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, please try again later.",
      500
    );
    return next(error);
  }

  res.status(201).json({ order: createdOrder });
};

exports.getOrder = async (req, res, next) => {
  const { orderId } = req.params;

  let order;
  try {
    order = await Order.findById(orderId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, please try again later.",
      500
    );
    return next(error);
  }

  if (!order) {
    const error = new HttpError("Cannot find order with this id.", 404);
    return next(error);
  }

  res.status(200).json({ order });
};

exports.getOrders = async (req, res, next) => {
  let userOrders;
  try {
    userOrders = await Order.find({ creator: req.userId });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, please try again later.",
      500
    );
    return next(error);
  }

  res.status(200).json({ orders: userOrders });
};

exports.getInvoice = async (req, res, next) => {
  const { orderId } = req.body;

  let existingOrder;
  try {
    existingOrder = await Order.findById(orderId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, please try again later.",
      500
    );
    return next(error);
  }

  if (!existingOrder) {
    const error = new HttpError("Cannot find order with this id.", 404);
    return next(error);
  }

  const invoiceName = `Invoice-${orderId}.pdf`;
  const invoicePath = path.join("invoices", invoiceName);

  const pdfDoc = new PDFDocument({ font: "Courier-Oblique" });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `inline; filename="${invoiceName}"`);

  pdfDoc.pipe(fs.createWriteStream(invoicePath));
  pdfDoc.pipe(res);

  pdfDoc.rect(20, 10, pdfDoc.page.width - 40, pdfDoc.page.height - 20).stroke();

  const imageWidth = 150;
  pdfDoc.image(
    path.join("assets", "Amazon.png"),
    pdfDoc.page.width - imageWidth - 40,
    35,
    { fit: [imageWidth, 100], valign: "center" },
    {
      width: imageWidth,
    }
  );

  pdfDoc.fontSize(30).font("Helvetica-Bold").text("INVOICE", 60, 72, {
    align: "left",
  });

  const billedData = [
    "Billed To",
    `${existingOrder.shippingAddress.name}`,
    `${existingOrder.shippingAddress.address}`,
    `${existingOrder.shippingAddress.country}, ${existingOrder.shippingAddress.city}`,
    `${existingOrder.shippingAddress.postalCode}`,
  ];

  let yAxis = 200;
  for (let i = 0; i < billedData.length; i++) {
    pdfDoc
      .font("Helvetica")
      .fillColor(i === 0 ? "#4336C0" : "#000")
      .fontSize(12)
      .text(billedData[i], 60, yAxis, {
        align: "left",
      });
    yAxis += 12;
  }
  yAxis = 200;

  const date = new Date().toDateString();
  const isseedData = ["Date Issued", date];

  for (let i = 0; i < isseedData.length; i++) {
    pdfDoc
      .font("Helvetica")
      .fillColor(i === 0 ? "#4336C0" : "#000")
      .fontSize(12)
      .text(isseedData[i], 300, yAxis, {
        align: "left",
      });
    yAxis += 12;
  }
  yAxis = 200;

  const paymentMethodData = ["Method", `${existingOrder.paymentMethod}`];
  for (let i = 0; i < paymentMethodData.length; i++) {
    pdfDoc
      .font("Helvetica")
      .fillColor(i === 0 ? "#4336C0" : "#000")
      .fontSize(12)
      .text(paymentMethodData[i], 450, yAxis, {
        align: "left",
      });
    yAxis += 12;
  }
  yAxis = 200;

  pdfDoc
    .moveTo(60, 350)
    .lineTo(pdfDoc.page.width - 64, 350)
    .strokeColor("#4336C0")
    .lineWidth(2)
    .stroke();

  const tableHead = [
    { title: "DESCRIPTION", xAxis: 60 },
    { title: "QTY", xAxis: 350 },
    { title: "AMOUNT", xAxis: 450 },
  ];
  for (let i = 0; i < tableHead.length; i++) {
    pdfDoc
      .font("Helvetica")
      .fillColor("#4336C0")
      .fontSize(10)
      .text(tableHead[i].title, tableHead[i].xAxis, 370, {
        align: "left",
      });
  }

  const orders = existingOrder.orderItems.map((order) => {
    return { title: order.title, quantity: order.quantity, price: order.price };
  });
  let coordinates = [
    { x: 60, y: 400 },
    { x: 357, y: 430 },
    { x: 450, y: 460 },
  ];
  let strokeYaxis = 420;
  let inc = 0;
  for (let i = 0; i < orders.length; i++) {
    pdfDoc
      .font("Helvetica")
      .fillColor("#000")
      .fontSize(12)
      .text(orders[i].title, coordinates[inc].x, coordinates[i].y, {
        align: "left",
      });

    pdfDoc
      .font("Helvetica")
      .fontSize(12)
      .text(orders[i].quantity, coordinates[inc + 1].x, coordinates[i].y, {
        align: "left",
      });

    pdfDoc
      .font("Helvetica")
      .fontSize(12)
      .text(`$${orders[i].price}`, coordinates[inc + 2].x, coordinates[i].y, {
        align: "left",
      });

    pdfDoc
      .moveTo(60, strokeYaxis)
      .lineTo(pdfDoc.page.width - 64, strokeYaxis)
      .strokeColor("#ccc")
      .lineWidth(1)
      .stroke();

    strokeYaxis += 30;
  }

  const amountData = [
    { title: "Shipping", value: existingOrder.shippingPrice },
    { title: "Tax", value: existingOrder.taxPrice },
  ];
  coordinates = [
    { x: 400, y: 520 },
    { x: pdfDoc.page.width - 130, y: 540 },
  ];
  for (let i = 0; i < amountData.length; i++) {
    pdfDoc
      .font("Helvetica")
      .fontSize(12)
      .text(amountData[i].title, coordinates[inc].x, coordinates[i].y, {
        align: "left",
      });

    pdfDoc
      .font("Helvetica")
      .fontSize(12)
      .text(
        `$${amountData[i].value}`,
        coordinates[inc + 1].x,
        coordinates[i].y,
        {
          align: "left",
        }
      );
  }

  pdfDoc
    .moveTo(300, 560)
    .lineTo(pdfDoc.page.width - 64, 560)
    .strokeColor("#4336C0")
    .lineWidth(2)
    .stroke();

  const priceData = ["Total", existingOrder.totalPrice];
  coordinates = [
    { x: 400, y: 570 },
    { x: pdfDoc.page.width - 130, y: 570 },
  ];

  for (let i = 0; i < priceData.length; i++) {
    pdfDoc
      .font("Helvetica-Bold")
      .fontSize(12)
      .text(
        `${i === 0 ? "" : "$"}${priceData[i]}`,
        coordinates[inc].x,
        coordinates[i].y,
        {
          align: "left",
        }
      );
    inc++;
  }

  yAxis = 630;
  const notes = ["Notes", "Thank you for your business!"];
  for (let i = 0; i < notes.length; i++) {
    pdfDoc
      .font("Helvetica")
      .fillColor(i === 0 ? "#4336C0" : "#000")
      .fontSize(12)
      .text(notes[i], 60, yAxis, {
        align: "left",
      });
    yAxis += 12;
  }

  yAxis = 660;
  const terms = ["Terms", "Will be arrive in 2 days!"];
  for (let i = 0; i < terms.length; i++) {
    pdfDoc
      .font("Helvetica")
      .fillColor(i === 0 ? "#4336C0" : "#000")
      .fontSize(12)
      .text(terms[i], 60, yAxis, {
        align: "left",
      });
    yAxis += 12;
  }

  pdfDoc.end();
};
