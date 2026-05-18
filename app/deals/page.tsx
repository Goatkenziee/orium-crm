"use client";
import { useState } from "react";
import { useCRM } from "@/lib/store";
import { Deal, DealStage } from "@/lib/types";
import TopBar from "@/components/TopBar";
import Modal from "@/components/Modal";
import { Plus, Trash2, Edit2, DollarSign } from "lucide-react";
import { formatCurrency, STAGE_LABELS, STAGE_COLORS } from "@/lib/utils";

const STAGES: DealStage[] = ["prospecting", "qualification", "proposal", "negotiation", "closed_won", "closed_lost"];
const EMPTY: Omit<Deal, "id" | "createdAt"> = { title: "", contactId: "", companyId: "", stage: "prospecting", value: 0, probability: 10, closeDate: "", notes: "" };

export default function DealsPage() {
  const { deals, contacts, companies, addDeal, updateDeal, deleteDeal } = useCRM();
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState<Omit<Deal, "id" | "createdAt">>(EMPTY);
  const [editId, setEditId] = useState<string | null>(null);
  const [view, setView] = useState<"kanban" | "list">("kanban");

  function openAdd(stage?: DealStage) { setForm({ ...EMPTY, stage: stage || "prospecting" }); setEditId(null); setModal(true); }
  function openEdit(d: Deal) { setForm({ title: d.title, contactId: d.contactId, companyId: d.companyId, stage: d.stage, value: d.value, probability: d.probability, closeDate: d.closeDate, notes: d.notes }); setEditId(d.id); setModal(true); }
  function save() {
    if (!form.title) return;
    if (editId) { updateDeal(editId, form); } else { addDeal(form); }
    setModal(false); setForm(EMPTY); setEditId(null);
  }

  const getContact = (id: string) => contacts.find(c => c.id === id);
  const pipelineTotal = deals.filter(d => d.stage !== "closed_lost").reduce((s, d) => s + d.value, 0);

  return (
    <div>
      <TopBar title="Deals" subtitle={`${formatCurrency(pipelineTotal)} pipeline`} action={
        <div className="flex gap-2">
          <div className="flex bg-slate-100 rounded-lg p-0.5">
            <button onClick={() => setView("kanban")} className={`px-3 py-1.5 text-xs rounded-md font-medium ${view === "kanban" ? "bg-white shadow text-slate-900" : "text-slate-500"}`}>Kanban</button>
            <button onClick={() => setView("list")} className={`px-3 py-1.5 text-xs rounded-md font-medium ${view === "list" ? "bg-white shadow text-slate-900" : "text-slate-500"}`}>List</button>
          </div>
          <button onClick={() => openAdd()} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
            <Plus size={16} /> Add Deal
          </button>
        </div>
      } />

      {view === "kanban" ? (
        <div className="p-6 overflow-x-auto">
          <div className="flex gap-4 min-w-max">
            {STAGES.map(stage => {
              const stageDeals = deals.filter(d => d.stage === stage);
              const stageValue = stageDeals.reduce((s, d) => s + d.value, 0);
              return (
                <div key={stage} className="w-64 shrink-0">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STAGE_COLORS[stage]}`}>{STAGE_LABELS[stage]}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-slate-400">{stageDeals.length} · {formatCurrency(stageValue)}</span>
                      <button onClick={() => openAdd(stage)} className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-700"><Plus size={13} /></button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {stageDeals.map(d => {
                      const contact = getContact(d.contactId);
                      return (
                        <div key={d.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-2">
                            <p className="text-sm font-medium text-slate-900 leading-tight">{d.title}</p>
                            <div className="flex gap-0.5 shrink-0 ml-2">
                              <button onClick={() => openEdit(d)} className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-700"><Edit2 size={12} /></button>
                              <button onClick={() => deleteDeal(d.id)} className="p-1 hover:bg-red-50 rounded text-slate-400 hover:text-red-600"><Trash2 size={12} /></button>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 mb-2">
                            <DollarSign size={13} className="text-emerald-500" />
                            <span className="text-sm font-semibold text-slate-900">{formatCurrency(d.value)}</span>
                          </div>
                          {contact && <p className="text-xs text-slate-500 mb-1">{contact.firstName} {contact.lastName}</p>}
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-slate-100 rounded-full h-1.5">
                              <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${d.probability}%` }} />
                            </div>
                            <span className="text-xs text-slate-400">{d.probability}%</span>
                          </div>
                          {d.closeDate && <p className="text-xs text-slate-400 mt-1.5">Close {d.closeDate}</p>}
                        </div>
                      );
                    })}
                    {stageDeals.length === 0 && (
                      <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center">
                        <p className="text-xs text-slate-400">No deals</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="p-6">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Deal</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Stage</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Value</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide hidden md:table-cell">Contact</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide hidden lg:table-cell">Close Date</th>
                  <th className="px-5 py-3 w-20" />
                </tr>
              </thead>
              <tbody>
                {deals.length === 0 && <tr><td colSpan={6} className="text-center py-12 text-slate-400 text-sm">No deals yet.</td></tr>}
                {deals.map(d => {
                  const contact = getContact(d.contactId);
                  return (
                    <tr key={d.id} className="border-b border-slate-50 hover:bg-slate-50">
                      <td className="px-5 py-3 text-sm font-medium text-slate-900">{d.title}</td>
                      <td className="px-5 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STAGE_COLORS[d.stage]}`}>{STAGE_LABELS[d.stage]}</span></td>
                      <td className="px-5 py-3 text-sm font-semibold text-slate-900">{formatCurrency(d.value)}</td>
                      <td className="px-5 py-3 hidden md:table-cell text-sm text-slate-600">{contact ? `${contact.firstName} ${contact.lastName}` : "—"}</td>
                      <td className="px-5 py-3 hidden lg:table-cell text-sm text-slate-500">{d.closeDate || "—"}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1 justify-end">
                          <button onClick={() => openEdit(d)} className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700"><Edit2 size={13} /></button>
                          <button onClick={() => deleteDeal(d.id)} className="p-1.5 rounded hover:bg-red-50 text-slate-400 hover:text-red-600"><Trash2 size={13} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title={editId ? "Edit Deal" : "New Deal"}>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Deal Title *</label>
            <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Stage</label>
              <select value={form.stage} onChange={e => setForm(p => ({ ...p, stage: e.target.value as DealStage }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                {STAGES.map(s => <option key={s} value={s}>{STAGE_LABELS[s]}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Value ($)</label>
              <input type="number" value={form.value} onChange={e => setForm(p => ({ ...p, value: +e.target.value }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Probability %</label>
              <input type="number" min={0} max={100} value={form.probability} onChange={e => setForm(p => ({ ...p, probability: +e.target.value }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Close Date</label>
              <input type="date" value={form.closeDate} onChange={e => setForm(p => ({ ...p, closeDate: e.target.value }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Contact</label>
            <select value={form.contactId} onChange={e => setForm(p => ({ ...p, contactId: e.target.value }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select contact…</option>
              {contacts.map(c => <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Notes</label>
            <textarea rows={2} value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>
          <div className="flex gap-2 pt-2">
            <button onClick={() => setModal(false)} className="flex-1 border border-slate-200 rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">Cancel</button>
            <button onClick={save} className="flex-1 bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-700">{editId ? "Update" : "Create"}</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
