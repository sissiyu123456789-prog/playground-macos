import { useState } from "react";

const tiles = [
  ["photo-tile-sky", "photo-tall"],
  ["photo-tile-coral", ""],
  ["photo-tile-lilac", "photo-tall"],
  ["photo-tile-mint", ""],
  ["photo-tile-sun", ""],
  ["photo-tile-blue", "photo-tall"],
  ["photo-tile-peach", ""],
  ["photo-tile-indigo", "photo-tall"]
];

export default function Photo() {
  const [selected, setSelected] = useState<number | null>(null);
  const previous = () => setSelected((value) => value === null ? null : (value + tiles.length - 1) % tiles.length);
  const next = () => setSelected((value) => value === null ? null : (value + 1) % tiles.length);
  return (
    <div className="photo-window size-full">
      <div className="photo-toolbar">
        <div className="font-semibold">Photo</div>
        <div className="photo-toolbar-hint">Your visual stream</div>
      </div>
      <div className="photo-feed">
        {tiles.map(([tone, size], index) => (
          <button
            key={`${tone}-${index}`}
            type="button"
            aria-label={`Open photo ${index + 1}`}
            className={`photo-tile ${tone} ${size}`}
            onClick={() => setSelected(index)}
          />
        ))}
      </div>
      {selected !== null && (
        <div className="photo-lightbox" onClick={() => setSelected(null)}>
          <button className="photo-lightbox-close" type="button" aria-label="Close photo" onClick={() => setSelected(null)}>×</button>
          <button className="photo-lightbox-prev" type="button" aria-label="Previous photo" onClick={(event) => { event.stopPropagation(); previous(); }}>‹</button>
          <button className="photo-lightbox-next" type="button" aria-label="Next photo" onClick={(event) => { event.stopPropagation(); next(); }}>›</button>
          <div
            className={`photo-preview photo-tile ${tiles[selected][0]}`}
            onClick={(event) => event.stopPropagation()}
          />
          <div className="photo-thumbnails" onClick={(event) => event.stopPropagation()}>
            {tiles.map(([tone], index) => (
              <button
                key={`thumb-${tone}-${index}`}
                type="button"
                aria-label={`Select photo ${index + 1}`}
                className={`photo-thumb ${tone} ${selected === index ? "is-selected" : ""}`}
                onClick={() => setSelected(index)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
