import Sidebar from "@/components/Sidebar";
import ClinicalHeader from "@/components/ClinicalHeader";
import HospitalStatusBar from "@/components/HospitalStatusBar";
import AppFooter from "@/components/AppFooter";
import ColdStartGuard from "@/components/ColdStartGuard";
import { BranchProvider } from "@/lib/branchContext";
import { NavProvider } from "@/lib/navContext";
import "./globals.css";

export const metadata = {
  title: "VisionFlow Eye Institute — Clinical Platform",
  description: "Real-time ophthalmology clinical intelligence platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body>
        <div className="app-bg" />
        <div className="app-grid" />
        <ColdStartGuard>
          <BranchProvider>
            <NavProvider>
              <Sidebar />
              <main className="relative z-10 min-h-screen w-full max-w-full overflow-x-hidden px-3 pb-6 pt-[4.25rem] md:ml-[272px] md:px-8 md:pb-8 md:pt-8">
                <ClinicalHeader />
                <HospitalStatusBar />
                {children}
                <AppFooter />
              </main>
            </NavProvider>
          </BranchProvider>
        </ColdStartGuard>
      </body>
    </html>
  );
}
