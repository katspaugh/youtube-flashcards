#!/bin/bash

output='./downloads'
mkdir -p "$output"

youtube-dl --all-subs --convert-subs vtt -o "$output"'/%(title)s.%(ext)s' "$1"
