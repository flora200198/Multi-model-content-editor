import React from 'react'

export default function InlineMenu({ position, onSelect }) {
  const items = [
    { label: 'Mention', value: 'mention' },
    { label: 'Emoji', value: 'emoji' },
    { label: 'Link', value: 'link' },
  ]

  return (
    <div
      className="absolute bg-white border shadow rounded p-2"
      style={{
        top: position.top,
        left: position.left,
        zIndex: 50,
      }}
    >
      {items.map((item) => (
        <div
          key={item.value}
          className="p-1 hover:bg-gray-100 cursor-pointer text-sm"
          onMouseDown={(e) => {
            e.preventDefault()
            onSelect(item.value)
          }}
        >
          {item.label}
        </div>
      ))}
    </div>
  )
}
