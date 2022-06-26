from flask import Flask, render_template, request, redirect, flash, url_for
import mysql.connector
from functools import wraps
import json
from datetime import date
import base64
import itertools
#variables
global isLoggedIn
isLoggedIn = False

mydb = mysql.connector.connect(
	host = 'localhost',
	user = 'root',
	passwd = 'root',
	database = 'ClinicProto'
)
mycursor = mydb.cursor(buffered =True)

app=Flask(__name__ , static_url_path="/static", static_folder="static")
app.config['SECRET_KEY'] = '54aaacc75d53041c924e22910015ddda'


def is_logged_in(f):
    @wraps(f)
    def wrap(*args, **kwargs):
        global isLoggedIn
        if isLoggedIn==True:
            return f(*args, **kwargs)
        else:
            flash('Unauthorized, Please login')
            return redirect(url_for('login'))
    return wrap	

def genJSON():
    mycursor.execute('SELECT * FROM Patients')
    desc = mycursor.description
    column_names = [col[0] for col in desc]
    patients = [dict(zip(column_names, row)) for row in mycursor.fetchall()]
    with open('static/json_patients.json', 'w') as outfile:
        json_string = json.dumps(patients)
        json.dump(json_string, outfile)

def enterImage(path):
    with open(path, 'rb') as File:
        data = File.read()
    return data

@app.route('/login', methods = ['POST', 'GET'])
def login():
    global isLoggedIn
    if request.method == 'POST':
        loginUsername = request.form['username']
        loginPassword = request.form['password']
        mycursor.execute("SELECT * FROM Users WHERE Username=%s and Password=%s", (loginUsername, loginPassword,))
        data = mycursor.fetchone()
        if data is not None:
            isLoggedIn = True
            flash('Successfully logged in')
            return redirect(url_for('home'))
        else:
            flash('Wrong username or Password')
            return render_template('login.html')
    else:
        return render_template('login.html')

@app.route('/logout')
def logout():
    global isLoggedIn
    isLoggedIn = False
    return redirect(url_for('home'))

@app.route('/', methods = ['POST', 'GET'])
@is_logged_in
def home():
        return redirect(url_for('newPatient'))

@app.route('/newpatient', methods = ['POST', 'GET'])
@is_logged_in
def newPatient():
    if request.method == 'POST':
        fname = request.form['fname']
        minit = request.form['minit']
        lname = request.form['lname']
        name = fname + ' ' + minit + ' ' + lname 
        age = request.form['age']
        gender = request.form['gender']
        address = request.form['address']
        data = (name, age, gender, address,)
        mycursor.execute('INSERT INTO Patients (Name, Age, Gender, Address) VALUES (%s, %s, %s, %s)', data)
        mydb.commit()
        flash('Patient added successfully')
    return render_template('patient.html')

@app.route('/exam', methods = ['POST', 'GET'])
@is_logged_in
def addExam():
    genJSON()
    if request.method == 'POST':
        id = request.form['input-id']
        co = request.form['CO']
        pulse = request.form['pulse']
        rirr = request.form['rirr']
        bps = request.form['bps']
        bpd = request.form['bpd']
        rr = request.form['rr']
        chest = request.form['chest']
        ht1 = request.form['ht1']
        ht2 = request.form['ht2']
        ht3 = request.form['ht3']
        abd = request.form['abd']
        ll = request.form['ll']
        oedema = request.form['oedema']
        sql = 'INSERT INTO Examination (PID, Date, Pulse, PulseType, CO, BPS, BPD, RR, Chest, HT1, HT2, HT3, ABD, LL, Oedema) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)'
        val = (id, str(date.today()), pulse, rirr, co, bps, bpd, rr, chest, ht1, ht2, ht3, abd, ll, oedema)
        mycursor.execute(sql, val)
        mydb.commit()

    return render_template('exam.html')

@app.route('/addscan', methods = ['POST', 'GET'])
@is_logged_in
def newScan():
    genJSON()
    if request.method == 'POST':
        pid = request.form['input-id']
        images = request.files.getlist('images')
        test = base64.b64encode(images[0].read())
        data = (str(pid), str(date.today()), test)
        mycursor.execute('INSERT INTO Scans (PID, SDate, Image1) VALUES (%s, %s, %s)', data)
        mydb.commit()
        flash('Scan added successfully')
    return render_template('scan.html')

@app.route('/search', methods = ['POST', 'GET'])
def search():
    genJSON()
    return render_template('search.html')

if __name__=='__main__':
	app.run(debug=True)