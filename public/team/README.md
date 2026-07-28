Team photos. Square crops work best — they are rendered into a 76px circle
with object-fit: cover.

Expected filenames (referenced from app/content.js):
  ramiro.jpg   Ramiro Carnicer
  lilly.jpg    Lilly Guo
  nicole.jpg   Nicole Sikorski

Until a file exists the card falls back to the person's initials, so a
missing or misnamed photo degrades quietly instead of showing a broken
image.
