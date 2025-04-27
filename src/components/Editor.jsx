import { useRef, useState, useEffect } from "react"
import InlineMenu from "./InlineMenu"
import Toolbar from "./Toolbar"

export default function Editor() {
  const editorRef = useRef(null)
  const [menuPosition, setMenuPosition] = useState(null)
  const [selectedRange, setSelectedRange] = useState(null)
  // Replace with a more comprehensive state object
  const [editorState, setEditorState] = useState({
    isBold: false,
    isItalic: false,
    isUnderline: false,
    isStrikethrough: false,
    isJustifyLeft: false,
    isJustifyCenter: false,
    isJustifyRight: false,
    isJustifyFull: false,
    isOrderedList: false,
    isUnorderedList: false,
  })

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

      // Update formatting state based on current selection
      updateFormatState()
    } else {
      setMenuPosition(null)
    }
  }

  // Update the updateFormatState function to check all formatting options
  const updateFormatState = () => {
    setEditorState({
      isBold: document.queryCommandState("bold"),
      isItalic: document.queryCommandState("italic"),
      isUnderline: document.queryCommandState("underline"),
      isStrikethrough: document.queryCommandState("strikethrough"),
      isJustifyLeft: document.queryCommandState("justifyLeft"),
      isJustifyCenter: document.queryCommandState("justifyCenter"),
      isJustifyRight: document.queryCommandState("justifyRight"),
      isJustifyFull: document.queryCommandState("justifyFull"),
      isOrderedList: document.queryCommandState("insertOrderedList"),
      isUnorderedList: document.queryCommandState("insertUnorderedList"),
    })
  }

  const handleInsertInline = (type) => {
    if (!selectedRange) return

    let node
    if (type === "mention") {
      node = document.createElement("span")
      node.contentEditable = "false"
      node.className = "bg-blue-100 text-blue-800 px-1 rounded cursor-move inline-block"
      node.innerText = "@username"
      node.draggable = true
    } else if (type === "emoji") {
      node = document.createElement("span")
      node.contentEditable = "false"
      node.className = "inline-block cursor-move"
      node.innerText = "😎"
      node.draggable = true
    } else if (type === "link") {
      const url = prompt("Enter URL:", "https://")
      if (url) {
        node = document.createElement("a")
        node.href = url
        node.target = "_blank"
        node.className = "text-blue-500 underline cursor-move inline-block"
        node.innerText = selectedRange.toString() || "Link"
        node.contentEditable = "false"
        node.draggable = true
      }
    }

    if (node) {
      selectedRange.deleteContents()
      selectedRange.insertNode(node)
      setMenuPosition(null)
    }
  }

  // Update the handleFormatText function to update state after formatting
  const handleFormatText = (format) => {
    editorRef.current.focus()

    if (format === "heading") {
      // Insert heading
      document.execCommand("formatBlock", false, "<h2>")
    } else if (format === "highlight") {
      // Highlight text
      document.execCommand("backColor", false, "#FFFF00")
    } else if (format === "link") {
      // Handle link insertion
      const url = prompt("Enter URL:", "https://")
      if (url) {
        document.execCommand("createLink", false, url)
        // Make links open in new tab
        const selection = window.getSelection()
        if (selection.rangeCount > 0) {
          const range = selection.getRangeAt(0)
          const links = range.commonAncestorContainer.querySelectorAll("a")
          links.forEach((link) => {
            link.target = "_blank"
          })
        }
      }
    } else if (format === "insertUnorderedList" || format === "insertOrderedList") {
      // Ensure proper list handling
      document.execCommand(format, false, null)

      // Force focus back to maintain selection
      setTimeout(() => {
        editorRef.current.focus()
        updateFormatState() // Update format state after list operation
      }, 0)
    } else {
      // Handle standard formatting commands
      document.execCommand(format, false, null)
    }

    // Update formatting state
    setTimeout(() => {
      updateFormatState()
    }, 0)
  }

  const handleKeyDown = (e) => {
    // Handle tab key to insert tab space instead of losing focus
    if (e.key === "Tab") {
      e.preventDefault()
      document.execCommand("insertHTML", false, "&nbsp;&nbsp;&nbsp;&nbsp;")
    }
  }

  // Add a click handler to update format state when clicking in the editor
  const handleEditorClick = () => {
    // Ensure editor has focus when clicked
    editorRef.current.focus()

    // Update format state to reflect current selection
    updateFormatState()
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

    const handleSelectionChange = () => {
      updateFormatState()
    }

    if (editor) {
      editor.addEventListener("drop", handleDrop)
      editor.addEventListener("dragover", handleDragOver)
      document.addEventListener("selectionchange", handleSelectionChange)
    }

    return () => {
      if (editor) {
        editor.removeEventListener("drop", handleDrop)
        editor.removeEventListener("dragover", handleDragOver)
        document.removeEventListener("selectionchange", handleSelectionChange)
      }
    }
  }, [])

  useEffect(() => {
    // Fix for list handling in contentEditable
    const handleKeyDownForLists = (e) => {
      if (
        e.key === "Enter" &&
        (document.queryCommandState("insertOrderedList") || document.queryCommandState("insertUnorderedList"))
      ) {
        // Let the browser handle list item creation naturally
        return true
      }
    }

    const editor = editorRef.current
    if (editor) {
      editor.addEventListener("keydown", handleKeyDownForLists)
    }

    return () => {
      if (editor) {
        editor.removeEventListener("keydown", handleKeyDownForLists)
      }
    }
  }, [])

  return (
    <div className="border rounded shadow-sm">
      <Toolbar onFormatText={handleFormatText} editorState={editorState} />

      {menuPosition && <InlineMenu position={menuPosition} onSelect={handleInsertInline} />}

      <div
        ref={editorRef}
        className="p-4 min-h-[400px] focus:outline-none"
        contentEditable
        suppressContentEditableWarning
        onMouseUp={handleMouseUp}
        onKeyDown={handleKeyDown}
        onClick={handleEditorClick}
      >
        <h2 className="text-2xl font-bold mb-4">Sample Document</h2>

        <h3 className="text-xl font-bold mb-2">Heading</h3>
        <p className="mb-2">
          <strong>Bold text</strong>
        </p>
        <p className="mb-2">
          <em>Italic text</em>
        </p>
        <p className="mb-2">
          <u>Underlined text</u>
        </p>
        <p className="mb-2">
          <s>Strikethrough text</s>
        </p>
        <p className="mb-2">
          X<sup>2</sup> and X<sub>1</sub>
        </p>

        <ul className="list-disc pl-5 mb-2">
          <li>Blockquote</li>
          <li>Numbered item</li>
        </ul>

        <p className="mb-2">
          Text in <span className="text-red-500">red</span> <span className="bg-yellow-200">highlighted</span> text
        </p>
      </div>
    </div>
  )
}
