import React, { useRef, useState, useEffect } from 'react'
import InlineMenu from './InlineMenu'

export default function Editor() {
  const editorRef = useRef(null)
  const [menuPosition, setMenuPosition] = useState(null)
  const [selectedRange, setSelectedRange] = useState(null)

  const handleMouseUp = () => {
    const selection = window.getSelection()
    if (selection && selection.toString().length > 0) {
      const range = selection.getRangeAt(0)
      const rect = range.getBoundingClientRect()

      setSelectedRange(range)
      setMenuPosition({
        top: rect.top + window.scrollY + rect.height,
        left: rect.left + window.scrollX,
      })
    } else {
      setMenuPosition(null)
    }
  }

  const handleInsertInline = (type) => {
    if (!selectedRange) return

    let node
    if (type === 'mention') {
      node = document.createElement('span')
      node.contentEditable = "false"
      node.className = "bg-blue-100 text-blue-800 px-1 rounded cursor-move inline-block"
      node.innerText = "@username"
      node.draggable = true
    } else if (type === 'emoji') {
      node = document.createElement('span')
      node.contentEditable = "false"
      node.className = "inline-block cursor-move"
      node.innerText = "😎"
      node.draggable = true
    } else if (type === 'link') {
      node = document.createElement('a')
      node.href = "https://example.com"
      node.target = "_blank"
      node.className = "text-blue-500 underline cursor-move inline-block"
      node.innerText = "Link"
      node.contentEditable = "false"
      node.draggable = true
    }

    if (node) {
      selectedRange.deleteContents()
      selectedRange.insertNode(node)
      setMenuPosition(null)
    }
  }

  useEffect(() => {
    const editor = editorRef.current

    const handleDrop = (e) => {
      e.preventDefault()
      const data = e.dataTransfer.getData("text/html")
      if (data) {
        document.execCommand("insertHTML", false, data)
      }
    }

    const handleDragOver = (e) => {
      e.preventDefault()
    }

    if (editor) {
      editor.addEventListener("drop", handleDrop)
      editor.addEventListener("dragover", handleDragOver)
    }

    return () => {
      if (editor) {
        editor.removeEventListener("drop", handleDrop)
        editor.removeEventListener("dragover", handleDragOver)
      }
    }
  }, [])

  return (
    <div className="relative">
      {menuPosition && (
        <InlineMenu
          position={menuPosition}
          onSelect={handleInsertInline}
        />
      )}
      <div
        ref={editorRef}
        className="border p-4 rounded min-h-[400px] focus:outline-none"
        contentEditable
        suppressContentEditableWarning
        onMouseUp={handleMouseUp}
      >
        <h1 className="text-2xl font-bold mb-2">Sample Document</h1>
        <p>Select any text to see options!</p>
      </div>
    </div>
  )
}
