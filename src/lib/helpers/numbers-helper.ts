export default class NumbersHelper{
    static toArabicDigits(value: string | number) {
    return value.toString().replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[+d]);
    }

    static toEnglishDigits(value: string) {
      return value.replace(/[٠-٩]/g, (d) => "0123456789"["٠١٢٣٤٥٦٧٨٩".indexOf(d)]);
    }
}