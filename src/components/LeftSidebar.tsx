import Link from 'next/link'
import { Home, User, Settings } from 'lucide-react'

export function LeftSidebar() {
    return (
        <div className="w-64 h-screen fixed left-0 top-0 bg-background border-r p-4">
            <div className="flex flex-col space-y-4">
                <Link href="/" className="text-2xl font-bold mb-6">Minitwitter</Link>
                <NavItem href="/" icon={<Home />} label="Home" />
                <NavItem href="/profile" icon={<User />} label="Profile" />
                <NavItem href="/settings" icon={<Settings />} label="Settings" />
            </div>
        </div>
    )
}

function NavItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
    return (
        <Link href={href} className="flex items-center space-x-4 text-lg hover:bg-accent rounded-full px-4 py-2 transition-colors">
            {icon}
            <span>{label}</span>
        </Link>
    )
}

