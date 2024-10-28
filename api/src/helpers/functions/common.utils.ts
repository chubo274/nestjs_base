import moment from 'moment';
import { customAlphabet } from 'nanoid';
import path from 'path';
import { COMMON_CONSTANT } from 'src/helpers/constants/common.constant';
import { MediaType } from 'src/helpers/constants/enum.constant';
import { RegexConstant } from 'src/helpers/constants/regex.constant';
import * as XLSX from 'xlsx';

// const configService = new BackendConfigService(new ConfigService());

export function getTimeFromNow(minutes = 0) {
  const now = new Date();
  now.setMinutes(now.getMinutes() + minutes);
  return now;
}

export function getDateFromNowByMonth(month = 0) {
  const now = new Date();
  now.setMonth(now.getMonth() + month);
  return now;
}

export function _excludeObject<T, Key extends keyof T>(
  user: T,
  keys: Key[],
): Omit<T, Key> {
  for (const key of keys) {
    delete user[key];
  }
  return user;
}

export function hasRequiredProperties(properties: Array<string>, obj) {
  return properties.every(
    (prop) => obj.hasOwnProperty(prop) && obj[prop] !== null,
  );
  // return obj.hasOwnProperty('type') && obj.hasOwnProperty('count');
}

export function _hasRequiredProperties<T,>(properties, obj: T) {
  return properties.every(
    (prop) => obj.hasOwnProperty(prop) && obj[prop] !== null,
  );
  // return obj.hasOwnProperty('type') && obj.hasOwnProperty('count');
}

export function sortObject(obj) {
  const sorted = {};
  const str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
  }
  return sorted;
}

export function isEmptyObject(obj: object): boolean {
  return Object.keys(obj).length === 0;
}

export function generateCustomAlphaBet() {
  const nanoid = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 10);
  return nanoid()
}
export async function getSMSTemplate(template: string, data: any) {
  function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
  }
  const keys = Object.keys(data);
  if (keys.length > 0) {
    for (const key of keys) {
      if (data[key]) {
        template = replaceAll(template, '<' + key + '>', data[key]);
      }
    }
  }
  return template;
}
export function getCreatedAtNotification() {
  return moment().format(COMMON_CONSTANT.NOTIFY_FORMAT_TIME);
}

export function parseQueryString(queryString: string): Record<string, string> {
  const params = new URLSearchParams(queryString);
  const result: Record<string, string> = {};

  params.forEach((value, key) => {
    result[key] = value;
  });

  return result;
}

export function mimeTypeToMediaType(mimeType: string) {
  console.info(mimeType)
  if (RegexConstant.ImageReg.test(mimeType))
    return MediaType.IMAGE
  if (RegexConstant.VideoReg.test(mimeType))
    return MediaType.VIDEO
  if (RegexConstant.PdfReg.test(mimeType))
    return MediaType.PDF
}

export function concatValueInObject(obj) {
  let result = '';

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === 'string') {
        result += obj[key];
      }
    }
  }

  return result;
}

export function getApiAndMethodFromRequest(request: Request) {
  const API_PREFIX = 'api/v1'
  let url = request.url.split(API_PREFIX)[1]
  if (request.method === 'GET') {
    if (request.url.includes('?'))
      url = url.split('?')[0]
  }
  const method = request.method
  return `${method} ${url}`
}

export function getDates(startDate, endDate) {
  const dates = [];
  const currentDate = new Date(startDate);
  const lastDate = new Date(endDate);

  while (currentDate <= lastDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}


// Function to export data to Excel
export async function exportToExcel(data: any[], headers: any[], name?: string) {
  // Create a new workbook
  const wb = XLSX.utils.book_new();
  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
  XLSX.utils.sheet_add_aoa(ws, [headers], {
    origin: 'A1',
  });

  XLSX.utils.sheet_add_json(ws, data, {
    origin: 'A2',
    skipHeader: true,
  });

  const fileName = name ? `${name}_${moment().format('HHmmSSSDDMMYYYY')}.xlsx` : `${moment().format('HHmmSSSDDMMYYYY')}.xlsx`;
  const folderPath = path.resolve(
    __dirname,
    '..',
    '..',
    '..',
    'public',
    'excels',
    fileName,
  );

  XLSX.utils.book_append_sheet(wb, ws, name);
  await XLSX.writeFile(wb, folderPath);
  return fileName
}

export function* chunkArray<T>(arr: T[], n: number): Generator<T[], void> {
  for (let i = 0; i < arr.length; i += n) {
    yield arr.slice(i, i + n);
  }
}