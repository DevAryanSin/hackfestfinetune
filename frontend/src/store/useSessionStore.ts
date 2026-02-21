/**
 * useSessionStore — persists the list of BRD sessions to localStorage.
 * This is separate from useBRDStore which handles BRD section content.
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface BRDSession {
    id: string;
    name: string;
    description: string;
    status: 'active' | 'complete' | 'draft';
    createdAt: string; // ISO string
    sections?: number;
    signals?: number;
    words?: number;
}

interface SessionStore {
    sessions: BRDSession[];
    activeSessionId: string | null;
    addSession: (session: Omit<BRDSession, 'createdAt'>) => void;
    setActive: (id: string) => void;
    updateSession: (id: string, patch: Partial<Omit<BRDSession, 'id'>>) => void;
    removeSession: (id: string) => void;
}

const SEED: BRDSession[] = [
    {
        id: 'sess_02a9fe3c',
        name: 'Hackfest Demo Session',
        description: 'Live demo BRD for Hackfest 2.0',
        status: 'active',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        sections: 7, signals: 183, words: 2840,
    },
    {
        id: 'sess_01b7aa2d',
        name: 'Project Alpha Kickoff',
        description: 'Initial requirements for Alpha launch',
        status: 'complete',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        sections: 7, signals: 124, words: 2210,
    },
];

export const useSessionStore = create<SessionStore>()(
    persist(
        (set, get) => ({
            sessions: SEED,
            activeSessionId: SEED[0].id,

            addSession: (session) => {
                const newSession: BRDSession = {
                    ...session,
                    createdAt: new Date().toISOString(),
                };
                set((state) => ({
                    sessions: [newSession, ...state.sessions],
                    activeSessionId: newSession.id,
                }));
            },

            setActive: (id) => set({ activeSessionId: id }),

            updateSession: (id, patch) =>
                set((state) => ({
                    sessions: state.sessions.map((s) =>
                        s.id === id ? { ...s, ...patch } : s
                    ),
                })),

            removeSession: (id) => {
                const state = get();
                set({
                    sessions: state.sessions.filter((s) => s.id !== id),
                    activeSessionId:
                        state.activeSessionId === id
                            ? (state.sessions.find((s) => s.id !== id)?.id ?? null)
                            : state.activeSessionId,
                });
            },
        }),
        {
            name: 'ps21-brd-sessions',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
