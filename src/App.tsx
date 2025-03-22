import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { PersistGate } from 'redux-persist/integration/react'
import store, { persistor } from './store'
import Theme from '@/components/template/Theme'
import Layout from '@/components/layouts'
import searchClient from './algolia'
import { InstantSearch } from 'react-instantsearch'
import './locales'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import dayjs from 'dayjs'
import 'dayjs/locale/es';
import relativeTime from 'dayjs/plugin/relativeTime'
import { useEffect } from 'react'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      cacheTime: Infinity,
    },
  },
})

function App() {

  useEffect(() => {
    dayjs.extend(relativeTime)
  }, [])

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            <Theme>
              <InstantSearch
                searchClient={searchClient}
                indexName="users_index"
              >
                <Layout />
              </InstantSearch>
            </Theme>
          </QueryClientProvider>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  )
}

export default App
