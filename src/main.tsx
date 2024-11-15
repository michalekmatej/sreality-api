import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { keepPreviousData, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@components/ThemeContext/ThemeContext'
import App from '@/App.tsx'
import '@globals/globals.scss'

const queryClient = new QueryClient();

queryClient.setDefaultOptions({
  queries: {
    // placeholderData: keepPreviousData,
    staleTime: 60000,
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>,
)
