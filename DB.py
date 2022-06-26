import mysql.connector

mydb = mysql.connector.connect(
    host="localhost",
    user="root",
    passwd="root",
)
mycursor = mydb.cursor()
mycursor.execute('DROP DATABASE IF EXISTS ClinicProto')
mydb.commit()
mycursor.execute("CREATE DATABASE IF NOT EXISTS ClinicProto")
mydb.commit()

mydb = mysql.connector.connect(
    host="localhost",
    user="root",
    passwd="root",
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
        Age INT,
        Address VARCHAR(255),
        PRIMARY KEY(ID)
    )
''')
mydb.commit()

mycursor.execute('''
    CREATE TABLE IF NOT EXISTS Scans (
        ID INT NOT NULL UNIQUE AUTO_INCREMENT,
        PID INT NOT NULL,
        SDate VARCHAR(255),
        Image1 LONGBLOB,
        Image2 BLOB,
        Image3 BLOB,
        Image4 BLOB,
        Image5 BLOB,
        Image6 BLOB,
        Image7 BLOB,
        Image8 BLOB,
        PRIMARY KEY(ID),
        CONSTRAINT PID_SCAN
            FOREIGN KEY(PID)
            REFERENCES Patients (ID)
    )
''')
mydb.commit

mycursor.execute(""" 
    CREATE TABLE Examinations( 
        ID INT NOT NULL UNIQUE AUTO_INCREMENT, 
        PID INT, 
        Date VARCHAR(255), 
        Pulse INT,
        PulseType VARCHAR(10),
        CO INT,
        BPS INT, 
        BPD INT, 
        RR INT, 
        Chest VARCHAR(45),
        HT1 INT,
        HT2 VARCHAR(15),
        HT3 VARCHAR(255),
        ABD VARCHAR(255), 
        LL BOOLEAN,
        Oedema INT, 
        PRIMARY KEY(ID),
        CONSTRAINT PID_EXAM
            FOREIGN KEY(PID) 
            REFERENCES Patients (ID) 
    )"""
)