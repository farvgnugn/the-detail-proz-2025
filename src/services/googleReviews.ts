export interface GoogleReview {
  author_name: string;
  author_url?: string;
  language: string;
  profile_photo_url: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
}

export interface GooglePlaceDetails {
  place_id: string;
  name: string;
  rating: number;
  user_ratings_total: number;
  reviews: GoogleReview[];
}

class GoogleReviewsService {
  private apiKey: string;
  private placeId: string;

  constructor(apiKey: string, placeId: string) {
    this.apiKey = apiKey;
    this.placeId = placeId;
  }

  async fetchReviews(): Promise<GoogleReview[]> {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${this.placeId}&fields=name,rating,reviews,user_ratings_total&key=${this.apiKey}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status !== 'OK') {
        throw new Error(`Google Places API error: ${data.status}`);
      }

      return data.result.reviews || [];
    } catch (error) {
      console.error('Error fetching Google reviews:', error);
      return [];
    }
  }

  async fetchPlaceDetails(): Promise<GooglePlaceDetails | null> {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${this.placeId}&fields=place_id,name,rating,reviews,user_ratings_total&key=${this.apiKey}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status !== 'OK') {
        throw new Error(`Google Places API error: ${data.status}`);
      }

      return data.result;
    } catch (error) {
      console.error('Error fetching place details:', error);
      return null;
    }
  }

  // Format review text to a reasonable length
  static formatReviewText(text: string, maxLength: number = 200): string {
    if (text.length <= maxLength) return text;
    
    const truncated = text.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    
    return lastSpace > 0 
      ? truncated.substring(0, lastSpace) + '...'
      : truncated + '...';
  }

  // Convert Google review to our testimonial format
  static convertToTestimonial(review: GoogleReview) {
    return {
      name: review.author_name,
      location: "Google Review",
      rating: review.rating,
      text: this.formatReviewText(review.text),
      image: review.profile_photo_url || "/src/assets/customer_avatar_2.png",
      date: review.relative_time_description,
      isGoogleReview: true
    };
  }
}

export default GoogleReviewsService;