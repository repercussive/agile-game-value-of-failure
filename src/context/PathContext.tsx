import { createContext } from 'react'
import Path from '../logic/Path'

export const pathContext = createContext(new Path())
export const PathContextProvider = pathContext.Provider