"use client"

import { useState, useRef, useCallback, useEffect, useLayoutEffect } from "react"
import { Search } from "lucide-react"

interface SearchInputStableProps {
  onSearch: (query: string) => void
  placeholder?: string
  disabled?: boolean
  value?: string
}

export function SearchInputStable({ onSearch, placeholder = "Поиск...", disabled = false, value: externalValue }: SearchInputStableProps) {
  const [value, setValue] = useState("")
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const inputRef = useRef<HTMLInputElement>(null)
  const wasFocusedRef = useRef(false)
  
  // Синхронизируем внутреннее состояние с внешним значением (для сброса)
  useEffect(() => {
    if (externalValue !== undefined) {
      setValue(externalValue)
    }
  }, [externalValue])
  
  // Сохраняем и восстанавливаем фокус при ре-рендерах
  useLayoutEffect(() => {
    if (wasFocusedRef.current && inputRef.current && document.activeElement !== inputRef.current) {
      const cursorPosition = inputRef.current.selectionStart
      inputRef.current.focus()
      if (cursorPosition !== null) {
        inputRef.current.setSelectionRange(cursorPosition, cursorPosition)
      }
    }
  })
  
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    wasFocusedRef.current = true
    
    // Обновляем value СРАЗУ (текст появляется мгновенно)
    setValue(newValue)
    
    // Очищаем предыдущий таймер
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    // Вызываем onSearch с задержкой (чтобы не лагало)
    timeoutRef.current = setTimeout(() => {
      onSearch(newValue)
    }, 300)
  }, [onSearch])
  
  const handleFocus = useCallback(() => {
    wasFocusedRef.current = true
  }, [])
  
  const handleBlur = useCallback(() => {
    wasFocusedRef.current = false
  }, [])
  
  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none z-10" />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full h-10 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        style={{ 
          fontSize: '14px',
          color: '#000000',
          backgroundColor: '#ffffff'
        }}
        autoComplete="off"
        spellCheck={false}
      />
    </div>
  )
}
