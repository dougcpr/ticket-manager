import React, {useState} from "react";
import { Play, Pause } from '@geist-ui/icons'
import useMousePosition from "@/components/simpledoc/useMousePosition";

function SimpleDoc() {
  const mouseInfo = useMousePosition()

  return (
    <div style={{position: "absolute", bottom: "0rem", left: "1rem", zIndex: 2}}>
      {localStorage.getItem("recording") !== 'false' ?
        <Play color="red" onClick={() => {
          localStorage.setItem("recording", "false")
          document.body.style.border = "1px solid transparent"
        }}/> :
        <Pause color="red" onClick={() => {
          localStorage.setItem("recording", "true")
          document.body.style.border = "1px solid red"
        }} />}
      <span>{JSON.stringify(mouseInfo)}</span>
    </div>
  )
}

export default SimpleDoc