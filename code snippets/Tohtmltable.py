
#Setup the environment 
# This code is used to convert a pandas dataframe to an HTML table and save it as an HTML file.
# changing directory to the location of the file
import os
os.chdir("C:\\Users\\mklav\\Documents\\GitHub\\Taekwondo-Teori\\code snippets")


#importing the required libraries data manipulation and analysis and data visualization
import numpy as np
import pandas as pd
import dplython as dpl
from dplython import (DplyFrame, 
                      X, 
                      diamonds, 
                      dfilter,
                      select,
                      sift, 
                      sample_n,
                      sample_frac, 
                      head, 
                      arrange,
                      mutate,
                      nrow,
                      group_by,
                      summarize, 
                      DelayFunction) 
# importing the required libraries data import
import gspread as gspread
from oauth2client.service_account import ServiceAccountCredentials

gc = gspread.service_account(filename="GsheetAccess.json")
#scope = ["https://www.googleapis.com/auth/spreadsheets", "https://www.googleapis.com/auth/drive.files", "https://www.googleapis.com/auth/drive"] 
#creds = ServiceAccountCredentials.from_json_keyfile_name("GsheetAccess.json", scope)

#gspread.authorize(creds)


sheet = gc.open("Begrebs liste TKD").sheet1

data = sheet.get_all_records()

df = DplyFrame(data)

#end of the setup ###############################################################

# setting up filter. 
# Vælg niveau (bælgegrad) og område samt navnet på tabellen
Niveau = 8
Område = "Teori"
tabelNavn = "8.Kup Teori"
lokation = "C:\\Users\\mklav\\Documents\\GitHub\\Taekwondo-Teori\\Graduering\\Pensum tabeller\\" + tabelNavn + ".html"

#end filter setup ###############################################################

dffortable = df >> sift(X.bæltegrad == Niveau) >> sift(X.Område == Område) >> select(X["Teknik koreansk"], X["Teknik Dansk"]) 


html_title = f"""
<html>
<head>
    <meta charset="UTF-8">
    <title>{tabelNavn}</title>
    <style>
        body {{
            font-family: Arial, sans-serif;
            margin: 20px;
            background-color: #f5f5f5;
        }}
        h2 {{
            text-align: center;
            color: #333;
        }}
        table.dataframe {{
            width: 80%;
            margin: 0 auto;
            border-collapse: collapse;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            background-color: #fff;
        }}
        table.dataframe th,
        table.dataframe td {{
            padding: 10px;
            border: 1px solid #ddd;
        }}
        table.dataframe th {{
            background-color: #4CAF50;
            color: #fff;
            text-align: center;
        }}
        table.dataframe tr:nth-child(even) {{
            background-color: #f9f9f9;
        }}
        table.dataframe tr:hover {{
            background-color: #e1f5e1;
        }}
    </style>
</head>
<body>
    <h2 style="text-align:center;">{tabelNavn}</h2>
"""

# Generate the HTML table
html_table = dffortable.to_html(index=False, justify="center", border=0, classes="dataframe table")

# Combine title and table
html_content = html_title + html_table + """
</body>
</html>
"""

# Write to file
with open(lokation, "w", encoding="utf-8") as f:
    f.write(html_content)