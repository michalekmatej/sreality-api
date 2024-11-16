import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@lib/reactQuery/reactQuery';
import { ThemeProvider } from '@/lib/themeContext/themeContext'
import App from '@/App.tsx'
import '@globals/globals.scss'



createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>,
)
