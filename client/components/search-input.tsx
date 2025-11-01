"use client"

import { useState, useRef, useEffect } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface SearchInputProps {
  onSearch: (query: string) => void
  placeholder?: string
  disabled?: boolean
  initialValue?: string
}

export function SearchInput({ onSearch, placeholder = "Поиск...", disabled = false, initialValue = "" }: SearchInputProps) {
  const [searchQuery, setSearchQuery] = useState(initialValue)
  const inputRef = useRef<HTMLInputElement>(null)
  
  // Update local state when initialValue changes
  useEffect(() => {
    setSearchQuery(initialValue)
  }, [initialValue])
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    onSearch(value)
  }
  
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={handleChange}
        className="pl-9"
        disabled={disabled}
      />
    </div>
  )
}
