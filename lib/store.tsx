"use client";

import React, { createContext, useContext, useReducer, useCallback } from "react";
import type { Contact, Company, Deal, Task, Activity, CRMStore } from "./types";
import { seedData } from "./data";

// ─── State ─────────────────────────────────────────────────────────────────
interface State extends CRMStore {
  searchQuery: string;
}

const initialState: State = {
  ...seedData,
  searchQuery: "",
};

// ─── Actions ────────────────────────────────────────────────────────────────
type Action =
  | { type: "SET_SEARCH"; payload: string }
  // Contacts
  | { type: "ADD_CONTACT"; payload: Contact }
  | { type: "UPDATE_CONTACT"; payload: Contact }
  | { type: "DELETE_CONTACT"; payload: string }
  // Companies
  | { type: "ADD_COMPANY"; payload: Company }
  | { type: "UPDATE_COMPANY"; payload: Company }
  | { type: "DELETE_COMPANY"; payload: string }
  // Deals
  | { type: "ADD_DEAL"; payload: Deal }
  | { type: "UPDATE_DEAL"; payload: Deal }
  | { type: "DELETE_DEAL"; payload: string }
  | { type: "MOVE_DEAL"; payload: { id: string; stage: Deal["stage"] } }
  // Tasks
  | { type: "ADD_TASK"; payload: Task }
  | { type: "UPDATE_TASK"; payload: Task }
  | { type: "DELETE_TASK"; payload: string }
  | { type: "TOGGLE_TASK"; payload: string }
  // Activities
  | { type: "ADD_ACTIVITY"; payload: Activity };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_SEARCH":
      return { ...state, searchQuery: action.payload };

    // Contacts
    case "ADD_CONTACT":
      return { ...state, contacts: [action.payload, ...state.contacts] };
    case "UPDATE_CONTACT":
      return { ...state, contacts: state.contacts.map(c => c.id === action.payload.id ? action.payload : c) };
    case "DELETE_CONTACT":
      return { ...state, contacts: state.contacts.filter(c => c.id !== action.payload) };

    // Companies
    case "ADD_COMPANY":
      return { ...state, companies: [action.payload, ...state.companies] };
    case "UPDATE_COMPANY":
      return { ...state, companies: state.companies.map(c => c.id === action.payload.id ? action.payload : c) };
    case "DELETE_COMPANY":
      return { ...state, companies: state.companies.filter(c => c.id !== action.payload) };

    // Deals
    case "ADD_DEAL":
      return { ...state, deals: [action.payload, ...state.deals] };
    case "UPDATE_DEAL":
      return { ...state, deals: state.deals.map(d => d.id === action.payload.id ? action.payload : d) };
    case "DELETE_DEAL":
      return { ...state, deals: state.deals.filter(d => d.id !== action.payload) };
    case "MOVE_DEAL":
      return {
        ...state,
        deals: state.deals.map(d =>
          d.id === action.payload.id ? { ...d, stage: action.payload.stage, updatedAt: new Date().toISOString() } : d
        ),
      };

    // Tasks
    case "ADD_TASK":
      return { ...state, tasks: [action.payload, ...state.tasks] };
    case "UPDATE_TASK":
      return { ...state, tasks: state.tasks.map(t => t.id === action.payload.id ? action.payload : t) };
    case "DELETE_TASK":
      return { ...state, tasks: state.tasks.filter(t => t.id !== action.payload) };
    case "TOGGLE_TASK": {
      const now = new Date().toISOString();
      return {
        ...state,
        tasks: state.tasks.map(t => {
          if (t.id !== action.payload) return t;
          const done = t.status !== "done";
          return { ...t, status: done ? "done" : "todo", completedAt: done ? now : undefined, updatedAt: now };
        }),
      };
    }

    // Activities
    case "ADD_ACTIVITY":
      return { ...state, activities: [action.payload, ...state.activities] };

    default:
      return state;
  }
}

// ─── Context ────────────────────────────────────────────────────────────────
interface CRMContextValue {
  state: State;
  // Contacts
  addContact: (c: Contact) => void;
  updateContact: (c: Contact) => void;
  deleteContact: (id: string) => void;
  // Companies
  addCompany: (c: Company) => void;
  updateCompany: (c: Company) => void;
  deleteCompany: (id: string) => void;
  // Deals
  addDeal: (d: Deal) => void;
  updateDeal: (d: Deal) => void;
  deleteDeal: (id: string) => void;
  moveDeal: (id: string, stage: Deal["stage"]) => void;
  // Tasks
  addTask: (t: Task) => void;
  updateTask: (t: Task) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  // Activities
  addActivity: (a: Activity) => void;
  // Search
  setSearch: (q: string) => void;
}

const CRMContext = createContext<CRMContextValue | null>(null);

export function CRMProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const addContact = useCallback((c: Contact) => dispatch({ type: "ADD_CONTACT", payload: c }), []);
  const updateContact = useCallback((c: Contact) => dispatch({ type: "UPDATE_CONTACT", payload: c }), []);
  const deleteContact = useCallback((id: string) => dispatch({ type: "DELETE_CONTACT", payload: id }), []);

  const addCompany = useCallback((c: Company) => dispatch({ type: "ADD_COMPANY", payload: c }), []);
  const updateCompany = useCallback((c: Company) => dispatch({ type: "UPDATE_COMPANY", payload: c }), []);
  const deleteCompany = useCallback((id: string) => dispatch({ type: "DELETE_COMPANY", payload: id }), []);

  const addDeal = useCallback((d: Deal) => dispatch({ type: "ADD_DEAL", payload: d }), []);
  const updateDeal = useCallback((d: Deal) => dispatch({ type: "UPDATE_DEAL", payload: d }), []);
  const deleteDeal = useCallback((id: string) => dispatch({ type: "DELETE_DEAL", payload: id }), []);
  const moveDeal = useCallback((id: string, stage: Deal["stage"]) => dispatch({ type: "MOVE_DEAL", payload: { id, stage } }), []);

  const addTask = useCallback((t: Task) => dispatch({ type: "ADD_TASK", payload: t }), []);
  const updateTask = useCallback((t: Task) => dispatch({ type: "UPDATE_TASK", payload: t }), []);
  const deleteTask = useCallback((id: string) => dispatch({ type: "DELETE_TASK", payload: id }), []);
  const toggleTask = useCallback((id: string) => dispatch({ type: "TOGGLE_TASK", payload: id }), []);

  const addActivity = useCallback((a: Activity) => dispatch({ type: "ADD_ACTIVITY", payload: a }), []);
  const setSearch = useCallback((q: string) => dispatch({ type: "SET_SEARCH", payload: q }), []);

  return (
    <CRMContext.Provider value={{
      state,
      addContact, updateContact, deleteContact,
      addCompany, updateCompany, deleteCompany,
      addDeal, updateDeal, deleteDeal, moveDeal,
      addTask, updateTask, deleteTask, toggleTask,
      addActivity,
      setSearch,
    }}>
      {children}
    </CRMContext.Provider>
  );
}

export function useCRM() {
  const ctx = useContext(CRMContext);
  if (!ctx) throw new Error("useCRM must be used inside CRMProvider");
  return ctx;
}
