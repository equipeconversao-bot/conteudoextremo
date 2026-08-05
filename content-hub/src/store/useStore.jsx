import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { supabase, loadCollection, addItem as addToSupabase, updateItem as updateInSupabase, deleteItem as deleteFromSupabase } from '../lib/supabase'

const StoreContext = createContext(null)

const TABLE_MAP = {
  videosLongos: 'videos_longos',
  videosCurtos: 'videos_curtos',
  cortes: 'cortes',
  frases: 'frases',
  equipe: 'equipe',
  calendario: 'calendario',
  producao: 'producao',
}

function camelToSnake(str) {
  return str.replace(/[A-Z]/g, l => '_' + l.toLowerCase())
}

function snakeToCamel(str) {
  return str.replace(/_([a-z])/g, (_, l) => l.toUpperCase())
}

function mapKeys(obj, fn) {
  if (!obj || typeof obj !== 'object') return obj
  if (Array.isArray(obj)) return obj.map(i => mapKeys(i, fn))
  const result = {}
  for (const [k, v] of Object.entries(obj)) {
    result[fn(k)] = v
  }
  return result
}

function itemToDb(item) {
  const db = mapKeys(item, camelToSnake)
  delete db.id
  delete db.created_at
  delete db.updated_at
  return db
}

function itemFromDb(row) {
  const item = mapKeys(row, snakeToCamel)
  if (item.createdAt) item.createdAt = new Date(item.createdAt).toISOString()
  if (item.updatedAt) item.updatedAt = new Date(item.updatedAt).toISOString()
  return item
}

function arrayFromDb(rows) {
  return (rows || []).map(itemFromDb)
}

export function StoreProvider({ children }) {
  const [state, setState] = useState({
    videosLongos: [],
    videosCurtos: [],
    cortes: [],
    frases: [],
    equipe: [],
    calendario: [],
    producao: [],
    loaded: false,
  })

  const loadedRef = useRef(false)

  useEffect(() => {
    if (loadedRef.current) return
    loadedRef.current = true

    async function loadAll() {
      try {
        const collections = Object.keys(TABLE_MAP)
        const results = await Promise.all(collections.map(name => loadCollection(name)))

        const newState = { loaded: true }
        collections.forEach((name, i) => {
          newState[name] = arrayFromDb(results[i]) || []
        })

        // Fetch from global cloud API
        const cloudRes = await fetch('/api/data').catch(() => null)
        if (cloudRes && cloudRes.ok) {
          const cloudData = await cloudRes.json()
          if (cloudData?.data) {
            collections.forEach(name => {
              if (Array.isArray(cloudData.data[name]) && cloudData.data[name].length > 0) {
                newState[name] = cloudData.data[name]
              }
            })
          }
        }

        setState(prev => ({ ...prev, ...newState }))
      } catch (err) {
        console.error('Error in loadAll store:', err)
        setState(prev => ({ ...prev, loaded: true }))
      }
    }

    loadAll()

    // 4s polling for global real-time synchronization across all devices
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/data')
        if (res.ok) {
          const json = await res.json()
          if (json?.data) {
            setState(prev => {
              let changed = false
              const updated = { ...prev }
              Object.keys(TABLE_MAP).forEach(name => {
                if (Array.isArray(json.data[name]) && json.data[name].length > 0) {
                  const cloudJson = JSON.stringify(json.data[name])
                  const localJson = JSON.stringify(prev[name])
                  if (cloudJson !== localJson) {
                    updated[name] = json.data[name]
                    changed = true
                  }
                }
              })
              return changed ? updated : prev
            })
          }
        }
      } catch (e) {}
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const updateState = useCallback((name, updater) => {
    setState(prev => {
      const newItems = updater(prev[name])
      const nextState = {
        ...prev,
        [name]: newItems,
      }
      try {
        fetch('/api/data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ [name]: newItems }),
        }).catch(() => {})
      } catch (e) {}
      return nextState
    })
  }, [])

  const addItem = useCallback(async (name, item) => {
    const dbItem = itemToDb(item)
    const result = await addToSupabase(name, dbItem)
    if (result) {
      const newItem = itemFromDb(result)
      updateState(name, items => [newItem, ...items])
      return newItem
    }
    return null
  }, [updateState])

  const updateItem = useCallback(async (name, id, updates) => {
    const dbUpdates = itemToDb(updates)
    const result = await updateInSupabase(name, id, dbUpdates)
    if (result) {
      const updated = itemFromDb(result)
      updateState(name, items => items.map(i => i.id === id ? updated : i))
      return updated
    }
    return null
  }, [updateState])

  const deleteItem = useCallback(async (name, id) => {
    const ok = await deleteFromSupabase(name, id)
    if (ok) {
      updateState(name, items => items.filter(i => i.id !== id))
      return true
    }
    return false
  }, [updateState])

  const toggleStage = useCallback(async (name, id, stage, stages) => {
    const theItem = state[name]?.find(i => i.id === id)
    if (!theItem) return

    const currentValue = theItem[stage]
    const newValue = !currentValue
    const updates = {}

    if (newValue) {
      const idx = stages.indexOf(stage)
      for (let i = 0; i <= idx; i++) updates[stages[i]] = true
    } else {
      const idx = stages.indexOf(stage)
      for (let i = idx; i < stages.length; i++) updates[stages[i]] = false
    }

    await updateItem(name, id, updates)
  }, [state, updateItem])

  return (
    <StoreContext.Provider value={{ state, addItem, updateItem, deleteItem, toggleStage }}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const ctx = useContext(StoreContext)
  return ctx?.state
}

export function useCollection(name) {
  const ctx = useContext(StoreContext)
  if (!ctx) return { items: [], addItem: () => {}, updateItem: () => {}, deleteItem: () => {}, toggleStage: () => {} }

  const items = ctx.state?.[name] || []

  const add = useCallback((item) => ctx.addItem(name, item), [ctx, name])
  const update = useCallback((id, updates) => ctx.updateItem(name, id, updates), [ctx, name])
  const remove = useCallback((id) => ctx.deleteItem(name, id), [ctx, name])
  const toggle = useCallback((id, stage, stages) => ctx.toggleStage(name, id, stage, stages), [ctx, name])

  return { items, addItem: add, updateItem: update, deleteItem: remove, toggleStage: toggle }
}

export function useApprovedItems() {
  const state = useStore()
  if (!state) return []
  const approved = []

  ;(state.videosLongos || []).forEach(item => {
    if (item.aprovado) approved.push({ type: 'Vídeo Longo', title: item.tema, id: item.id })
  })
  ;(state.videosCurtos || []).forEach(item => {
    if (item.aprovado) approved.push({ type: 'Vídeo Curto', title: item.titulo, id: item.id })
  })
  ;(state.cortes || []).forEach(item => {
    if (item.aprovado) approved.push({ type: 'Corte', title: item.titulo, id: item.id })
  })
  ;(state.frases || []).forEach(item => {
    approved.push({ type: 'Frase', title: item.frase?.slice(0, 60) + (item.frase?.length > 60 ? '…' : ''), id: item.id })
  })

  return approved
}
