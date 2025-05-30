export interface ContractData {
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  address: string;
}

export function getADBContractTemplate(data: ContractData): string {
  const today = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return `
# **AI-POWERED PATIENT SIMULATION SYSTEM AGREEMENT**

This Agreement is entered into as of ${today} ("Effective Date") between:

**Innovative Technology Consulting Corporation** ("Consultant"), operating under the trade name Zero to One AI, located at 2415 Foster Ave Baltimore, MD 21224, and

**${data.company}** ("Client" or "ABD")

## 1. SERVICES AND DELIVERABLES

Consultant agrees to develop and deliver an AI-powered patient simulation system specifically designed for dermatology training, including:

### Core System Components:
- Two (2) fully developed patient simulation scenarios
- 1,000 hours of voice simulation usage
- AI-powered evaluation system with immediate feedback
- Administrative dashboard for user management
- Support for up to 30 concurrent users
- Session transcript storage and email report generation

### Implementation Services:
- System setup and configuration
- Live training session for ABD staff
- Complete documentation
- First year technical support included

## 2. INVESTMENT

**Total System Investment: $50,000**

This one-time investment covers all deliverables listed in Section 1. Additional voice simulation usage beyond the included 1,000 hours will be billed at $0.10 per minute.

## 3. PAYMENT TERMS

Payment is due as follows:
- 50% upon contract execution ($25,000)
- 50% upon system delivery ($25,000)

## 4. DELIVERY TIMELINE

Consultant will deliver the complete system within 10 weeks of contract execution and initial payment receipt, following this schedule:

- **Weeks 1-2**: Discovery & Architecture Design
- **Weeks 3-5**: Core Platform Development
- **Weeks 6-7**: AI Patient Development & Training
- **Weeks 8-9**: Testing & Refinement
- **Week 10**: Deployment & Training

## 5. WARRANTY AND SUPPORT

Consultant warrants that the system will function as specified for one (1) year from delivery. Technical support is included for the first year. After year one, ongoing maintenance and support will be available under a separate agreement.

## 6. INTELLECTUAL PROPERTY

Consultant retains all intellectual property rights to the core platform and AI technology. ABD will have a perpetual, non-exclusive license to use the system for its internal training purposes.

## 7. CONFIDENTIALITY

Both parties agree to maintain the confidentiality of each other's proprietary information disclosed during the course of this engagement.

## 8. DATA SECURITY AND PRIVACY

Consultant will implement appropriate security measures to protect all data. Data retention periods will be configured according to ABD's requirements. ABD maintains full control over its data retention policies.

## 9. TERMINATION

Either party may terminate this agreement with 30 days written notice. In case of termination, ABD will pay for all work completed up to the termination date.

## 10. LIMITATION OF LIABILITY

Consultant's total liability under this agreement shall not exceed the total amount paid by ABD under this agreement.

## 11. GENERAL PROVISIONS

This agreement constitutes the entire agreement between the parties and supersedes all prior negotiations, representations, or agreements. This agreement shall be governed by the laws of Maryland.

## ACCEPTANCE

By signing below, both parties agree to the terms and conditions set forth in this agreement.

**INNOVATIVE TECHNOLOGY CONSULTING CORPORATION**

By: Robert Wray
Title: Owner
Date: ${today}
Address: 2415 Foster Ave Baltimore, MD 21224

**${data.company.toUpperCase()}**

By: ${data.name}
Title: ${data.title}
Date: ${today}
Email: ${data.email}
Phone: ${data.phone}
Address: ${data.address}

---

*This agreement was electronically signed and accepted.*
`;
}

export function getKeyTermsSummary(): string[] {
  return [
    "$50,000 total investment for complete system",
    "Two AI patient simulations included",
    "1,000 hours of voice simulation usage",
    "Support for up to 30 concurrent users",
    "10-week delivery timeline",
    "First year technical support included",  
    "Additional usage at $0.10 per minute",
    "Full data control and security"
  ];
} 