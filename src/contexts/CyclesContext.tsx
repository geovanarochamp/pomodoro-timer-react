import { createContext, ReactNode, useState, useReducer } from 'react'

interface Cycle {
	id: string
	task: string
	minutesAmount: number
	startDate: Date
	interruptedDate?: Date
	finishedDate?: Date
}

interface CreateCycleData {
	task: string
	minutesAmount: number
}

interface CyclesContextType {
	cycles: Cycle[]
	activeCycle: Cycle | undefined
	activeCycleId: string | null
	amountSecondsPassed: number
	markCurrentCycleAsFinished: () => void
	setSecondsPassed: (seconds: number) => void
	createNewCycle: (data: CreateCycleData) => void
	interruptCurrentCycle: () => void
}

export const CyclesContext = createContext({} as CyclesContextType)

interface CyclesContextProviderPros {
	children: ReactNode
}

export function CyclesContextProvider({ children }: CyclesContextProviderPros) {
	const [cycles, setCycles] = useReducer((state: Cycle[], action) => {
		return state
	}, [])

	const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
	const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

	const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

	function setSecondsPassed(seconds: number) {
		setAmountSecondsPassed(seconds)
	}

	function markCurrentCycleAsFinished() {
		setCycles((state) =>
			state.map((cycle) => {
				if (cycle.id === activeCycleId) {
					return { ...cycle, finishedDate: new Date() }
				} else {
					return cycle
				}
			}),
		)
	}

	function createNewCycle(data: CreateCycleData) {
		const newCycle: Cycle = {
			id: String(new Date().getTime()),
			task: data.task,
			minutesAmount: data.minutesAmount,
			startDate: new Date(),
		}

		setCycles((state) => [...state, newCycle])
		setActiveCycleId(newCycle.id)
		setAmountSecondsPassed(0)
	}

	function interruptCurrentCycle() {
		setCycles((state) =>
			cycles.map((cycle) => {
				if (cycle.id === activeCycleId) {
					return { ...cycle, interruptedDate: new Date() }
				} else {
					return cycle
				}
			}),
		)
		setActiveCycleId(null)
	}

	return (
		<CyclesContext.Provider
			value={{
				cycles,
				activeCycle,
				activeCycleId,
				markCurrentCycleAsFinished,
				amountSecondsPassed,
				setSecondsPassed,
				createNewCycle,
				interruptCurrentCycle,
			}}
		>
			{children}
		</CyclesContext.Provider>
	)
}
