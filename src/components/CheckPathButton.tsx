import { observer } from 'mobx-react-lite'
import { useContext } from 'react'
import { pathContext } from '../context/PathContext'
import { pathMatcherContext } from '../context/PathMatcherContext'
import PathMatcher, { PathMatchMode } from '../logic/PathMatcher'

type CheckPathButtonProps = {
  onCheckPath: () => void
}

const CheckPathButton = observer(({ onCheckPath }: CheckPathButtonProps) => {
  const { isPathComplete, pathCellIndexes } = useContext(pathContext)
  const { hasTargetPath, pathMatchMode, getCurrentIncrementSize } = useContext(pathMatcherContext)

  function disablePathChecking() {
    if (!hasTargetPath) return true

    if (isPathComplete) {
      return false
    }
    
    if (pathMatchMode === PathMatchMode.Incremental) {
      return getCurrentIncrementSize(pathCellIndexes) < PathMatcher.maxIncrementSize
    }

    return true
  }

  return (
    <button
      disabled={disablePathChecking()}
      onClick={onCheckPath}
    >
      Check
    </button>
  )
})

export default CheckPathButton