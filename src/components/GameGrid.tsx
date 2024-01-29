import { useState } from 'react'
import { observer } from 'mobx-react-lite'
import Grid from '../logic/Grid'
import GridCell from './GridCell'
import styles from './GameGrid.module.scss'

const GameGrid = observer(() => {
  const [grid] = useState(new Grid())

  return (
    <div className={styles.grid} style={{ '--grid-side-length': grid.sideLength } as React.CSSProperties}>
      {Array.from({ length: grid.totalCellCount }).map((_, cellIndex) => (
        <GridCell
          key={cellIndex}
          grid={grid}
          cellIndex={cellIndex}
        />
      ))}
    </div>
  )
})

export default GameGrid