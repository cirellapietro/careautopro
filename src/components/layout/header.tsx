
"use client"
import Link from "next/link"
import {
  LogOut,
  Shield,
  Bell,
  Clock,
  Gauge,
  Activity,
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
import { cn } from "@/lib/utils"

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
    const { isTracking, trackedVehicle, sessionDistance, sessionDuration, trackedVehicleId } = useTracking();
    
    // Se il tracking è attivo ma l'oggetto veicolo non è ancora caricato, mostriamo comunque uno stato di "Attesa"
    if (!isTracking || !trackedVehicleId) return null;

    const formatDuration = (totalSeconds: number) => {
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        
        if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    const vehicleName = trackedVehicle?.name || "Veicolo...";

    return (
        <div className="flex items-center gap-2 rounded-full bg-destructive px-3 py-1.5 text-[10px] font-black text-destructive-foreground transition-all animate-in fade-in zoom-in duration-300 shadow-lg shadow-destructive/20">
            <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </div>
            <span className="hidden sm:inline uppercase tracking-tighter">GPS ATTIVO:</span>
            <span className="max-w-[80px] truncate sm:max-w-none">{vehicleName}</span>
            <div className="flex items-center gap-2 border-l border-white/30 ml-1 pl-2">
                <span className="flex items-center gap-1 tabular-nums">
                    <Clock className="h-3 w-3" /> {formatDuration(sessionDuration)}
                </span>
                <span className="flex items-center gap-1 tabular-nums">
                    <Activity className="h-3 w-3" /> {sessionDistance.toFixed(2)} km
                </span>
            </div>
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
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6">
            <div className="flex items-center gap-2">
                <Link href="/dashboard">
                    <Logo />
                </Link>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
                <TrackingIndicator />
                <NotificationBell />
                <ThemeToggleButton />
                <UserMenu />
            </div>
        </header>
    )
}
