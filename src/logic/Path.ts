import { makeAutoObservable } from 'mobx'
import Point from './types/Point'
import Direction from './types/Direction'

class Path {
  public pathCellIndexes: number[] = []
  public gridSideLength = 7;
  public totalCellCount = this.gridSideLength * this.gridSideLength

  constructor() {
    makeAutoObservable(this)
  }

  public serialize() {
    return this.pathCellIndexes.join('-')
  }

  public toggleCell(cellIndex: number) {
    if (this.isCellInPath(cellIndex)) {
      this.removeCellFromPath(cellIndex)
    } else {
      this.addCellToPath(cellIndex)
    }
  }

  public clear() {
    this.pathCellIndexes = []
  }
  
  public isCellInPath(cellIndex: number) {
    return this.pathCellIndexes.includes(cellIndex)
  }
  
  // returns true if the given cell is the first or last cell in the path
  public isCellEndPoint(cellIndex: number) {
    return this.pathCellIndexes.length > 0 && cellIndex === 0
    || cellIndex === this.pathCellIndexes[this.pathCellIndexes.length - 1]
  }

  // returns the direction of cell 2 relative to cell 1, given the cells are adjacent
  public getAdjacentCellDirection(cellIndex1: number | null, cellIndex2: number | null): Direction | null {
    if (cellIndex1 === null || cellIndex2 === null) return null

    const cell1Position = this.cellIndexToCoordinate(cellIndex1)
    const cell2Position = this.cellIndexToCoordinate(cellIndex2)

    const xDistance = cell2Position.x - cell1Position.x
    const yDistance = cell2Position.y - cell1Position.y

    if (xDistance === 0) {
      if (yDistance === -1) return Direction.Up
      if (yDistance === 1) return Direction.Down
    } 
    else if (yDistance === 0) {
      if (xDistance === 1) return Direction.Right
      if (xDistance === -1) return Direction.Left
    }

    return null
  }

  public addCellToPath(newCellIndex: number) {
    if (this.pathCellIndexes.includes(newCellIndex)) return

    const isFirstCellInPath = this.pathCellIndexes.length === 0

    // first cell in path must be at the start point (top left corner)
    if (isFirstCellInPath && newCellIndex !== 0) {
      return
    }

    const hasPathAlreadyEnded = this.pathCellIndexes.includes(this.totalCellCount - 1)

    // can't continue path after including the end cell (bottom right corner)
    if (hasPathAlreadyEnded) {
      return
    }

    const previousCellIndex = this.pathCellIndexes[this.pathCellIndexes.length - 1]

    if (isFirstCellInPath || this.areCellsAdjacent(previousCellIndex, newCellIndex)) {
      this.pathCellIndexes.push(newCellIndex)
    }
  }

  public removeCellFromPath(cellIndex: number) {
    if (!this.pathCellIndexes.includes(cellIndex)) return

    const positionInPath = this.pathCellIndexes.findIndex((i) => i === cellIndex)

    if (positionInPath >= 0) {
      this.pathCellIndexes = this.pathCellIndexes.slice(0, positionInPath)
    }
  }

  public nextCellIndexInPath(cellIndex: number) {
    const positionInPath = this.pathCellIndexes.indexOf(cellIndex)
    if (positionInPath < 0 || positionInPath === this.pathCellIndexes.length - 1) {
      return null
    }
    return this.pathCellIndexes[positionInPath + 1]
  }

  private areCellsAdjacent(cellIndex1: number, cellIndex2: number): boolean {
    return this.getAdjacentCellDirection(cellIndex1, cellIndex2) !== null
  }

  private cellIndexToCoordinate(cellIndex: number): Point {
    const x = cellIndex % this.gridSideLength
    const y = Math.floor(cellIndex / this.gridSideLength)
    return { x, y }
  }
}

export default Path