"use client"

import { useState, useRef, useEffect } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface SearchInputFixedProps {
  onSearch: (query: string) => void
  placeholder?: string
  disabled?: boolean
  initialValue?: string
}

export function SearchInputFixed({ onSearch, placeholder = "Поиск...", disabled = false, initialValue = "" }: SearchInputFixedProps) {
  // Use a local state to manage the input value
  const [searchQuery, setSearchQuery] = useState(initialValue)
  const inputRef = useRef<HTMLInputElement>(null)
  
  // Update local state when initialValue changes
  useEffect(() => {
    setSearchQuery(initialValue)
  }, [initialValue])
  
  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    // Notify parent component about the change
    onSearch(value)
  }
  
  // This component is completely isolated from the parent's render cycle
  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={handleChange}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-9 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={disabled}
      />
    </div>
  )
}
