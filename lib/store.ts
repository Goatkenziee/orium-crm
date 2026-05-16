import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Client {
  id: string
  name: string
  email: string
  phone: string
  creditScore: number
  status: 'active' | 'paused' | 'completed'
  monthlyFee: number
  startDate: string
  notes: string
}

export interface Dispute {
  id: string
  clientId: string
  description: string
  amount: number
  status: 'pending' | 'in-progress' | 'resolved'
  createdAt: string
  resolvedAt?: string
}

interface CRMStore {
  clients: Client[]
  disputes: Dispute[]
  addClient: (client: Omit<Client, 'id'>) => void
  updateClient: (id: string, updates: Partial<Client>) => void
  deleteClient: (id: string) => void
  addDispute: (dispute: Omit<Dispute, 'id'>) => void
  updateDispute: (id: string, updates: Partial<Dispute>) => void
  deleteDispute: (id: string) => void
  initializeSampleData: () => void
}

const SAMPLE_CLIENTS: Omit<Client, 'id'>[] = [
  {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '(555) 123-4567',
    creditScore: 642,
    status: 'active',
    monthlyFee: 299,
    startDate: '2024-01-15',
    notes: 'Excellent communicator, quick responder',
  },
  {
    name: 'Michael Chen',
    email: 'mchen@email.com',
    phone: '(555) 234-5678',
    creditScore: 521,
    status: 'active',
    monthlyFee: 299,
    startDate: '2024-02-10',
    notes: 'Chase card dispute pending',
  },
  {
    name: 'Amanda Rodriguez',
    email: 'arodriguez@email.com',
    phone: '(555) 345-6789',
    creditScore: 728,
    status: 'active',
    monthlyFee: 299,
    startDate: '2023-11-22',
    notes: '3 bureau removals completed',
  },
  {
    name: 'David Kim',
    email: 'dkim@email.com',
    phone: '(555) 456-7890',
    creditScore: 589,
    status: 'active',
    monthlyFee: 299,
    startDate: '2024-03-05',
    notes: 'Medical debt removal in progress',
  },
  {
    name: 'Jennifer Lewis',
    email: 'jlewis@email.com',
    phone: '(555) 567-8901',
    creditScore: 742,
    status: 'completed',
    monthlyFee: 0,
    startDate: '2023-08-30',
    notes: 'Goal reached - 200+ point improvement',
  },
]

const SAMPLE_DISPUTES: Omit<Dispute, 'id'>[] = [
  {
    clientId: '',
    description: 'Late payment on Chase credit card',
    amount: 2500,
    status: 'in-progress',
    createdAt: '2024-04-10',
  },
  {
    clientId: '',
    description: 'Medical collection account',
    amount: 1850,
    status: 'in-progress',
    createdAt: '2024-03-20',
  },
  {
    clientId: '',
    description: 'Duplicate account reporting',
    amount: 0,
    status: 'resolved',
    createdAt: '2024-02-01',
    resolvedAt: '2024-03-15',
  },
  {
    clientId: '',
    description: 'Inquiry removal request',
    amount: 0,
    status: 'pending',
    createdAt: '2024-04-15',
  },
]

export const useCRMStore = create<CRMStore>()(
  persist(
    (set) => ({
      clients: [],
      disputes: [],

      addClient: (client) =>
        set((state) => ({
          clients: [...state.clients, { ...client, id: Date.now().toString() }],
        })),

      updateClient: (id, updates) =>
        set((state) => ({
          clients: state.clients.map((client) =>
            client.id === id ? { ...client, ...updates } : client
          ),
        })),

      deleteClient: (id) =>
        set((state) => ({
          clients: state.clients.filter((client) => client.id !== id),
          disputes: state.disputes.filter((d) => d.clientId !== id),
        })),

      addDispute: (dispute) =>
        set((state) => ({
          disputes: [...state.disputes, { ...dispute, id: Date.now().toString() }],
        })),

      updateDispute: (id, updates) =>
        set((state) => ({
          disputes: state.disputes.map((dispute) =>
            dispute.id === id ? { ...dispute, ...updates } : dispute
          ),
        })),

      deleteDispute: (id) =>
        set((state) => ({
          disputes: state.disputes.filter((dispute) => dispute.id !== id),
        })),

      initializeSampleData: () =>
        set((state) => {
          if (state.clients.length > 0) return state

          const newClients = SAMPLE_CLIENTS.map((client) => ({
            ...client,
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          }))

          const newDisputes = SAMPLE_DISPUTES.map((dispute, idx) => ({
            ...dispute,
            clientId: newClients[idx % newClients.length].id,
            id: Date.now().toString() + idx,
          }))

          return {
            clients: newClients,
            disputes: newDisputes,
          }
        }),
    }),
    {
      name: 'crm-store',
    }
  )
)
