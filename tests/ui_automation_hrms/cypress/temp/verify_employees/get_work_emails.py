import sys  # to use command line arguments
import csv   # csv library


if len(sys.argv) != 2:  # number of arguments check
    print("There should be exactly 2 arguments.")
    print("Usage:  python get_work_emails.py [name_of_csv_file]")
    exit()

filename = sys.argv[1]

# initializing the rows list
rows = []

# reading csv file
with open(filename, 'r') as csvfile:
  # creating a csv reader object
  csvreader = csv.reader(csvfile)

  # extracting field names through first row
  fields = next(csvreader) # in case you want to find out the field names

  # extracting each data row one by one
  for row in csvreader:
    rows.append(row)

work_emails = []

for i in range(len(rows)):
  work_emails.append(rows[i][8]) # 8 is the index of the row with the work emails


print(work_emails)


