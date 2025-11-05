"use client"

import { useEffect, useState } from "react"

const STORAGE_KEY = "provider_page_size"
const DEFAULT_PAGE_SIZE = 20

export function usePageSize() {
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = parseInt(saved, 10)
      if (!isNaN(parsed) && parsed > 0) {
        setPageSize(parsed)
      }
    }
  }, [])

  const increasePageSize = () => {
    const newSize = pageSize + DEFAULT_PAGE_SIZE
    setPageSize(newSize)
    localStorage.setItem(STORAGE_KEY, newSize.toString())
    return newSize
  }

  return { pageSize, increasePageSize }
}
