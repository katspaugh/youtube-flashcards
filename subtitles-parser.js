function parseTimestamp(ts) {
  const delim = ':'
  let parts = ts.split(delim);

  // Normalize vtt/srt differences
  if (parts.length == 2) {
    parts.unshift('00');
  }
  parts[2] = parts[2].replace(/,/, '.');

  let hours = parseFloat(parts[0]) * 60 * 60 * 1000;
  let minutes = parseFloat(parts[1]) * 60 * 1000;
  let seconds = parseFloat(parts[2]) * 1000;

  return {
    ms: hours + minutes + seconds,
    full: parts.join(delim)
  };
}

function encodeTimestamp(ms) {
  let pad = (num, digits) => ('0000' + num).slice(-digits);

  let date = new Date(2000, 0, 1, 0, 0, 0, ms);

  return [
    pad(date.getHours(), 2),
    pad(date.getMinutes(), 2),
    pad(date.getSeconds(), 2) + '.' + pad(date.getMilliseconds(), 3)
  ].join(':');
}

function parseSubtitles(subtitles) {
  const timestampsDelim = ' --> ';
  const lineDelim = '\n\n';

  return subtitles.split(lineDelim)
    .map((line, index) => {
      try {
        let parts = line.split('\n');
        let id = parts[0].indexOf(timestampsDelim) > -1 ? index.toString() : parts.shift();
        let timestamps = parts[0].split(timestampsDelim).map(parseTimestamp)

        return {
          id: id,
          start: timestamps[0].ms,
          end: timestamps[1].ms,
          startTime: timestamps[0].full,
          endTime: timestamps[1].full,
          text: parts.slice(1).join('<br />')
        };
      } catch (e) {
        return null;
      }
    })
    .filter(Boolean);
}

module.exports = {
  parse: parseSubtitles,
  encodeTimestamp: encodeTimestamp
};
