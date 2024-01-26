import { useEffect, useState } from 'react'

const useIsMouseDown = () => {
  const [isMouseDown, setIsMouseDown] = useState(false)

  useEffect(() => {
    const handleMouseDown = () => setIsMouseDown(true)
    const handleMouseUp = () => setIsMouseDown(false)
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  return isMouseDown
}

export default useIsMouseDown