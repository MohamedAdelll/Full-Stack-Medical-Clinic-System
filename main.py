from wsgiref.util import request_uri
from flask import Flask, render_template, request, redirect, flash, url_for
import mysql.connector
from functools import wraps
import json
#variables
global isLoggedIn
isLoggedIn = False

mydb = mysql.connector.connect(
	host = 'localhost',
	user = 'root',
	passwd = '@Hm$d_2001',
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
        return redirect(url_for('admin'))

@app.route('/admin', methods = ['POST', 'GET'])
@is_logged_in
def admin():
    if request.method == 'POST':
        fName = request.form['fname']
        lName = request.form['Lname']
        user = request.form['username']
        passwd = request.form['password']
        mycursor.execute('INSERT INTO Users (Username, Password, FirstName, LastName) VALUES (%s, %s, %s, %s)', (fName, lName, user, passwd,))
        mydb.commit()
        flash('User succefully registered')
    
    return render_template('admin.html')

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

@app.route('/newscan', methods = ['POST', 'GET'])
@is_logged_in
def newScan():
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
    mycursor.execute('SELECT * FROM Patients')
    data = mycursor.fetchall()
    # with open('static/json_data.json', 'w') as outfile:
    #     json_string = json.dumps(data)
    #     json.dump(json_string, outfile)
    return render_template('search.html', data = data)
if __name__=='__main__':
	app.run(debug=True)