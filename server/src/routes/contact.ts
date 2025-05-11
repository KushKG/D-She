import express, { Request, Response } from 'express';
import nodemailer from 'nodemailer';

const router = express.Router();

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, email, phone, productId, productName } = req.body;

    // Email to boutique owner
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.BOUTIQUE_EMAIL,
      subject: `New Interest in Product: ${productName}`,
      html: `
        <h2>New Product Interest</h2>
        <p><strong>Product:</strong> ${productName}</p>
        <p><strong>Product ID:</strong> ${productId}</p>
        <p><strong>Customer Name:</strong> ${name}</p>
        <p><strong>Customer Email:</strong> ${email}</p>
        <p><strong>Customer Phone:</strong> ${phone}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    // Confirmation email to customer
    const customerMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank you for your interest in D-She Boutique',
      html: `
        <h2>Thank you for your interest!</h2>
        <p>Dear ${name},</p>
        <p>Thank you for your interest in our product: ${productName}</p>
        <p>We have received your inquiry and will contact you shortly.</p>
        <p>Best regards,<br>D-She Boutique Team</p>
      `,
    };

    await transporter.sendMail(customerMailOptions);

    res.status(200).json({ message: 'Interest form submitted successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Error submitting interest form' });
  }
});

export default router; 