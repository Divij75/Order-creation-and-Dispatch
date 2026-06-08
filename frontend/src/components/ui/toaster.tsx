import { useToast } from './use-toast'
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Toaster() {
  const { toasts, dismiss } = useToast()

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2">
      {toasts.map((t) => {
        const config = {
          default: {
            bg: 'bg-white',
            border: 'border-slate-200',
            icon: <Info className="h-4 w-4 text-indigo-500" />,
          },
          success: {
            bg: 'bg-white',
            border: 'border-emerald-200',
            icon: <CheckCircle className="h-4 w-4 text-emerald-500" />,
          },
          error: {
            bg: 'bg-white',
            border: 'border-red-200',
            icon: <AlertCircle className="h-4 w-4 text-red-500" />,
          },
        }[t.variant]

        return (
          <div
            key={t.id}
            className={cn(
              'animate-toast-slide flex items-center gap-3 rounded-xl border px-4 py-3 shadow-lg min-w-[280px] max-w-[400px]',
              config.bg,
              config.border
            )}
          >
            {config.icon}
            <span className="flex-1 text-sm font-medium text-slate-700">{t.message}</span>
            <button
              onClick={() => dismiss(t.id)}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
