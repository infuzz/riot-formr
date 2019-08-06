#!/bin/sh
git -c user.email=backend@klicat.com -c user.name=infuzz pull origin master
git -c user.email=backend@klicat.com -c user.name=infuzz add .
git -c user.email=backend@klicat.com -c user.name=infuzz commit -a -m "Commit by infuzz"
git -c user.email=backend@klicat.com -c user.name=infuzz push
