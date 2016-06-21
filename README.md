# YouTube Flashcards

Extract screenshots & audio clips from YouTube videos into Anki cards.

## Installation
You'll need to install `youtube-dl` and `ffmpeg`:

```
brew install youtube-dl ffmpeg
```

## Usage

### Download
First, download a video that you know has subtitles in your target language:

```
./download.sh 'https://www.youtube.com/watch?v=5P3Tb_v-KnY'
```

That will download the video and subs into the `./downloads` folder.

### Extract
Next, extract the cards (it may take a while):

```
./extract.sh downloads/Frau_Holle.mp4 downloads/Frau_Holle.de.vtt downloads/Frau_Holle.en.vtt > cards.tsv
```

The parameters are:
 * The video file
 * The subtitles file in your target language
 * Optionally: the subtitles file in your native language

### Import
Finally, import the cards into Anki:
 * Copy the audio and image files from `./output` to your Anki media collection folder.
 * Import the cards TSV into a deck. There are 4 fields in the TSV: original subtitle, translated subtitle, image and audio.

<img width="635" alt="screen shot 2016-05-25 at 10 15 31" src="https://cloud.githubusercontent.com/assets/381895/15532887/455f63d6-2262-11e6-8533-8db8fad228a7.png">

## Offline videos
You can also create cards from local files other than from YouTube. The script requires that the subtitles are in the VTT format. To convert from SRT and other formats, use http://www.webvtt.org/ or https://github.com/nwoltman/srt-to-vtt-converter.
