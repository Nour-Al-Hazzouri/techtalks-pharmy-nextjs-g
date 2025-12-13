export interface Pharmacy {
    id: string
    name: string
    address: string
    distance: string
    rating: number
    phone: string
    status: "Open" | "Closing soon" | "Closed"
    closingTime?: string
    coordinates: [number, number] // [lat, lng]
}

export const MOCK_PHARMACIES: Pharmacy[] = [
    {
        id: "1",
        name: "Aster Pharmacy",
        address: "123 Main Street, Downtown",
        distance: "0.5 km",
        rating: 4.8,
        phone: "+971 4 123 4567",
        status: "Open",
        closingTime: "22:00",
        coordinates: [33.8938, 35.5018], // Example Beirut coords
    },
    {
        id: "2",
        name: "HealthPlus Pharmacy",
        address: "456 Oak Avenue, City Center",
        distance: "1.2 km",
        rating: 4.6,
        phone: "+1 234 567 8901",
        status: "Open",
        closingTime: "20:00",
        coordinates: [33.8886, 35.4955],
    },
    {
        id: "3",
        name: "MediQuick Pharmacy",
        address: "789 Park Road, Westside",
        distance: "1.8 km",
        rating: 4.9,
        phone: "+1 234 567 8902",
        status: "Closing soon",
        coordinates: [33.8900, 35.4800],
    },
    {
        id: "4",
        name: "WellCare Pharmacy",
        address: "321 Elm Street, Eastside",
        distance: "2.3 km",
        rating: 4.5,
        phone: "+1 234 567 8903",
        status: "Open",
        closingTime: "21:00",
        coordinates: [33.8950, 35.5100],
    },
    {
        id: "5",
        name: "QuickMed Pharmacy",
        address: "654 Pine Avenue, North District",
        distance: "2.7 km",
        rating: 4.7,
        phone: "+1 234 567 8904",
        status: "Closed",
        coordinates: [33.9000, 35.5000],
    },
    {
        id: "6",
        name: "FamilyFirst Pharmacy",
        address: "987 Maple Drive, South District",
        distance: "3.1 km",
        rating: 4.4,
        phone: "+1 234 567 8905",
        status: "Open",
        closingTime: "23:00",
        coordinates: [33.8800, 35.5050],
    },
]
