import { observer } from 'mobx-react-lite'
import { useContext } from 'react'
import { pathContext } from '../context/PathContext'
import { pathMatcherContext } from '../context/PathMatcherContext'
import PathMatcher, { PathMatchMode } from '../logic/PathMatcher'
import useIsMouseDown from '../hooks/useIsMouseDown'
import styles from './GridCell.module.scss'

type GridCellProps = {
  cellIndex: number
}

const GridCell = observer(({ cellIndex }: GridCellProps) => {
  const path = useContext(pathContext)
  const { pathMatchMode, recordedMistakeCells, recordedCorrectCells, getCurrentIncrementSize } = useContext(pathMatcherContext)

  const isMouseDown = useIsMouseDown()
  const isMistakeCell = recordedMistakeCells.includes(cellIndex)
  const isCorrectCell = recordedCorrectCells.includes(cellIndex)

  function handleClickCell() {
    if (path.isCellInPath(cellIndex)) {
      if (
        recordedCorrectCells[recordedCorrectCells.length - 1] === cellIndex
        || !recordedCorrectCells.includes(cellIndex)
      ) { 
        path.setCellAsLastInPath(cellIndex)
      }
    } else {
      handleAddCellToPath()
    }
  }

  function handleMouseEnterCell() {
    if (isMouseDown) {
      handleAddCellToPath()
    }
  }

  function handleAddCellToPath() {
    if (
      pathMatchMode === PathMatchMode.Continuous
      || getCurrentIncrementSize(path.pathCellIndexes) < PathMatcher.maxIncrementSize
    ) {
      path.addCellToPath(cellIndex)
    }
  }

  return (
    <button
      className={styles.cell}
      onMouseDown={handleClickCell}
      onMouseEnter={handleMouseEnterCell}
      data-is-in-path={path.isCellInPath(cellIndex)}
      data-is-end-point={path.isCellEndPoint(cellIndex)}
      data-connect-direction={path.getAdjacentCellDirection(cellIndex, path.previousCellIndexInPath(cellIndex))}
      data-is-correct={isCorrectCell}
    >
      {isMistakeCell && <span className={styles.cross} />}
    </button>
  )
})

export default GridCell