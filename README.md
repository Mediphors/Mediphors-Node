# Mediphors-Node

## Installation

The listed libraries were used in the development of the project and must be installed for the code to properly run.
Use the package manager [pip](https://pip.pypa.io/en/stable/) to install [scrapy](https://scrapy.org/) and [xlwt](https://pypi.org/project/xlwt/).

```bash
pip install scrapy
pip install xlwt
```

## Usage
To run the program to retrieve N pages while N is an int. The program can be run with N set to 60 as default as well.

```bash
python main.py 100 # to run with N
python main.py # to run with N=60 as default
```

Once the program is ran it will create the index and prompt the user to enter a word to search. If the user enters 'stop' (case-insensitive) the program will cease execution. 
```bash
Enter a query: smu moore # to search for 'smu moore' in the index
Enter a query: stop # to stop the program
```
The program will first parse the query into individual tokens and determine if each token is a word and if the word is in the index. If it is then the program will calculate the weights of each word in the documents that each token is in using NTC similarity. Then the program calculates the query weight of each token and calcualtes the q prime number for each token. Using this data the program calculates the NTC.NTC document score of each document containing the tokens. If the token is in the title of a document then .1 is added to the score of the document. The program then prints out the top documents and scores up to the top 5 documents. Finally the program prompts the user for another query and repeats this cycle indefinitely until the word stop is inputted. 
