import './globals.css';
import Header from '../components/Header';
import Providers from './providers';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sl">
      <body className="bg-white text-black">
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
