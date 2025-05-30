import { z } from 'zod';

// Password verification schema
export const PasswordVerificationSchema = z.object({
  password: z.string().min(1, 'Password is required'),
  returnUrl: z.string().optional(),
});

// Contract submission schema
export const ContractSubmissionSchema = z.object({
  clientName: z.string().min(1, 'Client name is required'),
  clientEmail: z.string().email('Valid email required'),
  companyName: z.string().min(1, 'Company name is required'),
  signature: z.string().min(1, 'Digital signature required'),
  agreementAccepted: z.literal(true, {
    errorMap: () => ({ message: 'Agreement must be accepted' })
  }),
  timestamp: z.date().default(() => new Date()),
});

// Type inference for use throughout app
export type PasswordVerification = z.infer<typeof PasswordVerificationSchema>;
export type ContractSubmission = z.infer<typeof ContractSubmissionSchema>; 