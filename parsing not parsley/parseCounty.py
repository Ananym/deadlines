#ohello
import csv

dialect = csv.excel()
dialect.delimiter = "|"

def parse(filename):
    with open(filename,'r') as f:
        reader = csv.reader(f,dialect)
        rows = list(reader)
    
#here i am