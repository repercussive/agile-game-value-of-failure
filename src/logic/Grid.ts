import { makeAutoObservable } from 'mobx'
import Point from './types/Point'

class Grid {
  private pathCellIndexes: number[] = []
  private sideLength = 8
  public totalCellCount = this.sideLength * this.sideLength

  constructor() {
    makeAutoObservable(this)
  }

  public toggleCell(cellIndex: number) {
    if (this.isCellInPath(cellIndex)) {
      this.removeCellFromPath(cellIndex)
    } else {
      this.addCellToPath(cellIndex)
    }
  }
  
  public isCellInPath(cellIndex: number) {
    return this.pathCellIndexes.includes(cellIndex)
  }

  public isLastCellInPath(cellIndex: number) {
    return cellIndex === this.pathCellIndexes[this.pathCellIndexes.length - 1]
  }
  
  private addCellToPath(newCellIndex: number) {
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

  private removeCellFromPath(cellIndex: number) {
    const positionInPath = this.pathCellIndexes.findIndex((i) => i === cellIndex)

    if (positionInPath >= 0) {
      this.pathCellIndexes = this.pathCellIndexes.slice(0, positionInPath);
    }
  }

  private areCellsAdjacent(cellIndex1: number, cellIndex2: number): boolean {
    const cell1Position = this.cellIndexToCoordinate(cellIndex1)
    const cell2Position = this.cellIndexToCoordinate(cellIndex2)

    const sameRow = cell1Position.y === cell2Position.y
    const sameColumn = cell1Position.x === cell2Position.x
    const xDistance = Math.abs(cell1Position.x - cell2Position.x)
    const yDistance = Math.abs(cell1Position.y - cell2Position.y)
    
    return (sameRow && xDistance === 1) || (sameColumn && yDistance === 1)
  }
  
  private cellIndexToCoordinate(cellIndex: number): Point {
    const x = cellIndex % this.sideLength;
    const y = Math.floor(cellIndex / this.sideLength)
    return { x, y }
  }
}

export default Grid