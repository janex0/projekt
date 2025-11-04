import './globals.css';
import Header from '../components/Header';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sl">
      <body className="bg-gray-100">
        <Header />
        {children}
      </body>
    </html>
  );
}
