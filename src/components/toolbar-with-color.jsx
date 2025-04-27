
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Type,
  Link,
  Highlighter,
} from "lucide-react"
import ColorPicker from "./colorPicker"

export default function Toolbar({ onFormatText }) {
  const formatOptions = [
    { icon: <Bold size={18} />, format: "bold", title: "Bold" },
    { icon: <Italic size={18} />, format: "italic", title: "Italic" },
    { icon: <Underline size={18} />, format: "underline", title: "Underline" },
    { icon: <Strikethrough size={18} />, format: "strikethrough", title: "Strikethrough" },
    { divider: true },
    { icon: <AlignLeft size={18} />, format: "justifyLeft", title: "Align Left" },
    { icon: <AlignCenter size={18} />, format: "justifyCenter", title: "Align Center" },
    { icon: <AlignRight size={18} />, format: "justifyRight", title: "Align Right" },
    { icon: <AlignJustify size={18} />, format: "justifyFull", title: "Justify" },
    { divider: true },
    { icon: <List size={18} />, format: "insertUnorderedList", title: "Bullet List" },
    { icon: <ListOrdered size={18} />, format: "insertOrderedList", title: "Numbered List" },
    { divider: true },
    { icon: <Type size={18} />, format: "heading", title: "Heading" },
    { icon: <Link size={18} />, format: "link", title: "Insert Link" },
    { icon: <Highlighter size={18} />, format: "highlight", title: "Highlight Text" },
  ]

  const fontFamilies = ["Arial", "Times New Roman", "Courier New", "Georgia", "Verdana"]

  const fontSizes = ["8", "9", "10", "11", "12", "14", "16", "18", "20", "24", "30", "36", "48", "60", "72"]

  const handleFontChange = (e) => {
    document.execCommand("fontName", false, e.target.value)
  }

  const handleFontSizeChange = (e) => {
    document.execCommand("fontSize", false, getClosestFontSize(Number.parseInt(e.target.value)))
  }

  const handleTextColor = (color) => {
    document.execCommand("foreColor", false, color)
  }

  const handleHighlightColor = (color) => {
    document.execCommand("hiliteColor", false, color)
  }

  // Map font size to execCommand fontSize values (1-7)
  const getClosestFontSize = (size) => {
    if (size <= 10) return 1
    if (size <= 12) return 2
    if (size <= 16) return 3
    if (size <= 20) return 4
    if (size <= 24) return 5
    if (size <= 32) return 6
    return 7
  }

  return (
    <div className="flex items-center p-2 bg-white border-b overflow-x-auto">
      <div className="flex items-center space-x-1 mr-2">
        <select className="border rounded px-2 py-1 text-sm" onChange={handleFontChange} defaultValue="Arial">
          {fontFamilies.map((font) => (
            <option key={font} value={font}>
              {font}
            </option>
          ))}
        </select>

        <select className="border rounded px-2 py-1 text-sm w-16" onChange={handleFontSizeChange} defaultValue="11">
          {fontSizes.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      {formatOptions.map((option, index) =>
        option.divider ? (
          <div key={index} className="h-6 w-px bg-gray-300 mx-2" />
        ) : (
          <button
            key={index}
            className="p-1 rounded hover:bg-gray-100"
            title={option.title}
            onMouseDown={(e) => {
              e.preventDefault()
              onFormatText(option.format)
            }}
          >
            {option.icon}
          </button>
        ),
      )}

      <div className="h-6 w-px bg-gray-300 mx-2" />

      <ColorPicker type="text" onSelectColor={handleTextColor} />

      <ColorPicker type="background" onSelectColor={handleHighlightColor} />
    </div>
  )
}
