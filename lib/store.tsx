"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { CRMStore, Contact, Company, Deal, Task, Activity } from "./types";
import { seedData } from "./data";
import { generateId } from "./utils";

const STORAGE_KEY = "orium_crm_data";

interface CRMContextValue extends CRMStore {
  // Contacts
  addContact: (c: Omit<Contact, "id" | "createdAt" | "updatedAt">) => Contact;
  updateContact: (id: string, updates: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
  // Companies
  addCompany: (c: Omit<Company, "id" | "createdAt" | "updatedAt">) => Company;
  updateCompany: (id: string, updates: Partial<Company>) => void;
  deleteCompany: (id: string) => void;
  // Deals
  addDeal: (d: Omit<Deal, "id" | "createdAt" | "updatedAt">) => Deal;
  updateDeal: (id: string, updates: Partial<Deal>) => void;
  deleteDeal: (id: string) => void;
  // Tasks
  addTask: (t: Omit<Task, "id" | "createdAt" | "updatedAt">) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  // Activities
  addActivity: (a: Omit<Activity, "id" | "createdAt">) => Activity;
  deleteActivity: (id: string) => void;
}

const CRMContext = createContext<CRMContextValue | null>(null);

export function CRMProvider({ children }: { children: React.ReactNode }) {
  const [store, setStore] = useState<CRMStore>(() => {
    if (typeof window === "undefined") return seedData;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw) as CRMStore;
    } catch {}
    return seedData;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    } catch {}
  }, [store]);

  const ts = () => new Date().toISOString();

  // --- Contacts ---
  const addContact = useCallback((c: Omit<Contact, "id" | "createdAt" | "updatedAt">): Contact => {
    const contact: Contact = { ...c, id: generateId(), createdAt: ts(), updatedAt: ts() };
    setStore(s => ({ ...s, contacts: [contact, ...s.contacts] }));
    return contact;
  }, []);

  const updateContact = useCallback((id: string, updates: Partial<Contact>) => {
    setStore(s => ({ ...s, contacts: s.contacts.map(c => c.id === id ? { ...c, ...updates, updatedAt: ts() } : c) }));
  }, []);

  const deleteContact = useCallback((id: string) => {
    setStore(s => ({ ...s, contacts: s.contacts.filter(c => c.id !== id) }));
  }, []);

  // --- Companies ---
  const addCompany = useCallback((c: Omit<Company, "id" | "createdAt" | "updatedAt">): Company => {
    const company: Company = { ...c, id: generateId(), createdAt: ts(), updatedAt: ts() };
    setStore(s => ({ ...s, companies: [company, ...s.companies] }));
    return company;
  }, []);

  const updateCompany = useCallback((id: string, updates: Partial<Company>) => {
    setStore(s => ({ ...s, companies: s.companies.map(c => c.id === id ? { ...c, ...updates, updatedAt: ts() } : c) }));
  }, []);

  const deleteCompany = useCallback((id: string) => {
    setStore(s => ({ ...s, companies: s.companies.filter(c => c.id !== id) }));
  }, []);

  // --- Deals ---
  const addDeal = useCallback((d: Omit<Deal, "id" | "createdAt" | "updatedAt">): Deal => {
    const deal: Deal = { ...d, id: generateId(), createdAt: ts(), updatedAt: ts() };
    setStore(s => ({ ...s, deals: [deal, ...s.deals] }));
    return deal;
  }, []);

  const updateDeal = useCallback((id: string, updates: Partial<Deal>) => {
    setStore(s => ({ ...s, deals: s.deals.map(d => d.id === id ? { ...d, ...updates, updatedAt: ts() } : d) }));
  }, []);

  const deleteDeal = useCallback((id: string) => {
    setStore(s => ({ ...s, deals: s.deals.filter(d => d.id !== id) }));
  }, []);

  // --- Tasks ---
  const addTask = useCallback((t: Omit<Task, "id" | "createdAt" | "updatedAt">): Task => {
    const task: Task = { ...t, id: generateId(), createdAt: ts(), updatedAt: ts() };
    setStore(s => ({ ...s, tasks: [task, ...s.tasks] }));
    return task;
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setStore(s => ({ ...s, tasks: s.tasks.map(t => t.id === id ? { ...t, ...updates, updatedAt: ts() } : t) }));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setStore(s => ({ ...s, tasks: s.tasks.filter(t => t.id !== id) }));
  }, []);

  // --- Activities ---
  const addActivity = useCallback((a: Omit<Activity, "id" | "createdAt">): Activity => {
    const activity: Activity = { ...a, id: generateId(), createdAt: ts() };
    setStore(s => ({ ...s, activities: [activity, ...s.activities] }));
    return activity;
  }, []);

  const deleteActivity = useCallback((id: string) => {
    setStore(s => ({ ...s, activities: s.activities.filter(a => a.id !== id) }));
  }, []);

  return (
    <CRMContext.Provider value={{
      ...store,
      addContact, updateContact, deleteContact,
      addCompany, updateCompany, deleteCompany,
      addDeal, updateDeal, deleteDeal,
      addTask, updateTask, deleteTask,
      addActivity, deleteActivity,
    }}>
      {children}
    </CRMContext.Provider>
  );
}

export function useCRM(): CRMContextValue {
  const ctx = useContext(CRMContext);
  if (!ctx) throw new Error("useCRM must be used within CRMProvider");
  return ctx;
}
