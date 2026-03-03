'use client'

import { useState } from 'react'
import { claimAchievementAction } from '@/app/dashboard/conquistas/actions'
import { Check } from 'lucide-react'

export function ClaimButton({ achievementId, xp }: { achievementId: string, xp: number }) {
    const [loading, setLoading] = useState(false)
    const [claimed, setClaimed] = useState(false)

    const handleClaim = async () => {
        setLoading(true)
        const res = await claimAchievementAction(achievementId)

        if (res.error) {
            alert(res.error)
            setLoading(false)
        } else {
            setClaimed(true)
            // Trigger a soft refresh to update total XP on screen
            window.location.reload()
        }
    }

    if (claimed) {
        return (
            <span className="text-secondary font-mono text-xs flex items-center justify-end gap-1">
                <Check size={14} /> Resgatado
            </span>
        )
    }

    return (
        <button
            onClick={handleClaim}
            disabled={loading}
            className="px-3 py-1.5 bg-primary text-white text-xs font-mono font-bold uppercase rounded-sm hover:bg-primary/80 transition-colors disabled:opacity-50"
        >
            {loading ? '...' : `Resgatar +${xp} XP`}
        </button>
    )
}
