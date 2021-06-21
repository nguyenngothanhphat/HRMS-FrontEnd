# About
Python Script to generate an Excel sheet that simulates a company with employees on a scale of your preference.

##Departments in the company:

* Executive Leadership Team
* Engineering
* HR
* Finance
* Marketing
* Sales 
* IT
* Operations
* Legal

** We are referring to the Executive Leadership Team as a department for generality's sake.

<br>


###Executive Leadership Team: 
The Executive Leadership Team reports to the CEO. The Executive Leadership Team consists of the following people:

* Chief Technology Officer   : &nbsp;&nbsp;  Engineering
* Chief People Officer       : &nbsp;&nbsp;  HR         
* Chief Finance Officer      : &nbsp;&nbsp;  Finance    
* Chief Marketing Officer    : &nbsp;&nbsp;  Marketing  
* Chief Sales Officer        : &nbsp;&nbsp;  Sales      
* Chief IT Officer           : &nbsp;&nbsp;  IT         
* Chief Operations Officer   : &nbsp;&nbsp;  Operations 
* Chief Legal Officer        : &nbsp;&nbsp;  Legal      


###Hierarchy:
* You choose the number of Directors, Senior Managers, Managers, and employees under managers.

* All directors of a department report to the relevant Chief Officer. All directors have some number of Senior Managers under them. All Senior Managers have some number of managers under them. All managers have some number of employees under them.    
 


# Rundown of Arguments


###Argument 1:
* <b>director_count</b>: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; The number of directors per department. 

###Argument 2:
* <b>director_sr_manager_count</b>: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; The number of senior managers under each director per department.

###Argument 3:
* <b>director_sr_manager_managers_count</b>: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; The number of managers under each senior manager for every director of a department.

###Argument 4:
* <b>director_sr_manager_managers_people_count</b>: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; The number of people under each manager under each senior manager for every director of a department.
  

<br>




# Commands to Run Python Script

<b>Note that you are supposed to be in shell / base mode when running this script. If you are in the Python Virtual Environment (venv), exit out of it with the following command:</b>
```sh
$ deactivate
```

# Installing XlsxWriter
This is the package required to create and write to a spreadsheet.

```sh
pip install xlsxwriter
```

##Recommended commands to run script

###Small Scale ~ 90 people: 
```sh
$ python excel_generator_xlsx.py 1 1 2 3
```
  
###Normal Scale ~ 500 people:
```sh
$ python excel_generator_xlsx.py 2 1 3 9  
```
  
###Medium Scale ~ 1000 people: 
```sh
$ python excel_generator_xlsx.py 2 3 3 6     
```

###Large Scale ~ 5000 people: 
```sh
$ python excel_generator_xlsx.py 4 4 4 9     
```

<br>

## To View The Generated Sheet After Making A Change In The Code

You can find the name of the generated spreadsheet from the console where it was printed out. 

###Command: 
```sh
$ open [generated_spreadsheet's name] 
```

<b>Close the sheet manually and reopen it with the above command every time you make a change and need the result refreshed.</b> 


<br>
<br>