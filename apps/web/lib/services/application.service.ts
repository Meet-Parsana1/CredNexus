import { UserApplication } from '../types';

export class ApplicationService {
  private static applications: UserApplication[] = [
    {
      id: 'app_demo_101',
      schemeId: 'sch_nbcfdc_micro',
      schemeName: 'NBCFDC Micro Finance Scheme',
      partnerId: 'prt_bob_ahmedabad_04',
      partnerName: 'Bank of Baroda - Financial Inclusion Hub',
      projectAmount: 120000,
      purpose: 'Small Business - Textile / Tailoring Modernization',
      status: 'GUIDED_TO_PARTNER',
      statusNotes: 'Document dossier generated. Direct physical verification scheduled at Bank of Baroda branch.',
      createdAt: '2026-03-08',
      updatedAt: '2026-03-10',
      requiredDocuments: [
        { name: 'Aadhaar Card', uploaded: true },
        { name: 'Income Certificate', uploaded: true },
        { name: 'OBC Community Certificate', uploaded: true },
        { name: 'Bank Statement (6 months)', uploaded: false },
      ],
    },
  ];

  public static getApplications(): UserApplication[] {
    return this.applications;
  }

  public static createApplication(
    app: Omit<UserApplication, 'id' | 'createdAt' | 'updatedAt' | 'status'>
  ): UserApplication {
    const created: UserApplication = {
      ...app,
      id: `app_demo_${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
      status: 'GUIDED_TO_PARTNER',
    };
    this.applications.unshift(created);
    return created;
  }
}
