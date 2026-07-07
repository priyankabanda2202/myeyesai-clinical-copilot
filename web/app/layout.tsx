import Sidebar from "@/components/Sidebar";
import ClinicalHeader from "@/components/ClinicalHeader";
import DemoBanner from "@/components/DemoBanner";
import "./globals.css";

export const metadata = {
  title: "VisionFlow Eye Hospital CDS",
  description: "Real-time ophthalmology clinical intelligence command center",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="app-bg" />
        <div className="app-grid" />
        <Sidebar />
        <main className="relative z-10 ml-[272px] min-h-screen p-6 md:p-8">
          <ClinicalHeader />
          <DemoBanner />
          {children}
        </main>
      </body>
    </html>
  );
}
