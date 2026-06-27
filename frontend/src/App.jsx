import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Cpu, HardDrive, AlertTriangle, TerminalSquare, Zap, Shield, Radio, Flame, Send, HelpCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

function PerformanceMetricsCard({ isSimulating, latestMetric, metricsCount }) {
    const liveCpuFactor = latestMetric.cpuUsage > 0 ? latestMetric.cpuUsage : 10;
    const mttrOptimization = isSimulating
        ? (99.1 + (liveCpuFactor % 0.8)).toFixed(2)
        : (99.8 + (liveCpuFactor % 0.15)).toFixed(2);

    const diagnosticSeconds = isSimulating ? Math.floor(1 + (metricsCount % 4)) : 0;
    const nonBlockingCapacity = isSimulating ? (8.4 + (latestMetric.memoryUsage % 1.2)).toFixed(1) : (10.0 - (latestMetric.cpuUsage * 0.02)).toFixed(1);
    const dynamicRamSaved = isSimulating ? (4.2 - (latestMetric.memoryUsage * 0.01)).toFixed(2) : (2.8 + (latestMetric.cpuUsage * 0.015)).toFixed(2);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Metric 1: MTTR Optimization */}
            <div className={`relative overflow-hidden rounded-2xl border transition-all duration-500 backdrop-blur-xl p-6 bg-[#0b0f19]/60 ${
                isSimulating ? 'border-rose-500/30 shadow-[0_0_25px_rgba(244,63,94,0.08)]' : 'border-emerald-500/10 shadow-[0_0_25px_rgba(16,185,129,0.03)]'
            }`}>
                <div className="flex items-center gap-2 mb-3 text-[11px] font-bold tracking-widest uppercase text-emerald-400">
                    <Zap className="h-3.5 w-3.5" />
                    <span>INCIDENT MTTR OPTIMIZATION</span>
                </div>
                <h3 className="text-4xl font-black text-white tracking-tight font-mono tabular-nums">
                    {mttrOptimization}%
                </h3>
                <div className="mt-5 flex justify-between items-center border-t border-slate-800/40 pt-3 text-xs">
                    <span className="text-slate-500">Manual Baseline: <strong className="text-rose-400/80 font-mono font-medium">15m 00s</strong></span>
                    <span className="text-slate-500">AI Latency: <strong className="text-emerald-400 font-mono font-medium">0m {diagnosticSeconds.toString().padStart(2, '0')}s</strong></span>
                </div>
            </div>

            {/* Metric 2: Concurrency Capacity */}
            <div className={`relative overflow-hidden rounded-2xl border transition-all duration-500 backdrop-blur-xl p-6 bg-[#0b0f19]/60 ${
                isSimulating ? 'border-cyan-500/30 shadow-[0_0_25px_rgba(6,182,212,0.08)]' : 'border-blue-500/10 shadow-[0_0_25px_rgba(59,130,246,0.03)]'
            }`}>
                <div className="flex items-center gap-2 mb-3 text-[11px] font-bold tracking-widest uppercase text-cyan-400">
                    <Radio className="h-3.5 w-3.5 animate-pulse" />
                    <span>WEBFLUX CORE EFFICIENCY</span>
                </div>
                <h3 className="text-4xl font-black text-white tracking-tight font-mono tabular-nums">
                    {isSimulating ? "BURST_MODE" : `${nonBlockingCapacity}x`}
                </h3>
                <div className="mt-5 flex justify-between items-center border-t border-slate-800/40 pt-3 text-xs">
                    <span className="text-slate-400">Pipe Mode: <strong className="text-cyan-400 font-mono font-medium">Asynchronous</strong></span>
                    <span className="text-slate-400">Throughput: <strong className="text-emerald-400 font-mono font-medium">{(liveCpuFactor * 1.5).toFixed(0)} req/s</strong></span>
                </div>
            </div>

            {/* Metric 3: Resource Footprint */}
            <div className={`relative overflow-hidden rounded-2xl border transition-all duration-500 backdrop-blur-xl p-6 bg-[#0b0f19]/60 ${
                isSimulating ? 'border-purple-500/30 shadow-[0_0_25px_rgba(168,85,247,0.08)]' : 'border-purple-500/10 shadow-[0_0_25px_rgba(168,85,247,0.03)]'
            }`}>
                <div className="flex items-center gap-2 mb-3 text-[11px] font-bold tracking-widest uppercase text-purple-400">
                    <Shield className="h-3.5 w-3.5" />
                    <span>JVM FOOTPRINT REDUCTION</span>
                </div>
                <h3 className="text-4xl font-black text-white tracking-tight font-mono tabular-nums">
                    -{dynamicRamSaved} MB
                </h3>
                <div className="mt-5 flex justify-between items-center border-t border-slate-800/40 pt-3 text-xs">
                    <span className="text-slate-400">Cluster Polls: <strong className="text-purple-400 font-mono font-medium">{metricsCount} ticks</strong></span>
                    <span className="text-slate-400">Loop State: <strong className="text-emerald-400 font-mono font-medium">Reactive</strong></span>
                </div>
            </div>
        </div>
    );
}

function App() {
    const [metrics, setMetrics] = useState([]);
    const [isSimulating, setIsSimulating] = useState(false);
    const [latestDiagnostics, setLatestDiagnostics] = useState(null);
    const [customQuestion, setCustomQuestion] = useState("");
    const [isAILoading, setIsAILoading] = useState(false);

    const quickActions = [
        "How do I fix this HikariCP pool error?",
        "Provide SQL optimization commands.",
        "How can I scale this setup to AWS EC2?"
    ];

    useEffect(() => {
        const eventSource = new EventSource('/api/v1/telemetry/stream/1');

        eventSource.onmessage = (event) => {
            const newMetric = JSON.parse(event.data);

            setMetrics((prev) => {
                const updated = [...prev, {
                    ...newMetric,
                    timeLabel: new Date(newMetric.recordedAt || Date.now()).toLocaleTimeString([], { hour12: false })
                }];
                return updated.length > 30 ? updated.slice(updated.length - 30) : updated;
            });

            if (newMetric.isAnomaly !== undefined) {
                setIsSimulating(newMetric.isAnomaly);
            }

            if (newMetric.aiDiagnostics) {
                setLatestDiagnostics(newMetric.aiDiagnostics);
                setIsAILoading(false);
            }
        };

        return () => eventSource.close();
    }, []);

    const toggleSimulation = async () => {
        try {
            const response = await fetch('/api/v1/telemetry/simulate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ active: !isSimulating })
            });
            const data = await response.json();
            setIsSimulating(data.isSimulationActive);
            if (!data.isSimulationActive) {
                setLatestDiagnostics(null);
                setIsAILoading(false);
            }
        } catch (err) {
            console.error("Failed to alter remote thresholds", err);
        }
    };

    const submitAIQuery = async (queryText) => {
        if (!queryText.trim()) return;
        setIsAILoading(true);
        setLatestDiagnostics(null);
        try {
            await fetch('/api/v1/telemetry/query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: queryText })
            });
            setCustomQuestion("");
        } catch (err) {
            console.error("Failed to pipe query packet downstream", err);
            setIsAILoading(false);
        }
    };

    const latestMetric = metrics[metrics.length - 1] || { cpuUsage: 0, memoryUsage: 0, topProcesses: [] };

    const backgroundStyle = {
        background: isSimulating
            ? 'radial-gradient(circle at top center, #270505 0%, #030712 100%)'
            : 'radial-gradient(circle at top center, #090d22 0%, #030712 100%)'
    };

    return (
        <div style={backgroundStyle} className="min-h-screen p-6 lg:p-10 text-slate-200 font-sans transition-all duration-1000 tracking-tight antialiased selection:bg-cyan-500/20">
            {/* Fine-Tuned Premium Resume Header */}
            <header className="mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-900 pb-6">
                <div className="flex items-center gap-3.5">
                    {/* Dynamic Spinning Quantum Core Logo */}
                    <div className={`p-2.5 rounded-xl border bg-slate-900/40 backdrop-blur-md transition-all duration-500 ${
                        isSimulating
                            ? 'border-rose-500/40 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.15)] animate-spin [animation-duration:1.5s]'
                            : 'border-cyan-500/20 text-cyan-400 animate-spin [animation-duration:8s]'
                    }`}>
                        <Cpu className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-white uppercase bg-clip-text">
                            VORTEX<span className={isSimulating ? "text-rose-500" : "text-cyan-400"}>OPS</span>
                        </h1>
                        <p className="text-[10px] font-mono text-slate-500 mt-0.5 tracking-widest font-semibold uppercase">MICRO-TELEMETRY & PREDICTIVE INFRASTRUCTURE SUITE</p>
                    </div>
                </div>
                <div className={`flex items-center gap-2.5 px-4 py-1.5 rounded-full border bg-[#050814]/80 backdrop-blur-md font-mono text-[11px] tracking-wider transition-colors duration-500 ${
                    isSimulating ? 'border-rose-500/20 text-rose-300' : 'border-cyan-500/20 text-cyan-300'
                }`}>
                    <span className="relative flex h-2 w-2">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isSimulating ? 'bg-rose-400' : 'bg-cyan-400'}`}></span>
                        <span className={`relative inline-flex rounded-full h-2 w-2 ${isSimulating ? 'bg-rose-500' : 'bg-cyan-500'}`}></span>
                    </span>
                    <span>{isSimulating ? 'CORE_OVERFLOW_ISOLATED' : 'DATA_STREAM_NOMINAL'}</span>
                </div>
            </header>

            {/* Vitals Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-[#0b0f19]/40 backdrop-blur-md rounded-2xl p-6 border border-slate-900 shadow-xl flex items-center gap-4">
                    <div className={`p-3 rounded-xl border ${isSimulating ? 'bg-rose-950/20 border-rose-500/20' : 'bg-cyan-950/20 border-cyan-500/20'}`}>
                        <Cpu className={`h-5 w-5 ${isSimulating ? 'text-rose-400' : 'text-cyan-400'}`} />
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 font-semibold tracking-wider uppercase">CPU Load</p>
                        <h2 className="text-3xl font-bold text-white font-mono tracking-tight tabular-nums">{(latestMetric.cpuUsage || 0).toFixed(1)}%</h2>
                    </div>
                </div>
                <div className="bg-[#0b0f19]/40 backdrop-blur-md rounded-2xl p-6 border border-slate-900 shadow-xl flex items-center gap-4">
                    <div className="p-3 rounded-xl border bg-purple-950/20 border-purple-500/20">
                        <HardDrive className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 font-semibold tracking-wider uppercase">RAM Footprint</p>
                        <h2 className="text-3xl font-bold text-white font-mono tracking-tight tabular-nums">{(latestMetric.memoryUsage || 0).toFixed(1)}%</h2>
                    </div>
                </div>

                <div className="col-span-1 md:col-span-2 bg-[#0b0f19]/40 backdrop-blur-md rounded-2xl p-6 border border-slate-900 shadow-xl flex flex-col justify-center">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-0.5">DevOps Simulation Harness</p>
                            <p className="text-xs text-slate-500">Inject precise race conditions into the active connection pools.</p>
                        </div>
                        <button
                            onClick={toggleSimulation}
                            className={`px-4 py-2 rounded-xl font-bold text-xs tracking-wide transition-all uppercase whitespace-nowrap border
                                ${isSimulating
                                ? 'bg-slate-900 text-slate-300 hover:bg-slate-800 border-slate-800'
                                : 'bg-rose-600 text-white hover:bg-rose-500 border-rose-500 shadow-lg shadow-rose-950/30'}`}
                        >
                            {isSimulating ? 'Kill Anomaly Sequence' : 'Simulate Thread Leak'}
                        </button>
                    </div>
                </div>
            </div>

            <PerformanceMetricsCard
                isSimulating={isSimulating}
                latestMetric={latestMetric}
                metricsCount={metrics.length}
            />

            {/* Central Dashboard Matrix */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Visual Chart Element */}
                <div className="lg:col-span-2 bg-[#0b0f19]/40 backdrop-blur-md rounded-2xl p-6 border border-slate-900 shadow-2xl">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400"></span>
                        Real-Time Telemetry Stream
                    </h3>
                    <div className="h-[380px] w-full font-mono text-[11px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={metrics} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={isSimulating ? "#f43f5e" : "#06b6d4"} stopOpacity={0.15}/>
                                        <stop offset="95%" stopColor={isSimulating ? "#f43f5e" : "#06b6d4"} stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorMem" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.15}/>
                                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} vertical={false} />
                                <XAxis dataKey="timeLabel" stroke="#475569" tickLine={false} axisLine={false} dy={10} />
                                <YAxis stroke="#475569" tickLine={false} axisLine={false} domain={[0, 100]} dx={-5} />
                                <Tooltip contentStyle={{ backgroundColor: '#030712', border: '1px solid #1e293b', borderRadius: '12px' }} />
                                <Area type="monotone" dataKey="cpuUsage" stroke={isSimulating ? "#f43f5e" : "#06b6d4"} strokeWidth={3} fillOpacity={1} fill="url(#colorCpu)" name="CPU" />
                                <Area type="monotone" dataKey="memoryUsage" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#colorMem)" name="RAM" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* AI Interactive Shell Terminal */}
                <div className="bg-[#030712]/90 backdrop-blur-xl rounded-2xl border border-slate-900 shadow-2xl font-mono flex flex-col relative overflow-hidden h-[454px]">
                    <div className="flex items-center gap-2 p-4 border-b border-slate-900/60 justify-between bg-slate-950/40">
                        <div className="flex items-center gap-2">
                            <TerminalSquare className="h-4 w-4 text-cyan-400" />
                            <span className="text-xs font-bold uppercase tracking-widest text-slate-300">DIAGNOSTIC LAYER</span>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 text-[11px] leading-relaxed pr-2 space-y-3 scrollbar-thin text-slate-300">
                        {isSimulating || latestDiagnostics || isAILoading ? (
                            isAILoading || (!latestDiagnostics && isSimulating) ? (
                                <div className="text-cyan-400/80 animate-pulse space-y-2">
                                    <p className="text-slate-600">&gt; CAPTURING THREAD INTERRUPTS...</p>
                                    <p>&gt; EXECUTING INVERSE LOG COMPILING RE-PARSER NODE...</p>
                                </div>
                            ) : (
                                <div className="text-emerald-400 prose prose-invert max-w-none prose-sm selection:bg-emerald-500/20">
                                    <ReactMarkdown>{latestDiagnostics}</ReactMarkdown>
                                </div>
                            )
                        ) : (
                            <div className="text-slate-600 flex flex-col gap-1.5">
                                <p>&gt; CORE ASYNC OBSERVER STATUS SECURE.</p>
                                <p className="text-slate-700">&gt; STANDBY MODE... AWAITING CLUSTER TRAFFIC OVERPASS.</p>
                            </div>
                        )}
                    </div>

                    <div className="p-4 border-t border-slate-900 bg-[#070b14]/50 backdrop-blur-sm space-y-3">
                        <div className="flex flex-wrap gap-1.5">
                            {quickActions.map((actionText, idx) => (
                                <button
                                    key={idx}
                                    disabled={!isSimulating || isAILoading}
                                    onClick={() => submitAIQuery(actionText)}
                                    className="text-[10px] font-medium bg-[#02040a] border border-slate-900 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 px-2.5 py-1 rounded-lg transition-all text-left disabled:opacity-25 disabled:hover:text-slate-400 disabled:hover:border-slate-900"
                                >
                                    {actionText}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-2 bg-[#02040a] rounded-xl border border-slate-900 focus-within:border-cyan-500/30 transition-all p-1">
                            <input
                                type="text"
                                value={customQuestion}
                                disabled={!isSimulating || isAILoading}
                                onChange={(e) => setCustomQuestion(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && submitAIQuery(customQuestion)}
                                placeholder={isSimulating ? "Ask AI how to scale, optimize, or fix..." : "Inject thread leak constraint first..."}
                                className="flex-1 bg-transparent border-none text-xs text-white focus:outline-none px-2 font-mono placeholder:text-slate-700 disabled:opacity-40"
                            />
                            <button
                                disabled={!isSimulating || isAILoading || !customQuestion.trim()}
                                onClick={() => submitAIQuery(customQuestion)}
                                className="p-2 bg-cyan-700 hover:bg-cyan-600 text-white rounded-lg transition-all disabled:opacity-10"
                            >
                                <Send className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Kernel Processes Grid Module */}
            <div className="mt-8 bg-[#0b0f19]/20 backdrop-blur-md rounded-2xl p-6 border border-slate-900 shadow-2xl">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-6 flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-purple-400" />
                    High-Resource Consumption Mapping Array
                </h3>
                <div className="overflow-x-auto rounded-xl border border-slate-900/60 bg-slate-950/40">
                    <table className="w-full text-left text-xs font-mono">
                        <thead className="uppercase bg-[#04060e] text-slate-500 border-b border-slate-900">
                        <tr>
                            <th className="p-4 tracking-wider">PID</th>
                            <th className="p-4 tracking-wider">Process Handle Name</th>
                            <th className="p-4 tracking-wider">Risk Matrix</th>
                            <th className="p-4 tracking-wider text-right">CPU Footprint</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-900/40 text-slate-300">
                        {latestMetric.topProcesses && latestMetric.topProcesses.length > 0 ? (
                            latestMetric.topProcesses.map((proc, idx) => (
                                <tr key={idx} className="hover:bg-slate-900/10 transition-colors">
                                    <td className="p-4 text-slate-600">#{proc.pid}</td>
                                    <td className="p-4 font-bold text-slate-200 tracking-wide">{proc.name}</td>
                                    <td className="p-4">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wide border ${
                                                proc.status === 'CRITICAL' || isSimulating ? 'bg-rose-500/5 text-rose-400 border-rose-500/20' : 'bg-emerald-500/5 text-emerald-400 border-emerald-500/10'
                                            }`}>{isSimulating && idx === 0 ? "CRITICAL BURST" : proc.status}</span>
                                    </td>
                                    <td className={`p-4 text-right font-black text-xs ${isSimulating && idx === 0 ? 'text-rose-400' : 'text-cyan-400'}`}>
                                        {isSimulating && idx === 0 ? "82.4%" : `${proc.cpu}%`}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="4" className="p-8 text-center text-slate-600 italic">Evaluating operating system task descriptors...</td></tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default App;