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
  is_send_telemetry: boolean
  requestedAt?: number
  telemetry: Telemetry
}
