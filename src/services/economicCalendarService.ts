
import type { EconomicEvent, ImpactLevel } from '../types';

const EVENT_NAMES: { [key: string]: string[] } = {
  'USD': ['Non-Farm Payrolls', 'CPI m/m', 'Fed Interest Rate Decision', 'Retail Sales m/m', 'Unemployment Claims'],
  'EUR': ['ECB Main Refinancing Rate', 'German Flash Manufacturing PMI', 'CPI Flash Estimate y/y', 'German IFO Business Climate'],
  'GBP': ['BOE Monetary Policy Report', 'CPI y/y', 'Claimant Count Change', 'GDP m/m'],
  'JPY': ['BOJ Policy Rate', 'Tokyo Core CPI y/y', 'Tankan Manufacturing Index'],
  'AUD': ['RBA Rate Statement', 'Employment Change', 'Retail Sales m/m'],
  'CAD': ['BOC Rate Statement', 'Employment Change', 'CPI m/m'],
  'CHF': ['SNB Policy Rate', 'Manufacturing PMI', 'Unemployment Rate'],
  'NZD': ['RBNZ Rate Statement', 'GDP q/q', 'Visitor Arrivals m/m'],
};

const getRandomElement = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const slugify = (text: string): string => {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
};

const generateEconomicEvents = (): EconomicEvent[] => {
    const events: EconomicEvent[] = [];
    const now = new Date();

    // Generate events for today and the next 4 days
    for (let day = 0; day < 5; day++) {
        const date = new Date(now);
        date.setDate(now.getDate() + day);

        const numEvents = Math.floor(Math.random() * 5) + 3; // 3 to 7 events per day

        for (let i = 0; i < numEvents; i++) {
            const currency = getRandomElement(Object.keys(EVENT_NAMES));
            const name = getRandomElement(EVENT_NAMES[currency]);
            const impact: ImpactLevel = getRandomElement(['High', 'High', 'Medium', 'Medium', 'Medium', 'Low']); // Skew towards higher impact

            const eventDate = new Date(date);
            eventDate.setHours(Math.floor(Math.random() * 18), Math.floor(Math.random() * 60 / 15) * 15, 0, 0);

            // Only add future events for today
            if (day === 0 && eventDate < now) {
                continue;
            }
            
            const encodedName = encodeURIComponent(name);

            events.push({
                id: `event-${day}-${i}-${Date.now()}`,
                date: eventDate,
                currency,
                impact,
                name,
                forecast: `${(Math.random() * 5).toFixed(1)}%`,
                previous: `${(Math.random() * 5).toFixed(1)}%`,
                externalLinks: [
                    {
                        name: 'Investing.com',
                        url: `https://www.investing.com/economic-calendar/${slugify(name)}`,
                    },
                    {
                        name: 'Myfxbook',
                        url: `https://www.myfxbook.com/forex-economic-calendar?search=${encodedName}`,
                    },
                    {
                        name: 'Forex Factory',
                        // Since Forex Factory doesn't support direct linking via search query,
                        // this links to a targeted Google search within their site, which is more useful
                        // than a generic calendar link.
                        url: `https://www.google.com/search?q=site:forexfactory.com+${encodedName}`,
                    },
                    {
                        name: 'DailyFX',
                        // DailyFX supports a direct search query, making the link highly specific.
                        url: `https://www.dailyfx.com/search?q=${encodedName}`,
                    }
                ],
            });
        }
    }

    return events.sort((a, b) => a.date.getTime() - b.date.getTime());
};

export const getEconomicEvents = (): Promise<EconomicEvent[]> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(generateEconomicEvents());
        }, 400); // Reduzido de 1200ms
    });
};
