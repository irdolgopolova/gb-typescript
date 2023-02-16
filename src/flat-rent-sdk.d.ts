export interface hotelData {
  id: string,
  title: string,
  details: string,
  photos: string[],
  coordinates: number[],
  bookedDates?: Date[],
  totalPrice: number
}

export interface rentParameters {
  checkInDate: Date,
  checkOutDate: Date,
  city: string,
  priceLimit?: number
}

export const database: hotelData[]
export function cloneDate(date: Date): Date
export function addDays(date: Date, days: number): Date
export const backendPort: number
export const localStorageKey: string


export class FlatRentSdk {
  database: hotelData[]
  constructor()
  _readDatabase(): hotelData[]
  _writeDatabase(database: hotelData[]): void
  get(id: string): Promise<object | null>
  search(parameters: rentParameters): Promise<hotelData[]>
  book(flatId: string, checkInDate: Date, checkOutDate: Date): number
  _assertDatesAreCorrect(checkInDate: Date, checkOutDate: Date): void
  _resetTime(date: Date): void
  _calculateDifferenceInDays(startDate: Date, endDate: Date): number
  _generateDateRange(from: Date, to: Date): Date[]
  _generateTransactionId(): number
  _areAllDatesAvailable(flat: hotelData, dateRange: Date[]): boolean
  _formatFlatObject(flat: hotelData, nightNumber: number): hotelData
  _readDatabase(): hotelData
  _writeDatabase(database: hotelData): void
  _syncDatabase(database: hotelData): void
}
