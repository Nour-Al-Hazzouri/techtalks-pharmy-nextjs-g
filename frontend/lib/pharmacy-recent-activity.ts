import type { ActivityItem } from "@/components/features/pharmacy/RecentActivityList"

type StoredActivityItem = ActivityItem & {
    createdAtIso: string
}

const STORAGE_KEY = "pharmy:pharmacy:recent-activity:v1"
const MAX_ITEMS = 25

function safeParse(json: string | null): StoredActivityItem[] {
    if (!json) return []
    try {
        const parsed = JSON.parse(json)
        if (!Array.isArray(parsed)) return []
        return parsed.filter(Boolean)
    } catch {
        return []
    }
}

export function getStoredRecentActivity(): ActivityItem[] {
    if (typeof window === "undefined") return []

    const items = safeParse(window.localStorage.getItem(STORAGE_KEY))

    return items
        .sort((a, b) => b.createdAtIso.localeCompare(a.createdAtIso))
        .map(({ id, medicineName, action, timestamp, status }) => ({
            id,
            medicineName,
            action,
            timestamp,
            status,
        }))
}

export function addRecentActivityEntries(
    entries: Omit<ActivityItem, "id" | "timestamp">[],
    nowIso?: string
) {
    if (typeof window === "undefined") return

    const createdAtIso = nowIso ?? new Date().toISOString()

    const existing = safeParse(window.localStorage.getItem(STORAGE_KEY))

    const next: StoredActivityItem[] = [
        ...entries.map((e) => ({
            ...e,
            id: `activity-${Date.now()}-${Math.random().toString(16).slice(2)}`,
            timestamp: "just now",
            createdAtIso,
        })),
        ...existing,
    ].slice(0, MAX_ITEMS)

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
}

export function formatRelativeTime(isoOrDate: string): string {
    const date = new Date(isoOrDate)
    const ms = Date.now() - date.getTime()
    if (!Number.isFinite(ms)) return ""

    const sec = Math.floor(ms / 1000)
    if (sec < 10) return "just now"
    if (sec < 60) return `${sec}s ago`

    const min = Math.floor(sec / 60)
    if (min < 60) return `${min} min${min === 1 ? "" : "s"} ago`

    const hr = Math.floor(min / 60)
    if (hr < 24) return `${hr} hour${hr === 1 ? "" : "s"} ago`

    const day = Math.floor(hr / 24)
    return `${day} day${day === 1 ? "" : "s"} ago`
}

export function hydrateRelativeTimestamps(items: ActivityItem[]): ActivityItem[] {
    if (typeof window === "undefined") return items

    const stored = safeParse(window.localStorage.getItem(STORAGE_KEY))
    const byId = new Map(stored.map((s) => [s.id, s.createdAtIso]))

    return items.map((i) => {
        const createdAtIso = byId.get(i.id)
        if (!createdAtIso) return i
        return { ...i, timestamp: formatRelativeTime(createdAtIso) }
    })
}
