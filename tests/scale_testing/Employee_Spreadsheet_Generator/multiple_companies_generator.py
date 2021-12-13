import sys  # to use command line arguments
import os   # to open the created spreadsheet upon running the script


if len(sys.argv) != 7:  # number of arguments check
    print("There should be exactly 6 arguments.")
    print("Usage:  python multiple_companies_generator.py [director_count] [director_sr_manager_count] [director_sr_manager_managers_count] [director_sr_manager_managers_people_count] [company_name_prefix] [number_of_companies]")
    exit()

args = []

for i in range(1, len(sys.argv)):   # creating a new args array while making sure that all entered arguments are integers
    if i == 5:
      args.append(sys.argv[i])
      continue
    try :
        args.append(int(sys.argv[i]))
    except:
        raise Exception ("All arguments except for the name of company must be non-negative integers")

arg_name_arr = ['director_count', 'director_sr_manager_count', 'director_sr_manager_managers_count', 'director_sr_manager_managers_people_count', 'company_name_prefix', 'number_of_companies']

arg_dict = {}

for index in range(len(arg_name_arr)):
    arg_dict[arg_name_arr[index]] = args[index]

print("Main Args:", arg_dict)    # printing out args array with labels for user to understand them


# GENERATE COMMAND BASE

command = 'python excel_generator_xlsx.py '
for i in range(len(args) - 1): # only go until the company name prefix
  if i == len(args) - 2:
    command += '"' + args[i] + " "
    continue
  command += str(args[i]) + " "


# Use the base command to create all the files using the previously created Python Script
for i in range(arg_dict['number_of_companies']):
  cur_command = command + str(i+1) + '"'
  os.system(cur_command)

os.system("rm -rf *.xlsx") # get rid of any xlsx files that are created

os.system("mkdir -p sheets/" + '"' + arg_dict['company_name_prefix'] + '"') # create a directory to store the sheets if it doesn't already exist
os.system("mv *.csv sheets/" + '"' +  arg_dict['company_name_prefix'] + '"') # move all the CSV files to the relevant 'sheets' directory


# COMMENT THE LINE BELOW IF YOU DON'T WANT THE GENERATED SHEETS TO OPEN IMMEDIATELY
os.system("open sheets/" + '"' +  arg_dict['company_name_prefix'] + '"/*.csv')

