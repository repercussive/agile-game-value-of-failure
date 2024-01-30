import { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { PathContextProvider } from './context/PathContext'
import { PathMatcherContextProvider } from './context/PathMatcherContext'
import PathMatcher, { PathMatchResult } from './logic/PathMatcher'
import Path from './logic/Path'
import GameGrid from './components/GameGrid'
import Spacer from './components/modular/Spacer'

const App = observer(() => {
  const [pathMatcher] = useState(new PathMatcher())
  const [path, setPath] = useState(new Path())
  const [shareCode, setShareCode] = useState('')
  const [statusText, setStatusText] = useState('Guess the path!')

  function handleSubmitShareCode() {
    pathMatcher.registerShareCode(shareCode)
    setPath(new Path())
  }

  function handleCheckPath() {
    const result = pathMatcher.comparePathWithTarget(path)
    setStatusText(getPathMatchStatusText(result))
    if (result === PathMatchResult.MistakeInPath) {
      path.clear()
    }
  }

  function disablePathChecking() {
    return !pathMatcher.hasTargetPath() || !path.isPathComplete()
  }

  return (
    <>
      <h1>Agile Game WIP</h1>

      <PathMatcherContextProvider value={pathMatcher}>
        <Spacer mb="1rem" />
        <button
          disabled={disablePathChecking()}
          onClick={handleCheckPath}
        >
          Check
        </button>
        <span style={{ marginLeft: '0.5rem' }}>{statusText}</span>
        <Spacer mb="1rem" />
        <PathContextProvider value={path}>
          <GameGrid />
        </PathContextProvider>
        <Spacer mb="1rem" />
        <button onClick={() => path.clear()}>🗑️ Clear path</button>
        <Spacer mb="1rem" />
      </PathMatcherContextProvider>
      <button onClick={() => console.log(path.serialize())}>💾 Save & share</button>
      <Spacer mb="2rem" />

      <input
        type="text"
        placeholder="Enter share code"
        value={shareCode}
        onChange={(e) => setShareCode(e.target.value)}
      />
      <button onClick={handleSubmitShareCode}>Submit</button>

    </>
  )
})

function getPathMatchStatusText(result: PathMatchResult) {
  switch (result) {
    case PathMatchResult.Correct:
      return 'Correct! You guessed the path correctly.'
    case PathMatchResult.MistakeInPath:
      return 'Mistake in path found.'
    case PathMatchResult.MissedCell:
      return 'You missed a spot.'
    case PathMatchResult.IncorrectConfiguration:
      return 'Your path covers the right spots, but in the wrong order.'
  }
}

export default App
