"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface TimeSlot {
  date: string
  time: string
  datetime: string
  selected: boolean
}

interface WeekDay {
  label: string
  date: string
  startOfDay: string
  endOfDay: string
}

interface WeekAvailabilitySpec {
  timezone: string
  granularityMinutes: number
  days: WeekDay[]
}

interface WeekAvailabilityPickerProps {
  spec: WeekAvailabilitySpec
  onSubmit: (windows: { start: string; end: string }[]) => void
  onCancel?: () => void
}

export function WeekAvailabilityPicker({ spec, onSubmit, onCancel }: WeekAvailabilityPickerProps) {
  const [slots, setSlots] = useState<TimeSlot[]>(() => {
    // Generate all time slots
    const allSlots: TimeSlot[] = []
    
    spec.days.forEach((day) => {
      const [startHour, startMin] = day.startOfDay.split(':').map(Number)
      const [endHour, endMin] = day.endOfDay.split(':').map(Number)
      
      let currentTime = startHour * 60 + startMin // minutes from midnight
      const endTime = endHour * 60 + endMin
      
      while (currentTime < endTime) {
        const hours = Math.floor(currentTime / 60)
        const minutes = currentTime % 60
        const timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
        
        allSlots.push({
          date: day.date,
          time: timeStr,
          datetime: `${day.date}T${timeStr}:00`,
          selected: false,
        })
        
        currentTime += spec.granularityMinutes
      }
    })
    
    return allSlots
  })

  const toggleSlot = (index: number) => {
    setSlots(prev => {
      const newSlots = [...prev]
      newSlots[index].selected = !newSlots[index].selected
      return newSlots
    })
  }

  const selectRange = (startIndex: number, endIndex: number) => {
    setSlots(prev => {
      const newSlots = [...prev]
      for (let i = startIndex; i <= endIndex; i++) {
        if (newSlots[i].date === newSlots[startIndex].date) {
          newSlots[i].selected = true
        }
      }
      return newSlots
    })
  }

  const handleSubmit = () => {
    // Group selected slots into contiguous windows
    const windows: { start: string; end: string }[] = []
    let windowStart: string | null = null
    let lastDatetime: string | null = null

    slots.forEach((slot, index) => {
      if (slot.selected) {
        if (!windowStart) {
          // Start new window
          windowStart = slot.datetime
        }
        lastDatetime = slot.datetime
        
        // Check if next slot continues the window
        const nextSlot = slots[index + 1]
        const isLastSlot = index === slots.length - 1
        const nextSlotBreaks = nextSlot && (!nextSlot.selected || nextSlot.date !== slot.date)
        
        if (isLastSlot || nextSlotBreaks) {
          // Close current window
          if (windowStart) {
            // Calculate end time (add granularity to last slot)
            const endTime = new Date(lastDatetime!)
            endTime.setMinutes(endTime.getMinutes() + spec.granularityMinutes)
            
            windows.push({
              start: new Date(windowStart).toISOString(),
              end: endTime.toISOString(),
            })
            
            windowStart = null
            lastDatetime = null
          }
        }
      }
    })

    if (windows.length === 0) {
      alert('Please select at least one time slot')
      return
    }

    onSubmit(windows)
  }

  const selectedCount = slots.filter(s => s.selected).length

  // Group slots by day
  const slotsByDay: { [date: string]: TimeSlot[] } = {}
  slots.forEach(slot => {
    if (!slotsByDay[slot.date]) {
      slotsByDay[slot.date] = []
    }
    slotsByDay[slot.date].push(slot)
  })

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Select Your Availability</h3>
          <p className="text-sm text-muted-foreground">
            Click time slots when you're available for a 30-minute appointment.
            You can click and drag to select multiple slots.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Selected: {selectedCount} time slot{selectedCount !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="grid grid-cols-5 gap-4">
          {spec.days.map((day) => (
            <div key={day.date} className="space-y-2">
              <div className="text-center font-medium text-sm">
                <div>{day.label}</div>
                <div className="text-xs text-muted-foreground">
                  {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>

              <div className="space-y-1">
                {slotsByDay[day.date]?.map((slot, index) => {
                  const globalIndex = slots.findIndex(s => s.datetime === slot.datetime)
                  return (
                    <button
                      key={slot.datetime}
                      type="button"
                      onClick={() => toggleSlot(globalIndex)}
                      className={cn(
                        "w-full px-2 py-1 text-xs rounded transition-colors",
                        slot.selected
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "bg-muted hover:bg-muted/80"
                      )}
                    >
                      {slot.time}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="button" onClick={handleSubmit} disabled={selectedCount === 0}>
            Continue with {selectedCount} slot{selectedCount !== 1 ? 's' : ''}
          </Button>
        </div>
      </div>
    </Card>
  )
}

