import Link from 'next/link';
import { Home, User, Settings, Grid } from 'lucide-react';
import { useState, useEffect } from 'react';

export function LeftSidebar() {
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded: any = JSON.parse(atob(token.split('.')[1]));
                setIsAdmin(decoded.role === 'admin');
            } catch (error) {
                console.error('[LeftSidebar] Error decoding token:', error);
            }
        }
    }, []);

    return (
        <div className="w-64 h-screen fixed left-0 top-0 bg-background border-r p-6 overflow-y-auto z-50">
            <div className="flex flex-col space-y-6">
                <Link href="/" className="text-2xl font-bold mb-6">
                    Minitwitter
                </Link>

                <NavItem href="/" icon={<Home />} label="Home" />
                <NavItem href="/profile" icon={<User />} label="Profile" />
                <NavItem href="/settings" icon={<Settings />} label="Settings" />

                {isAdmin && <NavItem href="/dashboard" icon={<Grid />} label="Dashboard" />}
            </div>
        </div>
    );
}

function NavItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
    return (
        <Link
            href={href}
            className="flex items-center space-x-4 text-lg hover:bg-accent rounded-full px-4 py-2 transition-colors"
        >
            {icon}
            <span>{label}</span>
        </Link>
    );
}

