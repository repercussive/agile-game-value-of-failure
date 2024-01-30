import { makeAutoObservable } from 'mobx'
import sample from 'lodash.sample'
import Path from './Path'

export enum PathMatchResult {
  Correct,
  MistakeInPath,
  MissedCell,
  IncorrectConfiguration
}

class PathMatcher {
  private targetPath: number[] = []
  public recordedMistakeCells: number[] = []
  public recordedCorrectCells: number[] = []
  public accuracy: number | undefined = undefined

  constructor() {
    makeAutoObservable(this)
  }

  public registerShareCode(shareCode: string) {
    this.targetPath = shareCode.split('-').map((value) => Number.parseInt(value))
    console.log(this.targetPath)
  }

  public comparePathWithTarget(path: Path) {
    const pathCells = path.pathCellIndexes
    const isCorrect = this.targetPath.every((cellIndex, i) => cellIndex === pathCells[i])
    if (isCorrect) {
      this.recordedCorrectCells = this.targetPath
      return PathMatchResult.Correct
    }

    let allMistakeCells = pathCells.filter((cellIndex) => !this.targetPath.includes(cellIndex))
    let newMistakeCells = allMistakeCells.filter((cellIndex) => !this.recordedMistakeCells.includes(cellIndex))

    if (newMistakeCells.length > 0) {
      this.recordedMistakeCells.push(sample(allMistakeCells)!)
      return PathMatchResult.MistakeInPath
    } 

    if (path.pathCellIndexes.length === this.targetPath.length) {
      return PathMatchResult.IncorrectConfiguration
    } 

    return PathMatchResult.MissedCell
  }
}

export default PathMatcher