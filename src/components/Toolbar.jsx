import React from 'react'

export default function Toolbar() {
  return (
    <div className="flex items-center gap-2 border-b pb-2 mb-4">
      <select className="border rounded p-1">
        <option>Arial</option>
        <option>Times New Roman</option>
        <option>Courier New</option>
      </select>
      <select className="border rounded p-1">
        <option>11</option>
        <option>12</option>
        <option>14</option>
      </select>
      <button className="font-bold">B</button>
      <button className="italic">I</button>
      <button className="underline">U</button>
      <button className="line-through">S</button>
    </div>
  )
}
