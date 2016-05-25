#!/bin/bash

IFS='␞'

video="$1"
subs="$2"
tr_subs="$3"

output='output'
mkdir -p "$output"

for i in $(sed 's/^$/␞/g' "$subs"); do
    line=$(echo "$i" | tail -n +2)
    [[ -z $(echo "$line" | grep -E ' \-\-> ') ]] && continue

    times=$(echo "$line" | head -n +1)
    stamps=$(echo "$times" | grep -Eo '[0-9:.]{9,}')
    text=$(echo "$line" | tail -n +2 | tr '\n' '␞' | sed 's/␞/<br>/g')
    start=$(echo "$stamps" | head -n 1)
    end=$(echo "$stamps" | tail -n 1)

    if [ -f "$tr_subs" ]; then
        tr_text=$(grep -A 10 "$times" "$tr_subs" | awk "/$times/,/^$/" | tail -n +2 | tr '\n' '␞' | sed 's/␞/<br>/g')
    else
        tr_text=''
    fi

    sound="$(echo "${start}_${end}" | sed 's/[.:]/-/g').aac"
    image="$(echo "${start}" | sed 's/[.:]/-/g').jpg"
    ffmpeg -v 0 -n -ss "$start" -i "$video"  -to "$end" -vn -acodec copy "$output/$sound"
    ffmpeg -v 0 -n -ss "$start" -i "$video" -vframes 1 -q:v 5 "$output/$image"

    echo -e "${text}\t${tr_text}\t${image}\t[sound:${sound}]"
done
