import mysql.connector

mydb = mysql.connector.connect(
    host="localhost",
    user="root",
    passwd="@Hm$d_2001",
)
mycursor = mydb.cursor()
mycursor.execute('DROP DATABASE IF EXISTS ClinicProto')
mydb.commit()
mycursor.execute("CREATE DATABASE IF NOT EXISTS ClinicProto")
mydb.commit()

mydb = mysql.connector.connect(
    host="localhost",
    user="root",
    passwd="@Hm$d_2001",
    database='ClinicProto'
)
mycursor = mydb.cursor()

mycursor.execute('''
    CREATE TABLE IF NOT EXISTS Users (
    ID INT NOT NULL UNIQUE AUTO_INCREMENT,
    Username VARCHAR(255) NOT NULL UNIQUE,
    Password VARCHAR(60) NOT NULL,
    FirstName VARCHAR(255),
    LastName VARCHAR(255),
    PRIMARY KEY(ID)
    );
''')
mydb.commit()

mycursor.execute('INSERT INTO Users (Username, Password) VALUES ("admin", "admin")')
mydb.commit()

mycursor.execute('''
    CREATE TABLE IF NOT EXISTS Patients (
        ID INT NOT NULL UNIQUE AUTO_INCREMENT,
        Name VARCHAR(255),
        Gender VARCHAR(45),
        BDate DATE,
        Address VARCHAR(255),
        PRIMARY KEY(ID)
    )
''')
mydb.commit()

mycursor.execute('''
    CREATE TABLE IF NOT EXISTS Scans (
        ID INT NOT NULL UNIQUE AUTO_INCREMENT,
        PID INT NOT NULL,
        SDate DATE,
        SImage VARCHAR(255),
        SText VARCHAR(255),
        PRIMARY KEY(ID),
        CONSTRAINT PID_SCAN
            FOREIGN KEY(PID)
            REFERENCES Patients (ID)
    )
''')
mydb.commit