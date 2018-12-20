export function sanitizeHtmlString(htmlString) {
  return (
    htmlString
      // Remove space characters after opening tags
      .replace(/>\s+/g, '>')
      // Remove space characters before closing tags
      .replace(/\s+</g, '<')
      // remove lit-html expression markers
      .replace(/<!---->/g, '')
      // Remove leading and trailing whitespace
      .trim()
  );
}
