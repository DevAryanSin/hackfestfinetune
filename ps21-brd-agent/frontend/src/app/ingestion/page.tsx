
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, MessageSquare, Video, FileText, CheckCircle2, ChevronDown } from "lucide-react";
import IngestionLog from "@/components/features/IngestionLog";

const connectors = [
    { id: "slack", name: "Slack", icon: MessageSquare, status: "connected", channels: ["#general", "#dev-team", "#project-alpha"] },
    { id: "drive", name: "Google Drive", icon: FileText, status: "connect", channels: [] },
    { id: "zoom", name: "Zoom Transcripts", icon: Video, status: "connect", channels: [] },
];

export default function IngestionPage() {
    const [connected, setConnected] = useState<Record<string, boolean>>({ slack: false });
    const [dragActive, setDragActive] = useState(false);

    const toggleConnect = (id: string) => {
        setConnected(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div className="flex h-[calc(100vh-8rem)] gap-8">
            {/* Left Panel: Connectors */}
            <div className="w-1/2 space-y-6 flex flex-col">
                <h2 className="text-2xl font-bold text-gradient">Data Sources</h2>

                <div className="flex-1 space-y-4 overflow-y-auto pr-2">
                    {connectors.map((connector) => (
                        <motion.div
                            key={connector.id}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-panel p-5 transition-all hover:bg-white/10"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white/5 rounded-lg">
                                        <connector.icon className="text-cyan-400" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">{connector.name}</h3>
                                        <p className="text-xs text-gray-400">
                                            {connected[connector.id] ? "Active Connection" : "Not Connected"}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => toggleConnect(connector.id)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${connected[connector.id]
                                        ? "bg-green-500/20 text-green-400 border border-green-500/50"
                                        : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                                        }`}
                                >
                                    {connected[connector.id] ? "Connected" : "Connect"}
                                </button>
                            </div>

                            {/* Expanded View for Connected Sources */}
                            <AnimatePresence>
                                {connected[connector.id] && connector.channels.length > 0 && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="mt-4 pt-4 border-t border-white/5 space-y-2"
                                    >
                                        <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Select Channels</p>
                                        {connector.channels.map(channel => (
                                            <div key={channel} className="flex items-center gap-2 group cursor-pointer hover:bg-white/5 p-2 rounded transition-colors">
                                                <div className={`w-4 h-4 rounded border flex items-center justify-center ${channel === "#project-alpha" ? "bg-cyan-500 border-cyan-500" : "border-gray-600"
                                                    }`}>
                                                    {channel === "#project-alpha" && <CheckCircle2 size={10} className="text-black" />}
                                                </div>
                                                <span className={channel === "#project-alpha" ? "text-white" : "text-gray-400"}>{channel}</span>
                                            </div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}

                    {/* File Upload Dropzone */}
                    <div
                        className={`h-40 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center transition-colors cursor-pointer ${dragActive ? "border-cyan-500 bg-cyan-500/10" : "border-white/10 hover:border-white/20 hover:bg-white/5"
                            }`}
                        onDragEnter={() => setDragActive(true)}
                        onDragLeave={() => setDragActive(false)}
                    >
                        <UploadCloud size={40} className="text-gray-500 mb-4" />
                        <p className="text-sm text-gray-300 font-medium">Drag & Drop transcripts here</p>
                        <p className="text-xs text-gray-500 mt-1">Supported: .txt, .pdf, .docx, .mp4</p>
                    </div>
                </div>
            </div>

            {/* Right Panel: Logs */}
            <div className="w-1/2 flex flex-col">
                <h2 className="text-xl font-bold text-gradient mb-6">Ingestion Matrix</h2>
                <IngestionLog />
            </div>
        </div>
    );
}
