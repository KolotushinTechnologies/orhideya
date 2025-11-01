"use client"

import React from "react"
import { Search } from "lucide-react"

interface SearchClassProps {
  onSearch: (query: string) => void
  placeholder?: string
  disabled?: boolean
  initialValue?: string
}

// Using a completely different approach with uncontrolled input
export class SearchClass extends React.Component<SearchClassProps> {
  private inputRef: any
  private searchTimeout: NodeJS.Timeout | null = null
  private currentValue: string

  constructor(props: SearchClassProps) {
    super(props)
    this.inputRef = React.createRef()
    this.currentValue = props.initialValue || ""
  }

  componentDidMount() {
    // Set initial value directly on the DOM element
    if (this.inputRef.current && this.props.initialValue) {
      this.inputRef.current.value = this.props.initialValue
    }

    // Add event listener directly to the input element
    if (this.inputRef.current) {
      this.inputRef.current.addEventListener('input', this.handleInputEvent)
    }
  }

  componentWillUnmount() {
    // Clean up event listener
    if (this.inputRef.current) {
      this.inputRef.current.removeEventListener('input', this.handleInputEvent)
    }

    // Clear any pending timeouts
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout)
    }
  }

  componentDidUpdate(prevProps: SearchClassProps) {
    // Only update if initialValue prop changes and is different from current value
    if (this.props.initialValue !== prevProps.initialValue && 
        this.props.initialValue !== this.currentValue && 
        this.inputRef.current) {
      this.inputRef.current.value = this.props.initialValue || ""
      this.currentValue = this.props.initialValue || ""
    }
  }

  // Handle input event directly without React's synthetic events
  handleInputEvent = (e: Event) => {
    if (e.target instanceof HTMLInputElement) {
      const value = e.target.value
      this.currentValue = value

      // Debounce the search to prevent too many updates
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout)
      }

      this.searchTimeout = setTimeout(() => {
        this.props.onSearch(value)
      }, 100)
    }
  }

  render() {
    const { placeholder = "Поиск...", disabled = false } = this.props

    return (
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          ref={this.inputRef}
          type="text"
          placeholder={placeholder}
          defaultValue={this.props.initialValue}
          // We're not using onChange as we're handling input events directly
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-9 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={disabled}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />
      </div>
    )
  }
}
