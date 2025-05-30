'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertTriangle, DollarSign } from "lucide-react";
import { ProposalLayout } from '@/components/proposal/ProposalLayout';

interface FormData {
  name: string;
  title: string;
  email: string;
  phone: string;
  company: string;
  address: string;
}

export default function ContractPage() {
  const params = useParams();
  const router = useRouter();
  const proposalId = params.proposalId as string;

  const [formData, setFormData] = React.useState<FormData>({
    name: "",
    title: "",
    email: "",
    phone: "",
    company: "American Board of Dermatology",
    address: ""
  });

  const [agreed, setAgreed] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showValidationError, setShowValidationError] = React.useState(false);

  // Check if all required fields are filled
  const allRequiredFilled = formData.name && formData.title && formData.email && 
                           formData.phone && formData.company && formData.address;

  // Get list of missing required fields
  const getMissingFields = () => {
    const missing = [];
    if (!formData.name) missing.push("Full Name");
    if (!formData.title) missing.push("Title / Role");
    if (!formData.email) missing.push("Email");
    if (!formData.phone) missing.push("Phone");
    if (!formData.address) missing.push("Address");
    if (!agreed) missing.push("Agreement checkbox");
    return missing;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if all required fields are filled and agreement is checked
    if (!allRequiredFilled || !agreed) {
      setShowValidationError(true);
      return;
    }

    // Clear any previous validation errors
    setShowValidationError(false);
    setIsSubmitting(true);
    
    try {
      const res = await fetch("/api/contract/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          ...formData,
          proposalId 
        })
      });

      if (res.ok) {
        router.push(`/proposal/${proposalId}/thank-you`);
      } else {
        const errorText = await res.text();
        console.error("Submission failed:", errorText);
      }
    } catch (err) {
      console.error("Network or server error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clear validation error when user starts filling required fields
  React.useEffect(() => {
    if (showValidationError && allRequiredFilled && agreed) {
      setShowValidationError(false);
    }
  }, [showValidationError, allRequiredFilled, agreed]);

  // Generate the contract text
  const today = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const contractText = `
AI-POWERED PATIENT SIMULATION SYSTEM AGREEMENT

This Agreement is entered into as of ${today} ("Effective Date") between:

Zero to One AI, Inc. ("Zero to One AI"), a Delaware corporation, and

${formData.company || '[Company Name]'} ("Client" or "ABD")

1. SERVICES AND DELIVERABLES

Zero to One AI agrees to develop and deliver an AI-powered patient simulation system specifically designed for dermatology training, including:

Core System Components:
• Two (2) fully developed patient simulation scenarios
• 1,000 hours of voice simulation usage
• AI-powered evaluation system with immediate feedback
• Administrative dashboard for user management
• Support for up to 30 concurrent users
• Session transcript storage and email report generation

Implementation Services:
• System setup and configuration
• Live training session for ABD staff
• Complete documentation
• First year technical support included

2. INVESTMENT

Total System Investment: $50,000

This one-time investment covers all deliverables listed in Section 1. Additional voice simulation usage beyond the included 1,000 hours will be billed at $0.10 per minute.

3. PAYMENT TERMS

Payment is due as follows:
• 50% upon contract execution ($25,000)
• 50% upon system delivery ($25,000)

4. DELIVERY TIMELINE

Zero to One AI will deliver the complete system within 10 weeks of contract execution and initial payment receipt, following this schedule:

• Weeks 1-2: Discovery & Architecture Design
• Weeks 3-5: Core Platform Development
• Weeks 6-7: AI Patient Development & Training
• Weeks 8-9: Testing & Refinement
• Week 10: Deployment & Training

5. WARRANTY AND SUPPORT

Zero to One AI warrants that the system will function as specified for one (1) year from delivery. Technical support is included for the first year. After year one, ongoing maintenance and support will be available under a separate agreement.

6. INTELLECTUAL PROPERTY

Zero to One AI retains all intellectual property rights to the core platform and AI technology. ABD will have a perpetual, non-exclusive license to use the system for its internal training purposes.

7. CONFIDENTIALITY

Both parties agree to maintain the confidentiality of each other's proprietary information disclosed during the course of this engagement.

8. DATA SECURITY AND PRIVACY

Zero to One AI will implement appropriate security measures to protect all data. Data retention periods will be configured according to ABD's requirements. ABD maintains full control over its data retention policies.

9. TERMINATION

Either party may terminate this agreement with 30 days written notice. In case of termination, ABD will pay for all work completed up to the termination date.

10. LIMITATION OF LIABILITY

Zero to One AI's total liability under this agreement shall not exceed the total amount paid by ABD under this agreement.

11. GENERAL PROVISIONS

This agreement constitutes the entire agreement between the parties and supersedes all prior negotiations, representations, or agreements. This agreement shall be governed by the laws of Delaware.

ACCEPTANCE

By signing below, both parties agree to the terms and conditions set forth in this agreement.

ZERO TO ONE AI, INC.

By: Robert Wray
Title: Co-Founder & CEO
Date: ${today}

${formData.company ? formData.company.toUpperCase() : '[COMPANY NAME]'}

By: ${formData.name || '[Your Name]'}
Title: ${formData.title || '[Your Title]'}
Date: ${today}
Email: ${formData.email || '[Your Email]'}
Phone: ${formData.phone || '[Your Phone]'}
Address: ${formData.address || '[Your Address]'}
  `;

  if (proposalId !== 'adb') {
    return (
      <ProposalLayout title="Contract Not Available" subtitle="This proposal does not have a contract available">
        <div className="container-custom section-padding py-12">
          <div className="max-w-2xl mx-auto text-center">
            <p>The contract for this proposal is not available.</p>
            <Button asChild className="mt-4">
              <Link href={`/proposal/${proposalId}`}>Return to Proposal</Link>
            </Button>
          </div>
        </div>
      </ProposalLayout>
    );
  }

  return (
    <ProposalLayout 
      title="Contract Agreement" 
      subtitle="American Board of Dermatology - AI Patient Simulation System"
    >
      <div className="container-custom section-padding py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Summary of Key Terms */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-zto1-blue" />
                Key Terms Summary
              </CardTitle>
              <CardDescription>
                Review the main points of the agreement below
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2 text-gray-800">
                <li>$50,000 total investment for complete system</li>
                <li>Two AI patient simulations included</li>
                <li>1,000 hours of voice simulation usage</li>
                <li>Support for up to 30 concurrent users</li>
                <li>10-week delivery timeline</li>
                <li>First year technical support included</li>
                <li>Additional usage at $0.10 per minute</li>
                <li>Full data control and security</li>
              </ul>
              <p className="text-sm text-amber-600 mt-4 font-medium">
                *This summary is for convenience only. Please review the full agreement below before accepting.
              </p>
            </CardContent>
          </Card>

          {/* Full Agreement Text */}
          <Card>
            <CardHeader>
              <CardTitle>Full Agreement</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96 w-full border rounded-lg p-4 bg-gray-50">
                <div className="pr-4 text-sm leading-relaxed whitespace-pre-wrap font-mono">
                  {contractText}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Form Fields */}
          <Card>
            <CardHeader>
              <CardTitle>Your Information</CardTitle>
              <CardDescription>
                Please provide your information to complete the agreement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Validation Error Alert */}
                {showValidationError && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Missing Required Fields</AlertTitle>
                    <AlertDescription>
                      Please complete the following required fields to continue:
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        {getMissingFields().map((field, index) => (
                          <li key={index}>{field}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Full Name <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="title">
                      Title / Role <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      id="title"
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      required
                      placeholder="Enter your title or role"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">
                    Company <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    id="company"
                    type="text"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    required
                    placeholder="Enter your company name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">
                    Business Address <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    id="address"
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    required
                    placeholder="Enter your business address"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      Phone <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      required
                      placeholder="Enter your phone number"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Email <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>

                {/* Agreement Checkbox */}
                <div className="flex items-start space-x-3 p-4 border rounded-lg bg-blue-50">
                  <Checkbox
                    id="agree"
                    checked={agreed}
                    onCheckedChange={(checked: boolean) => setAgreed(checked)}
                    required
                  />
                  <Label htmlFor="agree" className="text-sm leading-relaxed">
                    I have read and agree to the terms of the AI-Powered Patient Simulation System Agreement above. 
                    I understand that by checking this box and submitting this form, I am entering into a legally 
                    binding agreement on behalf of my organization.
                  </Label>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={!agreed || isSubmitting}
                  className="w-full md:w-auto bg-zto1-blue hover:bg-zto1-blue-dark"
                  size="lg"
                >
                  {isSubmitting ? "Processing..." : "Sign Agreement & Launch Project"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProposalLayout>
  );
} 