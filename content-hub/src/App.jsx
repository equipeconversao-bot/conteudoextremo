import { useState } from 'react'
import { StoreProvider } from './store/useStore'
import { AppShell } from './components/layout/AppShell'
import { VideosLongosTab } from './pages/Organization/VideosLongosTab'
import { VideosCurtosTab } from './pages/Organization/VideosCurtosTab'
import { CortesTab } from './pages/Organization/CortesTab'
import { FrasesTab } from './pages/Organization/FrasesTab'
import { CalendarPage } from './pages/Calendar/CalendarPage'
import { DashboardPage } from './pages/Dashboard/DashboardPage'
import { AnalyticsPage } from './pages/Analytics/AnalyticsPage'
import { SettingsPage } from './pages/Settings/SettingsPage'
import { TeamPage } from './pages/Team/TeamPage'
import { ProducaoPage } from './pages/Producao/ProducaoPage'
import { ToastContainer } from './components/ui/Toast'
import { Tabs } from './components/ui/Tabs'
import { ImportSheetModal } from './components/ImportSheetModal'
import { Button } from './components/ui/Button'
import { FileSpreadsheet } from 'lucide-react'

const orgTabs = [
  { key: 'videos-longos', label: 'Vídeos Longos' },
  { key: 'videos-curtos', label: 'Vídeos Curtos' },
  { key: 'cortes', label: 'Cortes' },
  { key: 'frases', label: 'Frases' },
]

function OrganizationPage({ activeSubTab, onNavigate }) {
  const [sheetModalOpen, setSheetModalOpen] = useState(false)

  const pageMap = {
    'videos-longos': <VideosLongosTab onNavigate={onNavigate} />,
    'videos-curtos': <VideosCurtosTab onNavigate={onNavigate} />,
    'cortes': <CortesTab onNavigate={onNavigate} />,
    'frases': <FrasesTab />,
  }
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-heading-lg text-ink">{pageTitles[activeSubTab] || 'Organização'}</h1>
          <p className="text-sm text-mute mt-1">{pageDescriptions[activeSubTab]}</p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => setSheetModalOpen(true)} icon={<FileSpreadsheet size={16} />}>
          Importar Sheets
        </Button>
      </div>
      <div className="mt-4">
        <Tabs tabs={orgTabs} active={activeSubTab} onChange={onNavigate} />
      </div>
      <div className="mt-6">
        {pageMap[activeSubTab] || <VideosLongosTab onNavigate={onNavigate} />}
      </div>
      <ImportSheetModal isOpen={sheetModalOpen} onClose={() => setSheetModalOpen(false)} />
    </>
  )
}

const pageTitles = {
  'videos-longos': 'Vídeos Longos',
  'videos-curtos': 'Vídeos Curtos',
  'cortes': 'Cortes',
  'frases': 'Frases',
}

const pageDescriptions = {
  'videos-longos': 'Gerencie seus vídeos longos do YouTube',
  'videos-curtos': 'Acompanhe Reels, TikTok e Shorts',
  'cortes': 'Organize cortes dos vídeos longos',
  'frases': 'Métricas de performance das suas frases',
}

export default function App() {
  const [activePage, setActivePage] = useState('videos-longos')

  const isOrgPage = orgTabs.some(t => t.key === activePage)

  return (
    <StoreProvider>
      <AppShell activePage={activePage} onNavigate={setActivePage}>
        {isOrgPage && <OrganizationPage activeSubTab={activePage} onNavigate={setActivePage} />}
        {activePage === 'producao' && <ProducaoPage onNavigate={setActivePage} />}
        {activePage === 'calendario' && <CalendarPage />}
        {activePage === 'dashboard' && <DashboardPage />}
        {activePage === 'analytics' && <AnalyticsPage />}
        {activePage === 'equipe' && <TeamPage />}
        {activePage === 'settings' && <SettingsPage />}
      </AppShell>
      <ToastContainer />
    </StoreProvider>
  )
}
