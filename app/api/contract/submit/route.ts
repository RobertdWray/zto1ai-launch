import { NextRequest, NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { getADBContractTemplate } from '@/lib/contracts/adb-contract';

// Configure SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

interface ContractFormData {
  name: string;
  title: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  proposalId: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as ContractFormData;
    const { name, title, email, phone, company, address, proposalId } = body;
    
    // Validate required fields
    if (!name || !title || !email || !phone || !company || !address) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Only process ADB contracts for now
    if (proposalId !== 'adb') {
      return NextResponse.json(
        { error: 'Invalid proposal ID' },
        { status: 400 }
      );
    }

    // Capture metadata
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     req.headers.get('x-real-ip') || 
                     req.headers.get('cf-connecting-ip') || 
                     'unknown';
    const timestamp = new Date();

    // Generate PDF
    const pdfBuffer = await generateContractPDF({
      name,
      title,
      email,
      phone,
      company,
      address
    }, clientIp, timestamp);

    // Send email with PDF attachment
    if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_FROM_EMAIL) {
      await sendContractEmail(email, pdfBuffer, {
        name,
        company,
        title
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Contract signed successfully' 
    });
  } catch (error) {
    console.error('Contract submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function generateContractPDF(
  data: Omit<ContractFormData, 'proposalId'>,
  clientIp: string,
  timestamp: Date
): Promise<Buffer> {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  
  // Embed fonts
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  // Add a page
  const page = pdfDoc.addPage([612, 792]); // Letter size
  const { width, height } = page.getSize();
  
  // Get contract content
  const contractContent = getADBContractTemplate(data);
  
  // Simple rendering - just add the title and a note
  // In a real implementation, you'd parse and render the full contract
  let yPosition = height - 50;
  
  page.drawText('AI-POWERED PATIENT SIMULATION SYSTEM AGREEMENT', {
    x: 50,
    y: yPosition,
    size: 16,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  
  yPosition -= 40;
  
  page.drawText(`This agreement was electronically signed by ${data.name}`, {
    x: 50,
    y: yPosition,
    size: 12,
    font,
    color: rgb(0, 0, 0),
  });
  
  yPosition -= 20;
  
  page.drawText(`Title: ${data.title} at ${data.company}`, {
    x: 50,
    y: yPosition,
    size: 12,
    font,
    color: rgb(0, 0, 0),
  });
  
  yPosition -= 20;
  
  page.drawText(`Date: ${timestamp.toLocaleString()}`, {
    x: 50,
    y: yPosition,
    size: 12,
    font,
    color: rgb(0, 0, 0),
  });
  
  yPosition -= 20;
  
  page.drawText(`IP Address: ${clientIp}`, {
    x: 50,
    y: yPosition,
    size: 12,
    font,
    color: rgb(0, 0, 0),
  });
  
  // Add audit trail at bottom
  page.drawText('--- ELECTRONIC SIGNATURE AUDIT TRAIL ---', {
    x: 50,
    y: 100,
    size: 10,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  
  page.drawText(`Signed electronically via launch.zto1ai.com on ${timestamp.toISOString()}`, {
    x: 50,
    y: 80,
    size: 8,
    font,
    color: rgb(0, 0, 0),
  });
  
  // Serialize the PDF
  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

async function sendContractEmail(
  to: string,
  pdfBuffer: Buffer,
  userData: { name: string; company: string; title: string }
): Promise<void> {
  const msg = {
    to,
    cc: process.env.SENDGRID_FROM_EMAIL!,
    from: process.env.SENDGRID_FROM_EMAIL!,
    subject: `Zero to One AI - Contract Signed - ${userData.company}`,
    text: `Hello ${userData.name},

Thank you for signing the AI-Powered Patient Simulation System Agreement.

We're excited to partner with ${userData.company} on this innovative project. Attached is a copy of the signed agreement for your records.

Next Steps:
1. You'll receive an invoice for the initial payment within 1 business day
2. Our team will reach out within 24 hours to schedule your kickoff meeting
3. We'll begin the discovery phase to understand your specific needs

If you have any questions, please don't hesitate to reach out.

Best regards,
The Zero to One AI Team`,
    html: `<p>Hello ${userData.name},</p>
<p>Thank you for signing the AI-Powered Patient Simulation System Agreement.</p>
<p>We're excited to partner with ${userData.company} on this innovative project. Attached is a copy of the signed agreement for your records.</p>
<h3>Next Steps:</h3>
<ol>
<li>You'll receive an invoice for the initial payment within 1 business day</li>
<li>Our team will reach out within 24 hours to schedule your kickoff meeting</li>
<li>We'll begin the discovery phase to understand your specific needs</li>
</ol>
<p>If you have any questions, please don't hesitate to reach out.</p>
<p>Best regards,<br>The Zero to One AI Team</p>`,
    attachments: [
      {
        content: pdfBuffer.toString('base64'),
        filename: `ZeroToOneAI_Contract_${userData.company.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`,
        type: 'application/pdf',
        disposition: 'attachment'
      }
    ]
  };

  await sgMail.send(msg);
} 