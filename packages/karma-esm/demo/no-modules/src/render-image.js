export function renderImage() {
  const dir = new URL('./', import.meta.url);
  const img = document.createElement('img');
  img.src = `${dir}logo.png`;
  document.body.appendChild(img);
}
