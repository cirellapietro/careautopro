
"use client"
import Link from "next/link"
import {
  LogOut,
  Shield,
  Bell,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeToggleButton } from "@/components/ui/theme-toggle-button"
import { Logo } from "@/components/logo"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import { useUser } from "@/firebase/auth/use-user"
import { signOut } from "@/firebase/auth/auth"
import { useTracking } from "@/contexts/tracking-context"
import { useFirebase, useCollection } from "@/firebase"
import { useMemo } from "react"
import { collection, query, where } from "firebase/firestore"
import { Badge } from "@/components/ui/badge"

const UserMenu = () => {
    const { user } = useUser();
    const router = useRouter();

    const handleSignOut = async () => {
        await signOut();
        router.push('/login');
    }

    if (!user) return null;

    const userInitial = user.displayName ? user.displayName.charAt(0).toUpperCase() : (user.email ? user.email.charAt(0).toUpperCase() : '?');

    return (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button
                variant="outline"
                size="icon"
                className="overflow-hidden rounded-full"
            >
                <Avatar>
                    <AvatarImage src={user.photoURL || ''} alt={user.displayName || ''} />
                    <AvatarFallback>{userInitial}</AvatarFallback>
                </Avatar>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            <DropdownMenuLabel>{user.displayName || user.email}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link href="/dashboard/profile" className="cursor-pointer w-full">Profilo</Link>
            </DropdownMenuItem>
            {user.role === 'Amministratore' && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/admin" className="flex items-center gap-2 cursor-pointer w-full">
                    <Shield className="h-4 w-4" />
                    <span>Pannello Admin</span>
                  </Link>
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="flex items-center gap-2 cursor-pointer">
                <LogOut className="h-4 w-4" />
                <span>Esci</span>
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
)}

function TrackingIndicator() {
    const { isTracking, trackedVehicle } = useTracking();
    if (!isTracking || !trackedVehicle) return null;

    return (
        <div className="flex items-center gap-2 rounded-full bg-destructive px-3 py-1 text-[10px] font-bold text-destructive-foreground">
            <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
            <span className="hidden sm:inline">GPS ATTIVO:</span>
            <span>{trackedVehicle.name}</span>
        </div>
    );
}

function NotificationBell() {
    const { user } = useUser();
    const { firestore } = useFirebase();

    const alertsQuery = useMemo(() => {
        if (!user || !firestore) return null;
        return query(
            collection(firestore, `users/${user.uid}/alerts`),
            where('isRead', '==', false),
            where('dataoraelimina', '==', null)
        );
    }, [user, firestore]);

    const { data: unreadAlerts } = useCollection(alertsQuery);
    const count = unreadAlerts?.length || 0;

    return (
        <Button variant="ghost" size="icon" className="relative" asChild>
            <Link href="/dashboard/notifications">
                <Bell className="h-5 w-5" />
                {count > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] bg-destructive text-destructive-foreground">
                        {count > 9 ? '9+' : count}
                    </Badge>
                )}
            </Link>
        </Button>
    );
}


export function Header() {
    return (
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
            <Link href="/dashboard">
                <Logo />
            </Link>
            <div className="flex items-center gap-2 sm:gap-4">
                <TrackingIndicator />
                <NotificationBell />
                <ThemeToggleButton />
                <UserMenu />
            </div>
        </header>
    )
}
