import { useState, useEffect, useCallback } from 'react'

function useLocalStorage<T>(key: string, initialValue: T) {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = localStorage.getItem(key)
            return item ? JSON.parse(item) : initialValue
        } catch (error) {
            console.error(`Error reading local storage with key ${key}`, error)
            return initialValue
        }
    })

    const setValue = useCallback(
        (value: T | ((val: T) => T)) => {
            try {
                // Allow value to be a function like useState
                const valueToStore = value instanceof Function ? value(storedValue) : value

                setStoredValue(valueToStore)
                localStorage.setItem(key, JSON.stringify(valueToStore))
            } catch (error) {
                console.error(`Error setting local storage with key ${key}`, error)
            }
        },
        [key, storedValue]
    )

    const removeValue = useCallback(() => {
        try {
            localStorage.removeItem(key)
            setStoredValue(initialValue)
        } catch (error) {
            console.error(`Error removing local storage with key ${key}`, error)
        }
    }, [key, initialValue])

    useEffect(() => {
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === key) {
                setStoredValue(event.newValue ? JSON.parse(event.newValue) : initialValue)
            }
        }

        addEventListener('storage', handleStorageChange)

        return () => {
            removeEventListener('storage', handleStorageChange)
        }
    }, [key, initialValue])

    return { storedValue, setValue, removeValue }
}

export default useLocalStorage
