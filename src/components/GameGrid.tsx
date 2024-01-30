import { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { pathContext } from '../context/PathContext'
import GridCell from './GridCell'
import styles from './GameGrid.module.scss'

const GameGrid = observer(() => {
  const { gridSideLength, totalCellCount } = useContext(pathContext)

  return (
    <>
      <div className={styles.grid} style={{ '--grid-side-length': gridSideLength, position: 'relative' } as React.CSSProperties}>
        {Array.from({ length: totalCellCount }).map((_, cellIndex) => (
          <GridCell
            key={cellIndex}
            cellIndex={cellIndex}
          />
        ))}
      </div>
    </>
  )
})

export default GameGrid