import { useMemo, useState } from "react"
import {
    nullStatusDescription,
    providerStatusDescriptions,
    type Provider,
    type StatusReasonStat,
} from "@/types/provider"
import { getProviderStatusInfo, type ProviderStatusTone } from "@/lib/utils"

function formatPercent(value: number) {
    if (!Number.isFinite(value) || value <= 0) {
        return "0%"
    }

    if (value >= 10) {
        return `${value.toFixed(0)}%`
    }

    return `${value.toFixed(1)}%`
}

function resolveDescription(stats: StatusReasonStat[]) {
    if (stats.length === 0) {
        return nullStatusDescription
    }

    const total = stats.reduce((sum, c) => sum + c.cnt, 0)
    stats = stats.sort((a, b) => b.cnt - a.cnt)
    var dominantReason = stats[0].reason

    if (stats[0].cnt < total * 0.8 && stats.length > 1) { 
        dominantReason = stats[1].reason
    } else {
        dominantReason = stats[0].reason
    }

    return (
        providerStatusDescriptions[dominantReason] ?? `Unknown reason (${dominantReason})`
    )
}

const COUNT_TONE_STYLES: Record<ProviderStatusTone, { badge: string; text: string }> = {
    gray: { badge: "bg-gray-100 border border-gray-200", text: "text-gray-600" },
    green: { badge: "bg-green-100 border border-green-200", text: "text-green-700" },
    yellow: { badge: "bg-yellow-100 border border-yellow-200", text: "text-yellow-700" },
    red: { badge: "bg-red-100 border border-red-200", text: "text-red-700" },
    orange: { badge: "bg-orange-100 border border-orange-200", text: "text-orange-700" },
}

const TONE_COLORS: Record<ProviderStatusTone, string> = {
    gray: "rgb(156,163,175)",
    green: "rgb(34,197,94)",
    yellow: "rgb(234,179,8)",
    red: "rgb(239,68,68)",
    orange: "rgb(249,115,22)",
}

const buildContractChecksBlock = (
    status: number | null,
    checks: StatusReasonStat[] | undefined,
) => {
    if (!checks || checks.length === 0) {
        return null;
    }

    const valid = checks.find((c) => c.reason === 0)?.cnt ?? 0
    const total = checks.reduce((sum, c) => sum + c.cnt, 0)

    const ratio = total > 0 ? valid / total : 0
    const statusInfo = getProviderStatusInfo(status, ratio)
    const toneStyles = COUNT_TONE_STYLES[statusInfo.tone]

    const validColor = total === 0 ? "bg-gray-100" : toneStyles.badge
    const textColor = total === 0 ? "text-gray-600" : toneStyles.text

    return (
        <div>
            {total === 0 ? (
                <span className="ml-2 text-xs text-gray-400 italic">Not store</span>
            ) : (
                <div className="flex items-center">
                    <div className={`flex rounded-md ${validColor} px-2 h-6 items-center justify-center text-xs font-semibold ${textColor}`}>
                        <span>{valid}</span>
                    </div>
                    <span className='text-gray-400 mx-1 text-xs font-medium'>/</span>
                    <div className='flex rounded-md bg-gray-100 px-2 h-6 items-center justify-center text-xs font-semibold text-gray-600'>
                        <span>{total}</span>
                    </div>
                </div>
            )}
        </div>
    );
}

type StatusPanelProps = {
    provider: Provider
}

export function StatusPanel({ provider }: StatusPanelProps) {
    const [showDetails, setShowDetails] = useState(false)
    const stats = useMemo<StatusReasonStat[]>(() => {
        return [...(provider.statuses_reason_stats ?? [])].sort((a, b) => b.cnt - a.cnt)
    }, [provider.statuses_reason_stats])

    const totalCnt = useMemo(() => stats.reduce((acc, stat) => acc + stat.cnt, 0), [stats])

    const description = useMemo(
        () => resolveDescription(stats),
        [stats],
    )

    const hasChecks = totalCnt > 0

    return (
        <div className="my-4 overflow-hidden border-2 bg-white">
            <div className="flex flex-col gap-3 p-5">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <span className="font-semibold text-gray-700">Status</span>
                        <p className="mt-1 text-sm text-gray-500">{description}</p>
                    </div>
                    {hasChecks ? (
                        <div className="flex flex-col items-end gap-2 text-xs">
                            <div className="flex items-center gap-2">
                                <span className="text-gray-500"> files available:</span>
                                {
                                    buildContractChecksBlock(provider.status, provider.statuses_reason_stats)
                                }
                            </div>
                            <button
                                onClick={() => setShowDetails((prev) => !prev)}
                                className="text-sm text-gray-500 hover:text-gray-700 disabled:cursor-not-allowed"
                            >
                                {showDetails ? "[ hide details ]" : "[ show details ]"}
                            </button>
                        </div>
                    ) : (
                        <span className="text-xs text-gray-400">No checks yet</span>
                    )}
                </div>

                {hasChecks && showDetails && (
                    <div className="space-y-2">
                        {stats.map((stat) => {
                            const percent = totalCnt ? (stat.cnt / totalCnt) * 100 : 0
                            const tone = stat.reason === 0 ? "green" : getProviderStatusInfo(stat.reason, percent / 100).tone
                            const background = TONE_COLORS[tone]
                            const label = providerStatusDescriptions[stat.reason] ?? `Reason ${stat.reason}`

                            return (
                                <div
                                    key={`legend-${stat.reason}`}
                                    className="flex items-center justify-between text-sm text-gray-600"
                                >
                                    <div className="flex items-center gap-2">
                                        <span
                                            className="inline-flex h-2.5 w-2.5 rounded-full"
                                            style={{ backgroundColor: background }}
                                        />
                                        <span className="font-medium">
                                            {stat.reason === 0 ? "All checks passed" : label}
                                        </span>
                                    </div>
                                    <span className="text-xs text-gray-500">
                                        {stat.cnt} • {formatPercent(percent)}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            {hasChecks && (
                <div className="flex p-0 h-2 w-full bg-gray-100">
                    {stats.map((stat) => {
                        if (stat.cnt === 0) {
                            return null
                        }

                        const percent = (stat.cnt / totalCnt) * 100
                        const tone = stat.reason === 0 ? "green" : getProviderStatusInfo(stat.reason, percent / 100).tone
                        const background = TONE_COLORS[tone]
                        const title = `${providerStatusDescriptions[stat.reason] ?? `Reason ${stat.reason}`} • ${stat.cnt} (${formatPercent(percent)})`

                        return (
                            <div
                                key={`bar-${stat.reason}`}
                                className="transition-all"
                                style={{
                                    backgroundColor: background,
                                    flexGrow: stat.cnt,
                                }}
                                title={title}
                            />
                        )
                    })}
                </div>
            )}
        </div>
    )
}
