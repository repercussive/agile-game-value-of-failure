import {  useState } from 'react'
import { observer } from 'mobx-react-lite'
import { PathContextProvider } from './context/PathContext'
import { PathMatcherContextProvider } from './context/PathMatcherContext'
import PathMatcher, { PathMatchMode, PathMatchResult } from './logic/PathMatcher'
import Path from './logic/Path'
import GameGrid from './components/GameGrid'
import Spacer from './components/modular/Spacer'
import CheckPathButton from './components/CheckPathButton'
import IncrementGuide from './components/IncrementGuide'
import styles from './App.module.css'

const defaultStatusText = 'Guess the path!'

const App = observer(() => {
  const [pathMatcher] = useState(new PathMatcher())
  const [path, setPath] = useState(new Path())
  const [pathCode, setPathCode] = useState('')
  const [statusText, setStatusText] = useState(defaultStatusText)
  const [timesPathWasChecked, setTimesPathWasChecked] = useState(0)

  function handleSubmitPathCode(mode: PathMatchMode) {
    pathMatcher.registerPathCode(pathCode, mode)
    setTimesPathWasChecked(0)
    setStatusText(defaultStatusText)
    setPath(new Path())
  }

  function handleCheckPath() {
    const result = pathMatcher.comparePathWithTarget(path)
    setStatusText(getPathMatchStatusText(result, pathMatcher.pathMatchMode))
    setTimesPathWasChecked((previous) => previous + 1)
    if (result === PathMatchResult.MistakeInPath) {
      handleClearPath()
    }
  }

  function handleClearPath() {
    path.set(
      pathMatcher.pathMatchMode === PathMatchMode.Continuous
        ? []
        : pathMatcher.recordedCorrectCells
    )
  }
  

  return (
    <>
      <h1>Agile Game WIP</h1>

      <PathMatcherContextProvider value={pathMatcher}>
        <PathContextProvider value={path}>
          {pathMatcher.pathMatchMode === PathMatchMode.Incremental && <IncrementGuide />}
          <Spacer mb="1rem" />
          <CheckPathButton onCheckPath={handleCheckPath} />

          <span className={styles.statusText} key={timesPathWasChecked} style={{ marginLeft: '0.5rem' }}>
            {statusText}
          </span>

          <Spacer mb="1rem" />


          <GameGrid />
          <Spacer mb="1rem" />

          <button onClick={handleClearPath}>
            🗑️ Clear{pathMatcher.pathMatchMode === PathMatchMode.Continuous ? ' path' : ' increment'}
          </button>
          <Spacer mb="1rem" />
          <button onClick={() => console.log(path.serialize())}>💾 Save & share</button>
        </PathContextProvider>
      </PathMatcherContextProvider>

      <Spacer mb="2rem" />
      <input
        type="text"
        placeholder="Enter path code"
        value={pathCode}
        onChange={(e) => setPathCode(e.target.value)}
      />
      <Spacer />
      <button onClick={() => handleSubmitPathCode(PathMatchMode.Continuous)}>
        Play (continuous mode)
      </button>
      <button onClick={() => handleSubmitPathCode(PathMatchMode.Incremental)}>
        Play (incremental mode)
      </button>

    </>
  )
})

function getPathMatchStatusText(result: PathMatchResult, matchMode: PathMatchMode) {
  switch (result) {
    case PathMatchResult.Correct:
      return 'Correct! You guessed the path correctly.'
    case PathMatchResult.MistakeInPath:
      return "There's a mistake in your path."
    case PathMatchResult.MissedCell:
      return "You've missed a spot."
    case PathMatchResult.IncorrectConfiguration:
      return matchMode === PathMatchMode.Continuous
        ? 'Your path covers the right spots, but in the wrong order.'
        : "Your path covers a spot that shouldn't be covered until later. Try taking a detour."
  }
}

export default App
