import { Providers } from "./providers"
import { LeftSidebar } from "./components/LeftSidebar"

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                <Providers>
                    <div className="flex">
                        <LeftSidebar />
                        <main className="flex-1 ml-64">
                            {children}
                        </main>
                    </div>
                </Providers>
            </body>
        </html>
    )
}

