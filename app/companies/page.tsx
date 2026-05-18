"use client";
import { useState } from "react";
import { useCRM } from "@/lib/store";
import { Company } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import TopBar from "@/components/TopBar";
import Modal from "@/components/Modal";
import { Plus, Trash2, Pencil, Building2 } from "lucide-react";

const EMPTY: Omit<Company, "id" | "createdAt"> = {
  name: "", industry: "", website: "", employees: 0, revenue: 0, country: "USA",
};

export default function CompaniesPage() {
  const { companies, addCompany, updateCompany, deleteCompany } = useCRM();
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Company | null>(null);
  const [form, setForm] = useState<Omit<Company, "id" | "createdAt">>(EMPTY);

  const filtered = companies.filter(c => {
    const q = search.toLowerCase();
    return !q || c.name.toLowerCase().includes(q) || c.industry.toLowerCase().includes(q);
  });

  function openAdd() { setEditing(null); setForm(EMPTY); setModal(true); }
  function openEdit(c: Company) { setEditing(c); setForm({ name: c.name, industry: c.industry, website: c.website, employees: c.employees, revenue: c.revenue, country: c.country }); setModal(true); }
  function save() {
    if (!form.name) return;
    if (editing) updateCompany(editing.id, form);
    else addCompany(form);
    setModal(false);
  }

  return (
    <div>
      <TopBar title="Companies" subtitle={`${companies.length} total`} />
      <div className="p-6">
        <div className="flex items-center justify-between gap-3 mb-5">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search companies..."
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button onClick={openAdd} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
            <Plus size={16} /> Add Company
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(c => (
            <div key={c.id} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                    <Building2 size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{c.name}</p>
                    <p className="text-xs text-slate-400">{c.industry}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => openEdit(c)} className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700"><Pencil size={14} /></button>
                  <button onClick={() => deleteCompany(c.id)} className="p-1.5 rounded hover:bg-red-50 text-slate-400 hover:text-red-600"><Trash2 size={14} /></button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-slate-50 rounded-lg p-2">
                  <p className="text-xs text-slate-400">Revenue</p>
                  <p className="font-semibold text-slate-800">{formatCurrency(c.revenue)}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-2">
                  <p className="text-xs text-slate-400">Employees</p>
                  <p className="font-semibold text-slate-800">{c.employees.toLocaleString()}</p>
                </div>
              </div>
              {c.website && (
                <a href={`https://${c.website}`} target="_blank" rel="noreferrer" className="block mt-3 text-xs text-blue-500 hover:underline truncate">{c.website}</a>
              )}
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-3 text-center py-16 text-slate-400">No companies found.</div>
          )}
        </div>
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? "Edit Company" : "Add Company"}>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Company Name *</label>
            <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Industry</label>
              <input value={form.industry} onChange={e => setForm(p => ({ ...p, industry: e.target.value }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Country</label>
              <input value={form.country} onChange={e => setForm(p => ({ ...p, country: e.target.value }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Website</label>
            <input value={form.website} onChange={e => setForm(p => ({ ...p, website: e.target.value }))} placeholder="example.com" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Employees</label>
              <input type="number" value={form.employees} onChange={e => setForm(p => ({ ...p, employees: Number(e.target.value) }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Annual Revenue ($)</label>
              <input type="number" value={form.revenue} onChange={e => setForm(p => ({ ...p, revenue: Number(e.target.value) }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button onClick={() => setModal(false)} className="flex-1 border border-slate-200 rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">Cancel</button>
            <button onClick={save} className="flex-1 bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-700">Save</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
