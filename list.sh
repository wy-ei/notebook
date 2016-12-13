#!/bin/bash
# 为每个目录生成列表

files=`find . -name "*.md"`
out=''
for file in $files
do
    content=`head $file | grep -E -o "title:\s(.+?)$"`
    title=`echo ${content#*:}`
    if [[ -n $title ]]
    then
        echo "- [$title]($file)"
    fi
done
