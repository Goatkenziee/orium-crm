"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { Contact, Company, Deal, Task, Activity } from "./types";
import { uuid } from "./utils";
import { SEED_CONTACTS, SEED_COMPANIES, SEED_DEALS, SEED_TASKS, SEED_ACTIVITIES } from "./data";

interface CRMContextType {
  contacts: Contact[];
  companies: Company[];
  deals: Deal[];
  tasks: Task[];
  activities: Activity[];

  addContact: (c: Omit<Contact, "id" | "createdAt">) => void;
  updateContact: (id: string, c: Partial<Contact>) => void;
  deleteContact: (id: string) => void;

  addCompany: (c: Omit<Company, "id" | "createdAt">) => void;
  updateCompany: (id: string, c: Partial<Company>) => void;
  deleteCompany: (id: string) => void;

  addDeal: (d: Omit<Deal, "id" | "createdAt">) => void;
  updateDeal: (id: string, d: Partial<Deal>) => void;
  deleteDeal: (id: string) => void;

  addTask: (t: Omit<Task, "id" | "createdAt">) => void;
  updateTask: (id: string, t: Partial<Task>) => void;
  deleteTask: (id: string) => void;

  addActivity: (a: Omit<Activity, "id" | "createdAt">) => void;
  deleteActivity: (id: string) => void;
}

const CRMContext = createContext<CRMContextType | null>(null);

export function CRMProvider({ children }: { children: ReactNode }) {
  const now = () => new Date().toISOString();

  const [contacts, setContacts] = useState<Contact[]>(SEED_CONTACTS);
  const [companies, setCompanies] = useState<Company[]>(SEED_COMPANIES);
  const [deals, setDeals] = useState<Deal[]>(SEED_DEALS);
  const [tasks, setTasks] = useState<Task[]>(SEED_TASKS);
  const [activities, setActivities] = useState<Activity[]>(SEED_ACTIVITIES);

  return (
    <CRMContext.Provider value={{
      contacts, companies, deals, tasks, activities,

      addContact: (c) => setContacts(p => [...p, { ...c, id: uuid(), createdAt: now() }]),
      updateContact: (id, c) => setContacts(p => p.map(x => x.id === id ? { ...x, ...c } : x)),
      deleteContact: (id) => setContacts(p => p.filter(x => x.id !== id)),

      addCompany: (c) => setCompanies(p => [...p, { ...c, id: uuid(), createdAt: now() }]),
      updateCompany: (id, c) => setCompanies(p => p.map(x => x.id === id ? { ...x, ...c } : x)),
      deleteCompany: (id) => setCompanies(p => p.filter(x => x.id !== id)),

      addDeal: (d) => setDeals(p => [...p, { ...d, id: uuid(), createdAt: now() }]),
      updateDeal: (id, d) => setDeals(p => p.map(x => x.id === id ? { ...x, ...d } : x)),
      deleteDeal: (id) => setDeals(p => p.filter(x => x.id !== id)),

      addTask: (t) => setTasks(p => [...p, { ...t, id: uuid(), createdAt: now() }]),
      updateTask: (id, t) => setTasks(p => p.map(x => x.id === id ? { ...x, ...t } : x)),
      deleteTask: (id) => setTasks(p => p.filter(x => x.id !== id)),

      addActivity: (a) => setActivities(p => [{ ...a, id: uuid(), createdAt: now() }, ...p]),
      deleteActivity: (id) => setActivities(p => p.filter(x => x.id !== id)),
    }}>
      {children}
    </CRMContext.Provider>
  );
}

export function useCRM() {
  const ctx = useContext(CRMContext);
  if (!ctx) throw new Error("useCRM must be used within CRMProvider");
  return ctx;
}
