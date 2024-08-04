import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { CountryDto } from './dto/country.dto';
import { SearchCountryResponseDto } from './dto/search-country-response.dto';
import { FormatCountryDetailsDto } from './dto/format-country-details.dto';
import { RegionDto } from './dto/region.dto';
import { LanguageDetailsDto } from './dto/language-details.dto';
import { StatsDto } from './dto/stats.dto';
import { CountryQueryDataDto } from './dto/country-query-data.dto';
import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CountriesService {
  private readonly logger = new Logger(CountriesService.name);
  private readonly restCountriesBaseUrl: string;
  private readonly callTimeout: number;

  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly configService: ConfigService,
  ) {
    this.restCountriesBaseUrl = this.configService.get<string>(
      'REST_COUNTRIES_API_URL',
    );
    this.callTimeout = this.configService.get<number>('REST_CALL_TIME_OUT');
  }

  async fetchCountries(): Promise<CountryDto[]> {
    const cacheKey = 'countries';
    const cachedData = await this.cacheManager.get<CountryDto[]>(cacheKey);

    if (cachedData) {
      this.logger.debug('Returning cached data');
      return cachedData;
    }

    try {
      this.logger.debug('Fetching countries from API');
      const response: AxiosResponse = await axios.get(
        `${this.restCountriesBaseUrl}/all`,
        {
          timeout: this.callTimeout,
        },
      );
      const countries = response.data;

      if (
        !Array.isArray(countries) ||
        !countries.every(this.isValidCountryDto)
      ) {
        throw new Error('Invalid data format from API');
      }

      this.logger.debug('Storing data in cache');
      await this.cacheManager.set(cacheKey, countries);

      return countries;
    } catch (error) {
      this.logger.error('Error fetching and storing countries:', error.stack);
      throw new InternalServerErrorException(error.message);
    }
  }

  async getCountries(
    searchQuery: CountryQueryDataDto,
  ): Promise<SearchCountryResponseDto> {
    this.logger.debug('Fetching countries for search query', searchQuery);
    let filteredCountries = await this.fetchCountries();

    if (searchQuery?.region) {
      filteredCountries = filteredCountries.filter(
        (country) =>
          country.region.toLowerCase() === searchQuery?.region.toLowerCase(),
      );
    }

    if (searchQuery?.minPopulation) {
      filteredCountries = filteredCountries.filter(
        (country) => country.population >= searchQuery?.minPopulation,
      );
    }

    filteredCountries.sort((a, b) =>
      a.name.common.localeCompare(b.name.common),
    );

    const start = (searchQuery?.page - 1) * searchQuery?.limit;
    const end = start + searchQuery?.limit;
    const paginatedCountries = filteredCountries.slice(start, end);

    const formattedCountries = this.formatCountryData(
      paginatedCountries,
    ) as FormatCountryDetailsDto[];

    this.logger.debug('Returning paginated and formatted country data');
    return {
      total: filteredCountries.length,
      page: searchQuery?.page,
      limit: searchQuery?.limit,
      data: formattedCountries,
    };
  }

  async getCountryByName(name: string): Promise<FormatCountryDetailsDto> {
    this.logger.debug(`Fetching country by name: ${name}`);
    const countries: CountryDto[] = await this.fetchCountries();
    const country: CountryDto = countries.find(
      (country) => country.name.common.toLowerCase() === name.toLowerCase(),
    );
    if (country) {
      return this.formatCountryData(country) as FormatCountryDetailsDto;
    }
    this.logger.warn(`Country not found: ${name}`);
    throw new NotFoundException(
      'Not Found: The specified country could not be found',
    );
  }

  async getRegions(): Promise<Record<string, RegionDto>> {
    this.logger.debug('Fetching regions');
    const countries: CountryDto[] = await this.fetchCountries();
    const regions: Record<string, RegionDto> = {};

    countries.forEach((country) => {
      if (!regions[country.region]) {
        regions[country.region] = {
          countries: [],
          totalPopulation: 0,
        };
      }
      regions[country.region].countries.push(country.name.common);
      regions[country.region].totalPopulation += country.population;
    });

    this.logger.debug('Returning region data');
    return regions;
  }

  async getLanguages(): Promise<Record<string, LanguageDetailsDto>> {
    this.logger.debug('Fetching languages');
    const countries: CountryDto[] = await this.fetchCountries();
    const languageDetails: Record<string, LanguageDetailsDto> = {};

    countries.forEach((country) => {
      Object.entries(country.languages || {})
        .filter(([_, name]) => name)
        .forEach(([code, name]) => {
          if (!languageDetails[name]) {
            languageDetails[name] = {
              countries: [],
              totalSpeakers: 0,
            };
          }

          languageDetails[name].countries.push(country.name.common);
          languageDetails[name].totalSpeakers += country.population;
        });
    });

    this.logger.debug('Returning language data');
    return languageDetails;
  }

  async getStatistics(): Promise<StatsDto> {
    this.logger.debug('Fetching statistics');
    const countries: CountryDto[] = await this.fetchCountries();
    const totalCountries = countries.length;
    const largestCountry = countries.reduce((prev, current) =>
      prev.area > current.area ? prev : current,
    );
    const smallestCountry = countries.reduce((prev, current) =>
      prev.population < current.population ? prev : current,
    );
    const mostSpokenLanguage = await this.getMostSpokenLanguage(countries);

    this.logger.debug('Returning statistics data');
    return {
      totalCountries,
      largestCountryByArea: largestCountry.name.common,
      smallestCountryByPopulation: smallestCountry.name.common,
      mostSpokenLanguage,
    };
  }

  async getMostSpokenLanguage(countries: CountryDto[]): Promise<string> {
    const languages: Record<string, LanguageDetailsDto> =
      await this.getLanguages();
    return Object.keys(languages).reduce((a, b) =>
      languages[a].totalSpeakers > languages[b].totalSpeakers ? a : b,
    );
  }

  private formatCountryData(
    country: CountryDto | CountryDto[],
  ): FormatCountryDetailsDto | FormatCountryDetailsDto[] {
    if (Array.isArray(country)) {
      return country.map((c) => ({
        commonName: c.name.common,
        population: c.population,
        languages: c.languages,
        borders: c.borders,
        latlng: c.latlng,
      }));
    } else {
      return {
        commonName: country.name.common,
        population: country.population,
        languages: country.languages,
        borders: country.borders,
        latlng: country.latlng,
      };
    }
  }

  private isValidCountryDto(country: any): country is CountryDto {
    return (
      country &&
      typeof country.name?.common === 'string' &&
      typeof country.region === 'string' &&
      typeof country.population === 'number'
    );
  }
}
