const fs = require('fs');
const path = require('path');
const spawnSync = require('child_process').spawnSync;
const parseSubtitles = require('./subtitles-parser.js').parse;
const encodeTimestamp = require('./subtitles-parser.js').encodeTimestamp;

function padTimestamps(subs) {
  const startPadding = 300;
  const endPadding = 300;

  return subs.map((sub) => {
    let start = sub.start - startPadding;
    let end = sub.end + endPadding;

    return Object.assign({}, sub, {
      start: start,
      end: end,
      startTime: encodeTimestamp(start),
      endTime: encodeTimestamp(end),
      middleTime: encodeTimestamp((sub.start + sub.end) / 2)
    });
  });
}

function filterSubs(subs) {
  let minLength = 20;
  let minDuration = 1000;

  return subs.filter((sub) => {
    return sub.text.length >= minLength && (sub.end - sub.start) >= minDuration;
  });
}

let videoFile = process.argv[2]
let originalSubsFile = fs.readFileSync(process.argv[3]).toString();
let origSubs = padTimestamps(filterSubs(parseSubtitles(originalSubsFile)));
let translationSubs;

if (process.argv[4]) {
  let translationSubsFile = fs.readFileSync(process.argv[4]).toString();
  translationSubs = padTimestamps(parseSubtitles(translationSubsFile));
}

let batchId = 'videocards_' + Math.random().toString(32).slice(2);
let outputDir = path.resolve(process.cwd(), batchId);

spawnSync('mkdir', [ '-p', outputDir ]);

origSubs.forEach((sub) => {
  let fileName = [ batchId, sub.startTime, sub.endTime ].join('_').replace(/[.:]/g, '-');
  let soundFile = fileName + '.mp3';
  let imageFile = fileName + '.jpg';

  console.log(`${ sub.startTime } --> ${ sub.endTime } ✓`);

  spawnSync('ffmpeg', [ '-vn', '-i', videoFile, '-ss', sub.startTime, '-to', sub.endTime, '-q:a', 10, path.resolve(outputDir, soundFile) ]);
  spawnSync('ffmpeg', [ '-v', 0, '-n', '-ss', sub.middleTime, '-i', videoFile, '-vframes', 1 ,'-q:v', 10, path.resolve(outputDir, imageFile) ]);

  let matchingSub;
  if (translationSubs) {
    matchingSub = translationSubs.filter((sub) => sub.start == sub.start && sub.end == sub.end);
  }
  let data = [ sub.text, matchingSub ? matchingSub.text : '', `[sound:${ soundFile }]`, `<img src="${ imageFile }" />` ];
  fs.appendFileSync(path.resolve(outputDir, '_videocards.txt'), data.join('\t') + '\n');
});

try {
  spawnSync('open', [ outputDir ]);
} catch (e) {
}

console.log(`✓ All done! The cards are ready in ${ outputDir }`);
