
export const parseNumber = (val: string) => {
  if (val === '' || val === null || val === undefined) return null

  const normalized = val.replace(',', '.')
  if (/\./.test(normalized)) {
    const f = parseFloat(normalized)
    return isNaN(f) ? null : f
  }

  const i = parseInt(normalized, 10)
  return isNaN(i) ? null : i
}

export const shortenString = (key: string, maxLen: number = 10) => {
  if (key.length <= maxLen) return key
  const shorten = `${key.substring(0, maxLen / 2)}...${key.substring(key.length - maxLen / 2)}`
  if (shorten.length > key.length) {
    return key
  }

  return shorten
}

export const getSortIconType = (
  field: string,
  sortField: string | null,
  sortDirection: string
): "up" | "down" | null => {
  if (sortField !== field) return null
  return sortDirection === "asc" ? "up" : "down"
}

export const copyToClipboard = (
  text: string,
  setCopiedKey?: (key: string | null) => void
) => {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      if (setCopiedKey) {
        setCopiedKey(text)
        setTimeout(() => setCopiedKey(null), 150)
      }
    })
    .catch((err) => {
      console.error("Failed to copy: ", err)
    })
}

export const timeDiff = (timestamp: number) => {
  if (timestamp == 0) {
    return 0
  }

  const currentDate = new Date()
  return currentDate.getTime() / 1000 - timestamp
}

export const printSpace = (bytes: number, t?: (key: string, opts?: Record<string, any>) => string): string => {
  if (bytes <= 0) return ``
  if (bytes <= 1024) {
    return t ? t('units.bytes', { count: bytes }) : `${bytes} bytes`
  }

  if (bytes <= 1024 * 1024) {
    const v = (bytes / 1024).toFixed(2)
    return t ? t('units.kb', { value: v }) : `${v} Kb`
  }

  if (bytes <= 1024 * 1024 * 1024) {
    const v = (bytes / 1024 / 1024).toFixed(2)
    return t ? t('units.mb', { value: v }) : `${v} Mb`
  }

  const v = (bytes / 1024 / 1024 / 1024).toFixed(2)
  return t ? t('units.gb', { value: v }) : `${v} Gb`
}

export const printUnixTime = (timestamp: number): string => {
  const date = new Date(timestamp * 1000)
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,  
  }

  const formattedDate = date.toLocaleString('en-US', options)
  return formattedDate.replace(/(\d{2})\/(\d{2})\/(\d{4}), (\d{2}):(\d{2}):(\d{2})/, '$3-$1-$2 $4:$5:$6')
}

export const printTime = (secs: number, skipLast: boolean = false, t?: (key: string, opts?: Record<string, any>) => string): string => {
  if (secs < 60) return `${(secs).toFixed(0)} sec`
  
  const seconds = (secs % 60).toFixed(0)
  const minutes = Math.floor(secs / 60) % 60
  const hours = Math.floor(secs / 3600) % 24
  const days = Math.floor(secs / 86400) % 365
  const years = Math.floor(secs / 31536000)
  if (years > 0) {
    if (t) {
      const yearsStr = t('time.year', { count: years })
      const daysStr = days && !skipLast ? ` ${t('time.days', { count: days })}` : ''
      return `${yearsStr}${daysStr}`.trim()
    }
    return `${years} year${years > 1 ? 's' : ''} ${days && !skipLast ? `${days} days` : ''}`.trim()
  }

  if (secs < 3600) {
    if (t) {
      const minStr = minutes ? t('time.min', { count: minutes }) : ''
      const secStr = seconds && !skipLast ? ` ${t('time.sec', { count: seconds })}` : ''
      return `${minStr}${secStr}`.trim()
    }
    return `${minutes ? `${minutes} min ` : ''}${seconds && !skipLast ? `${seconds} sec` : ''}`.trim()
  }

  if (secs < 86400) {
    if (t) {
      const hrStr = hours ? t('time.hr', { count: hours }) : ''
      const minStr = minutes && !skipLast ? ` ${t('time.min', { count: minutes })}` : ''
      return `${hrStr}${minStr}`.trim()
    }
    return `${hours ? `${hours} hr ` : ''}${minutes && !skipLast ? `${minutes} min ` : ''}`.trim()
  }

  if (secs < 604800) {
    if (t) {
      const daysStr = days ? t('time.days', { count: days }) : ''
      const hrStr = hours ? ` ${t('time.hr', { count: hours })}` : ''
      const minStr = minutes && !skipLast ? ` ${t('time.min', { count: minutes })}` : ''
      return `${daysStr}${hrStr}${minStr}`.trim()
    }
    return `${days ? `${days} days ` : ''}${hours ? `${hours} hr ` : ''}${minutes && !skipLast ? `${minutes} min ` : ''}`.trim()
  }

  if (t) {
    const daysStr = days ? t('time.days', { count: days }) : ''
    const hrStr = hours && !skipLast ? ` ${t('time.hr', { count: hours })}` : ''
    return `${daysStr}${hrStr}`.trim()
  }
  return `${days ? `${days} days ` : ''}${hours && !skipLast ? `${hours} hr ` : ''}`.trim()
}


export function splitTextSmart(text: string, maxLen: number): string[] {
  const words = text.split(" ")
  const lines: string[] = []
  let current = ""
  for (const word of words) {
    if ((current + (current ? " " : "") + word).length > maxLen) {
      if (current) lines.push(current)
      current = word
    } else {
      current += (current ? " " : "") + word
    }
  }
  if (current) lines.push(current)
  return lines
}

export type ProviderStatusTone = "gray" | "green" | "yellow" | "red" | "orange"

export type ProviderStatusInfo = {
  indicatorClass: string
  label: string
  labelKey?: string
  labelClass: string
  tone: ProviderStatusTone
}

export const getProviderStatusInfo = (
  status: number | null,
  ratio: number,
): ProviderStatusInfo => {
  if (status === null) {
    return {
      indicatorClass: "bg-gray-400",
      label: "No Data",
      labelKey: "status.noData",
      labelClass: "text-gray-500",
      tone: "gray",
    }
  }

  if (status === 0) {
    if (ratio < 0.8) {
      return {
        indicatorClass: "bg-red-500 shadow-[0_0_4px_rgba(234,179,8,0.4)]",
        label: "Unstable",
        labelKey: "status.unstable",
        labelClass: "text-red-600",
        tone: "red",
      }
    }

    if (ratio < 0.99) {
      return {
        indicatorClass: "bg-yellow-500 shadow-[0_0_4px_rgba(234,179,8,0.4)]",
        label: "Partial",
        labelKey: "status.partial",
        labelClass: "text-yellow-600",
        tone: "yellow",
      }
    }

    return {
      indicatorClass: "bg-green-500 shadow-[0_0_4px_rgba(34,197,94,0.4)]",
      label: "Stable",
      labelKey: "status.stable",
      labelClass: "text-green-600",
      tone: "green",
    }
  }

  if ([101, 102, 103, 201, 202].includes(status)) {
    return {
      indicatorClass: "bg-gray-500 shadow-[0_0_4px_rgba(156,163,175,0.4)]",
      label: "Unavailable",
      labelKey: "status.unavailable",
      labelClass: "text-gray-600",
      tone: "gray",
    }
  }

  if ([301, 302].includes(status)) {
    return {
      indicatorClass: "bg-red-500 shadow-[0_0_4px_rgba(239,68,68,0.4)]",
      label: "Not Store",
      labelKey: "status.notStored",
      labelClass: "text-red-600",
      tone: "red",
    }
  }

  if ([401, 402, 403].includes(status)) {
    return {
      indicatorClass: "bg-orange-700 shadow-[0_0_4px_rgba(249,115,22,0.4)]",
      label: "No proofs",
      labelKey: "status.noProofs",
      labelClass: "text-orange-700",
      tone: "orange",
    }
  }

  return {
    indicatorClass: "bg-gray-400",
    label: "Unknown",
      labelKey: "status.unknown",
    labelClass: "text-gray-500",
    tone: "gray",
  }
}
