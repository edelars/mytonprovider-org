import { printSpace, printTime } from "@/lib/utils";
import { type Provider } from "@/types/provider"
import { Cpu, Globe, Info, Server, BarChart2 } from "lucide-react"
import { useMemo } from "react";
import { RenderField } from "./render-field";
import { StatusPanel } from "./status-panel";
import { useTranslation } from "react-i18next";

type ProviderDetailsProps = {
    provider: Provider
}

export function ProviderDetails({ provider }: ProviderDetailsProps) {
    const { t } = useTranslation();
    const telemetry = provider.telemetry || {};
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
    const workingTimeValue = provider.working_time !== null && provider.working_time !== undefined ? printTime(provider.working_time, false, t) : null
    const ratingValue = provider.rating !== null && provider.rating !== undefined ? provider.rating.toFixed(2) : null
    const priceTonValue = provider.price !== null && provider.price !== undefined ? (provider.price / 1_000_000_000).toFixed(2) : null

    return (
        <>
            <StatusPanel provider={provider} />

            {
                provider.is_send_telemetry && updatedSecAgo != 0 && updatedSecAgo > 60 * 10 &&
                <div className="flex justify-center">
                    <p className="text-sm text-red-500">{t('provider.lastTelemetryUpdate', { time: printTime(updatedSecAgo, true, t) })}</p>
                </div>
            }

            {
                lastOnlineSecAgo != 0 && lastOnlineSecAgo > 60 * 10 &&
                <div className="flex justify-center">
                    <p className="text-sm text-red-500">{t('provider.lastSeenOnline', { time: printTime(lastOnlineSecAgo, true, t) })}</p>
                </div>
            }

            <div className="p-4 text-sm grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Provider */}
                <div>
                    <div className="flex items-center mb-2 text-gray-500 font-bold"><Info className="w-4 h-4 mr-2" />{t('provider.providerTitle')}</div>
                    {RenderField(t('provider.address'), provider.address, '', `https://tonscan.org/address/${provider.address}`, provider.address)}
                    {RenderField(t('provider.span'), `${printTime(provider.min_span, false, t)} - ${printTime(provider.max_span, false, t)}`)}
                    {RenderField(t('provider.maxBagSize'), printSpace(provider.max_bag_size_bytes, t))}
                    {RenderField(t('provider.workingTime'), workingTimeValue)}
                    {RenderField(t('provider.location'), provider.location ? `${provider.location.country}${provider.location.city && ', ' + provider.location.city}` : t('unknown'))}
                    {RenderField(t('provider.uptime'), uptimeValue, '%')}
                    {RenderField(t('provider.rating'), ratingValue)}
                    {RenderField(t('provider.price'), priceTonValue, 'TON')}
                </div>

                {/* Hardware */}
                {
                    provider.is_send_telemetry &&
                    <div>
                        <div className="flex items-center mb-2 text-gray-500 font-bold"><Cpu className="w-4 h-4 mr-2" />{t('provider.hardware')}</div>
                        {RenderField(t('provider.cpuName'), telemetry.cpu_name)}
                        {RenderField(t('provider.cpuNumber'), telemetry.cpu_number)}
                        {RenderField(t('provider.cpuIsVirtual'), telemetry.cpu_is_virtual === null || telemetry.cpu_is_virtual === undefined ? null : telemetry.cpu_is_virtual ? t('triState.yes') : t('triState.no'))}
                        {RenderField(t('provider.ram'), `${telemetry.usage_ram?.toFixed(2)} of ${telemetry.total_ram?.toFixed(2)}`, ` Gb`)}
                        {RenderField(t('provider.totalProviderSpace'), `${telemetry.used_provider_space?.toFixed(2)} of ${telemetry.total_provider_space?.toFixed(2)}`, ' Gb')}
                    </div>
                }

                {/* Benchmarks */}
                {
                    provider.is_send_telemetry &&
                    <div>
                        <div className="flex items-center mb-2 text-gray-500 font-bold"><BarChart2 className="w-4 h-4 mr-2" />{t('provider.benchmarks')}</div>
                        {RenderField(t('provider.diskReadSpeed'), telemetry.qd64_disk_read_speed, '')}
                        {RenderField(t('provider.diskWriteSpeed'), telemetry.qd64_disk_write_speed, '')}
                    </div>
                }

                {/* Network */}
                {
                    provider.is_send_telemetry &&
                    <div>
                        <div className="flex items-center mb-2 text-gray-500 font-bold"><Globe className="w-4 h-4 mr-2" />{t('provider.network')}</div>
                        {RenderField(t('provider.speedtestDownload'), telemetry.speedtest_download ? telemetry.speedtest_download / 1024 ** 2 : 0, ' Mbps')}
                        {RenderField(t('provider.speedtestUpload'), telemetry.speedtest_upload ? telemetry.speedtest_upload / 1024 ** 2 : 0, ' Mbps')}
                        {RenderField(t('provider.speedtestPing'), telemetry.speedtest_ping, '')}
                        {RenderField(t('provider.country'), telemetry.country)}
                        {RenderField(t('provider.isp'), telemetry.isp)}
                    </div>
                }

                {/* Software */}
                {
                    provider.is_send_telemetry &&
                    <div>
                        <div className="flex items-center mb-2 text-gray-500 font-bold"><Server className="w-4 h-4 mr-2" />{t('provider.software')}</div>
                        {RenderField(t('provider.storageGitHash'), telemetry.storage_git_hash)}
                        {RenderField(t('provider.providerGitHash'), telemetry.provider_git_hash)}
                    </div>
                }
            </div>
        </>
    )
}
