#!/bin/sh
git -c user.name=infuzz pull origin master
git -c user.name=infuzz add .
git -c user.name=infuzz commit -a -m "Commit by infuzz"
git -c user.name=infuzz push
