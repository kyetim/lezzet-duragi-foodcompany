const isServer = typeof window === 'undefined';

export const TravelService = {
    async getAllPlans() {
        const url = isServer
            ? `http://localhost:3008/api/travel`
            : '/api/travel';
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Tatil planları getirilemedi');
        }
        return response.json();
    },

    async createPlan(data: {
        title: string
        location: string
        startDate: string
        endDate: string
        description?: string
        budget?: number
        notes?: string
    }) {
        const url = isServer
            ? `http://localhost:3008/api/travel`
            : '/api/travel';
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Tatil planı oluşturulamadı');
        }

        return response.json();
    }
} 