export const RegexConstant = {
  PasswordReg: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, // Minimum eight characters, at least one letter, one number and one special character
  ImageReg: /^image\/(jpeg|png|gif)$/,
  PdfReg: /^application\/pdf$/,
  VideoReg: /^video\/(mp4|avi|mkv|wmv|flv|mov|mpeg|webm|ogg|quicktime|x-matroska|x-msvideo|x-ms-wmv|x-flv|3gpp|x-ms-asf|x-m4v|mp2t)$/,
  EmailReg: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
};