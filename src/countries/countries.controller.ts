import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { CountryQueryDataDto } from './dto/country-query-data.dto';
import { SearchCountryResponseDto } from './dto/search-country-response.dto';
import { FormatCountryDetailsDto } from './dto/format-country-details.dto';
import { RegionDto } from './dto/region.dto';
import { LanguageDetailsDto } from './dto/language-details.dto';
import { StatsDto } from './dto/stats.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';

@Controller('')
@UseGuards(ThrottlerGuard)
@ApiTags('Country')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get('countries')
  @ApiOperation({
    summary: 'Retrieve a list of countries based on search criteria',
    description:
      'Fetches a list of countries that match the provided search criteria. Results include pagination and are sorted alphabetically by country name.',
  })
  @ApiResponse({
    status: 200,
    description:
      'A list of countries matching the search criteria, including pagination information.',
    schema: {
      example: {
        total: 53,
        page: 1,
        limit: 25,
        data: [
          {
            commonName: 'Åland Islands',
            population: 29458,
            languages: {
              swe: 'Swedish',
            },
            latlng: [60.116667, 19.9],
          },
          {
            commonName: 'Albania',
            population: 2837743,
            languages: {
              sqi: 'Albanian',
            },
            borders: ['MNE', 'GRC', 'MKD', 'UNK'],
            latlng: [41, 20],
          },
          {
            commonName: 'Andorra',
            population: 77265,
            languages: {
              cat: 'Catalan',
            },
            borders: ['FRA', 'ESP'],
            latlng: [42.5, 1.5],
          },
          {
            commonName: 'Austria',
            population: 8917205,
            languages: {
              de: 'German',
            },
            borders: ['CZE', 'DEU', 'HUN', 'ITA', 'LIE', 'SVK', 'SVN', 'CHE'],
            latlng: [47.33333333, 13.33333333],
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request: The request was invalid or cannot be served.',
    schema: {
      example: {
        message: ['property -- should not exist'],
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  @ApiResponse({
    status: 500,
    description:
      'Internal Server Error: An unexpected error occurred on the server.',
  })
  getCountries(
    @Query() searchCountryQuery: CountryQueryDataDto,
  ): Promise<SearchCountryResponseDto> {
    return this.countriesService.getCountries(searchCountryQuery);
  }

  @Get('countries/:name')
  @ApiOperation({
    summary: 'Retrieve details of a country by name',
    description:
      'Fetches detailed information about a specific country based on its name. Returns formatted country details including population, languages, borders, and geographical coordinates.',
  })
  @ApiParam({
    name: 'name',
    type: String,
    description: 'The name of the country to retrieve details for.',
  })
  @ApiResponse({
    status: 200,
    description: 'Detailed information about the specified country.',
    schema: {
      example: {
        commonName: 'Niger',
        population: 24206636,
        languages: {
          fra: 'French',
        },
        borders: ['DZA', 'BEN', 'BFA', 'TCD', 'LBY', 'MLI', 'NGA'],
        latlng: [16, 8],
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found: The specified country could not be found.',
  })
  @ApiResponse({
    status: 500,
    description:
      'Internal Server Error: An unexpected error occurred on the server.',
  })
  getCountryByName(
    @Param('name') name: string,
  ): Promise<FormatCountryDetailsDto> {
    return this.countriesService.getCountryByName(name);
  }

  @Get('regions')
  @ApiOperation({
    summary: 'Retrieve a list of regions with aggregated country data',
    description:
      'Fetches a list of regions, including details such as the list of countries within each region and the total population of each region.',
  })
  @ApiResponse({
    status: 200,
    description:
      'A list of regions with details including countries and total population.',
    schema: {
      example: {
        Americas: {
          countries: [
            'Grenada',
            'Barbados',
            'Saint Kitts and Nevis',
            'Caribbean Netherlands',
            'Mexico',
            'Saint Barthélemy',
            'Peru',
            'Aruba',
            'Montserrat',
            'United States Virgin Islands',
            'Colombia',
            'Puerto Rico',
            'Dominican Republic',
            'Paraguay',
            'El Salvador',
            'Greenland',
            'Cuba',
            'Canada',
            'Saint Pierre and Miquelon',
            'Sint Maarten',
            'Argentina',
            'Turks and Caicos Islands',
            'Dominica',
            'Costa Rica',
            'Haiti',
            'Honduras',
            'Saint Lucia',
            'Guadeloupe',
            'Suriname',
            'British Virgin Islands',
            'Trinidad and Tobago',
            'Guyana',
            'Uruguay',
            'Antigua and Barbuda',
            'Panama',
            'Curaçao',
            'French Guiana',
            'United States Minor Outlying Islands',
            'Falkland Islands',
            'Bolivia',
            'Chile',
            'United States',
            'Saint Vincent and the Grenadines',
            'Bermuda',
            'Guatemala',
            'Ecuador',
            'Martinique',
            'Bahamas',
            'Brazil',
            'Belize',
            'Venezuela',
            'Jamaica',
            'Cayman Islands',
            'Saint Martin',
            'Nicaragua',
            'Anguilla',
          ],
          totalPopulation: 1020976420,
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description:
      'Internal Server Error: An unexpected error occurred on the server.',
  })
  getRegions(): Promise<Record<string, RegionDto>> {
    return this.countriesService.getRegions();
  }

  @Get('languages')
  @ApiOperation({
    summary: 'Retrieve a list of languages with details',
    description:
      'Fetches a list of languages, including information about which countries speak each language and the total number of speakers for each language.',
  })
  @ApiResponse({
    status: 200,
    description:
      'A list of languages with details including the countries where each language is spoken and the total number of speakers.',
    schema: {
      example: {
        English: {
          countries: [
            'South Georgia',
            'Grenada',
            'Sierra Leone',
            'Barbados',
            'Pitcairn Islands',
            'Saint Kitts and Nevis',
            'Caribbean Netherlands',
            'Uganda',
            'Cook Islands',
            'United Kingdom',
            'Zambia',
            'Christmas Island',
            'Tokelau',
            'Mauritius',
            'Montserrat',
            'United States Virgin Islands',
            'Sudan',
            'Fiji',
            'Puerto Rico',
            'Pakistan',
            'Botswana',
            'Cayman Islands',
            'Guam',
            'Tonga',
            'Kiribati',
            'Ghana',
            'Zimbabwe',
            'American Samoa',
            'New Zealand',
            'Anguilla',
          ],
          totalSpeakers: 2882794269,
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description:
      'Internal Server Error: An unexpected error occurred on the server.',
  })
  getLanguages(): Promise<Record<string, LanguageDetailsDto>> {
    return this.countriesService.getLanguages();
  }

  @Get('statistics')
  @ApiOperation({
    summary: 'Retrieve various statistics about countries',
    description:
      'Fetches general statistics about countries such as the total number of countries, average population, and other relevant metrics.',
  })
  @ApiResponse({
    status: 200,
    description: 'Various statistics about countries.',
    schema: {
      example: {
        totalCountries: 250,
        largestCountryByArea: 'Russia',
        smallestCountryByPopulation: 'Heard Island and McDonald Islands',
        mostSpokenLanguage: 'English',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description:
      'Internal Server Error: An unexpected error occurred on the server.',
  })
  getStatistics(): Promise<StatsDto> {
    return this.countriesService.getStatistics();
  }
}
