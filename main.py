from flask import Flask, render_template, request, redirect, flash, url_for
import mysql.connector
from functools import wraps
import json
from datetime import date
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

app=Flask(__name__ ,static_url_path="/static", static_folder="static")
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
    patients = mycursor.fetchall()
    with open('static/json_patients.json', 'w') as outfile:
        json_string = json.dumps(patients)
        json.dump(json_string, outfile)
    mycursor.execute('SELECT * FROM Scans')
    scans = mycursor.fetchall()
    with open('static/json_scans.json', 'w') as outfile:
        json_string = json.dumps(scans)
        json.dump(json_string, outfile)
    mycursor.execute('SELECT * FROM Examinations')
    exams = mycursor.fetchall()
    with open('static/json_exams.json', 'w') as outfile:
        json_string = json.dumps(exams)
        json.dump(json_string, outfile)

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
        bdate = request.form['bdate']
        gender = request.form['gender']
        address = request.form['address']
        data = (name, bdate, gender, address,)
        mycursor.execute('INSERT INTO Patients (Name, BDate, Gender, Address) VALUES (%s, %s, %s, %s)', data)
        mydb.commit()
        flash('Patient added successfully')
    return render_template('newpatient.html')

@app.route('/addexam', methods = [POST, GET])
@is_logged_in
def addExam():
    genJSON()
    if request.method == 'POST':
        name = request.form['input-user']
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
        val = (id, date.today(), pulse, rirr, co, bps, bpd, rr, chest, ht1, ht2, ht3, abd, ll, oedema)
        mycursor.execute(sql, val)
        mydb.commit()

    return render_template('exam.html')

@app.route('/newscan', methods = ['POST', 'GET'])
@is_logged_in
def newScan():
    genJSON()
    if request.method == 'POST':
        pid = request.form['pid']
        sdate = request.form['sdate']
        simage = request.form['simage']
        print(simage)
        stext =  request.form['stext']
        data = (str(pid), sdate, simage, stext)
        mycursor.execute('INSERT INTO Scans (PID, SDate, SImage, SText) VALUES (%s, %s, %s, %s)', data)
        mydb.commit()
        flash('Scan added successfully')
    return render_template('newscan.html')

@app.route('/search', methods = ['POST', 'GET'])
def search():
    genJSON()
    return render_template('search.html', data = data)

if __name__=='__main__':
	app.run(debug=True)