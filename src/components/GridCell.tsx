import { observer } from 'mobx-react-lite'
import useIsMouseDown from '../hooks/useIsMouseDown'
import Grid from '../logic/Grid'
import styles from './GridCell.module.scss'

type GridCellProps = {
  grid: Grid,
  cellIndex: number
}

const GridCell = observer(({ grid, cellIndex }: GridCellProps) => {
  const isMouseDown = useIsMouseDown()

  return (
    <button
      className={styles.cell}
      onMouseDown={() => grid.toggleCell(cellIndex)}
      onMouseEnter={() => isMouseDown && grid.addCellToPath(cellIndex)}
      data-is-in-path={grid.isCellInPath(cellIndex)}
      data-is-end-point={grid.isCellEndPoint(cellIndex)}
      data-connect-direction={grid.getAdjacentCellDirection(cellIndex, grid.nextCellIndexInPath(cellIndex))}
    />
  )
})

export default GridCell