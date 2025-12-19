import { FiltersRange } from "./filters"

export interface ApiResponse {
  errorMsg: string | null
  data: Provider[] | FiltersRange | null
}

export interface Telemetry {
  storage_git_hash?: string | null
  provider_git_hash?: string | null
  total_provider_space?: number | null
  used_provider_space?: number | null
  updated_at?: number | null
  cpu_name?: string | null
  cpu_number?: number | null
  cpu_is_virtual?: boolean | null
  total_ram?: number | null
  usage_ram?: number | null
  ram_usage_percent?: number | null
  qd64_disk_read_speed?: string | null
  qd64_disk_write_speed?: string | null
  benchmark_rocks_ops?: number | null
  speedtest_download?: number | null
  speedtest_upload?: number | null
  speedtest_ping?: number | null
  country?: string | null
  isp?: string | null
}

export interface Location {
  country: string
  country_iso: string
  city: string
  time_zone: string
}

export interface StatusReasonStat {
  reason: number
  cnt: number
}

export interface Provider {
  status: number | null
  location: Location | null
  status_ratio: number
  pubkey: string
  address: string
  uptime: number
  working_time: number
  rating: number
  max_span: number
  price: number
  min_span: number
  max_bag_size_bytes: number
  reg_time: number
  last_online_check_time: number
  is_send_telemetry: boolean
  requestedAt?: number
  telemetry: Telemetry
  statuses_reason_stats?: StatusReasonStat[]
}

export const nullStatusDescription = "status.notChecked"

export const providerStatusDescriptions: Record<number, string> = {
  // Validated
  0: "status.reason.0",
  
  // No IP found. DHT or provider off
  101: "status.reason.101",
  102: "status.reason.102",
  103: "status.reason.103",
  
  // Ports are closed
  201: "status.reason.201",
  202: "status.reason.202",
  
  // Even no headers, doesn't know about file
  301: "status.reason.301",
  302: "status.reason.302",

  // Cant proof storage or not store bag at all
  401: "status.reason.401",
  402: "status.reason.402",
  403: "status.reason.403",
}
