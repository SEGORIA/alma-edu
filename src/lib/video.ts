/* Normaliza URLs de YouTube/Vimeo a su forma embebible en <iframe>.
   Acepta la URL ya-embed, watch?v=, youtu.be/, o vimeo.com/. */
export function toEmbedUrl(url: string): string {
  const u = url.trim()
  if (!u) return ''

  // YouTube: youtu.be/ID  o  watch?v=ID
  const ytShort = u.match(/youtu\.be\/([\w-]+)/)
  if (ytShort) return `https://www.youtube.com/embed/${ytShort[1]}`
  const ytWatch = u.match(/[?&]v=([\w-]+)/)
  if (ytWatch) return `https://www.youtube.com/embed/${ytWatch[1]}`
  if (u.includes('youtube.com/embed/')) return u

  // Vimeo: vimeo.com/ID
  const vimeo = u.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`

  // Ya es una URL de embed u otra cosa: úsala tal cual
  return u
}
