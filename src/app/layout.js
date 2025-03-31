import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'School Photography Client Map Dashboard',
  description: 'A dashboard to manage and visualize school photography clients across different locations.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          <header className="bg-white border-b border-gray-200">
            <div className="container-custom py-4">
              <h1 className="text-xl font-semibold text-gray-900">School Photography Dashboard</h1>
            </div>
          </header>
          {children}
          <footer className="bg-white border-t border-gray-200 mt-auto">
            <div className="container-custom py-4">
              <p className="text-gray-500 text-sm">© {new Date().getFullYear()} School Photography Client Map Dashboard</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
} 