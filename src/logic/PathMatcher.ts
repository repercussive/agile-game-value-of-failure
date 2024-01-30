import { makeAutoObservable } from 'mobx'
import randomSample from 'lodash.sample'
import Path from './Path'

export enum PathMatchResult {
  Correct,
  MistakeInPath,
  MissedCell,
  IncorrectConfiguration
}

export enum PathMatchMode {
  Continuous,
  Incremental
}

class PathMatcher {
  public static maxIncrementSize = 3
  private targetPath: number[] = []
  private matchMode = PathMatchMode.Continuous
  public recordedMistakeCells: number[] = []
  public recordedCorrectCells: number[] = []

  constructor() {
    makeAutoObservable(this)
  }

  public get pathMatchMode() { return this.matchMode }

  public get hasTargetPath() {
    return this.targetPath.length > 0
  }

  public registerPathCode = (shareCode: string, mode: PathMatchMode) => {
    this.targetPath = shareCode.split('-').map((value) => Number.parseInt(value))
    this.matchMode = mode
    this.recordedCorrectCells = []
    this.recordedMistakeCells = []
  }

  public comparePathWithTarget = (actualPath: Path) => {
    // Continuous mode - segment is the entire path
    let targetSegmentStartIndex = 0
    let targetSegment = this.targetPath
    let actualSegment = actualPath.pathCellIndexes 

    // Incremental mode - segment is max 3 cells
    if (this.matchMode === PathMatchMode.Incremental) {
      targetSegmentStartIndex = this.recordedCorrectCells.length
      targetSegment = this.targetPath.slice(targetSegmentStartIndex, targetSegmentStartIndex + PathMatcher.maxIncrementSize)
      actualSegment = actualPath.pathCellIndexes.slice(targetSegmentStartIndex, targetSegmentStartIndex + PathMatcher.maxIncrementSize)
    } 

    const isCorrect = targetSegment.every((cellIndex, i) => cellIndex === actualSegment[i])

    if (isCorrect) {
      targetSegment.forEach((cellIndex) => this.recordedCorrectCells.push(cellIndex))
      return PathMatchResult.Correct
    }

    let allMistakeCells = actualPath.pathCellIndexes.filter((cellIndex) => !this.targetPath.includes(cellIndex))
    let newMistakeCells = allMistakeCells.filter((cellIndex) => !this.recordedMistakeCells.includes(cellIndex))

    if (newMistakeCells.length > 0) {
      this.recordedMistakeCells.push(randomSample(allMistakeCells)!)
      return PathMatchResult.MistakeInPath
    } 

    if (actualSegment.length === targetSegment.length) {
      return PathMatchResult.IncorrectConfiguration
    } 

    return PathMatchResult.MissedCell
  }

  public getCurrentIncrementSize = (cellsInActualPath: number[]) => {
    return cellsInActualPath.length - this.recordedCorrectCells.length
  }
}

export default PathMatcher