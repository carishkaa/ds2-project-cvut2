import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { QueryClient, QueryClientProvider } from "react-query"

const queryClient = new QueryClient()

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()

  return (
    <QueryClientProvider client={queryClient}>
            <Component {...pageProps} />
      </QueryClientProvider>
  )
}

export default MyApp

export const getServerSideProps = async (context: any) => {
  return { props: {} }
}
