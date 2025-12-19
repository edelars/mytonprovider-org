"use client"

import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next";
import type { Provider } from "@/types/provider"
import {
  Star,
  Copy,
  ArrowUp,
  ArrowDown,
  InfoIcon,
} from "lucide-react"
import { shortenString, getSortIconType, copyToClipboard, printTime, getProviderStatusInfo } from "@/lib/utils"
import { ProviderDetails } from "./provider-details"
import HintWithIcon from "./hint"

interface ProviderTableProps {
  providers: Provider[]
  loading: boolean
  onSort: (field: string) => void
  sortField: string | null
  sortDirection: string
}

export default function ProviderTable({ providers, loading, onSort, sortField, sortDirection }: ProviderTableProps) {
  const { t } = useTranslation();
  const safeProviders = Array.isArray(providers) ? providers : []

  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && selectedProvider) {
        setSelectedProvider(null)
      }
    }

    document.addEventListener('keydown', handleEscKey)
    return () => {
      document.removeEventListener('keydown', handleEscKey)
    }
  }, [selectedProvider])

  if (loading && safeProviders.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p>{t('buttons.loading')}</p>
      </div>
    )
  }

  if (safeProviders.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">{t('table.providersNotFound')}</p>
      </div>
    )
  }

  const getSortIcon = (field: string) => {
    const iconType = getSortIconType(field, sortField, sortDirection)
    if (!iconType) return null
    return iconType === "up"
      ? <ArrowUp className="h-4 w-4 ml-1 text-blue-500" />
      : <ArrowDown className="h-4 w-4 ml-1 text-blue-500" />
  }

  return (
    <div>
      {/* Details modal */}
      <div className="fixed inset-0 z-50 overflow-hidden" hidden={selectedProvider === null}>
        <div className="absolute inset-0 flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative bg-white border shadow-2xl rounded-xl p-8 mt-4 mb-4 mx-auto max-w-5xl w-full max-h-[100vh] overflow-y-auto">
            <button
              className="absolute top-4 right-4 z-10 flex items-center justify-center w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-200"
              onClick={() => setSelectedProvider(null)}
            >
              <span className="text-gray-600 text-lg font-medium">✕</span>
            </button>

            {selectedProvider && (
              <div>
                <p className="text-md text-gray-700 mb-2">
                  <span className="text-gray-900 font-semibold">{t('table.providerDetails')}</span> {shortenString(selectedProvider.pubkey, 35)}
                  <button
                    onClick={() => copyToClipboard(selectedProvider.pubkey, setCopiedKey)}
                    className={`ml-2 transition-colors duration-200
                      ${copiedKey === selectedProvider.pubkey
                        ? "text-gray-100 font-extrabold drop-shadow-[0_0_6px_rgba(34,197,94,0.8)]"
                        : "text-gray-700 hover:text-gray-400"
                      }`}
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </p>
                {/* <div className="mx-auto"> */}
                <div className="mx-auto">
                  <ProviderDetails provider={selectedProvider} key={`${selectedProvider.pubkey}-details`} />
                </div>
                {/* </div> */}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Providers table */}
      <table className="ton-table overscroll-x-auto">
        <thead>
          <tr>
            <th onClick={() => onSort("pubkey")}>
              <div className="flex items-center">
                {t('table.publicKey')}
                {getSortIcon("pubkey")}
              </div>
            </th>
            <th onClick={() => onSort("location")}>
              <div className="flex items-center">
                {t('table.location')}
                {getSortIcon("location")}
              </div>
            </th>
            <th onClick={() => { }}>
              <div className="flex items-center">
                {t('table.status')}
                <HintWithIcon text={t('status.accessibleFilesHint')} maxWidth={24} />
              </div>
            </th>
            <th onClick={() => onSort("uptime")}>
              <div className="flex items-center">
                {t('table.uptime')}
                <HintWithIcon text={t('status.uptimeHint')} maxWidth={24} />
                {getSortIcon("uptime")}
              </div>
            </th>
            <th onClick={() => onSort("workingTime")}>
              <div className="flex items-center">
                {t('table.workingTime')}
                {getSortIcon("workingTime")}
              </div>
            </th>
            <th onClick={() => onSort("rating")}>
              <div className="flex items-center">
                {t('table.rating')}
                {getSortIcon("rating")}
              </div>
            </th>
            <th onClick={() => onSort("price")}>
              <div className="flex items-center">
                {t('table.price')}
                <HintWithIcon text={t('status.priceHint')} maxWidth={18} />
                {getSortIcon("price")}
              </div>
            </th>
            <th className="w-10"></th>
          </tr>
        </thead>
        <tbody>
          {safeProviders.map((provider, index) => (
            <React.Fragment key={provider.pubkey}>
              <tr key={provider.pubkey} className={`group ${index % 2 ? "" : "bg-gray-50"} ${selectedProvider?.pubkey === provider.pubkey ? "!bg-blue-100" : ""} hover:bg-blue-50 transition-colors duration-200`}>
                {/* Public Key */}
                <td>
                  <div className="flex items-center">
                    <span className="font-mono text-sm">{shortenString(provider.pubkey, 15)}</span>
                    <button
                      onClick={() => copyToClipboard(provider.pubkey, setCopiedKey)}
                      className={`ml-2 transition-colors duration-200
                        ${copiedKey === provider.pubkey
                          ? "text-gray-100 font-extrabold drop-shadow-[0_0_6px_rgba(34,197,94,0.8)]"
                          : "text-gray-700 hover:text-gray-400"
                        }`}
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </td>
                
                {/* Location */}
                <td>
                  {provider.location ? (
                    <div className="flex items-center">
                      <span className="text-sm">{provider.location.country} ({provider.location.country_iso})</span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">{t('unknown')}</span>
                  )}
                </td>

                {/* Status */}
                <td><StatusCell status={provider.status} ratio={provider.status_ratio} /></td>
                
                {/* Uptime */}
                <td>{(provider.uptime).toFixed(2)} %</td>
                
                {/* Working Time */}
                <td>{printTime(provider.working_time, false, t)}</td>
                
                {/* Rating */}
                <td>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-transparent group-hover:fill-yellow-400 transition-all duration-200" />
                    <span className="ml-2">{provider.rating.toFixed(2)}</span>
                  </div>
                </td>
                
                {/* Price */}
                <td>
                  <div className="flex items-center">
                    {(provider.price / 1_000_000_000).toFixed(2)} TON
                  </div>
                </td>
                
                {/* Details button */}
                <td>
                  <button
                    onClick={() => setSelectedProvider(provider)}
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <InfoIcon className="h-5 w-5 text-gray-500" />
                  </button>
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function StatusCell({ status, ratio }: { status: number | null, ratio: number }) {
  const statusInfo = getProviderStatusInfo(status, ratio)
  const { t } = useTranslation();

  const indicatorClasses = {
    gray: "bg-gray-400",
    green: "bg-green-500 shadow-[0_4_4px_rgba(34,197,94,0.4)]",
    yellow: "bg-yellow-500 shadow-[0_4_4px_rgba(234,179,8,0.4)]",
    red: "bg-red-500 shadow-[0_4_4px_rgba(239,68,68,0.4)]",
    orange: "bg-orange-700 shadow-[0_4_4px_rgba(249,115,22,0.4)]",
  }

  const labelClasses = {
    gray: "text-gray-500",
    green: "text-green-600",
    yellow: "text-yellow-600",
    red: "text-red-600",
    orange: "text-orange-700",
  }

  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${indicatorClasses[statusInfo.tone]}`}></div>
      <span className={`text-xs font-medium ${labelClasses[statusInfo.tone]}`}>
        {statusInfo.labelKey ? t(statusInfo.labelKey) : statusInfo.label}
      </span>
      {
        status == 0 && (
          <span className="text-xs font-medium text-gray-900">
            {ratio === 1.0 ? "(100%)" : "(" + (ratio * 100).toFixed(1) + "%)"}
          </span>
        )
      }
    </div>
  )
}
