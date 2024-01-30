import { createContext } from 'react'
import PathMatcher from '../logic/PathMatcher'

export const pathMatcherContext = createContext(new PathMatcher())
export const PathMatcherContextProvider = pathMatcherContext.Provider