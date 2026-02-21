import { create } from 'zustand';

export interface BRDSection {
    id: string;
    title: string;
    content: string;
    citations: string[];
    lastEdited?: Date;
}

export interface Conflict {
    id: string;
    requirement1: string;
    requirement2: string;
    source1: string;
    source2: string;
    severity: 'high' | 'medium' | 'low';
    resolved: boolean;
}

interface BRDStore {
    sections: BRDSection[];
    conflicts: Conflict[];
    updateSection: (id: string, content: string) => void;
    addCitation: (sectionId: string, citation: string) => void;
    resolveConflict: (id: string) => void;
    generateSection: (sectionId: string) => Promise<void>;
}

const defaultSections: BRDSection[] = [
    { id: 'exec-summary', title: 'Executive Summary', content: '', citations: [] },
    { id: 'objectives', title: 'Business Objectives', content: '', citations: [] },
    { id: 'stakeholders', title: 'Stakeholder Analysis', content: '', citations: [] },
    { id: 'functional', title: 'Functional Requirements', content: '', citations: [] },
    { id: 'non-functional', title: 'Non-Functional Requirements', content: '', citations: [] },
    { id: 'assumptions', title: 'Assumptions & Constraints', content: '', citations: [] },
    { id: 'metrics', title: 'Success Metrics', content: '', citations: [] },
    { id: 'timeline', title: 'Timeline & Milestones', content: '', citations: [] }
];

export const useBRDStore = create<BRDStore>((set) => ({
    sections: defaultSections,
    conflicts: [
        {
            id: '1',
            requirement1: 'System must support 100 concurrent users',
            requirement2: 'Initial launch limited to 50 users for beta testing',
            source1: 'Email from CTO (Dec 15)',
            source2: 'Slack #general (Dec 20)',
            severity: 'medium',
            resolved: false
        },
        {
            id: '2',
            requirement1: 'Mobile app required for Q1 launch',
            requirement2: 'Focus exclusively on web platform first',
            source1: 'Product meeting notes',
            source2: 'Engineering roadmap document',
            severity: 'high',
            resolved: false
        }
    ],

    updateSection: (id, content) =>
        set((state) => ({
            sections: state.sections.map((s) =>
                s.id === id ? { ...s, content, lastEdited: new Date() } : s
            )
        })),

    addCitation: (sectionId, citation) =>
        set((state) => ({
            sections: state.sections.map((s) =>
                s.id === sectionId ? { ...s, citations: [...s.citations, citation] } : s
            )
        })),

    resolveConflict: (id) =>
        set((state) => ({
            conflicts: state.conflicts.map((c) =>
                c.id === id ? { ...c, resolved: true } : c
            )
        })),

    generateSection: async (sectionId) => {
        // Simulate AI generation
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const demoContent: Record<string, string> = {
            'exec-summary': 'This project aims to modernize the customer portal...',
            'objectives': '1. Improve user experience\n2. Reduce support tickets by 40%...',
            'functional': 'FR-001: User authentication via OAuth2\nFR-002: Dashboard with real-time data...'
        };

        set((state) => ({
            sections: state.sections.map((s) =>
                s.id === sectionId
                    ? { ...s, content: demoContent[sectionId] || 'Generated content...', lastEdited: new Date() }
                    : s
            )
        }));
    }
}));
