import "./globals.css";
import { Inter, Libre_Baskerville } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const libre = Libre_Baskerville({ 
  weight: ['400', '700'], 
  style: ['normal', 'italic'], 
  subsets: ['latin'], 
  variable: '--font-serif' 
});

export const metadata = {
  title: 'Period Tracker',
  description: 'Track your menstrual cycles',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${libre.variable}`}>
      <body>{children}</body>
    </html>
  );
}