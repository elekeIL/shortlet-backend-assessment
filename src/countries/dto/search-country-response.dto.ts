import { CountryDto } from './country.dto';
import { FormatCountryDetailsDto } from './format-country-details.dto';

export interface SearchCountryResponseDto {
  total: number;
  page: number;
  limit: number;
  data: FormatCountryDetailsDto[];
}
