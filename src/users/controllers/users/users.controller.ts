import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  Req,
  Res,
  UsePipes,
  ValidationPipe,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import puppeteer from 'puppeteer';

import { Request, Response } from 'express';
import { CreateUserDto } from 'src/users/dtos/CreateUser.dto';
import { UsersService } from 'src/users/services/users/users.service';
import axios, { HttpStatusCode } from 'axios';
import cheerio from 'cheerio';
import { error } from 'console';
import { Trailblazer } from 'src/users/Types/Trailblazer';
import { request } from 'http';

@Controller('users')
export class UsersController {
  // _username = null;
  private trailblazer: Trailblazer[] = [];

  constructor(private userService: UsersService) {}

  @Get()
  getUser() {
    return { name: 'Krishan', email: 'krishan@gmail.com' };
  }

  @Post('fetch')
  createUser(@Req() request, @Res() response) {
    // console.log(request.body);
    response.redirect('/fetchbyPost');
    return {};
  }

  @Post('fetchbyPost')
  createUserByPost(@Body() userData: CreateUserDto) {
    console.log(userData.name);
    console.log(userData);
    return {};
  }

  @Post('fetchbyPostValidator')
  @UsePipes(new ValidationPipe())
  createUserByPostValidator(@Body() userData: CreateUserDto) {
    console.log(userData.name);
    console.log(userData);
    return userData;
  }

  @Get('/providers')
  checkProvider() {
    return this.userService.fetchUser();
  }

  @HttpCode(500) // we can set manually Http status
  @Get('user/:id/:cmtId')
  showUserById(@Param('id') id: string, @Param('cmtId') cmtID: string) {
    return { id, cmtID };
  }

  @Get('puppeteer')
  scrapping() {
    (async () => {
      const browser = await puppeteer.launch({ headless: false });
      const page = await browser.newPage();
      await page.goto('https://trailblazer.me/id/kkumawatsfdc');
      //   await page.screenshot({ path: 'example.png' });
      const grap = await page.evaluate(() => {
        const data = document
          .querySelector(
            '#profile-sections-container > div:nth-child(2) > tbme-rank',
          )
          .shadowRoot.querySelector(
            'lwc-tds-theme-provider > lwc-tbui-card > div.stats-container > lwc-tbui-tally:nth-child(2)',
          )
          .shadowRoot.querySelector(
            'span > span.tally__count.tally__count_success',
          );
        return data.innerHTML;
      });

      console.log('Data : ' + grap);
      await browser.close();
    })();
    return '';
  }

  @Get('puppeteer1')
  scrapping1() {
    (async () => {
      const browser = await puppeteer.launch({ headless: false });
      const page = await browser.newPage();
      await page.goto('https://trailblazer.me/id/scott');
      //   await page.screenshot({ path: 'example.png' });
      const grap = await page.evaluate(async () => {
        try {
          const element: HTMLElement = document
            .querySelector(
              '#profile-sections-container > div:nth-child(1) > tbme-profile-badges',
            )
            .shadowRoot.querySelector(
              'lwc-tbui-card > lwc-tbui-card-footer-link',
            )
            .shadowRoot.querySelector('lwc-tds-button') as HTMLElement;
          await element.click();
          const badge = document
            .querySelector(
              '#profile-sections-container > div:nth-child(10) > tbme-profile-badges',
            )
            .shadowRoot.querySelector(
              'lwc-tbui-card > div > lwc-tbui-badge:nth-child(1)',
            )
            .shadowRoot.querySelector(
              'article > figure > figcaption > a',
            ).innerHTML;
          console.log(`${badge} name`);
          return badge;
        } catch (error) {
          console.log(`error ${error}`);
        }
      });

      console.log('Data : ' + grap);
      await browser.close();
    })();
    return '';
  }

  @Get('link/:link')
  async handleRequest(@Query('link') path: string) {
    const res = await axios
      .get('https://trailblazer.me/id/saloni', {
        headers: {
          'Accept-Encoding': 'gzip=true, deflate, br', // gzip=true
        },
        // responseType: 'text',
        // responseEncoding: 'utf8',
        // decompress: false,
      })
      .then((res) => {
        if (res.status === 200) {
          const html = res.data;
          console.log(typeof html);
          console.log(html.length);
          console.log(html);
          console.log(html.search('\\"Id\\":\\"'));
        }
      });

    // const request = XMLHttpRequest();
    // const res = await axios.get('https://trailblazer.me/id/saloni', {
    //   // headers: { 'content-type': 'application/text' },
    //   // responseType: 'text',
    //   // responseEncoding: 'utf8',
    //   decompress: false,
    // });
    // console.log(res.data);

    // axios({
    //   method: 'get',
    //   url: 'https://trailblazer.me/id/saloni',
    //   responseType: 'stream',
    // }).then(function (response) {
    // });
    return path.split('/')[path.split('/').length - 1];
  }

  @Get('assign/:value')
  async assignProtected(@Param('value') value: string) {
    const name = this.userService.assignUser(value);
    this.trailblazer.push({ tbId: value });
    // this._username = name;

    // console.log(this._username);
    return this.trailblazer;
  }

  @Get('extract')
  extract() {
    const rowData = `var profileData = JSON.parse("{\"trailheadUserData\":null,\"recognitions\":[],\"profileUserBgImageUrl\":\"https://trailblazer.me/resource/1666747344000/assets/assets/backgrounds/arid-dunes.png\",\"profileUser\":{\"attributes\":{\"type\":\"User\",\"url\":\"/services/data/v56.0/sobjects/User/0051I000004XUaHQAW\"},\"WebsiteLink__c\":\"http://sfdcmaster.com/\",\"Company_Website__c\":\"https://thinkvibes.com/\",\"AboutMe\":\"Enthusiastic and driven Science graduate with a Master\'s degree from JECRC University. 3X Certified Salesforce Developer with 1+ year of experience, Want the company’s standards and goals to rise with the help of my own contributions. A developer at heart, and an Associate Software Consultant by role, currently works at Thinkvibes Softwares Pvt Ltd.\",\"FirstName\":\"Prashant\",\"StateCode\":\"RJ\",\"Title\":\"Associate Software Consultant\",\"Relationship_To_Salesforce__c\":\"Partner\",\"BackgroundImageResource__c\":\"ARID_DUNES\",\"Certification_Status__c\":\"CONNECTED\",\"TBID_Role__c\":\"Developer\",\"Company_Size__c\":\"21-100 employees\",\"CompanyName\":\"Thinkvibes Softwares\",\"Is_Public_Profile__c\":true,\"TrailblazerId__c\":\"sfdc-prashant\",\"FacebookProfileLink__c\":\"Mr.PM99/\",\"State\":\"Rajasthan\",\"Pronoun__c\":\"he/him/his\",\"TwitterProfileLink__c\":\"Mr__PM\",\"Country\":\"India\",\"Id\":\"0051I000004XUaHQAW\",\"LastName\":\"Mishra\",\"CountryCode\":\"IN\",\"LinkedInProfileLink__c\":\"pmprashantmishra/\"},\"profilePhotoUrl\":\"https://trailblazer.me/profilephoto/7298W000001qpLr/M\",\"pickLists\":{\"pickListBackgroundAltText\":[{\"value\":\"A desert canyon with a small lake in the center\",\"key\":\"ARID_DUNES\"},{\"value\":\"A wide river with mountains in the background\",\"key\":\"HIGHLAND_POND\"},{\"value\":\"A series of small waterfalls with mountains in the background\",\"key\":\"HIGHLAND_WATERFALLS\"},{\"value\":\"A tropical lake with palm trees and a waterfall\",\"key\":\"TROPICAL_BEACH\"}],\"pickListBackgroundOptions\":[{\"value\":\"/resource/1666747344000/assets/assets/backgrounds/arid-dunes.png\",\"key\":\"ARID_DUNES\"},{\"value\":\"/resource/1666747344000/assets/assets/backgrounds/highland-pond.png\",\"key\":\"HIGHLAND_POND\"},{\"value\":\"/resource/1666747344000/assets/assets/backgrounds/highland-waterfalls.png\",\"key\":\"HIGHLAND_WATERFALLS\"},{\"value\":\"/resource/1666747344000/assets/assets/backgrounds/tropical-beach.png\",\"key\":\"TROPICAL_BEACH\"}],\"pickListFavoriteTrailheadCharacter\":[{\"label\":\"Select an Option\",\"value\":\"\"},{\"label\":\"Appy\",\"value\":\"Appy\"},{\"label\":\"Astro\",\"value\":\"Astro\"},{\"label\":\"Blaze\",\"value\":\"Blaze\"},{\"label\":\"Cloudy\",\"value\":\"Cloudy\"},{\"label\":\"Codey\",\"value\":\"Codey\"},{\"label\":\"Earnie\",\"value\":\"Earnie\"},{\"label\":\"Hootie\",\"value\":\"Hootie\"},{\"label\":\"Koa the dog\",\"value\":\"Koa the dog\"},{\"label\":\"Meta\",\"value\":\"Meta\"},{\"label\":\"SaaSy\",\"value\":\"SaaSy\"}],\"pickListCompanySizes\":[{\"label\":\"Select an Option\",\"value\":\"\"},{\"label\":\"1-20 employees\",\"value\":\"1-20 employees\"},{\"label\":\"21-100 employees\",\"value\":\"21-100 employees\"},{\"label\":\"101-500 employees\",\"value\":\"101-500 employees\"},{\"label\":\"501-3500 employees\",\"value\":\"501-3500 employees\"},{\"label\":\"3501+ employees\",\"value\":\"3501+ employees\"}],\"pickListPronouns\":[{\"label\":\"Select an Option\",\"value\":\"\"},{\"label\":\"he/him/his\",\"value\":\"he/him/his\"},{\"label\":\"other/ask me\",\"value\":\"other/ask me\"},{\"label\":\"she/her/hers\",\"value\":\"she/her/hers\"},{\"label\":\"they/them/theirs\",\"value\":\"they/them/theirs\"}],\"pickListCountries\":[{\"label\":\"Select an Option\",\"value\":\"\"},{\"label\":\"Afghanistan\",\"value\":\"AF\"},{\"label\":\"Aland Islands\",\"value\":\"AX\"},{\"label\":\"Albania\",\"value\":\"AL\"},{\"label\":\"Algeria\",\"value\":\"DZ\"},{\"label\":\"Andorra\",\"value\":\"AD\"},{\"label\":\"Angola\",\"value\":\"AO\"},{\"label\":\"Anguilla\",\"value\":\"AI\"},{\"label\":\"Antarctica\",\"value\":\"AQ\"},{\"label\":\"Antigua and Barbuda\",\"value\":\"AG\"},{\"label\":\"Argentina\",\"value\":\"AR\"},{\"label\":\"Armenia\",\"value\":\"AM\"},{\"label\":\"Aruba\",\"value\":\"AW\"},{\"label\":\"Australia\",\"value\":\"AU\"},{\"label\":\"Austria\",\"value\":\"AT\"},{\"label\":\"Azerbaijan\",\"value\":\"AZ\"},{\"label\":\"Bahamas\",\"value\":\"BS\"},{\"label\":\"Bahrain\",\"value\":\"BH\"},{\"label\":\"Bangladesh\",\"value\":\"BD\"},{\"label\":\"Barbados\",\"value\":\"BB\"},{\"label\":\"Belarus\",\"value\":\"BY\"},{\"label\":\"Belgium\",\"value\":\"BE\"},{\"label\":\"Belize\",\"value\":\"BZ\"},{\"label\":\"Benin\",\"value\":\"BJ\"},{\"label\":\"Bermuda\",\"value\":\"BM\"},{\"label\":\"Bhutan\",\"value\":\"BT\"},{\"label\":\"Bolivia, Plurinational State of\",\"value\":\"BO\"},{\"label\":\"Bonaire, Sint Eustatius and Saba\",\"value\":\"BQ\"},{\"label\":\"Bosnia and Herzegovina\",\"value\":\"BA\"},{\"label\":\"Botswana\",\"value\":\"BW\"},{\"label\":\"Bouvet Island\",\"value\":\"BV\"},{\"label\":\"Brazil\",\"value\":\"BR\"},{\"label\":\"British Indian Ocean Territory\",\"value\":\"IO\"},{\"label\":\"Brunei Darussalam\",\"value\":\"BN\"},{\"label\":\"Bulgaria\",\"value\":\"BG\"},{\"label\":\"Burkina Faso\",\"value\":\"BF\"},{\"label\":\"Burundi\",\"value\":\"BI\"},{\"label\":\"Cambodia\",\"value\":\"KH\"},{\"label\":\"Cameroon\",\"value\":\"CM\"},{\"label\":\"Canada\",\"value\":\"CA\"},{\"label\":\"Cape Verde\",\"value\":\"CV\"},{\"label\":\"Cayman Islands\",\"value\":\"KY\"},{\"label\":\"Central African Republic\",\"value\":\"CF\"},{\"label\":\"Chad\",\"value\":\"TD\"},{\"label\":\"Chile\",\"value\":\"CL\"},{\"label\":\"China\",\"value\":\"CN\"},{\"label\":\"Christmas Island\",\"value\":\"CX\"},{\"label\":\"Cocos (Keeling) Islands\",\"value\":\"CC\"},{\"label\":\"Colombia\",\"value\":\"CO\"},{\"label\":\"Comoros\",\"value\":\"KM\"},{\"label\":\"Congo\",\"value\":\"CG\"},{\"label\":\"Congo, the Democratic Republic of the\",\"value\":\"CD\"},{\"label\":\"Cook Islands\",\"value\":\"CK\"},{\"label\":\"Costa Rica\",\"value\":\"CR\"},{\"label\":\"Cote d\'Ivoire\",\"value\":\"CI\"},{\"label\":\"Croatia\",\"value\":\"HR\"},{\"label\":\"Cuba\",\"value\":\"CU\"},{\"label\":\"Curaçao\",\"value\":\"CW\"},{\"label\":\"Cyprus\",\"value\":\"CY\"},{\"label\":\"Czech Republic\",\"value\":\"CZ\"},{\"label\":\"Denmark\",\"value\":\"DK\"},{\"label\":\"Djibouti\",\"value\":\"DJ\"},{\"label\":\"Dominica\",\"value\":\"DM\"},{\"label\":\"Dominican Republic\",\"value\":\"DO\"},{\"label\":\"Ecuador\",\"value\":\"EC\"},{\"label\":\"Egypt\",\"value\":\"EG\"},{\"label\":\"El Salvador\",\"value\":\"SV\"},{\"label\":\"Equatorial Guinea\",\"value\":\"GQ\"},{\"label\":\"Eritrea\",\"value\":\"ER\"},{\"label\":\"Estonia\",\"value\":\"EE\"},{\"label\":\"Ethiopia\",\"value\":\"ET\"},{\"label\":\"Falkland Islands (Malvinas)\",\"value\":\"FK\"},{\"label\":\"Faroe Islands\",\"value\":\"FO\"},{\"label\":\"Fiji\",\"value\":\"FJ\"},{\"label\":\"Finland\",\"value\":\"FI\"},{\"label\":\"France\",\"value\":\"FR\"},{\"label\":\"French Guiana\",\"value\":\"GF\"},{\"label\":\"French Polynesia\",\"value\":\"PF\"},{\"label\":\"French Southern Territories\",\"value\":\"TF\"},{\"label\":\"Gabon\",\"value\":\"GA\"},{\"label\":\"Gambia\",\"value\":\"GM\"},{\"label\":\"Georgia\",\"value\":\"GE\"},{\"label\":\"Germany\",\"value\":\"DE\"},{\"label\":\"Ghana\",\"value\":\"GH\"},{\"label\":\"Gibraltar\",\"value\":\"GI\"},{\"label\":\"Greece\",\"value\":\"GR\"},{\"label\":\"Greenland\",\"value\":\"GL\"},{\"label\":\"Grenada\",\"value\":\"GD\"},{\"label\":\"Guadeloupe\",\"value\":\"GP\"},{\"label\":\"Guatemala\",\"value\":\"GT\"},{\"label\":\"Guernsey\",\"value\":\"GG\"},{\"label\":\"Guinea\",\"value\":\"GN\"},{\"label\":\"Guinea-Bissau\",\"value\":\"GW\"},{\"label\":\"Guyana\",\"value\":\"GY\"},{\"label\":\"Haiti\",\"value\":\"HT\"},{\"label\":\"Heard Island and McDonald Islands\",\"value\":\"HM\"},{\"label\":\"Holy See (Vatican City State)\",\"value\":\"VA\"},{\"label\":\"Honduras\",\"value\":\"HN\"},{\"label\":\"Hungary\",\"value\":\"HU\"},{\"label\":\"Iceland\",\"value\":\"IS\"},{\"label\":\"India\",\"value\":\"IN\"},{\"label\":\"Indonesia\",\"value\":\"ID\"},{\"label\":\"Iran, Islamic Republic of\",\"value\":\"IR\"},{\"label\":\"Iraq\",\"value\":\"IQ\"},{\"label\":\"Ireland\",\"value\":\"IE\"},{\"label\":\"Isle of Man\",\"value\":\"IM\"},{\"label\":\"Israel\",\"value\":\"IL\"},{\"label\":\"Italy\",\"value\":\"IT\"},{\"label\":\"Jamaica\",\"value\":\"JM\"},{\"label\":\"Japan\",\"value\":\"JP\"},{\"label\":\"Jersey\",\"value\":\"JE\"},{\"label\":\"Jordan\",\"value\":\"JO\"},{\"label\":\"Kazakhstan\",\"value\":\"KZ\"},{\"label\":\"Kenya\",\"value\":\"KE\"},{\"label\":\"Kiribati\",\"value\":\"KI\"},{\"label\":\"Korea, Democratic People\'s Republic of\",\"value\":\"KP\"},{\"label\":\"Korea, Republic of\",\"value\":\"KR\"},{\"label\":\"Kuwait\",\"value\":\"KW\"},{\"label\":\"Kyrgyzstan\",\"value\":\"KG\"},{\"label\":\"Lao People\'s Democratic Republic\",\"value\":\"LA\"},{\"label\":\"Latvia\",\"value\":\"LV\"},{\"label\":\"Lebanon\",\"value\":\"LB\"},{\"label\":\"Lesotho\",\"value\":\"LS\"},{\"label\":\"Liberia\",\"value\":\"LR\"},{\"label\":\"Libya\",\"value\":\"LY\"},{\"label\":\"Liechtenstein\",\"value\":\"LI\"},{\"label\":\"Lithuania\",\"value\":\"LT\"},{\"label\":\"Luxembourg\",\"value\":\"LU\"},{\"label\":\"Macao\",\"value\":\"MO\"},{\"label\":\"Macedonia, the former Yugoslav Republic of\",\"value\":\"MK\"},{\"label\":\"Madagascar\",\"value\":\"MG\"},{\"label\":\"Malawi\",\"value\":\"MW\"},{\"label\":\"Malaysia\",\"value\":\"MY\"},{\"label\":\"Maldives\",\"value\":\"MV\"},{\"label\":\"Mali\",\"value\":\"ML\"},{\"label\":\"Malta\",\"value\":\"MT\"},{\"label\":\"Martinique\",\"value\":\"MQ\"},{\"label\":\"Mauritania\",\"value\":\"MR\"},{\"label\":\"Mauritius\",\"value\":\"MU\"},{\"label\":\"Mayotte\",\"value\":\"YT\"},{\"label\":\"Mexico\",\"value\":\"MX\"},{\"label\":\"Moldova, Republic of\",\"value\":\"MD\"},{\"label\":\"Monaco\",\"value\":\"MC\"},{\"label\":\"Mongolia\",\"value\":\"MN\"},{\"label\":\"Montenegro\",\"value\":\"ME\"},{\"label\":\"Montserrat\",\"value\":\"MS\"},{\"label\":\"Morocco\",\"value\":\"MA\"},{\"label\":\"Mozambique\",\"value\":\"MZ\"},{\"label\":\"Myanmar\",\"value\":\"MM\"},{\"label\":\"Namibia\",\"value\":\"NA\"},{\"label\":\"Nauru\",\"value\":\"NR\"},{\"label\":\"Nepal\",\"value\":\"NP\"},{\"label\":\"Netherlands\",\"value\":\"NL\"},{\"label\":\"New Caledonia\",\"value\":\"NC\"},{\"label\":\"New Zealand\",\"value\":\"NZ\"},{\"label\":\"Nicaragua\",\"value\":\"NI\"},{\"label\":\"Niger\",\"value\":\"NE\"},{\"label\":\"Nigeria\",\"value\":\"NG\"},{\"label\":\"Niue\",\"value\":\"NU\"},{\"label\":\"Norfolk Island\",\"value\":\"NF\"},{\"label\":\"Norway\",\"value\":\"NO\"},{\"label\":\"Oman\",\"value\":\"OM\"},{\"label\":\"Pakistan\",\"value\":\"PK\"},{\"label\":\"Palestine\",\"value\":\"PS\"},{\"label\":\"Panama\",\"value\":\"PA\"},{\"label\":\"Papua New Guinea\",\"value\":\"PG\"},{\"label\":\"Paraguay\",\"value\":\"PY\"},{\"label\":\"Peru\",\"value\":\"PE\"},{\"label\":\"Philippines\",\"value\":\"PH\"},{\"label\":\"Pitcairn\",\"value\":\"PN\"},{\"label\":\"Poland\",\"value\":\"PL\"},{\"label\":\"Portugal\",\"value\":\"PT\"},{\"label\":\"Qatar\",\"value\":\"QA\"},{\"label\":\"Reunion\",\"value\":\"RE\"},{\"label\":\"Romania\",\"value\":\"RO\"},{\"label\":\"Russian Federation\",\"value\":\"RU\"},{\"label\":\"Rwanda\",\"value\":\"RW\"},{\"label\":\"Saint Barthélemy\",\"value\":\"BL\"},{\"label\":\"Saint Helena, Ascension and Tristan da Cunha\",\"value\":\"SH\"},{\"label\":\"Saint Kitts and Nevis\",\"value\":\"KN\"},{\"label\":\"Saint Lucia\",\"value\":\"LC\"},{\"label\":\"Saint Martin (French part)\",\"value\":\"MF\"},{\"label\":\"Saint Pierre and Miquelon\",\"value\":\"PM\"},{\"label\":\"Saint Vincent and the Grenadines\",\"value\":\"VC\"},{\"label\":\"Samoa\",\"value\":\"WS\"},{\"label\":\"San Marino\",\"value\":\"SM\"},{\"label\":\"Sao Tome and Principe\",\"value\":\"ST\"},{\"label\":\"Saudi Arabia\",\"value\":\"SA\"},{\"label\":\"Senegal\",\"value\":\"SN\"},{\"label\":\"Serbia\",\"value\":\"RS\"},{\"label\":\"Seychelles\",\"value\":\"SC\"},{\"label\":\"Sierra Leone\",\"value\":\"SL\"},{\"label\":\"Singapore\",\"value\":\"SG\"},{\"label\":\"Sint Maarten (Dutch part)\",\"value\":\"SX\"},{\"label\":\"Slovakia\",\"value\":\"SK\"},{\"label\":\"Slovenia\",\"value\":\"SI\"},{\"label\":\"Solomon Islands\",\"value\":\"SB\"},{\"label\":\"Somalia\",\"value\":\"SO\"},{\"label\":\"South Africa\",\"value\":\"ZA\"},{\"label\":\"South Georgia and the South Sandwich Islands\",\"value\":\"GS\"},{\"label\":\"South Sudan\",\"value\":\"SS\"},{\"label\":\"Spain\",\"value\":\"ES\"},{\"label\":\"Sri Lanka\",\"value\":\"LK\"},{\"label\":\"Sudan\",\"value\":\"SD\"},{\"label\":\"Suriname\",\"value\":\"SR\"},{\"label\":\"Svalbard and Jan Mayen\",\"value\":\"SJ\"},{\"label\":\"Swaziland\",\"value\":\"SZ\"},{\"label\":\"Sweden\",\"value\":\"SE\"},{\"label\":\"Switzerland\",\"value\":\"CH\"},{\"label\":\"Syrian Arab Republic\",\"value\":\"SY\"},{\"label\":\"Taiwan\",\"value\":\"TW\"},{\"label\":\"Tajikistan\",\"value\":\"TJ\"},{\"label\":\"Tanzania, United Republic of\",\"value\":\"TZ\"},{\"label\":\"Thailand\",\"value\":\"TH\"},{\"label\":\"Timor-Leste\",\"value\":\"TL\"},{\"label\":\"Togo\",\"value\":\"TG\"},{\"label\":\"Tokelau\",\"value\":\"TK\"},{\"label\":\"Tonga\",\"value\":\"TO\"},{\"label\":\"Trinidad and Tobago\",\"value\":\"TT\"},{\"label\":\"Tunisia\",\"value\":\"TN\"},{\"label\":\"Turkey\",\"value\":\"TR\"},{\"label\":\"Turkmenistan\",\"value\":\"TM\"},{\"label\":\"Turks and Caicos Islands\",\"value\":\"TC\"},{\"label\":\"Tuvalu\",\"value\":\"TV\"},{\"label\":\"Uganda\",\"value\":\"UG\"},{\"label\":\"Ukraine\",\"value\":\"UA\"},{\"label\":\"United Arab Emirates\",\"value\":\"AE\"},{\"label\":\"United Kingdom\",\"value\":\"GB\"},{\"label\":\"United States\",\"value\":\"US\"},{\"label\":\"Uruguay\",\"value\":\"UY\"},{\"label\":\"Uzbekistan\",\"value\":\"UZ\"},{\"label\":\"Vanuatu\",\"value\":\"VU\"},{\"label\":\"Venezuela, Bolivarian Republic of\",\"value\":\"VE\"},{\"label\":\"Vietnam\",\"value\":\"VN\"},{\"label\":\"Virgin Islands, British\",\"value\":\"VG\"},{\"label\":\"Wallis and Futuna\",\"value\":\"WF\"},{\"label\":\"Western Sahara\",\"value\":\"EH\"},{\"label\":\"Yemen\",\"value\":\"YE\"},{\"label\":\"Zambia\",\"value\":\"ZM\"},{\"label\":\"Zimbabwe\",\"value\":\"ZW\"}],\"pickListRelationships\":[{\"label\":\"Select an Option\",\"value\":\"\"},{\"label\":\"Customer\",\"value\":\"Customer\"},{\"label\":\"Partner\",\"value\":\"Partner\"},{\"label\":\"Non-Customer / Prospect\",\"value\":\"Non-Customer / Prospect\"},{\"label\":\"Salesforce Employee\",\"value\":\"Salesforce Employee\"}],\"pickListRoles\":[{\"label\":\"Select an Option\",\"value\":\"\"},{\"label\":\"Developer\",\"value\":\"Developer\"},{\"label\":\"Administrator\",\"value\":\"Administrator\"},{\"label\":\"Architect\",\"value\":\"Architect\"},{\"label\":\"Sales Representative / Manager\",\"value\":\"Sales Representative / Manager\"},{\"label\":\"Marketer\",\"value\":\"Marketer\"},{\"label\":\"Service Agent / Supervisor\",\"value\":\"Service Agent / Supervisor\"},{\"label\":\"Data Analyst\",\"value\":\"Data Analyst\"},{\"label\":\"Consultant\",\"value\":\"Consultant\"},{\"label\":\"Business Operations Manager\",\"value\":\"Business Operations Manager\"},{\"label\":\"Designer\",\"value\":\"UX Designer\"},{\"label\":\"Educator\",\"value\":\"Educator\"},{\"label\":\"Student\",\"value\":\"Student\"},{\"label\":\"Executive\",\"value\":\"Executive\"},{\"label\":\"Product Manager\",\"value\":\"Product Manager\"}]},\"isSelf\":false,\"isExtProfileUser\":null,\"isCommunityUser\":true,\"isAvailableForHire\":true,\"isAuthenticated\":true,\"identity\":\"eyJhY2Nlc3NfdG9rZW4iOiIwMEQxSTAwMDAwMVdNMU4hQVJNQVFCd1JqOVA4SEU3ei5SMUZRLnprRGRvV0c0SU8ybUZXZmlMdTFoX0dwTzdrY2VpTXF1cTJXanYzblh0eEpwUEthcVVJWDNRNXhaYUphYVpZdUVuaEJUWlVvdjhZIiwiTG9naW5NZXRob2QiOiJzYWxlc2ZvcmNlOjAwRDVpMDAwMDAxdklaR0VBMjAwNTVpMDAwMDAwb3M4TUFBUTpra3VtYXdhdEBpbmZvdGVjaC5jb206OjprdW1hd2F0a3Jpc2hhbjY1OEBnbWFpbC5jb20iLCJOb3RpZmljYXRpb25zRW1haWwiOiJrdW1hd2F0a3Jpc2hhbjY1OEBnbWFpbC5jb20iLCJNYXJrZXRpbmdFbWFpbE9wdEluIjoidHJ1ZSIsIkZhY2Vib29rUHJvZmlsZUxpbmsiOm51bGwsIlR3aXR0ZXJQcm9maWxlTGluayI6bnVsbCwiTGlua2VkSW5Qcm9maWxlTGluayI6bnVsbCwiSXNNZXJnZVYyIjoidHJ1ZSIsIlByb2ZpbGVQaWN0dXJlVXJsIjoiaHR0cHM6Ly90cmFpbGJsYXplci5tZS9wcm9maWxlcGhvdG8vNzI5OFcwMDAwMDFXeGxOL0YiLCJMb2dpblRpbWUiOiIxNjY5ODI5MDk0MTA4IiwiU2lnbnVwU2VydmljZSI6IlRyYWlsYmxhemVyIElkZW50aXR5IiwiU2lnbnVwRGF0ZSI6IjIwMjItMDItMTBUMDU6NDA6MTUuMDAwLTA4MDAiLCJMYXN0TG9naW5JblRpbWUiOiIyMDIyLTExLTMwVDE3OjE1OjE3LjAwMC0wODAwIiwiTGFzdEFjY2VwdGVkVE9TRGF0ZSI6IjIwMjItMDItMTBUMDU6NDM6MDAuMDAwLTA4MDAiLCJMYXRlc3RBY2NlcHRlZFRPU1ZlcnNpb24iOiIxLjIxLjMuMzEiLCJMYXN0TG9nZ2VkSW5Gcm9tIjoic2FsZXNmb3JjZTowMEQ1aTAwMDAwMXZJWkdFQTIwMDU1aTAwMDAwMG9zOE1BQVE6a2t1bWF3YXRAaW5mb3RlY2guY29tOjo6a3VtYXdhdGtyaXNoYW42NThAZ21haWwuY29tIiwiUmVsYXRpb25zaGlwVG9TYWxlc2ZvcmNlIjoiUGFydG5lciIsIlRpdGxlIjoic29mdHdhcmUrY29uc3VsdGFudCtpbnRlcm4iLCJSb2xlIjoiU3R1ZGVudCIsIkNvdW50cnkiOiJJTiIsIlByb2R1Y3QiOm51bGwsIkluZHVzdHJ5IjpudWxsLCJDb21wYW55V2Vic2l0ZSI6bnVsbCwiQ29tcGFueVNpemUiOm51bGwsIkNvbXBhbnlOYW1lIjoiVGhpbmt2aWJlcyIsIkJpbyI6bnVsbCwiSXNQdWJsaWNQcm9maWxlIjoidHJ1ZSIsImJhY2tncm91bmRJbWFnZVVybCI6Imh0dHBzOi8vdHJhaWxibGF6ZXIubWUvcmVzb3VyY2UvMTY2Njc0NzM0NDAwMC9hc3NldHMvYXNzZXRzL2JhY2tncm91bmRzL2FyaWQtZHVuZXMucG5nIiwiVEJJRF9VUkwiOiJra3VtYXdhdHNmZGMiLCJpc19hcHBfaW5zdGFsbGVkIjp0cnVlLCJ1cGRhdGVkX2F0IjoiMjAyMi0xMC0zMVQxMDoxNjozMy4wMDBaIiwidXRjT2Zmc2V0IjotMjg4MDAwMDAsImxvY2FsZSI6ImVuX0dCIiwibGFuZ3VhZ2UiOiJlbl9VUyIsInVzZXJfdHlwZSI6IkNzcExpdGVQb3J0YWwiLCJhY3RpdmUiOnRydWUsInVybHMiOnsiY3VzdG9tX2RvbWFpbiI6Imh0dHBzOi8vdHJhaWxibGF6ZXItaWRlbnRpdHkubXkuc2FsZXNmb3JjZS5jb20ifSwiYWRkcmVzcyI6eyJwb3N0YWxfY29kZSI6bnVsbCwiY291bnRyeSI6IkluZGlhIiwicmVnaW9uIjoiUmFqYXN0aGFuIiwibG9jYWxpdHkiOm51bGwsInN0cmVldF9hZGRyZXNzIjpudWxsfSwiem9uZWluZm8iOiJBbWVyaWNhL0xvc19BbmdlbGVzIiwiZmFtaWx5X25hbWUiOiJLdW1hd2F0IiwiZ2l2ZW5fbmFtZSI6IktyaXNoYW4iLCJlbWFpbCI6Imt1bWF3YXRrcmlzaGFuNjU4QGdtYWlsLmNvbSIsIm5hbWUiOiJLcmlzaGFuIEt1bWF3YXQiLCJuaWNrbmFtZSI6ImtyaXNoYW4ua3VtYXdhdC04MDExNzEwMDg3MTE1Njg2ODEwMiIsInByZWZlcnJlZF91c2VybmFtZSI6ImtrdW1hd2F0c2ZkY0B0cmFpbGJsYXplci5tZSIsIm9yZ2FuaXphdGlvbl9pZCI6IjAwRDFJMDAwMDAxV00xTlVBVyIsInVzZXJfaWQiOiIwMDU4VzAwMDAwOTdTckhRQVUiLCJzdWIiOiJodHRwczovL2xvZ2luLnNhbGVzZm9yY2UuY29tL2lkLzAwRDFJMDAwMDAxV00xTlVBVy8wMDU4VzAwMDAwOTdTckhRQVUifQ==\",\"extProfileUserCmty\":null,\"communityUrl\":\"https://trailblazer.me\"}"); Kingdom`;

    // var profileData = JSON.parse("
    const pos1 = rowData.indexOf('var profileData = ');
    console.log(rowData.substring(pos1 + 30).indexOf(';'));
    console.log(rowData.charAt(pos1 + 30));
    console.log(
      rowData.substring(pos1 + 30, rowData.substring(pos1).indexOf('");')),
    );
  }

  @Get('global')
  getProfileData() {
    return '';
  }

  // @Get('session/:user')
  // setOrGetSession(@Param('user') user: string, @Req() request: FastifyRequest) {
  //   request.session.set('name', user ? user + 1 : 1);
  // }

  @Get('error/:alias')
  async handleErrors(@Param() alias: string) {
    return await this.userService
      .getData(alias)
      .then((res) => {
        // console.log('con ' + res[0]);
        return res;
      })
      .catch((err) => {
        console.log('con error ' + err);
        console.log('con error ' + err.code);
        // if (err.code === 400)
        //   throw new HttpException('Not found', HttpStatus.BAD_REQUEST);
        throw new HttpException(err.message, err.code);
        // console.log('err');
      })
      .then(async (response) => {
        return await this.userService
          .getMoreData()
          .then((res) => {
            // console.log('sec ' + response);
            return {
              first: JSON.parse(JSON.stringify(response)),
              second: JSON.parse(JSON.stringify(res)),
            };
          })
          .catch((err) => {
            console.log('sec error ' + err.code);
            throw new HttpException(
              'more data not found',
              HttpStatus.AMBIGUOUS,
            );
          });
      })
      .then(async (response) => {
        return await this.userService
          .getSomeData()
          .then((res) => {
            // console.log('sec ' + response);
            return {
              first: JSON.parse(JSON.stringify(response)),
              second: JSON.parse(JSON.stringify(res)),
            };
          })
          .catch((err) => {
            console.log('sec error ' + err.code);
            throw new HttpException(err.message, err.code);
          });
      });
  }
}
