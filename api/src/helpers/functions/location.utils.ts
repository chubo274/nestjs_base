import subVn from 'area-vn';

export function getProvinces() {
  return subVn.getProvinces();
}

export function getDistricts() {
  return subVn.getDistricts();
}

export function getWards() {
  return subVn.getWards();
}

export function getProvinceByProvinceCode(code: string) {
  return subVn.getProvinceByProvinceCode(code);
}

export function getDistrictByDistrictCode(code: string) {
  return subVn.getDistrictByDistrictCode(code);
}

export function getWardByWardCode(code: string) {
  try {
    return subVn.getWardByWardCode(code);
  } catch (error) {
    return error;
  }
}

export function getDistrictsByProvince(provinceCode: string) {
  return subVn.getDistrictsByProvinceCode(provinceCode);
}

export function getWardsByDistrict(district: string) {
  return subVn.getWardsByDistrictCode(district);
}
