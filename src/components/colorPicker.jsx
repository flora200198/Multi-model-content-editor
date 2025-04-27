"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

export default function ColorPicker({ onSelectColor, type = "text" }) {
  const [isOpen, setIsOpen] = useState(false)

  const colors = [
    { name: "Black", value: "#000000" },
    { name: "Red", value: "#FF0000" },
    { name: "Orange", value: "#FFA500" },
    { name: "Yellow", value: "#FFFF00" },
    { name: "Green", value: "#008000" },
    { name: "Blue", value: "#0000FF" },
    { name: "Purple", value: "#800080" },
    { name: "Pink", value: "#FFC0CB" },
  ]

  const handleColorSelect = (color) => {
    onSelectColor(color)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button className="flex items-center p-1 rounded hover:bg-gray-100" onClick={() => setIsOpen(!isOpen)}>
        <div
          className="w-4 h-4 border border-gray-300"
          style={{ backgroundColor: type === "text" ? "#000000" : "#FFFF00" }}
        />
        <ChevronDown size={14} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border shadow-md rounded-md p-2 z-50">
          <div className="grid grid-cols-4 gap-1">
            {colors.map((color) => (
              <div
                key={color.value}
                className="w-6 h-6 border border-gray-300 cursor-pointer"
                style={{ backgroundColor: color.value }}
                title={color.name}
                onClick={() => handleColorSelect(color.value)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
