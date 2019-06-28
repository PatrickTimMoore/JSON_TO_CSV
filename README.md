# JSON_TO_CSV

COPYRIGHT OF PATRICK MOORE AND NORTHRIDGE PREP

Author: Patrick Moore

Version: 1.1

Date: 6/28/2019

This code is a convertion tool developed to aid viewing RE-Integration change logs by converting the respective .txt file to a .csv.
Please enter the FULL .txt file name on line 26.

## Example of changelog.txt input:
123:\n
    { "first": "John, D", "middle": undefined } => { "first": "John", "middle": "D" }\n
456:\n
    { "first": "Will", "middle": "S" }\n

## Example of changelog.csv output:
lookup ID,old "first",old "middle",new "first",new "middle"\n
123,"John, D",undefined,"John","D"\n
456,"Will","S"\n
