'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Calendar, Mail, Phone } from 'lucide-react';
import { ProposalLayout } from '@/components/proposal/ProposalLayout';

export default function ThankYouPage() {
  const params = useParams();
  const proposalId = params.proposalId as string;

  if (proposalId !== 'adb') {
    return (
      <ProposalLayout title="Thank You" subtitle="Page not found">
        <div className="container-custom section-padding py-12">
          <div className="max-w-2xl mx-auto text-center">
            <p>This page is not available.</p>
            <Button asChild className="mt-4">
              <Link href="/">Return to Home</Link>
            </Button>
          </div>
        </div>
      </ProposalLayout>
    );
  }

  return (
    <ProposalLayout 
      title="Thank You!" 
      subtitle="Your agreement has been submitted successfully"
    >
      <div className="container-custom section-padding py-12">
        <div className="max-w-4xl mx-auto">
          {/* Success Message */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
                <h2 className="text-2xl font-bold text-green-600">Contract Signed Successfully!</h2>
                <p className="text-gray-600">
                  Thank you for partnering with Zero to One AI. We&apos;re excited to begin building
                  your AI-powered patient simulation system.
                </p>
                <p className="text-gray-600">
                  A copy of the signed agreement has been sent to your email address.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>What Happens Next?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-zto1-blue text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Invoice & Payment</h3>
                  <p className="text-sm text-gray-600">
                    You&apos;ll receive an invoice for the initial 50% payment ($25,000) within 1 business day.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-zto1-blue text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Kickoff Meeting</h3>
                  <p className="text-sm text-gray-600">
                    Our team will reach out within 24 hours to schedule your project kickoff meeting.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-zto1-blue text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Discovery Phase</h3>
                  <p className="text-sm text-gray-600">
                    We&apos;ll begin the 2-week discovery and architecture phase to understand your specific needs.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Schedule Meeting */}
          <Card className="mb-8 border-2 border-zto1-blue">
            <CardHeader className="bg-gradient-to-r from-zto1-blue to-zto1-blue-light text-white">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Schedule Your Kickoff Meeting
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-600 mb-4">
                Ready to get started? Schedule your kickoff meeting with our team to begin your AI journey.
              </p>
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Google Calendar booking widget will be embedded here</p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Your Zero to One AI Team</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Project Lead</h3>
                  <p className="text-sm text-gray-600 mb-1">Rob Wray, Co-Founder & CEO</p>
                  <div className="space-y-1">
                    <a href="mailto:rob@zto1ai.com" className="text-sm text-zto1-blue hover:underline flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      rob@zto1ai.com
                    </a>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">General Inquiries</h3>
                  <p className="text-sm text-gray-600 mb-1">Zero to One AI Team</p>
                  <div className="space-y-1">
                    <a href="mailto:team@zto1ai.com" className="text-sm text-zto1-blue hover:underline flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      team@zto1ai.com
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Return Button */}
          <div className="text-center mt-8">
            <Button asChild variant="outline">
              <Link href={`/proposal/${proposalId}`}>Return to Proposal</Link>
            </Button>
          </div>
        </div>
      </div>
    </ProposalLayout>
  );
} 