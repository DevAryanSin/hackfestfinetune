"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const hasHydrated = useAuthStore((state) => state._hasHydrated);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        // Wait for hydration to complete
        if (hasHydrated) {
            if (!isAuthenticated) {
                router.push('/login');
            } else {
                setIsChecking(false);
            }
        }
    }, [isAuthenticated, hasHydrated, router]);

    // Show loading while hydrating or checking auth
    if (!hasHydrated || isChecking) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 size={32} className="text-cyan-400 animate-spin mx-auto mb-4" />
                    <p className="text-zinc-400">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null; // Will redirect
    }

    return <>{children}</>;
}
