"use client";
import React, { createContext, useContext, useReducer, ReactNode } from "react";
import type { Contact, Deal, Task, Company, Activity } from "./types";
import {
  SEED_CONTACTS,
  SEED_DEALS,
  SEED_TASKS,
  SEED_COMPANIES,
  SEED_ACTIVITIES,
} from "./data";

// ─── State ───────────────────────────────────────────────────────────────────
interface CRMState {
  contacts: Contact[];
  deals: Deal[];
  tasks: Task[];
  companies: Company[];
  activities: Activity[];
}

const initialState: CRMState = {
  contacts: SEED_CONTACTS,
  deals: SEED_DEALS,
  tasks: SEED_TASKS,
  companies: SEED_COMPANIES,
  activities: SEED_ACTIVITIES,
};

// ─── Actions ─────────────────────────────────────────────────────────────────
type Action =
  | { type: "ADD_CONTACT"; payload: Contact }
  | { type: "UPDATE_CONTACT"; payload: Contact }
  | { type: "DELETE_CONTACT"; payload: string }
  | { type: "ADD_DEAL"; payload: Deal }
  | { type: "UPDATE_DEAL"; payload: Deal }
  | { type: "DELETE_DEAL"; payload: string }
  | { type: "ADD_TASK"; payload: Task }
  | { type: "UPDATE_TASK"; payload: Task }
  | { type: "DELETE_TASK"; payload: string }
  | { type: "ADD_COMPANY"; payload: Company }
  | { type: "UPDATE_COMPANY"; payload: Company }
  | { type: "DELETE_COMPANY"; payload: string }
  | { type: "ADD_ACTIVITY"; payload: Activity }
  | { type: "DELETE_ACTIVITY"; payload: string };

function reducer(state: CRMState, action: Action): CRMState {
  switch (action.type) {
    case "ADD_CONTACT": return { ...state, contacts: [action.payload, ...state.contacts] };
    case "UPDATE_CONTACT": return { ...state, contacts: state.contacts.map(c => c.id === action.payload.id ? action.payload : c) };
    case "DELETE_CONTACT": return { ...state, contacts: state.contacts.filter(c => c.id !== action.payload) };
    case "ADD_DEAL": return { ...state, deals: [action.payload, ...state.deals] };
    case "UPDATE_DEAL": return { ...state, deals: state.deals.map(d => d.id === action.payload.id ? action.payload : d) };
    case "DELETE_DEAL": return { ...state, deals: state.deals.filter(d => d.id !== action.payload) };
    case "ADD_TASK": return { ...state, tasks: [action.payload, ...state.tasks] };
    case "UPDATE_TASK": return { ...state, tasks: state.tasks.map(t => t.id === action.payload.id ? action.payload : t) };
    case "DELETE_TASK": return { ...state, tasks: state.tasks.filter(t => t.id !== action.payload) };
    case "ADD_COMPANY": return { ...state, companies: [action.payload, ...state.companies] };
    case "UPDATE_COMPANY": return { ...state, companies: state.companies.map(c => c.id === action.payload.id ? action.payload : c) };
    case "DELETE_COMPANY": return { ...state, companies: state.companies.filter(c => c.id !== action.payload) };
    case "ADD_ACTIVITY": return { ...state, activities: [action.payload, ...state.activities] };
    case "DELETE_ACTIVITY": return { ...state, activities: state.activities.filter(a => a.id !== action.payload) };
    default: return state;
  }
}

// ─── Context ─────────────────────────────────────────────────────────────────
interface CRMContextValue {
  state: CRMState;
  contacts: Contact[];
  deals: Deal[];
  tasks: Task[];
  companies: Company[];
  activities: Activity[];
  addContact: (c: Contact) => void;
  updateContact: (c: Contact) => void;
  deleteContact: (id: string) => void;
  addDeal: (d: Deal) => void;
  updateDeal: (d: Deal) => void;
  deleteDeal: (id: string) => void;
  addTask: (t: Task) => void;
  updateTask: (t: Task) => void;
  deleteTask: (id: string) => void;
  addCompany: (c: Company) => void;
  updateCompany: (c: Company) => void;
  deleteCompany: (id: string) => void;
  addActivity: (a: Omit<Activity, "id" | "createdAt">) => void;
  deleteActivity: (id: string) => void;
}

const CRMContext = createContext<CRMContextValue | null>(null);

export function CRMProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const ctx: CRMContextValue = {
    state,
    contacts: state.contacts,
    deals: state.deals,
    tasks: state.tasks,
    companies: state.companies,
    activities: state.activities,
    addContact: (c) => dispatch({ type: "ADD_CONTACT", payload: c }),
    updateContact: (c) => dispatch({ type: "UPDATE_CONTACT", payload: c }),
    deleteContact: (id) => dispatch({ type: "DELETE_CONTACT", payload: id }),
    addDeal: (d) => dispatch({ type: "ADD_DEAL", payload: d }),
    updateDeal: (d) => dispatch({ type: "UPDATE_DEAL", payload: d }),
    deleteDeal: (id) => dispatch({ type: "DELETE_DEAL", payload: id }),
    addTask: (t) => dispatch({ type: "ADD_TASK", payload: t }),
    updateTask: (t) => dispatch({ type: "UPDATE_TASK", payload: t }),
    deleteTask: (id) => dispatch({ type: "DELETE_TASK", payload: id }),
    addCompany: (c) => dispatch({ type: "ADD_COMPANY", payload: c }),
    updateCompany: (c) => dispatch({ type: "UPDATE_COMPANY", payload: c }),
    deleteCompany: (id) => dispatch({ type: "DELETE_COMPANY", payload: id }),
    addActivity: (a) => dispatch({
      type: "ADD_ACTIVITY",
      payload: {
        ...a,
        id: Math.random().toString(36).slice(2, 10),
        createdAt: new Date().toISOString(),
      },
    }),
    deleteActivity: (id) => dispatch({ type: "DELETE_ACTIVITY", payload: id }),
  };

  return <CRMContext.Provider value={ctx}>{children}</CRMContext.Provider>;
}

export function useCRM(): CRMContextValue {
  const ctx = useContext(CRMContext);
  if (!ctx) throw new Error("useCRM must be used within CRMProvider");
  return ctx;
}
