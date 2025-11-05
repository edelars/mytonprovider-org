import { printSpace, printTime, printUnixTime, timeDiff } from "@/lib/utils";
import type { Provider } from "@/types/provider"
import { Cpu, Globe, Info, Server, BarChart2, Copy } from "lucide-react"
import { useMemo } from "react";
import { RenderField } from "./render-field";

type ProviderDetailsProps = {
    provider: Provider
}

export function ProviderDetails({ provider }: ProviderDetailsProps) {
    const t = provider.telemetry || {};
    const updatedSecAgo = useMemo(() => {
        const telemetryUpdatedAt = provider.telemetry?.updated_at ?? 0
        const requestedAt = provider.requestedAt ?? 0

        if (!telemetryUpdatedAt || !requestedAt) {
            return 0
        }

        return Math.max(requestedAt - telemetryUpdatedAt, 0)
    }, [provider.telemetry?.updated_at, provider.requestedAt]);

    return (
        <>
            {/* Status Panel */}
            <div className="my-4 p-5 rounded-lg border-2 bg-white">
                <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-700">Status</span>
                    <div className="flex items-center gap-2">
                        {provider.status === null && (
                            <>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                                <span className="text-sm text-gray-500 font-medium">No Data</span>
                            </>
                        )}
                        {provider.status === 0 && (
                            <>
                                {provider.status_ratio < 0.75 ? (
                                    <>
                                        <div className="w-2 h-2 bg-red-500 rounded-full shadow-[0_0_6px_rgba(239,68,68,0.6)]"></div>
                                        <span className="text-sm text-red-600 font-medium">Unstable ({(provider.status_ratio * 100).toFixed(1)}%)</span>
                                    </>
                                ) : provider.status_ratio < 0.99 ? (
                                    <>
                                        <div className="w-2 h-2 bg-yellow-500 rounded-full shadow-[0_0_6px_rgba(234,179,8,0.6)]"></div>
                                        <span className="text-sm text-yellow-600 font-medium">Partial ({(provider.status_ratio * 100).toFixed(1)}%)</span>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_6px_rgba(34,197,94,0.6)]"></div>
                                        <span className="text-sm text-green-600 font-medium">Stable ({provider.status_ratio === 1.0 ? '100%' : (provider.status_ratio * 100).toFixed(1) + '%'})</span>
                                    </>
                                )}
                            </>
                        )}
                        {provider.status === 2 && (
                            <>
                                <div className="w-2 h-2 bg-orange-500 rounded-full shadow-[0_0_6px_rgba(249,115,22,0.6)]"></div>
                                <span className="text-sm text-orange-600 font-medium">Invalid Data</span>
                            </>
                        )}
                        {provider.status === 3 && (
                            <>
                                <div className="w-2 h-2 bg-red-500 rounded-full shadow-[0_0_6px_rgba(239,68,68,0.6)]"></div>
                                <span className="text-sm text-red-600 font-medium">Not Actually Store</span>
                            </>
                        )}
                        {provider.status === 500 && (
                            <>
                                <div className="w-2 h-2 bg-gray-700 rounded-full"></div>
                                <span className="text-sm text-gray-700 font-medium">Not Accessible</span>
                            </>
                        )}
                    </div>
                </div>
                
                {/* Status Description */}
                <div className="mt-2 text-sm text-gray-500">
                    {provider.status === null && "Provider is not storing any data or we just don't check it yet"}
                    {provider.status === 0 && "Status is calculated based on the percentage of files available for download from those stored by the provider"}
                    {provider.status === 2 && "Provider contains invalid or corrupted data"}
                    {provider.status === 3 && "Provider has some storage contracts, but not actually storing them"}
                    {provider.status === 500 && "Provider was not accessible when we tried to check it"}
                </div>
            </div>

            {
                provider.is_send_telemetry && updatedSecAgo != 0 && updatedSecAgo > 60 * 10 &&
                <div className="flex justify-center">
                    <p className="text-sm text-red-500">Last telemetry update was more than <b>{printTime(updatedSecAgo, true)}</b> ago</p>
                </div>
            }

            <div className="p-4 text-sm grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Provider */}
                <div>
                    <div className="flex items-center mb-2 text-gray-500 font-bold"><Info className="w-4 h-4 mr-2" />Provider</div>
                    {RenderField('Address', provider.address, '', `https://tonscan.org/address/${provider.address}`, provider.address)}
                    {RenderField('Max Span', printTime(provider.max_span))}
                    {RenderField('Min Span', printTime(provider.min_span))}
                    {RenderField('Max Bag Size', printSpace(provider.max_bag_size_bytes))}
                    {RenderField('Registration Time', printUnixTime(provider.reg_time))}
                    {RenderField('Location', provider.location ? `${provider.location.country}${provider.location.city && ', ' + provider.location.city}` : 'Unknown')}
                </div>

                {/* Hardware */}
                {
                    provider.is_send_telemetry &&
                    <div>
                        <div className="flex items-center mb-2 text-gray-500 font-bold"><Cpu className="w-4 h-4 mr-2" />Hardware</div>
                        {RenderField('CPU Name', t.cpu_name)}
                        {RenderField('CPU Number', t.cpu_number)}
                        {RenderField('CPU is Virtual', t.cpu_is_virtual === null || t.cpu_is_virtual === undefined ? null : t.cpu_is_virtual ? 'Yes' : 'No')}
                        {RenderField('RAM', `${t.usage_ram?.toFixed(2)} of ${t.total_ram?.toFixed(2)}`, ` Gb`)}
                        {RenderField('Total Provider Space', `${t.used_provider_space?.toFixed(2)} of ${t.total_provider_space?.toFixed(2)}`, ' Gb')}
                    </div>
                }

                {/* Benchmarks */}
                {
                    provider.is_send_telemetry &&
                    <div>
                        <div className="flex items-center mb-2 text-gray-500 font-bold"><BarChart2 className="w-4 h-4 mr-2" />Benchmarks</div>
                        {RenderField('Disk Read Speed', t.qd64_disk_read_speed, '')}
                        {RenderField('Disk Write Speed', t.qd64_disk_write_speed, '')}
                    </div>
                }

                {/* Network */}
                {
                    provider.is_send_telemetry &&
                    <div>
                        <div className="flex items-center mb-2 text-gray-500 font-bold"><Globe className="w-4 h-4 mr-2" />Network</div>
                        {RenderField('Speedtest Download', t.speedtest_download ? t.speedtest_download / 1024**2 : 0, ' Mbps')}
                        {RenderField('Speedtest Upload', t.speedtest_upload ? t.speedtest_upload / 1024**2 : 0, ' Mbps')}
                        {RenderField('Speedtest Ping', t.speedtest_ping, '')}
                        {RenderField('Country', t.country)}
                        {RenderField('ISP', t.isp)}
                    </div>
                }

                {/* Software */}
                {
                    provider.is_send_telemetry &&
                    <div>
                        <div className="flex items-center mb-2 text-gray-500 font-bold"><Server className="w-4 h-4 mr-2" />Software</div>
                        {RenderField('Storage Git Hash', t.storage_git_hash)}
                        {RenderField('Provider Git Hash', t.provider_git_hash)}
                    </div>
                }
            </div>
        </>
    )
}
