import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';

export const Route = createFileRoute('/campaign-preview')({
  component: CampaignPreviewPage,
});

function CampaignPreviewPage() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  // Generate campaign JSON based on the template example
  // Using current date and 7 days forward for the campaign dates
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 7);

  const campaignJson = {
    type: "education",
    is_shared: true,
    subject: {
      es: "Reduzca la contaminación del reciclaje",
      en: "Reduce Recycling Contamination",
      fr: "Réduire la contamination du recyclage",
      en_US: "Reduce Recycling Contamination"
    },
    service_id: 0, // This would be set based on the actual service
    html_message: {
      es: `<p>Este año, celebremos las fiestas con menos desperdicio y más alegría. ¿Todavía buscas el regalo perfecto? Visita el Merry Memory Maker de Metro Vancouver para más de 200 ideas de regalos con bajo desperdicio, ordenadas por estilo y precio.</p>
<p>Reduce el desperdicio innecesario eligiendo regalos y experiencias significativas, envolviendo con materiales reutilizables, eligiendo decoración duradera y previniendo el desperdicio de alimentos.</p>
<p>Para mantener el espíritu de reutilización, únete a nosotros en el Douglas Park Community Centre el sábado 13 de diciembre para un intercambio navideño GRATIS. Los intercambios son una forma divertida y fácil de dar una segunda vida a los artículos: trae algo que ya no necesites o simplemente ven a buscar y encuentra algo nuevo para ti. ¡Todos son bienvenidos!</p>`,
      en: `<p>This year, let's celebrate the Holidays with less waste and more cheer! Still searching for the right gift? Visit Metro Vancouver's Merry Memory Maker for more than 200 low-waste gift ideas sorted by style and price.</p>
<p>Cut down on unnecessary waste by choosing meaningful gifts and experiences, wrapping with reusable materials, picking long-lasting décor, and preventing food waste.</p>
<p>To keep the spirit of reuse going, join us at the Douglas Park Community Centre on Sat. Dec.13th for a Holiday-themed FREE Santa Swap! Swaps are a fun, easy way to give items a second life—bring something you no longer need, or simply come browse and find something new-to-you. Everyone's welcome. The swap runs from 10:00am to 1:00pm. See you there!</p>
<p>Happy Holidays! 🎄</p>`,
      fr: `<p>Cette année, célébrons les fêtes avec moins de déchets et plus de joie ! Vous cherchez toujours le bon cadeau ? Visitez le Merry Memory Maker de Metro Vancouver pour plus de 200 idées de cadeaux à faible déchet, triées par style et prix.</p>
<p>Réduisez les déchets inutiles en choisissant des cadeaux et des expériences significatifs, en emballant avec des matériaux réutilisables, en choisissant une décoration durable et en prévenant le gaspillage alimentaire.</p>
<p>Pour maintenir l'esprit de réutilisation, rejoignez-nous au Douglas Park Community Centre le samedi 13 décembre pour un échange de Noël GRATUIT ! Les échanges sont un moyen amusant et facile de donner une seconde vie aux articles—apportez quelque chose dont vous n'avez plus besoin, ou venez simplement parcourir et trouver quelque chose de nouveau pour vous. Tout le monde est le bienvenu !</p>`,
      en_US: ``
    },
    short_text_message: {
      es: "Celebre las fiestas con menos desperdicio y más alegría. Únase a nuestro intercambio GRATIS en Douglas Park CC el sábado 13 de diciembre, 10am-1pm. Explore más de 200 ideas de regalos con bajo desperdicio.",
      en: "Celebrate the Holidays with less waste and more cheer! Join our FREE Santa Swap at Douglas Park CC on Sat. Dec 13, 10am–1pm. Bring an item you no longer need and browse for something new-to-you. Still searching for the right gift? Explore Metro Vancouver's Merry Memory Maker for more than 200 low-waste gift ideas. Choose experiences, reusable wrap, lasting décor, and cut food waste. Find out more at creatememoriesnotgarbage.ca",
      fr: "Célébrez les fêtes avec moins de déchets et plus de joie ! Rejoignez notre échange GRATUIT au Douglas Park CC le samedi 13 décembre, 10h-13h. Apportez un article dont vous n'avez plus besoin et parcourez pour trouver quelque chose de nouveau pour vous.",
      en_US: ""
    },
    label: "Create memories, not garbage",
    voice_message: {
      es: "Celebre las fiestas con menos desperdicio y más alegría. Únase a nuestro intercambio GRATIS en Douglas Park CC el sábado 13 de diciembre, 10am-1pm.",
      en: "Celebrate the Holidays with less waste and more cheer! Join our FREE Santa Swap at Douglas Park CC on Sat. Dec 13, 10am–1pm. Bring an item you no longer need and browse for something new-to-you. Still searching for the right gift? Explore Metro Vancouver's Merry Memory Maker for more than 200 low-waste gift ideas. Choose experiences, reusable wrap, lasting décor, and cut food waste. Find out more at creatememoriesnotgarbage.ca",
      fr: "Célébrez les fêtes avec moins de déchets et plus de joie ! Rejoignez notre échange GRATUIT au Douglas Park CC le samedi 13 décembre, 10h-13h.",
      en_US: ""
    },
    zones: [
      {
        id: 0,
        title: "Metro Vancouver",
        name: "metro_vancouver"
      }
    ],
    meta: {
      value: "contamination_reduction",
      field: "campaign_type"
    },
    end_at: endDate.toISOString(),
    start_at: startDate.toISOString(),
    plain_text_message: {
      es: "Este año, celebremos las fiestas con menos desperdicio y más alegría. Visita el Merry Memory Maker de Metro Vancouver para más de 200 ideas de regalos con bajo desperdicio.",
      en: "This year, let's celebrate the Holidays with less waste and more cheer! Still searching for the right gift? Visit Metro Vancouver's Merry Memory Maker for more than 200 low-waste gift ideas sorted by style and price. Cut down on unnecessary waste by choosing meaningful gifts and experiences, wrapping with reusable materials, picking long-lasting décor, and preventing food waste. To keep the spirit of reuse going, join us at the Douglas Park Community Centre on Sat. Dec.13th for a Holiday-themed FREE Santa Swap! Swaps are a fun, easy way to give items a second life—bring something you no longer need, or simply come browse and find something new-to-you. Everyone's welcome. The swap runs from 10:00am to 1:00pm. See you there! Happy Holidays! 🎄",
      fr: "Cette année, célébrons les fêtes avec moins de déchets et plus de joie ! Visitez le Merry Memory Maker de Metro Vancouver pour plus de 200 idées de cadeaux à faible déchet.",
      en_US: ""
    }
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(campaignJson, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJson = () => {
    const blob = new Blob([JSON.stringify(campaignJson, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `campaign-${startDate.toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Campaign JSON Preview</h1>
          <p className="mt-2 text-gray-600">Campaign data formatted for API submission</p>
        </div>
        <button
          onClick={() => navigate({ to: '/' })}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
        >
          ← Back to Dashboard
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
          <div className="flex items-center justify-between text-white">
            <div>
              <h2 className="text-xl font-semibold">Campaign JSON</h2>
              <p className="text-sm text-purple-100 mt-1">Ready for API submission</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm">📋</span>
            </div>
          </div>
        </div>

        {/* Campaign Preview Info */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-semibold text-gray-700">Campaign Headline</p>
              <p className="text-sm text-gray-900 mt-1">{campaignJson.label}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700">Starting Date</p>
              <p className="text-sm text-gray-900 mt-1">{new Date(campaignJson.start_at).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700">Ending Date</p>
              <p className="text-sm text-gray-900 mt-1">{new Date(campaignJson.end_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* JSON Content */}
        <div className="p-6">
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-green-400 font-mono">
              {JSON.stringify(campaignJson, null, 2)}
            </pre>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 pt-6 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              This JSON matches the API structure for creating a new campaign.
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleCopyJson}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                {copied ? '✓ Copied!' : 'Copy JSON'}
              </button>
              <button
                onClick={handleDownloadJson}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Download JSON
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Campaign Content Preview */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">Campaign Content Preview</h3>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Email / Apps (English)</h4>
            <div className="prose max-w-none bg-gray-50 p-4 rounded border border-gray-200">
              <div dangerouslySetInnerHTML={{ __html: campaignJson.html_message.en }} />
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">App Notifications (English)</h4>
            <div className="bg-gray-50 p-4 rounded border border-gray-200">
              <p className="text-sm text-gray-800">{campaignJson.short_text_message.en}</p>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Phone Calls (English)</h4>
            <div className="bg-gray-50 p-4 rounded border border-gray-200">
              <p className="text-sm text-gray-800">{campaignJson.voice_message.en}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-semibold text-blue-900">About This Campaign JSON</h3>
            <p className="mt-2 text-sm text-blue-700">
              This JSON structure matches the API format required for creating a new campaign. 
              The campaign includes multi-language support (English, French, Spanish) and covers 
              email/app notifications, SMS, and voice messages. You can copy this JSON and use 
              it directly with the Campaign API endpoint.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

