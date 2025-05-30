export interface ProposalConfig {
  id: string;
  title: string;
  subtitle: string;
  passwordEnvKey: string;
  component: () => Promise<{ default: React.ComponentType }>;
}

export const proposals: Record<string, ProposalConfig> = {
  adb: {
    id: 'adb',
    title: 'American Board of Dermatology',
    subtitle: 'Patient Simulation Training System',
    passwordEnvKey: 'PROPOSAL_PASSWORD_ADB',
    component: () => import('@/components/proposals/adb'),
  },
};

export function getProposal(id: string): ProposalConfig | undefined {
  return proposals[id];
} 