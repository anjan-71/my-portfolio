import './globals.css';

export const metadata = {
  title: 'Anjan Boro - Portfolio',
  description: 'Full Stack Web Developer & CS Engineer Portfolio',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}