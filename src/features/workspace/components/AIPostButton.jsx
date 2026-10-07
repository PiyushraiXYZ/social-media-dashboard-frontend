import { useState } from 'react';
import { Sparkles, Loader2, Check, AlertCircle } from 'lucide-react';
import { Button } from '../../../components/ui/Button/Button.jsx';
import { useTriggerAiGenerationMutation } from '../api.js';

export function AIPostButton() {
  const [trigger, { isLoading }] = useTriggerAiGenerationMutation();
  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const [message, setMessage] = useState('');

  const handleClick = async () => {
    setStatus(null);
    setMessage('');

    try {
      const res = await trigger().unwrap();
      console.log('[AI Post] success:', res);

      setStatus('success');
      setMessage(
        res?.message ||
          'AI post generation started ✅ Check your email shortly.'
      );

      // Auto-hide after 5s
      setTimeout(() => {
        setStatus(null);
        setMessage('');
      }, 5000);
    } catch (err) {
      console.error('[AI Post] error:', err);

      const errorMsg =
        err?.data?.detail ||
        err?.error ||
        'Failed to trigger AI generation.';

      setStatus('error');
      setMessage(errorMsg);

      setTimeout(() => {
        setStatus(null);
        setMessage('');
      }, 6000);
    }
  };

  return (
    <div className="relative">
      <Button
        onClick={handleClick}
        disabled={isLoading}
        className="!bg-gradient-to-r !from-purple-600 !to-indigo-600 hover:!from-purple-700 hover:!to-indigo-700"
      >
        {isLoading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Generating…
          </>
        ) : (
          <>
            <Sparkles size={16} />
            AI Post
          </>
        )}
      </Button>

      {/* Feedback Toast */}
      {status && (
        <div
          className={`absolute right-0 top-full z-30 mt-2 w-72 rounded-lg border p-3 text-xs shadow-lg ${
            status === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
              : 'border-red-200 bg-red-50 text-red-800'
          }`}
        >
          <div className="flex items-start gap-2">
            {status === 'success' ? (
              <Check size={14} className="mt-0.5 shrink-0" />
            ) : (
              <AlertCircle size={14} className="mt-0.5 shrink-0" />
            )}
            <div>{message}</div>
          </div>
        </div>
      )}
    </div>
  );
}