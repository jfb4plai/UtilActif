import { useState } from 'react'
import { useClass } from '../shared/useClass'

const LEVELS = ['MS', 'GS', 'CP', 'CE1', 'CE2', 'CM1', 'CM2', 'P1', 'P2', 'P3', 'P4', 'P5', 'P6', '6e', '5e', '4e', '3e']

export function ClassSetup({ onDone }) {
  const { profile, updateProfile, resetProfile } = useClass()
  const [form, setForm] = useState({
    name: profile.name,
    level: profile.level,
    year: profile.year || new Date().getFullYear() + '-' + (new Date().getFullYear() + 1),
    accessibility: { ...profile.accessibility },
    students: [...profile.students],
  })
  const [newStudent, setNewStudent] = useState('')

  function handleChange(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function handleAccessibility(field, value) {
    setForm((f) => ({
      ...f,
      accessibility: { ...f.accessibility, [field]: value },
    }))
  }

  function addStudent() {
    const name = newStudent.trim()
    if (!name) return
    const id = 'E' + String(form.students.length + 1).padStart(2, '0')
    setForm((f) => ({
      ...f,
      students: [...f.students, { id, displayName: name }],
    }))
    setNewStudent('')
  }

  function removeStudent(id) {
    setForm((f) => ({
      ...f,
      students: f.students.filter((s) => s.id !== id),
    }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    updateProfile(form)
    onDone()
  }

  function handleReset() {
    if (window.confirm('Réinitialiser toute la classe ?')) {
      resetProfile()
      onDone()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="w-full bg-[#f5f0e8] border-b border-[#e8dfd0] px-6 py-4 flex items-center gap-4 mb-6">
        <img src="/plai-logo.jpg" alt="PLAI" style={{ height: '80px', width: '80px' }} className="object-contain" />
        <h1 className="text-2xl font-bold text-plai-teal">Configuration de la classe</h1>
      </header>
      <div className="max-w-lg mx-auto px-6 pb-6 overflow-y-auto">

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="space-y-3">
          <h2 className="font-semibold text-gray-700">Classe</h2>
          <input
            className="w-full border rounded-lg px-4 py-3 text-lg"
            placeholder="Nom de la classe (ex : 4B)"
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
          />
          <select
            className="w-full border rounded-lg px-4 py-3 text-lg"
            value={form.level}
            onChange={(e) => handleChange('level', e.target.value)}
            required
          >
            <option value="">Niveau</option>
            {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
          <input
            className="w-full border rounded-lg px-4 py-3 text-lg"
            placeholder="Année scolaire (ex : 2025-2026)"
            value={form.year}
            onChange={(e) => handleChange('year', e.target.value)}
          />
        </section>

        <section className="space-y-3">
          <h2 className="font-semibold text-gray-700">Accessibilité globale</h2>
          {[
            { key: 'dyslexia', label: 'Mode DYS (police Arial, interligne)' },
            { key: 'adhd', label: 'Mode TDAH (signaux visuels renforcés)' },
            { key: 'highContrast', label: 'Contraste élevé' },
            { key: 'reducedMotion', label: 'Animations réduites' },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-6 h-6 accent-plai-teal"
                checked={form.accessibility[key]}
                onChange={(e) => handleAccessibility(key, e.target.checked)}
              />
              <span className="text-lg">{label}</span>
            </label>
          ))}
          <div className="flex items-center gap-3">
            <span className="text-lg">Taille du texte</span>
            <select
              className="border rounded-lg px-3 py-2"
              value={form.accessibility.fontSize}
              onChange={(e) => handleAccessibility('fontSize', e.target.value)}
            >
              <option value="normal">Normal</option>
              <option value="large">Grand</option>
            </select>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-semibold text-gray-700">Élèves (prénoms ou codes)</h2>
          <div className="flex gap-2">
            <input
              className="flex-1 border rounded-lg px-4 py-3 text-lg"
              placeholder="Prénom ou code"
              value={newStudent}
              onChange={(e) => setNewStudent(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addStudent())}
            />
            <button
              type="button"
              onClick={addStudent}
              className="bg-plai-teal text-white px-5 rounded-lg font-bold text-xl"
              style={{ minHeight: 'var(--touch-target)' }}
            >
              +
            </button>
          </div>
          <ul className="space-y-2">
            {form.students.map((s) => (
              <li key={s.id} className="flex justify-between items-center bg-gray-50 rounded-lg px-4 py-2">
                <span>{s.displayName}</span>
                <button
                  type="button"
                  onClick={() => removeStudent(s.id)}
                  className="text-red-400 font-bold text-lg px-2"
                  style={{ minHeight: '44px' }}
                  aria-label={`Supprimer ${s.displayName}`}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </section>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="flex-1 bg-plai-teal text-white rounded-xl font-bold text-xl py-4"
            style={{ minHeight: 'var(--touch-target)' }}
          >
            Enregistrer
          </button>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="w-full text-red-400 text-sm py-2 underline"
        >
          Réinitialiser la classe
        </button>
      </form>
      </div>
    </div>
  )
}
