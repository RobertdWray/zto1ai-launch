import { notFound } from 'next/navigation';
import { getProposal } from '@/lib/proposals';
import { getSession } from '@/lib/auth';

interface ProposalPageProps {
  params: Promise<{
    proposalId: string;
  }>;
}

export default async function ProposalPage({ params }: ProposalPageProps) {
  const { proposalId } = await params;
  
  // Get proposal configuration
  const proposalConfig = getProposal(proposalId);
  
  if (!proposalConfig) {
    notFound();
  }
  
  // Verify authentication for this specific proposal
  const session = await getSession();
  if (!session || session.proposalId !== proposalId) {
    notFound();
  }
  
  // Dynamically load the proposal component
  const ProposalComponent = (await proposalConfig.component()).default;
  
  return <ProposalComponent />;
}

export async function generateStaticParams() {
  return [
    { proposalId: 'adb' },
  ];
} 