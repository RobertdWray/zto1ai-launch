import { Suspense } from 'react';
import { PasswordForm } from '@/components/auth/PasswordForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-zto1-blue mb-2">Zero to One AI</h1>
          <p className="text-gray-600">Launch Your AI Journey</p>
        </div>

        {/* Password Card */}
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle>Access Your Proposal</CardTitle>
            <CardDescription>
              Enter your secure password to view your personalized AI transformation roadmap
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading...</div>}>
              <PasswordForm />
            </Suspense>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-8">
          © {new Date().getFullYear()} Zero to One AI. All rights reserved.
        </p>
      </div>
    </div>
  );
} 