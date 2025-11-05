"use client"

import { useEffect, useState, useCallback } from "react"
import dynamic from 'next/dynamic';
import type { Provider } from "@/types/provider"
import { fetchFiltersRange, fetchProviders } from "@/lib/api"
import { FiltersData, FiltersRange } from "@/types/filters"
import { useIsMobile } from "@/hooks/useIsMobile"
import { usePageSize } from "@/hooks/usePageSize"
import React from "react";

const defaultField = "rating"
const defaultDirection = "desc"

const defaultFilters = {uptime_gt_percent: 20, uptime_lt_percent: 100} as FiltersData

const DynamicProviderTable = dynamic(() => import('@/components/provider-table').then(mod => mod.default), { ssr: false });
const DynamicFilters = dynamic(() => import('@/components/filters').then(mod => mod.Filters), { ssr: false });

export default function Home() {
  const isMobile = useIsMobile()
  const { pageSize, increasePageSize } = usePageSize()
  const [isShowFilters, setIsShowFilters] = useState(false);
  const [providers, setProviders] = useState<Provider[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedFilters, setSelectedFilters] = useState<FiltersData>(defaultFilters)
  const [sortField, setSortField] = useState<string>(defaultField)
  const [sortDirection, setSortDirection] = useState<string>(defaultDirection)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [currentOffset, setCurrentOffset] = useState(0)
  const [filtersRange, setFiltersRange] = React.useState<FiltersRange | null>(null)

  useEffect(() => {
    loadFiltersRange()
    loadProviders(defaultField, defaultDirection, selectedFilters, 0, false, pageSize)
  }, [pageSize])

  const loadFiltersRange = async() => {
    try {
      const response = await fetchFiltersRange()
      if (response.errorMsg) {
        console.error("Error loading filters range:", response.errorMsg)
      } else if (response.data as FiltersRange) {
        setFiltersRange(response.data as FiltersRange)
      }
    } catch (error) {
      console.error("Failed to fetch filters range:", error)
    }
  }
  
  const loadProviders = useCallback(async (
    sortField: string, 
    sortDirection: string, 
    actualFilters: FiltersData, 
    offset: number = 0, 
    append: boolean = false,
    customPageSize: number | null = null,
  ) => {
    setError(null)
    setLoading(true)
    
    if (!append) {
      setCurrentOffset(0)
    }
    
    try {
      var limit = pageSize
      if (customPageSize !== null) {
        limit = customPageSize
        offset = 0
      }

      const data = await fetchProviders(offset, limit, actualFilters, sortField, sortDirection)
      if (data.errorMsg) {
        setError(data.errorMsg)
      } else {
        const requestedAt = Math.floor(Date.now() / 1000)
        const fetchedProviders = (data.data as Provider[]) || []
        const newProviders = fetchedProviders.map(provider => ({
          ...provider,
          requestedAt,
        }))

        if (append) {
          setProviders(prev => [...prev, ...newProviders])
        } else {
          setProviders(newProviders)
        }

        setHasMore(newProviders.length >= limit)
        setCurrentOffset(offset + limit)
      }
    } catch (error) {
      console.error("Failed to fetch providers:", error)
      setError("Failed to load providers. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [])

  const handleSort = useCallback((field: string) => {
    var direction = "desc"
    if (sortField === field) {
      direction = sortDirection === "asc" ? "desc" : "asc"
      setSortDirection(direction)
    } else {
      setSortField(field)
      setSortDirection(direction)
    }

    loadProviders(field, direction, selectedFilters, 0, false)
  }, [sortField, sortDirection, selectedFilters, loadProviders])

  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      const newPageSize = increasePageSize()
      loadProviders(sortField, sortDirection, selectedFilters, 0, false, newPageSize)
    }
  }, [hasMore, loading, sortField, sortDirection, selectedFilters, increasePageSize, loadProviders])

  const handleFilterApply = useCallback((filters: FiltersData) => {
    setIsShowFilters(false)
    console.info(filters)
    setSelectedFilters(filters)
    loadProviders(sortField, sortDirection, filters, 0, false, currentOffset)
  }, [sortField, sortDirection, currentOffset, loadProviders])

  const handleFilterReset = useCallback(() => {
    setIsShowFilters(false)
    setSelectedFilters(defaultFilters)
    loadProviders(sortField, sortDirection, defaultFilters, 0, false)
  }, [sortField, sortDirection, currentOffset, loadProviders])

  const renderLoadMoreSection = useCallback(() => {
    if (loading && providers.length === 0) return null
    if (providers.length === 0) return null
    
    return (
      <div className="mt-6 text-center space-y-3">
        <div className="text-sm text-gray-600">
          Showing {providers.length} providers
        </div>
        {hasMore && (
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 rounded-full text-gray-600 hover:bg-gray-100"
          >
            {loading ? (
              <div className="flex">
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                Loading...
              </div>
            ) : (
              'Load More'
            )}
          </button>
        )}
      </div>
    )
  }, [loading, providers.length, hasMore, loadMore])

  return (
    <div className="relative">
      { 
        isMobile && 
          <div className="fixed inset-0 z-50 overflow-hidden" hidden={!isShowFilters}>
              <div
                  className="fixed inset-0 bg-black bg-opacity-50"
                  onClick={() => {
                    setIsShowFilters(false)
                  }}
              ></div>
          
              <div className="absolute inset-0 flex items-start justify-center p-4 overflow-y-auto">
                  <button
                      className="absolute top-4 right-4 z-10 rounded bg-gray-200 p-2 hover:bg-gray-300"
                      onClick={() => {
                    setIsShowFilters(false)
                  }}
                  >
                      ✕
                  </button>

                  <div className="bg-gray-50 rounded-xl p-6 mt-2 mb-6 mx-auto filters-form" onSubmit={() => {}}>
                    <DynamicFilters
                      onApply={handleFilterApply}
                      onReset={handleFilterReset}
                      filtersRange={filtersRange}
                      applyedFilters={selectedFilters}
                    />
                  </div>
              </div>
          </div>
      }

      <div className="space-y-12 min-w-80 py-12">

        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold">TON Storage Providers</h1>
          <p className="text-xl text-gray-600">Find and compare storage providers on the TON network</p>
        </div>

        <div className="bg-white rounded-lg overflow-hidden">
          { error ? (
              <p className="text-red-600 text-center py-4">{error}</p>
            ): (
              <div className="p-4">
              {
                isMobile ? (
                  <div>
                    <div className="flex justify-center">
                      <button 
                        type="button" 
                        onClick={() => {
                          setIsShowFilters(!isShowFilters)
                        }} 
                        className="mb-10 px-4 py-2 border border-gray-300 rounded-full text-gray-600 hover:bg-gray-100">
                        Show filters
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <DynamicProviderTable
                        providers={providers}
                        loading={loading && providers.length === 0}
                        onSort={handleSort}
                        sortField={sortField}
                        sortDirection={sortDirection}
                      />
                    </div>
                    {renderLoadMoreSection()}
                  </div>
                ) : (
                  <div className="flex space-x-6 justify-center">
                    <div className="flex-none w-[55%] space-y-6">
                      <DynamicProviderTable
                        providers={providers}
                        loading={loading && providers.length === 0}
                        onSort={handleSort}
                        sortField={sortField}
                        sortDirection={sortDirection}
                      />
                      {renderLoadMoreSection()}
                    </div>
                    <div>
                      <DynamicFilters
                        onApply={handleFilterApply}
                        onReset={handleFilterReset}
                        filtersRange={filtersRange}
                        applyedFilters={selectedFilters}
                      />
                    </div>
                  </div>
                )
              }
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}
