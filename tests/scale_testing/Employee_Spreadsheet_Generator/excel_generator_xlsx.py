# Be sure to read the README.md file in its entirety before proceeding

import xlsxwriter   # to create and write to an excel sheet
import math     # to use the ceil function
import sys  # to use command line arguments
import os   # to open the created spreadsheet upon running the script



if len(sys.argv) != 5:  # number of arguments check
    print("There should be exactly 5 arguments.")
    print("Usage:  python excel_generator_xlsx.py [director_count] [director_sr_manager_count] [director_sr_manager_managers_count] [director_sr_manager_managers_people_count]")
    exit()

args = []

for i in range(1, len(sys.argv)):   # creating a new args array while making sure that all entered arguments are integers
    try :
        args.append(int(sys.argv[i]))
    except:
        raise Exception ("All arguments must be non-negative integers")


arg_name_arr = ['director_count', 'director_sr_manager_count', 'director_sr_manager_managers_count', 'director_sr_manager_managers_people_count']

arg_dict = {}

for index in range(len(arg_name_arr)):
    arg_dict[arg_name_arr[index]] = args[index]

print("Args:", arg_dict)    # printing out args array with labels for user to understand them


# CEO is Super Admin
number_of_categories_of_chiefs = 8    # CTO, CPO, CFO, CMO, CSO, CIO, COO, CLO

chief_count = 1    # The number of chiefs of each category
total_chief_count = number_of_categories_of_chiefs * chief_count  # total number of chiefs


director_count = args[0]
director_sr_manager_count = args[1]
director_sr_manager_total_count = director_count * director_sr_manager_count
director_sr_manager_managers_count = args[2]
director_sr_manager_managers_total_count = director_sr_manager_total_count * director_sr_manager_managers_count
director_sr_manager_managers_people_count = args[3]
director_sr_manager_managers_people_total_count = director_sr_manager_managers_people_count * director_sr_manager_managers_total_count
total_non_ELT_count = (director_count + director_sr_manager_total_count + director_sr_manager_managers_total_count +
                       director_sr_manager_managers_people_total_count) * number_of_categories_of_chiefs  # total number of people except for Executive Leadership Team


total_number_of_employees = total_chief_count + total_non_ELT_count    # total number of employees


name_of_file = "scale_" + str(total_number_of_employees) + ".xlsx"
workbook = xlsxwriter.Workbook(name_of_file)   # create xlsx file
worksheet = workbook.add_worksheet()

# setting the column widths
worksheet.set_column('A:A', 10)
worksheet.set_column('B:E', 15)
worksheet.set_column('F:F', 25)
worksheet.set_column('G:G', 15)
worksheet.set_column('H:H', 25)
worksheet.set_column('I:J', 40)
worksheet.set_column('K:K', 33)
worksheet.set_column('L:L', 15)

column_names = ['Employee Id', 'First Name', 'Last Name', 'Joined Date', 'Location', 'Department', 'Employment Type',
                'Title', 'Work Email', 'Personal Email', 'Manager Work Email', 'Personal Number']

for i in range(len(column_names)):  # for loop to fill out the column names
    worksheet.write(0, i, column_names[i])  # row 0, column i



def generic_teams():   # function to get a list that contains all the different employees given the scale
    # we first get the total number of employees in the company

    complete_roles = []

    types = ['Director', 'Sr. Manager','Manager', 'Employee']
    departments = ['Eng.', 'HR','Finance', 'Marketing', 'Sales', 'IT', 'Operations', 'Legal']

    roles = ['Chief Technology Officer', 'Chief People Officer', 'Chief Finance Officer', 'Chief Marketing Officer', 'Chief Sales Officer', 'Chief IT Officer', 'Chief Operations Officer', 'Chief Legal Officer']    # array of all possible roles

    for i in range(len(departments)):   # for loop to add the rest of the roles to the roles array
        for j in range(len(types)):
            roles.append(departments[i] + ' ' + types[j])

    types_count_dict = {'Director': director_count, 'Sr. Manager': director_sr_manager_total_count, 'Manager': director_sr_manager_managers_total_count, 'Employee': director_sr_manager_managers_people_total_count }


    for i in range(len(roles)):     # for loop to append the suffix of each of these employees' roles based on the count specified in the scale
        roles_split = roles[i].split()
        if roles_split[0][0] == 'C':
            for j in range(chief_count):
                complete_roles.append(roles[i])
        elif roles_split[1] == "Director":
            for j in range(types_count_dict[roles_split[1]]):
                complete_roles.append(roles[i] + ' ' + str(j + 1))
        elif roles_split[1] == "Sr." and roles_split[2] == "Manager":
            search_string = "Sr. Manager"
            for j in range(types_count_dict[search_string]):
                complete_roles.append(roles[i] + ' ' + str(j + 1))
        elif roles_split[1] == "Manager":
            for j in range(types_count_dict[roles_split[1]]):
                complete_roles.append(roles[i] + ' ' + str(j + 1))
        elif roles_split[1] == "Employee":
            for j in range(types_count_dict[roles_split[1]]):
                complete_roles.append(roles[i] + ' ' + str(j + 1))


    print("Total Number of Employees:", total_number_of_employees)  # printing the total number of employees for user to verify
    if total_number_of_employees != len(complete_roles):    # code to check if array population was successful
        raise Exception("There was an error in filling in the complete_roles list!")

    return complete_roles



def get_manager(title):    # function to find the manager of a given employee
    hierarchy = ["Director", "Sr. Manager", "Manager", "Employee"]     # listing the roles by order of authority
    man_dict = {'C':'ceo', 'H': 'cpo', 'E':'cto', 'F':'cfo', 'M': 'cmo', 'S': 'cso', 'I': 'cio', 'O':'coo', 'L': 'clo'}     # dictionary that defines the chief officer that a director from a department reports to

    hierarchy_count = [director_count, director_sr_manager_count, director_sr_manager_managers_count, director_sr_manager_managers_people_count] # number of people in the hierarchy
    if title[0] == 'C':     # condition for chief officers
        manager = man_dict[title[0]]    # since all chief officers report to the ceo
        return manager
    else:   # condition for everything else
        arr = title.split() # splitting the complete role of an employee into parts to fetch first and last parts
        first = arr[0]      # department name
        last = arr[len(arr)-1]  # nth employee within that role
        for i in range(len(hierarchy)):
            if hierarchy[i] in title and i != 0:   # for all cases other than when employee is a director
                last  = math.ceil(int(last) / hierarchy_count[i])     # the suffix of the employee's manager given the nth employee
                manager = first + ' ' + hierarchy[i-1] + ' ' + str(last)
                return manager
            elif hierarchy[i] in title and i == 0:   # for the case where the employee is a director
                manager = man_dict[title[0]]    # since it's a director, they report to the relevant chief officer
                return manager




def populate_manager_email():   # function that populates all the manager email fields
    man_arr = []    # array that will be used to populate all the manager email fields

    for i in range(len(complete_roles)):    # for loop to populate man_arr with all the managers of every employee
        manager = get_manager(complete_roles[i])   # calling get_manager to get each employee's manager
        final = ""      # beginning of the code to convert the result from the above call to lowercase to use to create the email field's content
        manager = manager.lower()
        for j in range(len(manager)):
            if manager[j].isalnum():
                final += manager[j]     # end of the code to convert the result from the above call to lowercase to use to create the email field's content

        manager_work_email = final

        man_arr.append(manager_work_email)



    for i in range(len(man_arr)):   # for all elements in man_arr, write them in the correct field with the appended '@mailinator.com' to signify an email id
        worksheet.write(i+1, 10, man_arr[i] + "@mailinator.com")    # row i+1 (since the first row is just the column name), column 10 (manager work email)








def populate_employees():   # function to populate all the fields of the excel sheet, except for manager work email, which was already done above
    for i in range(len(complete_roles)):
        column_id = 0   # variable to store the column we are writing to currently

        # Employee ID
        emp_id = i + 1  # keep incrementing for id starting from 1, as the first employee has id =  1
        worksheet.write(emp_id, column_id, emp_id)
        column_id += 1  # increment column_id after each column write to move on to the next column

        # First Name
        first_name = "Test" + str(emp_id)
        worksheet.write(emp_id, column_id, first_name)
        column_id += 1

        # Last Name
        last_name = "Name" + str(emp_id)
        worksheet.write(emp_id, column_id, last_name)
        column_id += 1

        # Date Joined
        joined = '06/13/2021'   # letting all the join dates be the same for now, even though it's not practical
        worksheet.write(emp_id, column_id, joined)
        column_id += 1

        # Location of Employee
        location = "USA"
        worksheet.write(emp_id, column_id, location)
        column_id += 1

        # Department Employee works in
        department = ''
        if complete_roles[i][0] == 'C':
            department = 'Executive Leadership Team'
        elif complete_roles[i][0] == 'H':
            department = "HR"
        elif complete_roles[i][0] == 'E':
            department = "Engineering"
        elif complete_roles[i][0] == 'F':
            department = "Finance"
        elif complete_roles[i][0] == 'M':
            department = "Marketing"
        elif complete_roles[i][0] == 'S':
            department = "Sales"
        elif complete_roles[i][0] == 'I':
            department = "IT"
        elif complete_roles[i][0] == 'O':
            department = "Operations"
        elif complete_roles[i][0] == 'L':
            department = "Legal"

        worksheet.write(emp_id, column_id, department)
        column_id += 1


        # Employment type: Full Time, Part Time, or Internship
        employment_type = "Full Time"
        worksheet.write(emp_id, column_id, employment_type)
        column_id += 1

        # Employee's Job Title
        title = complete_roles[i]
        worksheet.write(i + 1, column_id, title)
        column_id += 1


        # Employee's Work Email ID
        string = complete_roles[i]  # beginning of the code to convert the employee's job title to lowercase to use to create the work email field's content
        string_arr = string.split()
        if string_arr[0] == 'Chief':
            string = string_arr[0][0] + string_arr[1][0] + string_arr[2][0]
        result = ""
        string = string.lower()
        for j in range(len(string)):
            if string[j].isalnum():
                result += string[j] # end of the code to convert the employee's job title to lowercase to use to create the work email field's content

        work_email = result + "@mailinator.com"
        worksheet.write(emp_id, column_id, work_email)
        column_id += 1


        # Employee's Personal Email ID
        personal_email = result + "_personal@mailinator.com"    # just adding '_personal' next to the employee's work email
        worksheet.write(emp_id, column_id, personal_email)
        column_id += 2      # notice it's incremented by 2 instead of 1 because the manager work email field is filled outside of this function



        # population of manager email should have happened here


        # Employee's Personal Phone Number
        personal_number = str(emp_id) + '012345678'
        worksheet.write(emp_id, column_id, int(personal_number[:10]))   # their phone number is just the first 10 digits from the string consisting of the concatenation of their employee ID followed by '012345678'
        column_id += 1



# calling all the necessary functions
complete_roles = generic_teams()
populate_employees()
populate_manager_email()


workbook.close()

command = 'open ' + name_of_file
print("Name of the spreadsheet created:", name_of_file )
os.system(command)  # command to open the created spreadsheet
