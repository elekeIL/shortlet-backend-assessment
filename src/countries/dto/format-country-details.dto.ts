export interface FormatCountryDetailsDto {
  commonName: string;
  population: number;
  languages: Record<string, string>;
  latlng: number[];
  borders: string[];
}
