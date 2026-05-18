"use client";
import { useState } from "react";
import { useCRM } from "@/lib/store";
import TopBar from "@/components/TopBar";
import Modal from "@/components/Modal";
import { stageColor, formatCurrencyFull, generateId } from "@/lib/utils";
import type { Deal, DealStage } from "@/lib/types";
import { Plus, Pencil, Trash2, GripVertical } from "lucide-react";

const STAGES: DealStage[] = ["prospecting", "qualification", "proposal", "negotiation", "closed_won", "closed_lost"];
const STAGE_LABELS: Record<DealStage, string> = {
  prospecting: "Prospecting", qualification: "Qualification", proposal: "Proposal",
  negotiation: "Negotiation", closed_won: "Closed Won", closed_lost: "Closed Lost",
};

const EMPTY: Omit<Deal, "id" | "createdAt" | "updatedAt"> = {
  title: "", contactId: "", contactName: "", company: "", value: 0,
  stage: "prospecting", probability: 20, expectedClose: "", notes: "",
};

export default function DealsPage() {
  const { state, addDeal, updateDeal, deleteDeal } = useCRM();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Deal | null>(null);
  const [form, setForm] = useState<Omit<Deal, "id" | "createdAt" | "updatedAt">>(EMPTY);
  const [dragging, setDragging] = useState<string | null>(null);

  const totalPipeline = state.deals
    .filter(d => !["closed_won", "closed_lost"].includes(d.stage))
    .reduce((s, d) => s + d.value, 0);

  function openAdd() { setEditing(null); setForm(EMPTY); setShowModal(true); }
  function openEdit(d: Deal) {
    setEditing(d);
    const { id, createdAt, updatedAt, ...rest } = d;
    setForm(rest);
    setShowModal(true);
  }
  function handleSave() {
    const now = new Date().toISOString();
    if (editing) updateDeal({ ...editing, ...form, value: Number(form.value), updatedAt: now });
    else addDeal({ id: generateId(), ...form, value: Number(form.value), createdAt: now, updatedAt: now });
    setShowModal(false);
  }

  function onDrop(stage: DealStage) {
    if (dragging) {
      const deal = state.deals.find(d => d.id === dragging);
      if (deal) updateDeal({ ...deal, stage, updatedAt: new Date().toISOString() });
      setDragging(null);
    }
  }

  return (
    <div className="p-6 space-y-4">
      <TopBar title="Deals" subtitle={`Pipeline: ${formatCurrencyFull(totalPipeline)}`} />
      <div className="flex justify-end">
        <button onClick={openAdd} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
          <Plus className="w-4 h-4" /> Add Deal
        </button>
      </div>

      {/* Kanban board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {STAGES.map(stage => {
          const cards = state.deals.filter(d => d.stage === stage);
          const stageValue = cards.reduce((s, d) => s + d.value, 0);
          return (
            <div key={stage}
              onDragOver={e => e.preventDefault()}
              onDrop={() => onDrop(stage)}
              className="flex-shrink-0 w-64 bg-slate-50 rounded-xl border border-slate-200 p-3 min-h-64">
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${stageColor(stage)}`}>
                  {STAGE_LABELS[stage]}
                </span>
                <span className="text-xs text-slate-400 font-medium">{formatCurrencyFull(stageValue)}</span>
              </div>
              <div className="space-y-2">
                {cards.map(d => (
                  <div key={d.id} draggable
                    onDragStart={() => setDragging(d.id)}
                    onDragEnd={() => setDragging(null)}
                    className="bg-white rounded-lg border border-slate-200 p-3 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing">
                    <div className="flex items-start justify-between gap-1">
                      <div className="flex items-center gap-1.5">
                        <GripVertical className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                        <p className="text-sm font-medium text-slate-800 leading-tight">{d.title}</p>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button onClick={() => openEdit(d)} className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-indigo-600"><Pencil className="w-3 h-3" /></button>
                        <button onClick={() => deleteDeal(d.id)} className="p-1 rounded hover:bg-red-50 text-slate-400 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 ml-5">{d.company}</p>
                    <div className="flex items-center justify-between mt-2 ml-5">
                      <span className="text-sm font-bold text-slate-900">{formatCurrencyFull(d.value)}</span>
                      <span className="text-xs text-slate-400">{d.probability}%</span>
                    </div>
                    <div className="mt-2 ml-5 bg-slate-100 rounded-full h-1.5">
                      <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${d.probability}%` }} />
                    </div>
                  </div>
                ))}
                {cards.length === 0 && (
                  <p className="text-xs text-slate-400 text-center py-4">Drop deals here</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editing ? "Edit Deal" : "New Deal"}>
        <div className="space-y-3">
          {[["Deal Title", "title"], ["Contact Name", "contactName"], ["Company", "company"]].map(([label, key]) => (
            <div key={key}>
              <label className="block text-xs font-medium text-slate-600 mb-1">{label}</label>
              <input value={(form as Record<string, unknown>)[key] as string}
                onChange={e => setForm({ ...form, [key]: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Value ($)</label>
              <input type="number" value={form.value} onChange={e => setForm({ ...form, value: Number(e.target.value) })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Probability (%)</label>
              <input type="number" min={0} max={100} value={form.probability} onChange={e => setForm({ ...form, probability: Number(e.target.value) })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Stage</label>
              <select value={form.stage} onChange={e => setForm({ ...form, stage: e.target.value as DealStage })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
                {STAGES.map(s => <option key={s} value={s}>{STAGE_LABELS[s]}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Expected Close</label>
              <input type="date" value={form.expectedClose} onChange={e => setForm({ ...form, expectedClose: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Notes</label>
            <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none" />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 font-medium">
            {editing ? "Save Changes" : "Create Deal"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
