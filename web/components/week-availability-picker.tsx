"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface TimeSlot {
  start: string
  end: string
}

interface TimeSlotInfo {
  time: string
  available: boolean
}

interface DaySpec {
  label: string
  date: string
  startOfDay: string
  endOfDay: string
  slots?: TimeSlotInfo[] // New field for pre-filtered slots
}

interface WeekAvailabilitySpec {
  timezone: string
  granularityMinutes: number
  days: DaySpec[]
}

interface WeekAvailabilityPickerProps {
  spec: WeekAvailabilitySpec
  onSubmit: (windows: TimeSlot[]) => void
  onCancel?: () => void
}

export function WeekAvailabilityPicker({ spec, onSubmit, onCancel }: WeekAvailabilityPickerProps) {
  const [selectedSlots, setSelectedSlots] = useState<Set<string>>(new Set())

  const generateTimeSlots = (startOfDay: string, endOfDay: string, granularity: number) => {
    const slots: string[] = []
    const [startHour, startMin] = startOfDay.split(":").map(Number)
    const [endHour, endMin] = endOfDay.split(":").map(Number)
    
    let currentMin = startHour * 60 + startMin
    const endMinutes = endHour * 60 + endMin
    
    while (currentMin < endMinutes) {
      const hour = Math.floor(currentMin / 60)
      const min = currentMin % 60
      const timeStr = `${hour.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`
      slots.push(timeStr)
      currentMin += granularity
    }
    
    return slots
  }

  const toggleSlot = (date: string, time: string) => {
    const slotKey = `${date}T${time}`
    const newSelected = new Set(selectedSlots)
    
    if (newSelected.has(slotKey)) {
      newSelected.delete(slotKey)
    } else {
      newSelected.add(slotKey)
    }
    
    setSelectedSlots(newSelected)
  }

  const handleSubmit = () => {
    // Convert selected slots to time windows
    const windows: TimeSlot[] = []
    const sortedSlots = Array.from(selectedSlots).sort()
    
    if (sortedSlots.length === 0) return
    
    // Group consecutive slots into windows
    let windowStart = sortedSlots[0]
    let windowEnd = sortedSlots[0]
    
    for (let i = 1; i < sortedSlots.length; i++) {
      const current = sortedSlots[i]
      const prev = sortedSlots[i - 1]
      
      // Check if slots are consecutive (same day and time is granularity minutes apart)
      const prevDate = prev.split("T")[0]
      const currentDate = current.split("T")[0]
      const prevTime = prev.split("T")[1]
      const currentTime = current.split("T")[1]
      
      const prevMinutes = parseInt(prevTime.split(":")[0]) * 60 + parseInt(prevTime.split(":")[1])
      const currentMinutes = parseInt(currentTime.split(":")[0]) * 60 + parseInt(currentTime.split(":")[1])
      
      if (prevDate === currentDate && currentMinutes - prevMinutes === spec.granularityMinutes) {
        // Consecutive slot
        windowEnd = current
      } else {
        // New window
        const endTime = windowEnd.split("T")[1]
        const [endHour, endMin] = endTime.split(":").map(Number)
        const endMinutes = endHour * 60 + endMin + spec.granularityMinutes
        const finalEndTime = `${Math.floor(endMinutes / 60).toString().padStart(2, "0")}:${(endMinutes % 60).toString().padStart(2, "0")}`
        
        windows.push({
          start: `${windowStart}:00${getTimezoneOffset(spec.timezone)}`,
          end: `${windowStart.split("T")[0]}T${finalEndTime}:00${getTimezoneOffset(spec.timezone)}`,
        })
        
        windowStart = current
        windowEnd = current
      }
    }
    
    // Add final window
    const endTime = windowEnd.split("T")[1]
    const [endHour, endMin] = endTime.split(":").map(Number)
    const endMinutes = endHour * 60 + endMin + spec.granularityMinutes
    const finalEndTime = `${Math.floor(endMinutes / 60).toString().padStart(2, "0")}:${(endMinutes % 60).toString().padStart(2, "0")}`
    
    windows.push({
      start: `${windowStart}:00${getTimezoneOffset(spec.timezone)}`,
      end: `${windowStart.split("T")[0]}T${finalEndTime}:00${getTimezoneOffset(spec.timezone)}`,
    })
    
    onSubmit(windows)
  }

  const getTimezoneOffset = (tz: string) => {
    // Simple timezone offset mapping (expand as needed)
    const offsets: Record<string, string> = {
      "America/New_York": "-04:00",
      "America/Chicago": "-05:00",
      "America/Denver": "-06:00",
      "America/Los_Angeles": "-07:00",
      "UTC": "+00:00",
    }
    return offsets[tz] || "-04:00"
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Select Your Availability
        </CardTitle>
        <CardDescription>
          Click on time slots when you're available for a 30-minute hardware appointment.
          Select at least 2-3 windows to give us flexibility.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          {spec.days.map((day) => {
            // Use pre-filtered slots if available, otherwise generate them
            const timeSlots = day.slots 
              ? day.slots.map(slot => slot.time)
              : generateTimeSlots(day.startOfDay, day.endOfDay, spec.granularityMinutes)
            
            return (
              <div key={day.date} className="space-y-2">
                <div className="font-semibold text-sm">
                  {day.label}, {new Date(day.date).toLocaleDateString()}
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                  {timeSlots.map((time) => {
                    const slotKey = `${day.date}T${time}`
                    const isSelected = selectedSlots.has(slotKey)
                    
                    // Check if this slot is available (if we have pre-filtered data)
                    const slotInfo = day.slots?.find(s => s.time === time)
                    const isAvailable = slotInfo ? slotInfo.available : true
                    
                    return (
                      <Button
                        key={slotKey}
                        type="button"
                        variant={isSelected ? "default" : "outline"}
                        size="sm"
                        className={cn(
                          "text-xs h-8 px-2",
                          isSelected && "bg-primary text-primary-foreground",
                          !isAvailable && "opacity-50 cursor-not-allowed bg-gray-100"
                        )}
                        onClick={() => isAvailable && toggleSlot(day.date, time)}
                        disabled={!isAvailable}
                      >
                        <Clock className="h-3 w-3 mr-1" />
                        {time}
                      </Button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            {selectedSlots.size} slot{selectedSlots.size !== 1 ? "s" : ""} selected
          </p>
          <div className="flex gap-2">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={selectedSlots.size === 0}
            >
              Submit Availability
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
