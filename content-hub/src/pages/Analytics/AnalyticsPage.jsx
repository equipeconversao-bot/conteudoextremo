import { useState } from 'react'
import { Tabs } from '../../components/ui/Tabs'
import { YoutubeAnalyticsView } from './YoutubeAnalyticsView'
import { InstagramAnalyticsView } from './InstagramAnalyticsView'

const tabs = [
  { key: 'youtube', label: 'YouTube' },
  { key: 'instagram', label: 'Instagram' },
]

export function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState('youtube')

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-heading-lg text-ink">Analytics</h1>
        <p className="text-sm text-mute mt-1">Métricas reais do YouTube e Instagram</p>
        <div className="mt-4">
          <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />
        </div>
      </div>

      {activeTab === 'youtube' && <YoutubeAnalyticsView />}
      {activeTab === 'instagram' && <InstagramAnalyticsView />}
    </div>
  )
}
