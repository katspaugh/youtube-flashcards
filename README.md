# YouTube Flashcards

Extract screenshots & audio clips from YouTube videos into Anki cards.

## Installation
You'll need to install `youtube-dl` and `ffmpeg`:

```
brew install youtube-dl ffmpeg
```

## Usage
First, download a video that you know to have subtitles in your target language:

```
./download.sh 'https://www.youtube.com/watch?v=5P3Tb_v-KnY'
```

That will download the video and subs into the `./downloads` folder.

Next, extract the cards (it may take a while):

```
./extract.sh Frau_Holle.mp4 Frau_Holle.de.vtt Frau_Holle.en.vtt > cards.tsv
```

Finally, import the cards into Anki:
 * Copy the audio and image files from `./output` to your Anki media collection folder.
 * Import the cards TSV into a deck. There are 4 fields in the TSV: original subtitle, translated subtitle, image and audio.

<img width="635" https://cloud.githubusercontent.com/assets/381895/15532728/a1725666-2261-11e6-99de-7b2403e2cb85.png">
