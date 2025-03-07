import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import Home from "./pages/Home/Home"
import Video from "./pages/Video/Video";
import Videos from "./pages/Videos/Videos";

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
      <Video />
    </QueryClientProvider>
  )
}

export default App
