#!/bin/bash

IFS='␞'
MIN_WORDS=5

video="$1"
subs="$2"
tr_subs="$3"

now=$(date '+%Y-%m-%d-%H-%M')
output='output'
mkdir -p "$output"

for i in $(sed 's/^$/␞/g' "$subs"); do
    line=$(echo "$i" | tail -n +2)
    [[ -z $(echo "$line" | grep -E ' \-\-> ') ]] && continue

    if [[ -z $(echo "$line" | head -n +1 | grep -E ' \-\-> ') ]]; then
        line=$(echo "$line" | tail -n +2)
    fi

    text=$(echo "$line" | tail -n +2 | tr '\n' '␞' | sed -E 's/␞$//' | sed -E 's/␞+/<br>/g')
    IFS=' ' words=($text)
    len="${#words[@]}"

    [[ len -lt MIN_WORDS ]] && continue

    times=$(echo "$line" | head -n +1)
    stamps=$(echo "$times" | grep -Eo '[0-9:.]{9,}')

    start=$(echo "$stamps" | head -n 1)
    end=$(echo "$stamps" | tail -n 1)

    if [[ -f "$tr_subs" ]]; then
        tr_text=$(grep -A 10 "$times" "$tr_subs" | awk "/$times/,/^$/" | tail -n +2 | tr '\n' '␞' | sed -E 's/␞$//' | sed -E 's/␞+/<br>/g')
    else
        tr_text=''
    fi

    sound="$(echo "${now}__${start}_${end}" | sed 's/[.:]/-/g').mp3"
    image="$(echo "${now}__${start}" | sed 's/[.:]/-/g').jpg"
    ffmpeg -threads 4 -v 0 -n -i "$video" -ss "$start" -to "$end" -q:a 10 -map a "$output/$sound"
    ffmpeg -threads 4 -v 0 -n -ss "$start" -i "$video" -vframes 1 -q:v 10 "$output/$image"

    echo -e "${text}\t${tr_text}\t<img src=\"${image}\">\t[sound:${sound}]"
done
