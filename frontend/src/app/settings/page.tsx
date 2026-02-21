"use client";

import { useIntegrationStore, type IntegrationType } from '@/store/useIntegrationStore';
import { Mail, MessageSquare, Video, Users, CheckCircle2, XCircle, RefreshCw, Settings as SettingsIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';

const integrationIcons: Record<IntegrationType, any> = {
    gmail: Mail,
    slack: MessageSquare,
    fireflies: Video,
    teams: Users
};

const integrationColors: Record<IntegrationType, string> = {
    gmail: 'from-red-500 to-orange-500',
    slack: 'from-purple-500 to-pink-500',
    fireflies: 'from-blue-500 to-cyan-500',
    teams: 'from-blue-600 to-indigo-600'
};

export default function SettingsPage() {
    const { integrations, toggleConnection, syncIntegration, updateIntegration } = useIntegrationStore();
    const [syncing, setSyncing] = useState<string | null>(null);

    const handleSync = async (id: string) => {
        setSyncing(id);
        await syncIntegration(id);
        setTimeout(() => setSyncing(null), 800);
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-semibold text-zinc-100">Settings</h1>
                <p className="text-zinc-400 mt-1">Manage integrations and data sources</p>
            </div>

            {/* Integration Cards */}
            <div className="space-y-6">
                <h2 className="text-xl font-semibold text-zinc-100">Integrations</h2>

                <div className="grid md:grid-cols-2 gap-6">
                    {integrations.map((integration) => {
                        const Icon = integrationIcons[integration.type];
                        const isConnected = integration.connected;

                        return (
                            <div
                                key={integration.id}
                                className="bg-zinc-900/50 border border-white/5 rounded-xl p-6 hover:border-white/10 transition-colors"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-3 rounded-lg bg-gradient-to-br ${integrationColors[integration.type]}`}>
                                            <Icon size={24} className="text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-zinc-100">{integration.name}</h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                {isConnected ? (
                                                    <>
                                                        <CheckCircle2 size={14} className="text-green-400" />
                                                        <span className="text-xs text-green-400">Connected</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <XCircle size={14} className="text-zinc-500" />
                                                        <span className="text-xs text-zinc-500">Not connected</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => toggleConnection(integration.id)}
                                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${isConnected
                                                ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20'
                                                : 'bg-cyan-500 hover:bg-cyan-600 text-white'
                                            }`}
                                    >
                                        {isConnected ? 'Disconnect' : 'Connect'}
                                    </button>
                                </div>

                                {isConnected && (
                                    <div className="space-y-3 pt-4 border-t border-white/5">
                                        {integration.lastSync && (
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-zinc-400">Last synced:</span>
                                                <span className="text-zinc-300">
                                                    {formatDistanceToNow(integration.lastSync, { addSuffix: true })}
                                                </span>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleSync(integration.id)}
                                                disabled={syncing === integration.id}
                                                className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-zinc-300 transition-colors disabled:opacity-50"
                                            >
                                                <RefreshCw size={14} className={syncing === integration.id ? 'animate-spin' : ''} />
                                                Sync Now
                                            </button>

                                            <label className="flex items-center gap-2 text-sm text-zinc-400 ml-auto">
                                                <input
                                                    type="checkbox"
                                                    checked={integration.config?.autoSync}
                                                    onChange={(e) =>
                                                        updateIntegration(integration.id, {
                                                            config: { ...integration.config, autoSync: e.target.checked }
                                                        })
                                                    }
                                                    className="rounded bg-zinc-800 border-zinc-700"
                                                />
                                                Auto-sync
                                            </label>
                                        </div>

                                        {/* Type-specific config */}
                                        {integration.type === 'slack' && isConnected && (
                                            <div className="mt-3">
                                                <label className="block text-sm text-zinc-400 mb-2">Monitored Channels</label>
                                                <div className="flex flex-wrap gap-2">
                                                    {['#general', '#product', '#engineering'].map((channel) => (
                                                        <span
                                                            key={channel}
                                                            className="px-2 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded text-xs"
                                                        >
                                                            {channel}
                                                        </span>
                                                    ))}
                                                    <button className="px-2 py-1 border border-dashed border-white/20 text-zinc-400 hover:text-zinc-100 rounded text-xs">
                                                        + Add Channel
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Additional Settings Sections */}
            <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-zinc-100 mb-4">General Preferences</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-zinc-100 font-medium">Enable notifications</p>
                            <p className="text-sm text-zinc-500">Receive alerts when BRD generation completes</p>
                        </div>
                        <input type="checkbox" defaultChecked className="rounded bg-zinc-800 border-zinc-700" />
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-zinc-100 font-medium">Auto-save drafts</p>
                            <p className="text-sm text-zinc-500">Automatically save changes while editing</p>
                        </div>
                        <input type="checkbox" defaultChecked className="rounded bg-zinc-800 border-zinc-700" />
                    </div>
                </div>
            </div>
        </div>
    );
}
