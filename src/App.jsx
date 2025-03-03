import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import Home from "./pages/Home/Home"

const queryClient = new QueryClient({
  defaultOptions: {
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
  }
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Home />
    </QueryClientProvider>
  )
}

export default App
