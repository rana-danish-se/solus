'use client';

import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import useToastStore from '@/store/toastStore';

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let bgColor, iconColor, Icon;

        switch (toast.type) {
          case 'success':
            bgColor = 'bg-green-500/10 border-green-500/20 text-green-500';
            iconColor = 'text-green-500';
            Icon = CheckCircle;
            break;
          case 'error':
            bgColor = 'bg-red-500/10 border-red-500/20 text-red-500';
            iconColor = 'text-red-500';
            Icon = AlertCircle;
            break;
          case 'info':
          default:
            bgColor = 'bg-blue-500/10 border-blue-500/20 text-blue-500';
            iconColor = 'text-blue-500';
            Icon = Info;
            break;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-lg border backdrop-blur-md shadow-lg transform transition-all duration-300 ${bgColor}`}
          >
            <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconColor}`} />
            <p className="text-sm flex-1 font-medium">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 p-1 rounded-md opacity-70 hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
