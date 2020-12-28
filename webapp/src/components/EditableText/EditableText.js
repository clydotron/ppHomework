import React, { useState, useRef, useEffect } from 'react'

const EditableText = (props) => {
  const [text,setText] = useState(props.text);
  const [editMode,setEditMode] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    setText(props.text)
  },[props])

  const changeEditMode = () => {
    setEditMode(!editMode)
  }

  const updateTextValue = () => {
    setEditMode(false)
    const newText = inputRef.current.value
    setText(newText)
    //console.log(`props:${props} text${newText}`)
    props.handleTextUpdate(newText)
  }

  // note: passing the props.class_name causes the edit box to be very large...
  // add better icons, check mark and cancel (font awesome)
  // add hover / click states -- possibly replace button with div
  
  const renderEditView = () => {
    return (
      <div>
        <input className={props.class_name} type="text" defaultValue={text} ref={inputRef}/>
        <button onClick={changeEditMode}>X</button>
        <button onClick={updateTextValue.bind(this)}>OK</button>
      </div>
    )
  }

  const renderDefaultView = () => {
    return (
      <div className={props.class_name} onDoubleClick={changeEditMode} data-testid="title">
        {text}
      </div>
    )
  }

  return editMode ? renderEditView() : renderDefaultView()
}

export default EditableText