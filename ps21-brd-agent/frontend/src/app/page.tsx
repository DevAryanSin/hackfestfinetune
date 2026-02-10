import Link from 'next/link';
import { ArrowRight, Zap, Shield, Sparkles, Check } from 'lucide-react';

export default function HomePage() {
    return (
        <div className="min-h-screen bg-zinc-950">
            {/* Navigation */}
            <nav className="border-b border-white/5 bg-zinc-950/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="text-xl font-bold text-white">
                        PS21 <span className="text-cyan-400">BRD Agent</span>
                    </div>
                    <Link href="/login">
                        <button className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium transition-colors">
                            Login
                        </button>
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-6 py-20">
                <div className="text-center space-y-6 max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-sm font-medium">
                        <Sparkles size={14} />
                        AI-Powered BRD Generation
                    </div>

                    <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
                        Transform Requirements into
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                            Professional BRDs
                        </span>
                    </h1>

                    <p className="text-xl text-zinc-400">
                        Automatically generate comprehensive Business Requirements Documents from Slack conversations,
                        meeting transcripts, and documents using advanced AI agents.
                    </p>

                    <div className="flex items-center justify-center gap-4 pt-4">
                        <Link href="/login">
                            <button className="flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium text-lg transition-colors shadow-lg shadow-cyan-500/20">
                                Get Started
                                <ArrowRight size={20} />
                            </button>
                        </Link>
                        <a href="#features">
                            <button className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg font-medium text-lg transition-colors">
                                Learn More
                            </button>
                        </a>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="max-w-7xl mx-auto px-6 py-20">
                <h2 className="text-3xl font-bold text-center text-white mb-12">
                    Intelligent BRD Generation
                </h2>

                <div className="grid md:grid-cols-3 gap-8">
                    <FeatureCard
                        icon={<Zap className="text-cyan-400" size={24} />}
                        title="Multi-Source Ingestion"
                        description="Connect Slack channels, upload transcripts, and sync with Google Drive to gather all your requirements in one place."
                    />
                    <FeatureCard
                        icon={<Shield className="text-purple-400" size={24} />}
                        title="AI Agent Orchestration"
                        description="Four specialized AI agents work together to analyze, structure, validate, and write your BRD with precision."
                    />
                    <FeatureCard
                        icon={<Sparkles className="text-yellow-400" size={24} />}
                        title="Citation & Traceability"
                        description="Every requirement is linked back to its source, ensuring full transparency and auditability."
                    />
                </div>
            </section>

            {/* How It Works */}
            <section className="max-w-7xl mx-auto px-6 py-20">
                <h2 className="text-3xl font-bold text-center text-white mb-12">
                    How It Works
                </h2>

                <div className="grid md:grid-cols-4 gap-6">
                    {[
                        { step: '1', title: 'Connect Sources', desc: 'Link Slack, upload files' },
                        { step: '2', title: 'AI Processing', desc: 'Agents analyze & structure' },
                        { step: '3', title: 'Review & Edit', desc: 'Refine in the editor' },
                        { step: '4', title: 'Export', desc: 'Download as PDF/DOCX' }
                    ].map((item) => (
                        <div key={item.step} className="bg-zinc-900/50 border border-white/5 rounded-xl p-6 text-center">
                            <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-cyan-400 font-bold text-lg">
                                {item.step}
                            </div>
                            <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                            <p className="text-sm text-zinc-400">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="max-w-7xl mx-auto px-6 py-20">
                <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-2xl p-12 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Ready to streamline your requirements process?
                    </h2>
                    <p className="text-zinc-400 mb-8">
                        Join teams using PS21 BRD Agent to create better documentation faster.
                    </p>
                    <Link href="/login">
                        <button className="px-8 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium text-lg transition-colors shadow-lg shadow-cyan-500/20">
                            Start Free Trial
                        </button>
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/5 mt-20">
                <div className="max-w-7xl mx-auto px-6 py-8 text-center text-zinc-500 text-sm">
                    © 2026 PS21 BRD Agent. Built for intelligent requirement management.
                </div>
            </footer>
        </div>
    );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
    return (
        <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-6 hover:border-white/10 transition-colors">
            <div className="mb-4">{icon}</div>
            <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
            <p className="text-zinc-400">{description}</p>
        </div>
    );
}
