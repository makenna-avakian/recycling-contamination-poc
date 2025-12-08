import { createFileRoute, useNavigate } from '@tanstack/react-router';

export const Route = createFileRoute('/email-preview')({
  component: EmailPreviewPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      contaminationType: (search.contaminationType as string) || '',
    };
  },
});

function EmailPreviewPage() {
  const navigate = useNavigate();
  const { contaminationType } = Route.useSearch();

  if (!contaminationType) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">No contamination type specified.</p>
        <button
          onClick={() => navigate({ to: '/' })}
          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  const subject = `Important: Contamination Education - ${contaminationType}`;
  const emailBody = `Dear Customer,

We are reaching out to provide important information about proper recycling practices.

We have noticed contamination issues related to: ${contaminationType}

IMPORTANT: ${contaminationType} is considered contamination and should NOT be placed in your recycling bin or trash bin.

Why this matters:
• Contamination can cause entire loads of recyclables to be rejected
• It poses safety risks to workers at recycling facilities
• It increases processing costs and environmental impact
• It prevents valuable materials from being properly recycled

Proper disposal:
Please dispose of ${contaminationType} according to your local waste management guidelines. You may need to take these items to a specialized drop-off location or use alternative disposal methods.

For more information about what can and cannot be recycled, please visit our website or contact our customer service team.

Thank you for helping us keep our recycling stream clean and effective.

Best regards,
Recollect Waste Management Team`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Email Preview</h1>
          <p className="mt-2 text-gray-600">Contamination education email for {contaminationType}</p>
        </div>
        <button
          onClick={() => navigate({ to: '/' })}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
        >
          ← Back to Dashboard
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        {/* Email Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
          <div className="flex items-center justify-between text-white">
            <div>
              <h2 className="text-xl font-semibold">Email Preview</h2>
              <p className="text-sm text-purple-100 mt-1">Ready to send</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm">📧</span>
            </div>
          </div>
        </div>

        {/* Email Content */}
        <div className="p-8">
          {/* Email Metadata */}
          <div className="border-b border-gray-200 pb-4 mb-6">
            <div className="space-y-2">
              <div className="flex items-start">
                <span className="text-sm font-semibold text-gray-700 w-24">From:</span>
                <span className="text-sm text-gray-900">Recollect Waste Management Team</span>
              </div>
              <div className="flex items-start">
                <span className="text-sm font-semibold text-gray-700 w-24">To:</span>
                <span className="text-sm text-gray-500 italic">[Customer Email]</span>
              </div>
              <div className="flex items-start">
                <span className="text-sm font-semibold text-gray-700 w-24">Subject:</span>
                <span className="text-sm text-gray-900 font-medium">{subject}</span>
              </div>
            </div>
          </div>

          {/* Email Body */}
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-gray-800 leading-relaxed font-sans">
              {emailBody}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              This email would be sent to customers affected by {contaminationType} contamination.
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
                  window.open(mailtoLink);
                }}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                Open in Email Client
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(emailBody);
                  alert('Email body copied to clipboard!');
                }}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Copy Email Body
              </button>
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
            <h3 className="text-sm font-semibold text-blue-900">About This Email</h3>
            <p className="mt-2 text-sm text-blue-700">
              This educational email is automatically generated based on contamination predictions. 
              It provides customers with clear information about why certain items cannot be recycled 
              and how to properly dispose of them.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

