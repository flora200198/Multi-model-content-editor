import React from 'react'
import Editor from './components/Editor'
import Toolbar from './components/Toolbar'
export default function App() {
  return (
    <div className="min-h-screen p-6">
      <div className="bg-white max-w-4xl mx-auto rounded-lg shadow p-4">
        <Toolbar/>
        <Editor />
      </div>
    </div>
  )
}
