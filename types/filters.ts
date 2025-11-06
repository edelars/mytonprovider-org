export interface FiltersRange {
  rating_max: number,
  reg_time_days_max: number,
  price_max: number,
  min_span_min: number,
  min_span_max: number,
  max_span_min: number,
  max_span_max: number,
  max_bag_size_mb_min: number,
  max_bag_size_mb_max: number,
  locations: string[],
  
  total_provider_space_min: number,
  total_provider_space_max: number,
  used_provider_space_max: number,
  cpu_number_max: number,
  total_ram_min: number,
  total_ram_max: number,
  
  benchmark_disk_read_speed_min: number,
  benchmark_disk_read_speed_max: number,
  benchmark_disk_write_speed_min: number,
  benchmark_disk_write_speed_max: number,

  speedtest_download_min: number,
  speedtest_download_max: number,
  speedtest_upload_min: number,
  speedtest_upload_max: number,
  speedtest_ping_min: number,
  speedtest_ping_max: number,
}

export interface FiltersData {
  rating_gt: number | null, // float 
  rating_lt: number | null, // float
  location: string | null, // string
  has_free_space: boolean | null, // boolean
  reg_time_days_gt: number | null, // int
  reg_time_days_lt: number | null, // int
  uptime_gt_percent: number | null, // float
  uptime_lt_percent: number | null, // float
  working_time_gt_sec: number | null, // int
  working_time_lt_sec: number | null, // int
  price_gt: number | null, // float
  price_lt: number | null, // float
  min_span_gt: number | null, // int
  min_span_lt: number | null, // int
  max_span_gt: number | null, // int
  max_span_lt: number | null, // int
  max_bag_size_mb_gt: number | null, // int
  max_bag_size_mb_lt: number | null, // int
  is_send_telemetry: boolean | null,
  total_provider_space_gt: number | null, // float
  total_provider_space_lt: number | null, // float
  used_provider_space_gt: number | null, // float
  used_provider_space_lt: number | null, // float
  storage_git_hash: string | null,
  provider_git_hash: string | null,
  cpu_number_gt: number | null, // int
  cpu_number_lt: number | null, // int
  cpu_name: string | null,
  cpu_is_virtual: boolean | null,
  total_ram_gt: number | null, // float
  total_ram_lt: number | null, // float
  usage_ram_percent_gt: number | null, // float
  usage_ram_percent_lt: number | null, // float
  benchmark_disk_read_speed_gt: number | null, // float
  benchmark_disk_read_speed_lt: number | null, // float
  benchmark_disk_write_speed_gt: number | null, // float
  benchmark_disk_write_speed_lt: number | null, // float
  benchmark_rocks_ops_gt: number | null, // float
  benchmark_rocks_ops_lt: number | null, // float
  speedtest_download_speed_gt: number | null, // float
  speedtest_download_speed_lt: number | null, // float
  speedtest_upload_speed_gt: number | null, // float
  speedtest_upload_speed_lt: number | null, // float
  speedtest_ping_gt: number | null, // float
  speedtest_ping_lt: number | null, // float
  country: string | null,
  isp: string | null,
}