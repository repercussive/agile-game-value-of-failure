import { observer } from 'mobx-react-lite'
import { useContext } from 'react'
import { pathContext } from '../context/PathContext'
import { pathMatcherContext } from '../context/PathMatcherContext'
import useIsMouseDown from '../hooks/useIsMouseDown'
import styles from './GridCell.module.scss'

type GridCellProps = {
  cellIndex: number
}

const GridCell = observer(({ cellIndex }: GridCellProps) => {
  const path = useContext(pathContext)
  const { recordedMistakeCells, recordedCorrectCells } = useContext(pathMatcherContext)

  const isMouseDown = useIsMouseDown()
  const isMistakeCell = recordedMistakeCells.includes(cellIndex)
  const isCorrectCell = recordedCorrectCells.includes(cellIndex)
  
  return (
    <button
      className={styles.cell}
      onMouseDown={() => path.toggleCell(cellIndex)}
      onMouseEnter={() => isMouseDown && path.addCellToPath(cellIndex)}
      data-is-in-path={path.isCellInPath(cellIndex)}
      data-is-end-point={path.isCellEndPoint(cellIndex)}
      data-connect-direction={path.getAdjacentCellDirection(cellIndex, path.nextCellIndexInPath(cellIndex))}
      data-is-correct={isCorrectCell}
    >
      {isMistakeCell && <span className={styles.cross} />}
    </button>
  )
})

export default GridCell