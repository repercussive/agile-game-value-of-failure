import { observer } from 'mobx-react-lite'
import { useContext } from 'react'
import { pathMatcherContext } from '../context/PathMatcherContext'
import { pathContext } from '../context/PathContext'
import PathMatcher from '../logic/PathMatcher'
import styles from './IncrementGuide.module.scss'

const IncrementGuide = observer(() => {
  const { pathCellIndexes } = useContext(pathContext)
  const { getCurrentIncrementSize } = useContext(pathMatcherContext)

  const currentIncrementSize = getCurrentIncrementSize(pathCellIndexes)

  return (
    <div className={styles.container}>
      <p>Draw your path in short increments.</p>
      <p>You've drawn {currentIncrementSize}/{PathMatcher.maxIncrementSize}</p>
      <input
        type="range"
        value={currentIncrementSize}
        max={PathMatcher.maxIncrementSize}
        disabled
      />
    </div>
  )
})

export default IncrementGuide