import os

class Label:
    def __init__(self, city, longitude, latitude, date):
        self.city = city
        self.longitude = longitude
        self.latitude = latitude
        self.date = date
        self.count = 0

    def increase(self, count):
        self.count +=count

    def output(self):
        return '{self.city},{self.count},{self.date},{self.longitude},{self.latitude}'.format(self=self)
#============================================================
citymap={} #check if a word is a city
table={} #key is city+date and value is Label
def readmap():
    inputfile=open('table.txt')
    line=inputfile.readline()
    while line!="":
        words=line.split(',')
        words[0]=words[0].lower()
        citymap[words[0]] = Label(words[0], words[1], words[2], '')
        line=inputfile.readline()

def lookupmap(word):
    for city in citymap.keys():
        if word in city and len(word) / len(city)>0.7 and word[0]==city[0]:
           # print(word+" "+city)
            return citymap[city]
    return None
        
def process(company):
    os.chdir('./'+company+'/docs.stas/')
    filesbydate = os.listdir()
    for filebydate in filesbydate:
        date=filebydate # get the date
        os.chdir('./'+filebydate)
        filesindate = os.listdir()
        #in directory date
        for fileindate in filesindate:
            filein=open(fileindate)
            while True:
                try:
                    line=filein.readline()
                except:
                    continue
                if line=='':
                    break
                else:
                    processline(line,date)
        os.chdir('..')
    os.chdir('../../') # reset to the init directory
    
def processline(line,date):
    words=line.split(" ") # words[0]=city, words[1]=count

    city=lookupmap(words[0]) #check if the word is city and return the city
    try:
        count=int(words[1])
    except:
        print('processline error:')
        print(words)
        return
    #if the word is a city, then we get the cityname+date as key
    #and insert it into table
    if city is not None:
        #check if the key is exist in table
        key=city.city+date
        if key in table.keys():
            table[key].increase(count)
        else:
            table[key] = Label(city.city, city.longitude, city.latitude, date)
            table[key].increase(count)
            
def outputfile():
    outfile=open("generatetable.csv",'w')
    for key in table.keys():
        outfile.write(table[key].output())
    outfile.close()

def main():
    readmap()
    process('Sony')
    outputfile()

main()
    
