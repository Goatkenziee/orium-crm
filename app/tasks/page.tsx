"use client";
import { useState } from "react";
import { useCRM } from "@/lib/store";
import TopBar from "@/components/TopBar";
import Modal from "@/components/Modal";
import { priorityColor, taskStatusColor, generateId } from "@/lib/utils";
import type { Task, TaskPriority, TaskStatus } from "@/lib/types";
import { Plus, Pencil, Trash2, CheckCircle2, Circle } from "lucide-react";

const PRIORITIES: TaskPriority[] = ["low", "medium", "high"];
const STATUSES: TaskStatus[] = ["todo", "in_progress", "done"];
const STATUS_LABELS: Record<TaskStatus, string> = { todo: "To Do", in_progress: "In Progress", done: "Done" };
const PRIORITY_LABELS: Record<TaskPriority, string> = { low: "Low", medium: "Medium", high: "High" };

const EMPTY: Omit<Task, "id" | "createdAt" | "updatedAt"> = {
  title: "", description: "", priority: "medium", status: "todo", dueDate: "", assignee: "Alexander",
};

export default function TasksPage() {
  const { state, addTask, updateTask, deleteTask } = useCRM();
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [form, setForm] = useState<Omit<Task, "id" | "createdAt" | "updatedAt">>(EMPTY);

  const filtered = state.tasks.filter(t => statusFilter === "all" || t.status === statusFilter);
  const todo = filtered.filter(t => t.status === "todo").length;
  const inProgress = filtered.filter(t => t.status === "in_progress").length;
  const done = filtered.filter(t => t.status === "done").length;

  function openAdd() { setEditing(null); setForm(EMPTY); setShowModal(true); }
  function openEdit(t: Task) {
    setEditing(t);
    const { id, createdAt, updatedAt, ...rest } = t;
    setForm(rest);
    setShowModal(true);
  }
  function handleSave() {
    const now = new Date().toISOString();
    if (editing) updateTask({ ...editing, ...form, updatedAt: now });
    else addTask({ id: generateId(), ...form, createdAt: now, updatedAt: now });
    setShowModal(false);
  }
  function toggleDone(t: Task) {
    updateTask({ ...t, status: t.status === "done" ? "todo" : "done", updatedAt: new Date().toISOString() });
  }

  return (
    <div className="p-6 space-y-4">
      <TopBar title="Tasks" subtitle={`${todo} to do · ${inProgress} in progress · ${done} done`} />

      <div className="flex flex-wrap items-center gap-3 justify-between">
        <div className="flex gap-1">
          {(["all", ...STATUSES] as const).map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${statusFilter === s ? "bg-indigo-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
              {s === "all" ? "All" : STATUS_LABELS[s]}
            </button>
          ))}
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
          <Plus className="w-4 h-4" /> Add Task
        </button>
      </div>

      <div className="space-y-2">
        {filtered.map(t => (
          <div key={t.id} className={`bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3 hover:shadow-sm transition-shadow ${t.status === "done" ? "opacity-60" : ""}`}>
            <button onClick={() => toggleDone(t)} className="shrink-0 text-slate-400 hover:text-green-500 transition-colors">
              {t.status === "done" ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Circle className="w-5 h-5" />}
            </button>
            <div className="flex-1 min-w-0">
              <p className={`font-medium text-slate-900 ${t.status === "done" ? "line-through" : ""}`}>{t.title}</p>
              {t.description && <p className="text-xs text-slate-500 mt-0.5 truncate">{t.description}</p>}
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColor(t.priority)}`}>{PRIORITY_LABELS[t.priority]}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${taskStatusColor(t.status)}`}>{STATUS_LABELS[t.status]}</span>
                {t.dueDate && <span className="text-xs text-slate-400">Due {new Date(t.dueDate).toLocaleDateString()}</span>}
                {t.assignee && <span className="text-xs text-slate-400">· {t.assignee}</span>}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => openEdit(t)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-indigo-600"><Pencil className="w-3.5 h-3.5" /></button>
              <button onClick={() => deleteTask(t.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-400 text-sm">No tasks found.</div>
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editing ? "Edit Task" : "New Task"}>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Title</label>
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Description</label>
            <textarea value={form.description ?? ""} onChange={e => setForm({ ...form, description: e.target.value })} rows={2}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Priority</label>
              <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value as TaskPriority })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
                {PRIORITIES.map(p => <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Status</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as TaskStatus })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
                {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Due Date</label>
              <input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Assignee</label>
              <input value={form.assignee ?? ""} onChange={e => setForm({ ...form, assignee: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 font-medium">
            {editing ? "Save Changes" : "Create Task"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
