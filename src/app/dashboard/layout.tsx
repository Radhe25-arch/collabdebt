import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import AIChat from '@/components/AIChat'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header title="Dashboard" />
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
      <AIChat />
    </div>
  )
}
