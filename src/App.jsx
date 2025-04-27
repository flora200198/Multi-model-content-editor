import Editor from "./components/Editor"
import "./styles/editor.css"
export default function App() {
  return (
    <div className="max-w-4xl mx-auto my-8 px-4">
      <h1 className="text-2xl font-bold mb-4">Rich Text Editor</h1>
      <Editor />
    </div>
  )
}
