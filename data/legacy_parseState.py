#ohello
import csv
import re
import pprint
from collections import ChainMap

dialect = csv.excel()
dialect.delimiter = "|"
pp = pprint.PrettyPrinter(indent=4)

dayAbbreviations = {"M":"Monday", "T": "Tuesday", "W": "Wednesday", "Th": "Thursday", "F": "Friday", "S": "Saturday", "Su": "Sunday"}
days = list(dayAbbreviations.values())

def parseState(filename):
    m = re.match("(.+?)\\.csv",filename)
    assert m
    stateName = m.group(0)
    stateResults = []
    with open(filename,'r') as f:
        reader = csv.reader(f,dialect)
        #skip headers
        next(reader)
        for row in reader:
            stateResults.append(parseCounty(row))
    return {stateName: dict(ChainMap(*stateResults))}
    
#there it goes
def parseCounty(row):
    countyName = row[0]
    deadlinesForDays = parseDeadlines(row[2])
    publicationDays = [r.strip() for r in row[1].split(",")]
    if 'Daily' in publicationDays:
        publicationDays = days
    deadlinesForPublicationDays = dict()
    for pd in publicationDays:
        deadlinesForPublicationDays[pd] = deadlinesForDays[pd] if pd in deadlinesForDays else deadlinesForDays["default"]
    return {countyName:deadlinesForPublicationDays}

def parseDeadlines(deadlinesRaw):
    rawDeadlines = [r.strip() for r in deadlinesRaw.split("/")]
    deadlinesForDays = dict()
    for rd in rawDeadlines:
        m = re.match("(\w\w?)-(\w\w?): (.*)",rd)
        if m:
            days = parseDayRange(m.group(1),m.group(2))
            deadlineRaw = m.group(3)
        else:
            m = re.match("(\w\w?): (.*)",rd)
            if m:
                days = [dayAbbreviations[m.group(1)]]
                deadlineRaw = m.group(2)
            else:
                days = ["default"]
                deadlineRaw = rd
        for d in days:
            deadlinesForDays[d] = parseDeadline(deadlineRaw,d)
    return deadlinesForDays


def parseDeadline(deadlineRaw,day):
    #"6 days prior @ 5pm" <- parses anything that looks like this, doesn't handle the day range at the start
    #or like this, "Thursday @ 5pm"
    m = re.search("(\d) days? prior @ (.+m)",deadlineRaw)
    if m:
        return {"daysPrior":m.group(1),"time":m.group(2)}
    else: #<- with this else
        m = re.match("(\w+) @ (.+m)",deadlineRaw)
        if m:
            targetIndex, currentIndex = days.index(m.group(1)), days.index(day) 
            daysPrior = currentIndex - targetIndex
            if daysPrior < 0:
                daysPrior += 7
            return {"daysPrior":daysPrior, "time":m.group(2)}
        else:
            raise RuntimeError("unhandlable deadline", deadlineRaw, day)

def parseDayRange(start,end):
    startDay, endDay = dayAbbreviations[start], dayAbbreviations[end]
    startIndex = days.index(startDay)
    remaining = (days+days)[startIndex:]
    endIndex = remaining.index(endDay)
    return remaining[:endIndex+1]

if __name__=="__main__":
    print("Preview mode")
    filename = input("gimmie filename of csv in cwd:")
    pp.pprint(parseState(filename))