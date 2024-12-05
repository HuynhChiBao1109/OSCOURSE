import React from 'react'
import { toast } from 'react-toastify';

export const Toast = () => {

  return (
    <div>
      <h1>Toast demo</h1>
      <h2><a href='https://fkhadra.github.io/react-toastify/introduction'>Link docs</a></h2>
      <br/>
      <button button onClick={() => toast.success("Wow so easy!")}>Success!</button>
      <button button onClick={() => toast.info("Wow so easy!")}>Info!</button>
      <button button onClick={() => toast.error("Wow so easy!")}>Error!</button>
      <button button onClick={() => toast.warn("Wow so easy!")}>Warn!</button>
      <button button onClick={() => {
        toast.success("You can provide any string", {
          icon: "🚀"
        });
      }}>Success with icon!</button>

      <br />
      <button onClick={ () => toast("Will close after 15s", { autoClose: 15000 })}>Close after 15 seconds</button>
    </div>
  )
}
