import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Raleway } from 'next/font/google'

const montserrat = Raleway({subsets: ['latin']});
export default function App({ Component, pageProps }: AppProps) {
  return <div className={montserrat.className}><Component {...pageProps} /></div>
}
