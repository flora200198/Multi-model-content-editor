import { AtSign, Smile, LinkIcon } from "lucide-react"

export default function InlineMenu({ position, onSelect }) {
  const items = [
    { label: "Mention", value: "mention", icon: <AtSign size={14} /> },
    { label: "Emoji", value: "emoji", icon: <Smile size={14} /> },
    { label: "Link", value: "link", icon: <LinkIcon size={14} /> },
  ]

  return (
    <div
      className="absolute bg-white border shadow-md rounded-md overflow-hidden"
      style={{
        top: position.top,
        left: position.left,
        zIndex: 50,
      }}
    >
      <div className="flex">
        {items.map((item) => (
          <div
            key={item.value}
            className="p-2 hover:bg-gray-100 cursor-pointer text-sm flex items-center gap-1"
            onMouseDown={(e) => {
              e.preventDefault()
              onSelect(item.value)
            }}
          >
            {item.icon}
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
