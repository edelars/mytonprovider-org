import { useState, useEffect } from "react"
import { BarChart2, Cpu, Globe, Info, Server, SlidersHorizontal } from 'lucide-react';
import { FiltersData, FiltersRange } from "@/types/filters";
import { ThreeStateField } from "./tri-state-field";
import { NumberField } from "./number-field";
import { FieldGroup } from "./group";
import { PopupList } from "./popup-list";

const defaultFilters = {uptime_gt_percent: 20, uptime_lt_percent: 100, has_free_space: true, is_send_telemetry: null} as FiltersData

export type FiltersProps = {
  onApply: (filters: FiltersData) => void
  onReset: () => void
  filtersRange: FiltersRange | null
  applyedFilters: FiltersData
}

export function Filters({ onApply, onReset, filtersRange, applyedFilters }: FiltersProps) {
  const [filters, setFilters] = useState<FiltersData>(applyedFilters)
  const [resetTrigger, setResetTrigger] = useState(0) // when reset button pressed or we have new filtersRange

  useEffect(() => {
    setResetTrigger(prev => prev + 1)
  }, [filtersRange])
  
  const handleTriStateChange = (name: string, value: boolean | null) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePopupListChange = (name: string, value: string | null) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onApply(filters)
  }

  const handleReset = () => {
    setFilters(defaultFilters)
    setResetTrigger(prev => prev + 1)
    onReset()
  }

  const TextField = ({ label, name }: { label: string, name: string }) => {
    const [localValue, setLocalValue] = useState(String(filters[name as keyof typeof filters] ?? ''))
    
    useEffect(() => {
      setLocalValue(String(filters[name as keyof typeof filters] ?? ''))
    }, [filters[name as keyof typeof filters], resetTrigger])
    
    return (
      <div className="flex flex-col gap-1">
        <label className="text-sm text-gray-700" htmlFor={name}>{label}</label>
        <input type="text" name={name} id={name} value={localValue} onChange={e => setLocalValue(e.target.value)} onBlur={e => setFilters(f => ({ ...f, [name]: e.target.value }))} className="border rounded px-2 py-1 focus:ring-2 focus:ring-blue-200" />
      </div>
    )
  }
  
  return (
    <div>
      <form className="bg-gray-50 rounded-xl p-6 mt-2 mb-6 mx-auto filters-form" onSubmit={handleSubmit}>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5 text-blue-500" />
            Filters
          </h2>
        </div>
        <div className="min-w-[400px]">
          <FieldGroup 
            icon={<Info className="w-4 h-4 mr-2" />} 
            title="Provider"
            isExpandedByDefault={true}>
            <PopupList
              label="Location"
              name="location"
              options={filtersRange?.locations || []}
              value={filters.location || null}
              onChange={handlePopupListChange}
              placeholder="Select location"
              resetTrigger={resetTrigger}
              maxHeight="max-h-48"
            />
            <ThreeStateField
              label="Only with free space:"
              name="has_free_space"
              value={filters.has_free_space}
              onChange={handleTriStateChange}
            />
            <br />
            <NumberField
              label="Rating"
              nameFrom="rating_gt"
              nameTo="rating_lt"
              min={0}
              max={filtersRange?.rating_max || 50.0}
              step={0.01}
              filters={filters}
              setFilters={setFilters}
              resetTrigger={resetTrigger}
            />
            <NumberField
              label="Registration Time (days)"
              nameFrom="reg_time_days_gt"
              nameTo="reg_time_days_lt"
              min={0}
              max={filtersRange?.reg_time_days_max || 365 * 3}
              step={1}
              filters={filters}
              setFilters={setFilters}
              isInteger={true}
              resetTrigger={resetTrigger}
            />
            <NumberField
              label="Uptime (%)"
              nameFrom="uptime_gt_percent"
              nameTo="uptime_lt_percent"
              min={0}
              max={100}
              step={0.1}
              filters={filters}
              setFilters={setFilters}
              resetTrigger={resetTrigger}
            />
            <NumberField
              label="Price"
              nameFrom="price_gt"
              nameTo="price_lt"
              min={0.0}
              max={(filtersRange?.price_max || 100 * 1_000_000_000) / 1_000_000_000}
              step={0.1}
              filters={filters}
              setFilters={setFilters}
              resetTrigger={resetTrigger}
            />
            <NumberField
              label="Min Span (sec.)"
              nameFrom="min_span_gt"
              nameTo="min_span_lt"
              min={filtersRange?.min_span_min || 1}
              max={filtersRange?.min_span_max || 3600 * 24 * 30} // 30 days
              step={3600} // 1 hour
              filters={filters}
              setFilters={setFilters}
              isInteger={true}
              resetTrigger={resetTrigger}
            />
            <NumberField
              label="Max Span (sec.)"
              nameFrom="max_span_gt"
              nameTo="max_span_lt"
              min={filtersRange?.max_span_min || 1}
              max={filtersRange?.max_span_max || 3600 * 24 * 30} // 30 days
              step={3600} // 1 hour
              filters={filters}
              setFilters={setFilters}
              isInteger={true}
              resetTrigger={resetTrigger}
            />
            <NumberField
              label="Max bag size (Mb)"
              nameFrom="max_bag_size_mb_gt"
              nameTo="max_bag_size_mb_lt"
              min={(filtersRange ? filtersRange.max_bag_size_mb_min : 0)}
              max={(filtersRange ? filtersRange.max_bag_size_mb_max : 40000)}
              step={1} // 1 Mb
              filters={filters}
              setFilters={setFilters}
              isInteger={true}
              resetTrigger={resetTrigger}
            />
          </FieldGroup>
          <FieldGroup 
            icon={<Cpu className="w-4 h-4 mr-2" />}
            title="Hardware"
            isExpandedByDefault={false}>
            <NumberField
              label="Total Provider Space (Gb)"
              nameFrom="total_provider_space_gt"
              nameTo="total_provider_space_lt"
              min={filtersRange?.total_provider_space_min || 10}
              max={filtersRange?.total_provider_space_max || 30000}
              step={10}
              filters={filters}
              setFilters={setFilters}
              resetTrigger={resetTrigger}
            />
            <NumberField
              label="Used Provider Space (Gb)"
              nameFrom="used_provider_space_gt"
              nameTo="used_provider_space_lt"
              min={0}
              max={filtersRange?.used_provider_space_max || 30000}
              step={10}
              filters={filters}
              setFilters={setFilters}
              resetTrigger={resetTrigger}
            />
            <NumberField
              label="CPU Number"
              nameFrom="cpu_number_gt"
              nameTo="cpu_number_lt"
              min={1}
              max={filtersRange?.cpu_number_max || 128}
              step={1}
              filters={filters}
              setFilters={setFilters}
              resetTrigger={resetTrigger}
            />
            <TextField label="CPU Name (contains):" name="cpu_name" />
            <ThreeStateField
              label="CPU is Virtual:"
              name="cpu_is_virtual"
              value={filters.cpu_is_virtual}
              onChange={handleTriStateChange}
            />
            <NumberField
              label="Total RAM (Gb)"
              nameFrom="total_ram_gt"
              nameTo="total_ram_lt"
              min={filtersRange?.total_ram_min || 1}
              max={filtersRange?.total_ram_max || 512}
              step={1}
              filters={filters}
              setFilters={setFilters}
              resetTrigger={resetTrigger}
            />
            <NumberField
              label="Used RAM (%)"
              nameFrom="usage_ram_percent_gt"
              nameTo="usage_ram_percent_lt"
              min={0}
              max={100}
              step={1}
              filters={filters}
              setFilters={setFilters}
              resetTrigger={resetTrigger}
            />
          </FieldGroup>
          <FieldGroup
            icon={<BarChart2 className="w-4 h-4 mr-2" />}
            title="Benchmarks"
            isExpandedByDefault={false}>
            <NumberField
              label="Disk Read Speed (KiB/s)"
              nameFrom="benchmark_disk_read_speed_gt"
              nameTo="benchmark_disk_read_speed_lt"
              min={filtersRange ? filtersRange.benchmark_disk_read_speed_min / 1024 : 0}
              max={(filtersRange?.benchmark_disk_read_speed_max || 10000) / 1024}
              step={1}
              filters={filters}
              setFilters={setFilters}
              resetTrigger={resetTrigger}
            />
            <NumberField
              label="Disk Write Speed (KiB/s)"
              nameFrom="benchmark_disk_write_speed_gt"
              nameTo="benchmark_disk_write_speed_lt"
              min={filtersRange ? filtersRange.benchmark_disk_write_speed_min / 1024 : 0}
              max={(filtersRange?.benchmark_disk_write_speed_max || 10000) / 1024}
              step={1}
              filters={filters}
              setFilters={setFilters}
              resetTrigger={resetTrigger}
            />
          </FieldGroup>
          <FieldGroup 
            icon={<Globe className="w-4 h-4 mr-2" />}
            title="Network"
            isExpandedByDefault={false}>
            <NumberField
              label="Download Speed (Mbps)"
              nameFrom="speedtest_download_speed_gt"
              nameTo="speedtest_download_speed_lt"
              min={filtersRange ? Math.floor(filtersRange.speedtest_download_min / 1000000) : 0}
              max={filtersRange ? Math.ceil(filtersRange.speedtest_download_max / 1000000) : 1000}
              step={1}
              filters={filters}
              setFilters={setFilters}
              resetTrigger={resetTrigger}
            />
            <NumberField
              label="Upload Speed (Mbps)"
              nameFrom="speedtest_upload_speed_gt"
              nameTo="speedtest_upload_speed_lt"
              min={filtersRange ? Math.floor(filtersRange.speedtest_upload_min / 1000000) : 0}
              max={filtersRange ? Math.ceil(filtersRange.speedtest_upload_max / 1000000) : 1000}
              step={1}
              filters={filters}
              setFilters={setFilters}
              resetTrigger={resetTrigger}
            />
            <NumberField
              label="Ping (ms)"
              nameFrom="speedtest_ping_gt"
              nameTo="speedtest_ping_lt"
              min={filtersRange?.speedtest_ping_min || 0}
              max={filtersRange?.speedtest_ping_max || 1000}
              step={1}
              filters={filters}
              setFilters={setFilters}
              resetTrigger={resetTrigger}
            />
            <TextField label="Country (contains):" name="country" />
            <TextField label="ISP (contains):" name="isp" />
          </FieldGroup>
          <FieldGroup
            icon={<Server className="w-4 h-4 mr-2" />}
            title="Software"
            isExpandedByDefault={false}>
            <TextField label="Storage Git Hash" name="storage_git_hash" />
            <TextField label="Provider Git Hash" name="provider_git_hash" />
            <ThreeStateField
              label="Is Send Telemetry:"
              name="is_send_telemetry"
              value={filters.is_send_telemetry}
              onChange={handleTriStateChange}
            />
          </FieldGroup>
        </div>
        <div className="flex gap-4 justify-end mt-4 sticky bottom-0 pt-4 z-10">
          <button type="button" onClick={handleReset} className="px-4 py-2 border border-gray-300 rounded-full text-gray-600 hover:bg-gray-100">Reset</button>
          <button type="submit" className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors">Apply Filters</button>
        </div>
      </form>
    </div>
  )
}
