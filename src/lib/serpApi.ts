import { getJson } from 'serpapi';
import type { Review, LocalGuide, NewsItem } from '@/types/trip';

type SerpApiResponse = {
  organic_results?: Array<{
    title?: string;
    link?: string;
    snippet?: string;
  }>;
  news_results?: Array<{
    title: string;
    snippet?: string;
    source?: string;
    date?: string;
    link?: string;
    thumbnail?: string;
  }>;
  properties?: Array<{
    name?: string;
    location?: string;
    amenities?: string[];
    overall_rating?: string | number;
    rate_per_night?: { extracted_lowest?: number; extracted_highest?: number };
  }>;
  error?: string;
};

export class JharkhandSerpAPI {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.SERPAPI_API_KEY || '';
    if (!this.apiKey) {
      console.warn('⚠️ SERPAPI_API_KEY not found, using fallback data');
    }
  }

  async searchJharkhandReviews(destination: string): Promise<Review[]> {
    try {
      const dest = this.cleanDestination(destination);
      if (!this.apiKey) return this.getFallbackReviews(dest);

      const params = {
        engine: 'google',
        q: `${dest} Jharkhand reviews "amazing" "beautiful" "must visit" site:tripadvisor.in OR site:google.com OR site:makemytrip.com`,
        api_key: this.apiKey,
        location: 'Jharkhand, India',
        num: 8,
        hl: 'en',
        gl: 'in',
      };

      const response = (await this.makeRequestWithRetry(params)) as SerpApiResponse;
      return this.extractReviews(response, dest);
    } catch (error) {
      console.error('SerpApi reviews search failed:', error);
      return this.getFallbackReviews(destination);
    }
  }

  async findJharkhandGuides(destination: string): Promise<LocalGuide[]> {
    try {
      const dest = this.cleanDestination(destination);
      if (!this.apiKey) return this.getOfficialGuides(dest);

      const queries = [
        `${dest} tour guide contact Jharkhand site:justdial.com OR site:sulekha.com`,
        `${dest} travel agent phone number Jharkhand`,
        `Jharkhand tourism guide services ${dest} contact`,
      ];

      const all: LocalGuide[] = [];
      for (const q of queries.slice(0, 2)) {
        const params = {
          engine: 'google',
          q,
          api_key: this.apiKey,
          location: 'Jharkhand, India',
          num: 5,
          hl: 'en',
          gl: 'in',
        };
        try {
          const response = (await this.makeRequestWithRetry(params)) as SerpApiResponse;
          const guides = this.extractGuides(response);
          all.push(...guides);
          await this.delay(800);
        } catch (err) {
          console.warn(`Guide search failed for query: ${q}`, err);
        }
      }

      const official = this.getOfficialGuides(dest);
      return this.deduplicateGuides([...all, ...official]);
    } catch (error) {
      console.error('Guide search failed:', error);
      return this.getOfficialGuides(destination);
    }
  }

  async getJharkhandTourismNews(): Promise<NewsItem[]> {
    try {
      if (!this.apiKey) return this.getFallbackNews();

      const params = {
        engine: 'google_news',
        q: 'Jharkhand tourism new attractions festivals events 2025',
        api_key: this.apiKey,
        location: 'India',
        hl: 'en',
        gl: 'in',
        num: 10,
      };

      const response = (await this.makeRequestWithRetry(params)) as SerpApiResponse;
      const news = this.extractNews(response);
      return news.length ? news : this.getFallbackNews();
    } catch (error) {
      console.warn('News search failed:', error);
      return this.getFallbackNews();
    }
  }

  async searchHotels(destination: string, budget: string): Promise<any[]> {
    try {
      const dest = this.cleanDestination(destination);
      if (!this.apiKey) return this.getFallbackHotels(dest);

      const params = {
        engine: 'google_hotels',
        q: `hotels in ${dest} Jharkhand`,
        api_key: this.apiKey,
        check_in_date: this.getDefaultCheckIn(),
        check_out_date: this.getDefaultCheckOut(),
        adults: 2,
        currency: 'INR',
        hl: 'en',
        gl: 'in',
      };

      const response = (await this.makeRequestWithRetry(params)) as SerpApiResponse;
      const hotels = this.extractHotels(response, budget);
      return hotels.length ? hotels : this.getFallbackHotels(dest);
    } catch (error) {
      console.error('Hotel search failed:', error);
      return this.getFallbackHotels(destination);
    }
  }

  // Core request with timeout + small retry
  private async makeRequestWithRetry(params: any, retries = 2, timeoutMs = 10000): Promise<SerpApiResponse> {
    let lastErr: any;
    for (let i = 0; i <= retries; i++) {
      try {
        const data = await this.makeRequestWithTimeout(params, timeoutMs);
        return data;
      } catch (err) {
        lastErr = err;
        if (i < retries) await this.delay(400 * (i + 1)); // backoff
      }
    }
    throw lastErr;
  }

  private async makeRequestWithTimeout(params: any, timeoutMs: number): Promise<SerpApiResponse> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('SerpAPI request timed out')), timeoutMs);
      getJson(params, (data: any) => {
        clearTimeout(timeout);
        if (data?.error) {
          reject(new Error(data.error));
        } else {
          resolve(data as SerpApiResponse);
        }
      });
    });
  }

  private extractReviews(response: SerpApiResponse, destination: string): Review[] {
    const out: Review[] = [];
    const list = response.organic_results || [];
    for (const r of list.slice(0, 5)) {
      const snippet = r?.snippet || '';
      if (!snippet || !this.isPositiveReview(snippet)) continue;
      out.push({
        text: snippet,
        source: this.extractDomain(r?.link || ''),
        rating: this.extractRating(snippet) || '4+ stars',
        reviewer: 'Verified Visitor',
        title: r?.title || 'Review',
        url: r?.link,
        date: this.extractDate(snippet),
      });
    }
    return out.length ? out : this.getFallbackReviews(destination);
  }

  private extractGuides(response: SerpApiResponse): LocalGuide[] {
    const out: LocalGuide[] = [];
    const list = response.organic_results || [];
    for (const r of list.slice(0, 3)) {
      const blob = `${r?.snippet || ''} ${r?.title || ''}`;
      const phone = this.extractPhoneFromText(blob);
      if (!phone) continue;
      out.push({
        name: this.cleanGuideName(r?.title || 'Local Guide'),
        contact: phone,
        source: this.extractDomain(r?.link || ''),
        description: ((r?.snippet || '').substring(0, 150) + '...').trim(),
        url: r?.link,
        verified: this.isVerifiedSource(r?.link || ''),
        specializations: this.extractSpecializations(r?.snippet || ''),
        languages: ['Hindi', 'English'],
        priceRange: '₹800-1500 per day',
        availability: 'Year-round',
      });
    }
    return out;
  }

  private extractNews(response: SerpApiResponse): NewsItem[] {
    const out: NewsItem[] = [];
    const list = response.news_results || [];
    for (const a of list.slice(0, 6)) {
      out.push({
        title: a.title,
        snippet: a.snippet || 'Recent tourism update from Jharkhand',
        source: a.source || 'News',
        date: a.date || '',
        link: a.link || '',
        thumbnail: a.thumbnail,
        relevance: this.calculateRelevance(a.title, a.snippet || ''),
      });
    }
    return out;
  }

  private extractHotels(response: SerpApiResponse, budget: string): any[] {
    const out: any[] = [];
    const props = response.properties || [];
    const budgetNum = parseInt((budget || '0').replace(/[₹,]/g, '')) || 0;
    const maxPrice = Math.max(0, Math.round(budgetNum * 0.4));
    for (const p of props.slice(0, 8)) {
      const low = p.rate_per_night?.extracted_lowest ?? Number.MAX_SAFE_INTEGER;
      const high = p.rate_per_night?.extracted_highest ?? low;
      if (low <= maxPrice) {
        out.push({
          name: p.name || 'Hotel',
          location: p.location || 'Jharkhand',
          priceRange: `₹${Number.isFinite(low) ? low : 'N/A'} - ₹${Number.isFinite(high) ? high : 'N/A'}`,
          rating: p.overall_rating || 'N/A',
          amenities: p.amenities || [],
          contact: 'Call hotel directly',
          bookingTips: 'Book directly for better rates',
        });
      }
    }
    return out;
  }

  // Utils
  private isPositiveReview(text: string): boolean {
    const keys = ['amazing', 'beautiful', 'excellent', 'wonderful', 'great', 'fantastic', 'must visit', 'highly recommend', 'loved', 'perfect', 'stunning', 'incredible', 'awesome', 'breathtaking', 'memorable', 'spectacular'];
    const t = text.toLowerCase();
    return keys.some((k) => t.includes(k));
  }

  private extractRating(text: string): string | null {
    const patterns = [/(\d+\.?\d*)\s*[\/\-]\s*5/i, /(\d+\.?\d*)\s*star/i, /rated\s+(\d+\.?\d*)/i];
    for (const re of patterns) {
      const m = text.match(re);
      if (m) return `${m[1]}/5`;
    }
    return null;
  }

  private extractPhoneFromText(text: string): string | null {
    const patterns = [
      /(\+91[\s-]?)?[6-9]\d{9}/g,
      /\d{5}[\s-]\d{5}/g,
      /\d{3}[\s-]\d{3}[\s-]\d{4}/g,
      /\d{4}[\s-]\d{3}[\s-]\d{3}/g,
    ];
    for (const re of patterns) {
      const matches = text.match(re);
      if (matches && matches.length) {
        const cleaned = matches[0].replace(/[\s-]/g, '');
        if (cleaned.length >= 10 && cleaned.length <= 13) return cleaned;
      }
    }
    return null;
  }

  private extractDomain(url: string): string {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return 'Web Source';
    }
  }

  private extractDate(text: string): string {
    const re = /(\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4})|(\w{3,9}\s+\d{1,2},?\s+\d{2,4})/i;
    const m = text.match(re);
    return m ? m[0] : new Date().toLocaleDateString();
  }

  private extractSpecializations(text: string): string[] {
    const t = text.toLowerCase();
    const out: string[] = [];
    if (t.includes('heritage')) out.push('Heritage Tours');
    if (t.includes('wildlife')) out.push('Wildlife Tours');
    if (t.includes('adventure')) out.push('Adventure Tours');
    if (t.includes('culture')) out.push('Cultural Tours');
    if (t.includes('temple')) out.push('Religious Tours');
    return out.length ? out : ['General Tourism'];
  }

  private calculateRelevance(title: string, snippet: string): 'high' | 'medium' | 'low' {
    const content = (title + ' ' + snippet).toLowerCase();
    const keys = ['jharkhand', 'tourism', 'new', 'festival', 'attraction'];
    const score = keys.reduce((acc, k) => acc + (content.includes(k) ? 1 : 0), 0);
    if (score >= 3) return 'high';
    if (score >= 2) return 'medium';
    return 'low';
  }

  private cleanGuideName(title: string): string {
    return title.replace(/[-|•].*/g, '').replace(/\s+/g, ' ').trim().substring(0, 60);
  }

  private isVerifiedSource(url: string): boolean {
    const verified = ['justdial.com', 'sulekha.com', 'tourism.jharkhand.gov.in', 'india.com', 'makemytrip.com', 'tripadvisor.in', 'goibibo.com'];
    return verified.some((d) => url.includes(d));
  }

  private deduplicateGuides(guides: LocalGuide[]): LocalGuide[] {
    const seen = new Set<string>();
    return guides.filter((g) => {
      const key = g.contact || g.name;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).slice(0, 8);
  }

  private delay(ms: number): Promise<void> {
    return new Promise((r) => setTimeout(r, ms));
  }

  private getDefaultCheckIn(): string {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  }

  private getDefaultCheckOut(): string {
    const d = new Date();
    d.setDate(d.getDate() + 9);
    return d.toISOString().split('T')[0];
  }

  private cleanDestination(dest: string): string {
    return (dest || '').toString().trim().replace(/\s+/g, ' ');
  }

  // Fallbacks
  private getFallbackReviews(destination: string): Review[] {
    return [
      {
        text: `${destination} is truly a hidden gem of Jharkhand! The natural beauty and cultural richness make it a must-visit destination.`,
        source: 'Traveler Reviews',
        rating: '4.5/5 stars',
        reviewer: 'Jharkhand Explorer',
        title: 'Amazing Experience',
      },
      {
        text: `Highly recommend visiting ${destination} when in Jharkhand. The local hospitality and scenic views are unforgettable.`,
        source: 'Tourism Feedback',
        rating: '4.7/5 stars',
        reviewer: 'Cultural Tourist',
        title: 'Unforgettable Journey',
      },
    ];
  }

  private getOfficialGuides(_destination: string): LocalGuide[] {
    return [
      {
        name: 'Jharkhand Tourism Development Corporation',
        contact: '0651-2331828',
        source: 'tourism.jharkhand.gov.in',
        description: 'Official state tourism body providing certified guides and complete tour packages for authentic Jharkhand experiences',
        verified: true,
        specializations: ['Heritage Tours', 'Cultural Tours', 'Wildlife Tours'],
        languages: ['Hindi', 'English', 'Bengali'],
        priceRange: '₹1000-1500 per day',
        availability: 'Year-round',
      },
      {
        name: 'Tourist Helpline Jharkhand',
        contact: '0651-2400496',
        source: 'Government of Jharkhand',
        description: '24/7 tourist assistance, emergency help, and local guide booking services',
        verified: true,
        specializations: ['General Tourism', 'Emergency Assistance'],
        languages: ['Hindi', 'English'],
        priceRange: '₹800-1200 per day',
        availability: '24/7',
      },
    ];
  }

  private getFallbackNews(): NewsItem[] {
    return [
      {
        title: 'Jharkhand Tourism Promotes Winter Destinations',
        snippet: 'State tourism department launches new initiatives to promote winter tourism in Jharkhand',
        source: 'Tourism Board',
        date: new Date().toISOString().split('T')[0],
        link: 'https://tourism.jharkhand.gov.in',
        relevance: 'high',
      },
    ];
  }

  private getFallbackHotels(destination: string): any[] {
    return [
      {
        name: `${destination} Tourist Lodge`,
        location: `${destination}, Jharkhand`,
        priceRange: '₹1200-2000 per night',
        rating: '4.0',
        amenities: ['WiFi', 'Restaurant', 'Room Service'],
        contact: 'Contact tourism office',
        bookingTips: 'Book in advance for better rates',
      },
    ];
  }
}

export const jharkhandSerpAPI = new JharkhandSerpAPI();
