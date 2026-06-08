import Dashboard from '@/pages/Dashboard'
import { ToastProvider } from '@/components/ui/use-toast'
import { Toaster } from '@/components/ui/toaster'

function App() {
  return (
    <ToastProvider>
      <Dashboard />
      <Toaster />
    </ToastProvider>
  )
}

export default App
