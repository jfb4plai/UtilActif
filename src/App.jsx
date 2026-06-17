import { useState } from 'react'
import { ClassProvider } from './context/ClassContext'
import { AccessibilityLayer } from './components/AccessibilityLayer'
import { ClassSetup } from './components/ClassSetup'
import { ToolGrid } from './components/ToolGrid'
import { useClass } from './shared/useClass'

import { Timer } from './tools/Timer/Timer'
import { Dice } from './tools/Dice/Dice'
import { Wheel } from './tools/Wheel/Wheel'
import { ConsigneDisplay } from './tools/ConsigneDisplay/ConsigneDisplay'
import { NumberGrid } from './tools/NumberGrid/NumberGrid'
import { TurnManager } from './tools/TurnManager/TurnManager'
import { CDU } from './tools/CDU/CDU'
import { Sono } from './tools/Sono/Sono'

const TOOL_COMPONENTS = {
  timer: Timer,
  dice: Dice,
  wheel: Wheel,
  consigne: ConsigneDisplay,
  numgrid: NumberGrid,
  turns: TurnManager,
  cdu: CDU,
  sono: Sono,
}

function AppInner() {
  const { hasProfile } = useClass()
  const [screen, setScreen] = useState(hasProfile ? 'grid' : 'setup')
  const [activeTool, setActiveTool] = useState(null)

  function handleSetupDone() {
    setScreen('grid')
  }

  function handleSelectTool(id) {
    setActiveTool(id)
    setScreen('tool')
  }

  function handleBack() {
    setActiveTool(null)
    setScreen('grid')
  }

  function handleEditClass() {
    setScreen('setup')
  }

  if (screen === 'setup') {
    return <ClassSetup onDone={handleSetupDone} />
  }

  if (screen === 'tool' && activeTool) {
    const ToolComponent = TOOL_COMPONENTS[activeTool]
    return <ToolComponent onBack={handleBack} onEditClass={handleEditClass} />
  }

  return <ToolGrid onSelectTool={handleSelectTool} onEditClass={handleEditClass} />
}

export default function App() {
  return (
    <ClassProvider>
      <AccessibilityLayer>
        <AppInner />
      </AccessibilityLayer>
    </ClassProvider>
  )
}
