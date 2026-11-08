const MAX_FILE_SIZE = 4 * 1024 * 1024

const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp']
const DOCUMENT_EXTENSIONS = ['pdf', 'docx']

type FileKind = 'image' | 'file'

function getAllowedExtensions(kind: FileKind) {
  return kind === 'image'
    ? IMAGE_EXTENSIONS
    : [...IMAGE_EXTENSIONS, ...DOCUMENT_EXTENSIONS]
}

function getAccept(kind: FileKind) {
  return getAllowedExtensions(kind)
    .map((extension) => `.${extension}`)
    .join(',')
}

function getFileError(file: File, kind: FileKind) {
  const extension = file.name.split('.').pop()?.toLowerCase() ?? ''
  const allowedExtensions = getAllowedExtensions(kind)
  if (!allowedExtensions.includes(extension)) {
    return `Dozwolone formaty: ${allowedExtensions.join(', ')}.`
  }
  if (file.size > MAX_FILE_SIZE) {
    return 'Plik może mieć najwyżej 4 MB.'
  }
  return null
}

export { getAccept, getFileError, type FileKind }
