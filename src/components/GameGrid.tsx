import { useState } from 'react'
import { observer } from 'mobx-react-lite'
import Grid from '../logic/Grid'
import styles from './GameGrid.module.scss'
import useIsMouseDown from '../hooks/useIsMouseDown'

const GameGrid = observer(() => {
  const [grid] = useState(new Grid())
  const isMouseDown = useIsMouseDown()

  return (
    <div className={styles.grid}>
      {Array.from({ length: grid.totalCellCount }).map((_, cellIndex) => (
        <button 
          key={cellIndex} 
          onMouseDown={() => grid.toggleCell(cellIndex)}
          onMouseEnter={() => isMouseDown && grid.toggleCell(cellIndex)}
          className={cellIndex === grid.totalCellCount - 1 ? styles.end : ''}
        >
          {grid.isCellInPath(cellIndex) 
            ? (grid.isLastCellInPath(cellIndex) ? 'o' : '•')
            : ''}
        </button>
      ))}
    </div>
  )
})

export default GameGrid