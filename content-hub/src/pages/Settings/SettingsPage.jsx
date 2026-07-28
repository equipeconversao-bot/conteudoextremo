import { Card } from '../../components/ui/Card'
import { ConnectedAccounts, InstagramAnalytics, InstagramMediaFeed, YoutubeAnalytics } from '../../components/analytics/ConnectedAccounts'

export function SettingsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-heading-lg text-ink">Configurações</h1>
        <p className="text-sm text-mute mt-1">Conecte suas contas para publicar e acompanhar analytics</p>
      </div>

      <div className="space-y-4 max-w-2xl">
        <ConnectedAccounts />

        <Card>
          <h3 className="text-base font-semibold text-ink mb-4">Como configurar</h3>
          <ol className="space-y-3 text-sm text-body list-decimal list-inside">
            <li>Crie um arquivo <code className="px-1 py-0.5 rounded bg-elevated text-xs font-mono">server/.env</code> na pasta server/</li>
            <li>Adicione suas chaves de API (veja o README do servidor)</li>
            <li>Reinicie o servidor com <code className="px-1 py-0.5 rounded bg-elevated text-xs font-mono">npm run dev</code> na pasta server/</li>
            <li>Volte aqui e clique em "Conectar" para cada plataforma</li>
          </ol>
        </Card>

        <InstagramAnalytics />
        <InstagramMediaFeed />
        <YoutubeAnalytics />
      </div>
    </div>
  )
}
