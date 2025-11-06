import { printSpace, printTime, printUnixTime } from "@/lib/utils";
import { type Provider } from "@/types/provider"
import { Cpu, Globe, Info, Server, BarChart2 } from "lucide-react"
import { useMemo } from "react";
import { RenderField } from "./render-field";
import { StatusPanel } from "./status-panel";

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

    const lastOnlineSecAgo = useMemo(() => {
        const lastOnlineCheckTime = provider.last_online_check_time ?? 0
        const requestedAt = provider.requestedAt ?? 0

        if (!lastOnlineCheckTime || !requestedAt) {
            return 0
        }

        return Math.max(requestedAt - lastOnlineCheckTime, 0)
    }, [provider.last_online_check_time, provider.requestedAt]);

    const uptimeValue = provider.uptime !== null && provider.uptime !== undefined ? provider.uptime.toFixed(2) : null
    const workingTimeValue = provider.working_time !== null && provider.working_time !== undefined ? printTime(provider.working_time) : null
    const ratingValue = provider.rating !== null && provider.rating !== undefined ? provider.rating.toFixed(2) : null
    const priceTonValue = provider.price !== null && provider.price !== undefined ? (provider.price / 1_000_000_000).toFixed(2) : null

    return (
        <>
            <StatusPanel provider={provider} />

            {
                provider.is_send_telemetry && updatedSecAgo != 0 && updatedSecAgo > 60 * 10 &&
                <div className="flex justify-center">
                    <p className="text-sm text-red-500">Last telemetry update was more than <b>{printTime(updatedSecAgo, true)}</b> ago</p>
                </div>
            }

            {
                lastOnlineSecAgo != 0 && lastOnlineSecAgo > 60 * 10 &&
                <div className="flex justify-center">
                    <p className="text-sm text-red-500">Last seen online more than <b>{printTime(lastOnlineSecAgo, true)}</b> ago</p>
                </div>
            }

            <div className="p-4 text-sm grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Provider */}
                <div>
                    <div className="flex items-center mb-2 text-gray-500 font-bold"><Info className="w-4 h-4 mr-2" />Provider</div>
                    {RenderField('Address', provider.address, '', `https://tonscan.org/address/${provider.address}`, provider.address)}
                    {RenderField('Span', `${printTime(provider.min_span)} - ${printTime(provider.max_span)}`)}
                    {RenderField('Max Bag Size', printSpace(provider.max_bag_size_bytes))}
                    {RenderField('Working Time', workingTimeValue)}
                    {RenderField('Location', provider.location ? `${provider.location.country}${provider.location.city && ', ' + provider.location.city}` : 'Unknown')}
                    {RenderField('Uptime', uptimeValue, '%')}
                    {RenderField('Rating', ratingValue)}
                    {RenderField('Price', priceTonValue, 'TON')}
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
                        {RenderField('Speedtest Download', t.speedtest_download ? t.speedtest_download / 1024 ** 2 : 0, ' Mbps')}
                        {RenderField('Speedtest Upload', t.speedtest_upload ? t.speedtest_upload / 1024 ** 2 : 0, ' Mbps')}
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
