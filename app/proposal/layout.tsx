import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';

export default async function ProposalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check authentication at the layout level
  const session = await getSession();
  
  if (!session || !session.authenticated) {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="container-custom section-padding py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-zto1-blue">Zero to One AI</h1>
              <p className="text-sm text-gray-600">Your AI Transformation Journey</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="mt-16 border-t border-gray-200 bg-gray-50">
        <div className="container-custom section-padding py-8">
          <div className="text-center text-sm text-gray-600">
            <p>© {new Date().getFullYear()} Zero to One AI. All rights reserved.</p>
            <p className="mt-2">Confidential and Proprietary</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 