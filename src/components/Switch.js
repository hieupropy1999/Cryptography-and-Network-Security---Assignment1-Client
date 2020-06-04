import React from "react";
import "./Switch.css";
export const Switch = (props) => {
  return (
    <div className="switch">
      <label>
        <input type="checkbox" checked={props.isOn} onChange={props.changed}/>
        <span className="slider round"></span>
      </label>
    </div>
  );
};
