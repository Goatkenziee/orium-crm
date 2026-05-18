"use client";
import { useState } from "react";
import { useCRM } from "@/lib/store";
import TopBar from "@/components/TopBar";
import Modal from "@/components/Modal";
import { generateId, formatCurrencyFull } from "@/lib/utils";
import type { Company } from "@/lib/types";
import { Plus, Pencil, Trash2, Search, Building2, Globe, Users } from "lucide-react";

const INDUSTRIES = ["Technology", "Finance", "Healthcare", "Real Estate", "Retail", "Manufacturing", "Education", "Other"];
const SIZES = ["1-10", "11-50", "51-200", "201-500", "500+"];

const EMPTY: Omit<Company, "id" | "createdAt" | "updatedAt"> = {
  name: "", industry: "Technology", website: "", phone: "", email: "", address: "",
  employees: "1-10", revenue: 0, notes: "",
};

export default function CompaniesPage() {
  const { state, addCompany, updateCompany, deleteCompany } = useCRM();
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Company | null>(null);
  const [form, setForm] = useState<Omit<Company, "id" | "createdAt" | "updatedAt">>(EMPTY);

  const filtered = state.companies.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.industry.toLowerCase().includes(search.toLowerCase())
  );

  function openAdd() { setEditing(null); setForm(EMPTY); setShowModal(true); }
  function openEdit(c: Company) {
    setEditing(c);
    const { id, createdAt, updatedAt, ...rest } = c;
    setForm(rest);
    setShowModal(true);
  }
  function handleSave() {
    const now = new Date().toISOString();
    if (editing) updateCompany({ ...editing, ...form, revenue: Number(form.revenue), updatedAt: now });
    else addCompany({ id: generateId(), ...form, revenue: Number(form.revenue), createdAt: now, updatedAt: now });
    setShowModal(false);
  }

  function getContactCount(companyId: string) {
    return state.contacts.filter(c => c.companyId === companyId).length;
  }

  return (
    <div className="p-6 space-y-4">
      <TopBar title="Companies" subtitle={`${filtered.length} companies`} />

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search companies…"
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400" />
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
          <Plus className="w-4 h-4" /> Add Company
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(c => (
          <div key={c.id} className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{c.name}</h3>
                  <p className="text-xs text-slate-500">{c.industry}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-indigo-600"><Pencil className="w-3.5 h-3.5" /></button>
                <button onClick={() => deleteCompany(c.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
            <div className="mt-3 space-y-1.5">
              {c.website && (
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Globe className="w-3.5 h-3.5 shrink-0" />
                  <a href={c.website} target="_blank" rel="noreferrer" className="hover:text-indigo-600 truncate">{c.website}</a>
                </div>
              )}
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Users className="w-3.5 h-3.5 shrink-0" />
                <span>{c.employees} employees</span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400">{getContactCount(c.id)} contact{getContactCount(c.id) !== 1 ? "s" : ""}</span>
              {c.revenue > 0 && <span className="font-semibold text-slate-700">{formatCurrencyFull(c.revenue)}</span>}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-3 text-center py-12 text-slate-400 text-sm">No companies found.</div>
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editing ? "Edit Company" : "New Company"}>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="block text-xs font-medium text-slate-600 mb-1">Company Name</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Industry</label>
            <select value={form.industry} onChange={e => setForm({ ...form, industry: e.target.value })}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
              {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Size</label>
            <select value={form.employees} onChange={e => setForm({ ...form, employees: e.target.value })}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
              {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          {[["Website", "website"], ["Phone", "phone"], ["Email", "email"]].map(([label, key]) => (
            <div key={key} className="col-span-2">
              <label className="block text-xs font-medium text-slate-600 mb-1">{label}</label>
              <input value={(form as Record<string, unknown>)[key] as string} onChange={e => setForm({ ...form, [key]: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>
          ))}
          <div className="col-span-2">
            <label className="block text-xs font-medium text-slate-600 mb-1">Annual Revenue ($)</label>
            <input type="number" value={form.revenue} onChange={e => setForm({ ...form, revenue: Number(e.target.value) })}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium text-slate-600 mb-1">Notes</label>
            <textarea value={form.notes ?? ""} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none" />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 font-medium">
            {editing ? "Save Changes" : "Create Company"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
