import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { aiApi } from '../lib/api';

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
  const [subject, setSubject] = useState(`Important: Contamination Education - ${contaminationType}`);
  const [emailBody, setEmailBody] = useState(`Dear Customer,

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
Recollect Waste Management Team`);

  const generateMutation = useMutation({
    mutationFn: () => aiApi.generateEmail(contaminationType),
    onSuccess: (data) => {
      setSubject(data.subject);
      setEmailBody(data.body);
    },
    onError: (error) => {
      console.error('Generation error:', error);
    },
    retry: false, // Don't retry on failure
  });

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
                onClick={() => generateMutation.mutate()}
                disabled={generateMutation.isPending}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {generateMutation.isPending ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Regenerate with AI
                  </>
                )}
              </button>
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
          {generateMutation.isPending && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-3">
                <svg className="animate-spin h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <div>
                  <p className="text-sm font-semibold text-blue-900">Generating email with AI...</p>
                  <p className="text-xs text-blue-700 mt-1">This may take 15-30 seconds. Please wait...</p>
                </div>
              </div>
            </div>
          )}
          {generateMutation.isError && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-red-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-red-900">Generation Failed</p>
                  <p className="text-sm text-red-800 mt-1">
                    {generateMutation.error instanceof Error 
                      ? generateMutation.error.message 
                      : 'Failed to generate email. Make sure Ollama is running: ollama serve'}
                  </p>
                  <p className="text-xs text-red-700 mt-2">
                    Tip: First generation can take 30-60 seconds. Subsequent generations are faster.
                  </p>
                </div>
              </div>
            </div>
          )}
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

