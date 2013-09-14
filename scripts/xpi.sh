#! /bin/bash

set -x

cd $1
source ./bin/activate
cd $2
cfx xpi
