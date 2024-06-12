export const RegexConstant = {
  PasswordReg: '^(?=.*[a-zA-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+])(?!.*\\s).{6,32}$',
  EmailReg: '^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$',
  ImageReg: /(^image)(\/)[a-zA-Z0-9_]*/gm,
  PdfReg: 'application\/pdf',
  VideoReg: '^video\/(mp4|avi|mkv|wmv|flv|mov|mpeg|webm|ogg|quicktime|x-matroska|x-msvideo|x-ms-wmv|x-flv|3gpp|x-ms-asf|avi\/x-matroska|x-m4v|mp2t)$'
};