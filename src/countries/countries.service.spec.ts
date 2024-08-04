import { Test, TestingModule } from '@nestjs/testing';
import { CountriesService } from './countries.service';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CountryDto } from './dto/country.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import axios from 'axios';
import { ConfigModule, ConfigService } from '@nestjs/config';

const mockCountryData: CountryDto[] = [
  {
    name: {
      common: 'France',
      official: 'French Republic',
      nativeName: {
        fra: { common: 'France', official: 'République française' },
      },
    },
    tld: ['.fr'],
    cca2: 'FR',
    ccn3: '250',
    cca3: 'FRA',
    cioc: 'FRA',
    independent: true,
    status: 'officially-assigned',
    unMember: true,
    currencies: { EUR: { name: 'Euro', symbol: '€' } },
    idd: { root: '+3', suffixes: ['3'] },
    capital: ['Paris'],
    altSpellings: ['FR', 'La France'],
    region: 'Europe',
    subregion: 'Western Europe',
    languages: { fra: 'French' },
    translations: { eng: { official: 'French Republic', common: 'France' } },
    latlng: [46.603354, 1.888334],
    landlocked: false,
    borders: ['BEL', 'DEU', 'ITA', 'LUX', 'MCO', 'ESP', 'CHE'],
    area: 551695,
    demonyms: { fra: { m: 'Frenchman', f: 'Frenchwoman' } },
    flag: 'https://restcountries.com/v3/flags/fr.png',
    maps: {
      googleMaps: 'https://maps.google.com/?q=France',
      openStreetMaps:
        'https://www.openstreetmap.org/?mlat=46.603354&mlon=1.888334#map=6/46.6/1.9',
    },
    population: 67000000,
    gini: { 2019: 32.7 },
    fifa: 'FRA',
    car: { signs: ['F'], side: 'right' },
    timezones: ['UTC+01:00'],
    continents: ['Europe'],
    flags: {
      png: 'https://restcountries.com/v3/flags/fr.png',
      svg: 'https://restcountries.com/v3/flags/fr.svg',
      alt: 'Flag of France',
    },
    coatOfArms: {
      png: 'https://restcountries.com/v3/coatOfArms/fr.png',
      svg: 'https://restcountries.com/v3/coatOfArms/fr.svg',
    },
    startOfWeek: 'monday',
    capitalInfo: { latlng: [48.856613, 2.352222] },
    postalCode: { format: '#####', regex: '^[0-9]{5}$' },
  },
  {
    name: {
      common: 'Germany',
      official: 'Federal Republic of Germany',
      nativeName: {
        deu: { common: 'Deutschland', official: 'Bundesrepublik Deutschland' },
      },
    },
    tld: ['.de'],
    cca2: 'DE',
    ccn3: '276',
    cca3: 'DEU',
    cioc: 'GER',
    independent: true,
    status: 'officially-assigned',
    unMember: true,
    currencies: { EUR: { name: 'Euro', symbol: '€' } },
    idd: { root: '+4', suffixes: ['9'] },
    capital: ['Berlin'],
    altSpellings: ['DE', 'Deutschland'],
    region: 'Europe',
    subregion: 'Western Europe',
    languages: { deu: 'German' },
    translations: {
      eng: { official: 'Federal Republic of Germany', common: 'Germany' },
    },
    latlng: [51.165691, 10.451526],
    landlocked: false,
    borders: ['AUT', 'BEL', 'CZE', 'DNK', 'FRA', 'LUX', 'NLD', 'POL', 'CHE'],
    area: 357022,
    demonyms: { deu: { m: 'German', f: 'German' } },
    flag: 'https://restcountries.com/v3/flags/de.png',
    maps: {
      googleMaps: 'https://maps.google.com/?q=Germany',
      openStreetMaps:
        'https://www.openstreetmap.org/?mlat=51.165691&mlon=10.451526#map=6/51.2/10.5',
    },
    population: 83783942,
    gini: { 2019: 31.9 },
    fifa: 'GER',
    car: { signs: ['D'], side: 'right' },
    timezones: ['UTC+01:00'],
    continents: ['Europe'],
    flags: {
      png: 'https://restcountries.com/v3/flags/de.png',
      svg: 'https://restcountries.com/v3/flags/de.svg',
      alt: 'Flag of Germany',
    },
    coatOfArms: {
      png: 'https://restcountries.com/v3/coatOfArms/de.png',
      svg: 'https://restcountries.com/v3/coatOfArms/de.svg',
    },
    startOfWeek: 'monday',
    capitalInfo: { latlng: [52.52437, 13.41053] },
    postalCode: { format: '#####', regex: '^[0-9]{5}$' },
  },
  {
    name: {
      common: 'Italy',
      official: 'Italian Republic',
      nativeName: {
        ita: { common: 'Italia', official: 'Repubblica Italiana' },
      },
    },
    tld: ['.it'],
    cca2: 'IT',
    ccn3: '380',
    cca3: 'ITA',
    cioc: 'ITA',
    independent: true,
    status: 'officially-assigned',
    unMember: true,
    currencies: { EUR: { name: 'Euro', symbol: '€' } },
    idd: { root: '+3', suffixes: ['9'] },
    capital: ['Rome'],
    altSpellings: ['IT', 'Italia'],
    region: 'Europe',
    subregion: 'Southern Europe',
    languages: { ita: 'Italian' },
    translations: { eng: { official: 'Italian Republic', common: 'Italy' } },
    latlng: [41.87194, 12.56738],
    landlocked: false,
    borders: ['AUT', 'FRA', 'SMR', 'SVN', 'CHE'],
    area: 301340,
    demonyms: { ita: { m: 'Italian', f: 'Italian' } },
    flag: 'https://restcountries.com/v3/flags/it.png',
    maps: {
      googleMaps: 'https://maps.google.com/?q=Italy',
      openStreetMaps:
        'https://www.openstreetmap.org/?mlat=41.87194&mlon=12.56738#map=6/41.9/12.6',
    },
    population: 60244639,
    gini: { 2019: 34.7 },
    fifa: 'ITA',
    car: { signs: ['I'], side: 'right' },
    timezones: ['UTC+01:00'],
    continents: ['Europe'],
    flags: {
      png: 'https://restcountries.com/v3/flags/it.png',
      svg: 'https://restcountries.com/v3/flags/it.svg',
      alt: 'Flag of Italy',
    },
    coatOfArms: {
      png: 'https://restcountries.com/v3/coatOfArms/it.png',
      svg: 'https://restcountries.com/v3/coatOfArms/it.svg',
    },
    startOfWeek: 'monday',
    capitalInfo: { latlng: [41.89474, 12.4816] },
    postalCode: { format: '#####', regex: '^[0-9]{5}$' },
  },
];

const mockCacheManager = {
  get: jest.fn(),
  set: jest.fn(),
};

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockInvalidData = [{}];

describe('CountriesService', () => {
  let service: CountriesService;
  const mockRestCountriesBaseUrl = 'https://mockurl.com';
  const mockCallTimeout = 5000;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [
        CountriesService,
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              if (key === 'REST_COUNTRIES_API_URL')
                return mockRestCountriesBaseUrl;
              if (key === 'REST_CALL_TIME_OUT') return mockCallTimeout;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<CountriesService>(CountriesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchCountries', () => {
    it('should return cached data if available', async () => {
      mockCacheManager.get.mockResolvedValue(mockCountryData);

      const result = await service.fetchCountries();

      expect(mockCacheManager.get).toHaveBeenCalledWith('countries');
      expect(mockedAxios.get).not.toHaveBeenCalled();
      expect(result).toEqual(mockCountryData);
    });

    it('should fetch from API if no cache data is available', async () => {
      mockCacheManager.get.mockResolvedValue(null);
      mockedAxios.get.mockResolvedValue({ data: mockCountryData });

      try {
        const result = await service.fetchCountries();

        expect(mockCacheManager.get).toHaveBeenCalledWith('countries');
        expect(mockedAxios.get).toHaveBeenCalledWith(
          `${mockRestCountriesBaseUrl}/all`,
          {
            timeout: mockCallTimeout,
          },
        );
        expect(mockCacheManager.set).toHaveBeenCalledWith(
          'countries',
          mockCountryData,
        );
        expect(result).toEqual(mockCountryData);
      } catch (error) {
        throw error;
      }
    });

    it('should throw an error if API response data format is invalid', async () => {
      mockCacheManager.get.mockResolvedValue(null);
      mockedAxios.get.mockResolvedValue({ data: mockInvalidData });

      await expect(service.fetchCountries()).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(mockCacheManager.get).toHaveBeenCalledWith('countries');
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${mockRestCountriesBaseUrl}/all`,
        {
          timeout: mockCallTimeout,
        },
      );
      expect(mockCacheManager.set).not.toHaveBeenCalled();
    });
  });

  describe('getCountries', () => {
    it('should return filtered and paginated country data', async () => {
      mockCacheManager.get.mockResolvedValue(mockCountryData);
      const searchQuery = {
        region: 'Europe',
        minPopulation: 60000000,
        page: 1,
        limit: 1,
      };

      const result = await service.getCountries(searchQuery);

      expect(result.total).toBeGreaterThanOrEqual(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(1);
      expect(result.data).toHaveLength(1);
      expect(result.data[0]).toHaveProperty('commonName');
    });
  });

  describe('getCountryByName', () => {
    it('should return country data if found', async () => {
      mockCacheManager.get.mockResolvedValue(mockCountryData);
      const result = await service.getCountryByName('France');

      expect(result).toHaveProperty('commonName', 'France');
      expect(result).toHaveProperty('population', expect.any(Number));
      expect(result).toHaveProperty('languages', expect.any(Object));
      expect(result).toHaveProperty('borders', expect.any(Array));
      expect(result).toHaveProperty('latlng', expect.any(Array));
    });

    it('should throw NotFoundException if country is not found', async () => {
      mockCacheManager.get.mockResolvedValue(mockCountryData);

      await expect(
        service.getCountryByName('NonexistentCountry'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getRegions', () => {
    it('should return correct region data', async () => {
      mockCacheManager.get.mockResolvedValue(mockCountryData);
      const result = await service.getRegions();

      expect(result).toEqual(expect.any(Object));
      expect(result).toHaveProperty('Europe');
    });
  });

  describe('getLanguages', () => {
    it('should return correct language data', async () => {
      mockCacheManager.get.mockResolvedValue(mockCountryData);
      const result = await service.getLanguages();

      expect(result).toEqual(expect.any(Object));
      expect(result).toHaveProperty('French');
      expect(result).toHaveProperty('German');
      expect(result).toHaveProperty('Italian');
    });
  });

  describe('getStatistics', () => {
    it('should return correct statistics', async () => {
      mockCacheManager.get.mockResolvedValue(mockCountryData);
      const result = await service.getStatistics();

      expect(result).toEqual({
        totalCountries: 3,
        largestCountryByArea: 'France',
        smallestCountryByPopulation: 'Italy',
        mostSpokenLanguage: expect.any(String),
      });
    });
  });
});
