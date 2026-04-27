// hooks/useWizardState.ts
import { useReducer, useCallback } from 'react'
import type { WizardState, DeviceType, WizardImage } from '../types/wizard'
import { initialWizardState } from '../types/wizard'

const MAX_STEP = 5

type Action =
  | { type: 'SET_DEVICE';       device: DeviceType }
  | { type: 'SET_BRAND';        brand: string }
  | { type: 'SET_MODEL';        modelNumber: string; modelTrim: string | null }
  | { type: 'SET_MODEL_CUSTOM'; modelCustom: string }
  | { type: 'TOGGLE_ISSUE';     issueId: string }
  | { type: 'ADD_IMAGE';        image: WizardImage }
  | { type: 'REMOVE_IMAGE';     id: string }
  | { type: 'SET_APPOINTMENT';  date: string; timeSlot: string }
  | { type: 'SKIP_APPOINTMENT' }
  | { type: 'SET_CUSTOMER';     field: keyof WizardState['customer']; value: string }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'GO_TO_STEP';       step: number }
  | { type: 'SET_TICKET_ID';    id: string }
  | { type: 'RESET' }

function reducer(state: WizardState, action: Action): WizardState {
  switch (action.type) {
    case 'SET_DEVICE':
      return { ...state, device: action.device, brand: null, modelNumber: null, modelTrim: null, modelCustom: null }
    case 'SET_BRAND':
      return { ...state, brand: action.brand, modelNumber: null, modelTrim: null, modelCustom: null }
    case 'SET_MODEL':
      return { ...state, modelNumber: action.modelNumber, modelTrim: action.modelTrim, modelCustom: null }
    case 'SET_MODEL_CUSTOM':
      return { ...state, modelCustom: action.modelCustom, modelNumber: null, modelTrim: null }
    case 'TOGGLE_ISSUE': {
      const exists = state.issues.includes(action.issueId)
      return {
        ...state,
        issues: exists
          ? state.issues.filter(id => id !== action.issueId)
          : [...state.issues, action.issueId],
      }
    }
    case 'ADD_IMAGE':
      if (state.images.length >= 5) return state
      return { ...state, images: [...state.images, action.image] }
    case 'REMOVE_IMAGE':
      return { ...state, images: state.images.filter(img => img.id !== action.id) }
    case 'SET_APPOINTMENT':
      return { ...state, appointment: { date: action.date, timeSlot: action.timeSlot } }
    case 'SKIP_APPOINTMENT':
      return { ...state, appointment: { date: null, timeSlot: null } }
    case 'SET_CUSTOMER':
      return { ...state, customer: { ...state.customer, [action.field]: action.value } }
    case 'NEXT_STEP':
      return { ...state, step: Math.min(state.step + 1, MAX_STEP) }
    case 'PREV_STEP':
      return { ...state, step: Math.max(state.step - 1, 0) }
    case 'GO_TO_STEP':
      return { ...state, step: Math.max(0, Math.min(action.step, MAX_STEP)) }
    case 'SET_TICKET_ID':
      return { ...state, submittedTicketId: action.id }
    case 'RESET':
      return initialWizardState
    default:
      return state
  }
}

export function useWizardState() {
  const [state, dispatch] = useReducer(reducer, initialWizardState)

  return {
    state,
    setDevice:       useCallback((device: DeviceType) => dispatch({ type: 'SET_DEVICE', device }), []),
    setBrand:        useCallback((brand: string) => dispatch({ type: 'SET_BRAND', brand }), []),
    setModel:        useCallback((modelNumber: string, modelTrim: string | null) => dispatch({ type: 'SET_MODEL', modelNumber, modelTrim }), []),
    setModelCustom:  useCallback((modelCustom: string) => dispatch({ type: 'SET_MODEL_CUSTOM', modelCustom }), []),
    toggleIssue:     useCallback((issueId: string) => dispatch({ type: 'TOGGLE_ISSUE', issueId }), []),
    addImage:        useCallback((image: WizardImage) => dispatch({ type: 'ADD_IMAGE', image }), []),
    removeImage:     useCallback((id: string) => dispatch({ type: 'REMOVE_IMAGE', id }), []),
    setAppointment:  useCallback((date: string, timeSlot: string) => dispatch({ type: 'SET_APPOINTMENT', date, timeSlot }), []),
    skipAppointment: useCallback(() => dispatch({ type: 'SKIP_APPOINTMENT' }), []),
    setCustomer:     useCallback((field: keyof WizardState['customer'], value: string) => dispatch({ type: 'SET_CUSTOMER', field, value }), []),
    nextStep:        useCallback(() => dispatch({ type: 'NEXT_STEP' }), []),
    prevStep:        useCallback(() => dispatch({ type: 'PREV_STEP' }), []),
    goToStep:        useCallback((step: number) => dispatch({ type: 'GO_TO_STEP', step }), []),
    setTicketId:     useCallback((id: string) => dispatch({ type: 'SET_TICKET_ID', id }), []),
    reset:           useCallback(() => dispatch({ type: 'RESET' }), []),
  }
}