import { useState, forwardRef, useImperativeHandle } from 'react'

const Togglable = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility
    }
  })

  return (
    <div>
      <div style={hideWhenVisible} className="panel-action">
        <button onClick={toggleVisibility} className="btn btn-primary">
          {props.buttonLabel}
        </button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button onClick={toggleVisibility} className="btn btn-secondary" style={{ width: '100%', marginTop: '0.75rem' }}>
          Cancel
        </button>
      </div>
    </div>
  )
})

Togglable.displayName = 'Togglable'

export default Togglable
