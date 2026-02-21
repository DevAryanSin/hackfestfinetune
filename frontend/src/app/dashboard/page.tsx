"use client";

import { useProjectStore } from '@/store/useProjectStore';
import { Badge } from '@/components/ui/badge';
import {
    FolderOpen,
    FileEdit,
    CheckCircle2,
    MoreVertical,
    Trash2,
    ExternalLink,
    Plus
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

export default function DashboardPage() {
    const { projects, deleteProject } = useProjectStore();

    const stats = [
        {
            label: 'Total Projects',
            value: projects.length,
            icon: FolderOpen,
            color: 'text-cyan-400'
        },
        {
            label: 'Drafts in Progress',
            value: projects.filter(p => p.status === 'draft' || p.status === 'in-progress').length,
            icon: FileEdit,
            color: 'text-yellow-400'
        },
        {
            label: 'Completed BRDs',
            value: projects.filter(p => p.status === 'completed').length,
            icon: CheckCircle2,
            color: 'text-green-400'
        }
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-semibold text-zinc-100">Dashboard</h1>
                    <p className="text-zinc-400 mt-1">Manage your Business Requirements Documents</p>
                </div>
                <Link href="/project/new">
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium transition-colors shadow-lg shadow-cyan-500/20">
                        <Plus size={18} />
                        New Project
                    </button>
                </Link>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-zinc-900/50 border border-white/5 rounded-xl p-6 hover:border-white/10 transition-colors"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-zinc-400 text-sm font-medium">{stat.label}</p>
                                    <p className="text-3xl font-semibold text-zinc-100 mt-2">{stat.value}</p>
                                </div>
                                <div className={`p-3 rounded-lg bg-white/5 ${stat.color}`}>
                                    <Icon size={24} />
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Projects Table */}
            <div className="bg-zinc-900/50 border border-white/5 rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-white/5">
                    <h2 className="text-lg font-semibold text-zinc-100">All Projects</h2>
                </div>

                {projects.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <FolderOpen size={48} className="text-zinc-600 mb-4" />
                        <h3 className="text-lg font-medium text-zinc-300 mb-2">No projects yet</h3>
                        <p className="text-zinc-500 text-sm mb-6">Create your first project to get started</p>
                        <Link href="/project/new">
                            <button className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium transition-colors">
                                Create Project
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/5">
                                    <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                                        Last Modified
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                                        Sources
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-zinc-400 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {projects.map((project, index) => (
                                    <motion.tr
                                        key={project.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="hover:bg-white/5 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div>
                                                <Link
                                                    href={`/project/${project.id}`}
                                                    className="text-zinc-100 font-medium hover:text-cyan-400 transition-colors"
                                                >
                                                    {project.name}
                                                </Link>
                                                {project.description && (
                                                    <p className="text-zinc-500 text-sm mt-0.5">{project.description}</p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant={project.status}>{project.status}</Badge>
                                        </td>
                                        <td className="px-6 py-4 text-zinc-400 text-sm">
                                            {formatDistanceToNow(project.lastModified, { addSuffix: true })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-zinc-400 text-sm">{project.sourceCount} sources</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={`/project/${project.id}`}>
                                                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-zinc-400 hover:text-zinc-100">
                                                        <ExternalLink size={16} />
                                                    </button>
                                                </Link>
                                                <button
                                                    onClick={() => deleteProject(project.id)}
                                                    className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-zinc-400 hover:text-red-400"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
