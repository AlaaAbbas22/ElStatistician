from flask import Flask, request, session
from flask_session import Session
import numpy as np
from flask_cors import CORS
from collections import Counter
from scipy import stats
import pandas as pd
from datetime import timedelta
import os

app = Flask(__name__)

app.config["SECRET_KEY"] = os.environ["Key"]
app.config["SESSION_TYPE"] = 'filesystem'
app.config.update(
    SESSION_COOKIE_SECURE=True,
    SESSION_COOKIE_SAMESITE='None',
)
app.permanent_session_lifetime = timedelta(days=1000)
CORS(app, supports_credentials=True)
Session(app)


#importing Counter from the library collection to calculate the repetitions
def the_mode(data):
#function for calculating the mode, the modes and their repetitions, or if there is not mode
    #did not make it floats as the mean and median because the mood can be calculated for qualitative
    my_modes=[]
    #list to put the modes and their repetitions in it
    orig_counts = Counter(data)
    #Counter creates a dictionary with each unique element as a key and its repition as a value
    values= list(orig_counts.keys())
    #list of the unique elements
    repts=list(orig_counts.values())
    #list for the repititions with indexing corresponding to the list of unique elements
    my_mode_repts=max(repts)
    #max gets the maximum value of repititions. it gets the first maximum
    if my_mode_repts == 1:
    #checking if this maximum repition is 1, it returns no mode
        return "there is no mode"
    else:
    #else to calculate the mode if the repitition is more than one and there is mode or modes
        my_mode = values[repts.index(my_mode_repts)]
        #getting the element with that repitition corresponding index of the repitition
        my_modes.append(my_mode)
        #adding a list of the mode and its repetition to the list of the modes
        values.remove(my_mode)
        repts.remove(my_mode_repts)
        #these two lines for removing the mode and its corresponding repitition to then check if there is other modes
        while my_mode_repts in repts:
        #while loop for calculating other modes that continue until there is no element with the same repitition
            my_mode_repts=max(repts)
            my_mode = values[repts.index(my_mode_repts)]
            my_modes.append(my_mode)
            values.remove(my_mode)
            repts.remove(my_mode_repts)
            #these five lines for the same idea above and removing that mode to check with the while loop again if there is other modes
        return my_modes
        #returning a two dimensional list of lists of the modes and their repetition

#funtion for the confidence interval
def myci(mean, SD, n, confidence_level):
    #standard error
    SE = SD/(n**0.5)
    #degrees of freedom
    df = n-1
    #confidence interval = point estimate plus or minus T-score X SE
    return [round(mean-SE*stats.t.ppf(1-0.5*(1-confidence_level), df),3), round(mean+SE*stats.t.ppf(1-0.5*(1-confidence_level), df),3)]

def filter(data,column, json1):
    if 'filterBy' not in json1.keys():
        return list(data[column]), "(No filter)"
    else:
        try:
            comparison = float(json1['comparison'].strip())
        except:
            comparison = json1['comparison']
        if json1['HowFilter'] ==  ">":
            r = data[json1["filterBy"]]>comparison
        elif json1['HowFilter'] == "⋝":
            r = data[json1["filterBy"]]>=comparison
        elif json1['HowFilter'] == "=":
            r = data[json1["filterBy"]]==comparison
        elif json1['HowFilter'] == "<":
            r = data[json1["filterBy"]]<comparison
        elif json1['HowFilter'] == "⋜":
            r = data[json1["filterBy"]]<=comparison
        elif json1['HowFilter'] == "≠":
            r = data[json1["filterBy"]]!=comparison
        return list(data[column][r]), f"Filter: {json1['filterBy']} {json1['HowFilter']} {comparison}"



@app.route('/mean', methods = ["POST"])
def mean():
    AllData = request.json
    if "csv" in AllData.keys():
        df = pd.read_csv(AllData["csv"])
        try:
            results = filter(df, AllData["column"], AllData)
            result = round(np.mean(results[0]),3)
            sentence = [f"Mean of {AllData['column']}",results[1],f"= {result}",[AllData["csv"]]]
            if "hist" in session.keys():
                session["hist"].append(sentence)
            else:
                session["hist"] = [sentence]               
            return {"result": result}
        except:
            return {"result":""}
    else:        
        try:
            data = request.json["numbers"]
            if data == "":
                return {"result":""}
            data = data.split(",")
            resolved = []
            for i in range(len(data)):
                if data[i] != "":
                    resolved.append(float(data[i].strip()))
            result = round(np.mean(list(resolved)),3)
            if "hist" in session.keys():
                session["hist"].append([f"Mean of {resolved} ",f"= {result}",[]])
            else:
                session["hist"] = [[f"Mean of {resolved} ",f"= {result}",[]]]
            return {"result":result}
        except:
            return {"result":""}
    
@app.route('/median', methods = ["POST"])
def median():
    AllData = request.json
    if "csv" in AllData.keys():
        df = pd.read_csv(AllData["csv"])
        try:
            results = filter(df, AllData["column"], AllData)
            result = np.median(results[0])
            sentence = [f"Median of {AllData['column']}",results[1],f"= {result}",[AllData["csv"]]]
            if "hist" in session.keys():
                session["hist"].append(sentence)
            else:
                session["hist"] = [sentence]               
            return {"result": result}
        except:
            return {"result":""}
    try:
        data = request.json["numbers"]
        if data == "":
            return {"result":""}
        data = data.split(",")
        resolved = []
        for i in range(len(data)):
            if data[i] != "":
                resolved.append(float(data[i].strip()))
        result = round(np.median(list(resolved)),3)   
        if "hist" in session.keys():
            session["hist"].append([f"Median of {resolved} ",f"= {result}",[]])
        else:
            session["hist"] = [[f"Median of {resolved} ",f"= {result}",[]]]
        return {"result":result}
    except:
        return {"result":""}

@app.route('/mode', methods = ["POST"])
def mode():
    AllData = request.json
    if "csv" in AllData.keys():
        df = pd.read_csv(AllData["csv"])
        try:
            results = filter(df, AllData["column"], AllData)
            result = the_mode(results[0])
            sentence = [f"Modes of {AllData['column']}",results[1],f"= {result}",[AllData["csv"]]]
            if "hist" in session.keys():
                session["hist"].append(sentence)
            else:
                session["hist"] = [sentence]               
            return {"result": result}
        except:
            return {"result":""}

    data = request.json["numbers"]
    if data == "":
        return {"result":""}
    data = data.split(",")
    try:
        resolved = []
        for i in range(len(data)):
            if data[i] != "":
                try:
                    resolved.append(float(data[i].strip()))      
                except:
                    resolved.append(data[i].strip())
        result= f"{the_mode(list(resolved))}"
        if "hist" in session.keys():
            session["hist"].append([f"Modes of {resolved} ",f"= {result}",[]])
        else:
            session["hist"] = [[f"Modes of {resolved} ",f"= {result}",[]]] 
        return {"result":result}
    except:
        return {"result":""}
    
@app.route('/std', methods = ["POST"])
def std():
    AllData = request.json
    Sample = int(AllData["sample"])    
    if "csv" in AllData.keys():
        df = pd.read_csv(AllData["csv"])
        try:
            results = filter(df, AllData["column"], AllData)
            result = round(np.std(results[0], ddof=Sample),3)
            sentence = [f"Standard Deviation ({'Sample SD' if Sample == 1 else 'Population SD'}) of {AllData['column']}",results[1],f"= {result}",[AllData["csv"]]]
            if "hist" in session.keys():
                session["hist"].append(sentence)
            else:
                session["hist"] = [sentence]               
            return {"result": result}
        except:
            return {"result":""}
    try:
        data = request.json["numbers"]
        if data == "":
            return {"result":""}
        data = data.split(",")
        resolved = []
        for i in range(len(data)):
            if data[i] != "":
                resolved.append(float(data[i].strip()))  
        result = round(np.std(list(resolved), ddof= Sample),3)
        if "hist" in session.keys():
            session["hist"].append([f"Standard deviation of {resolved} ({'Sample SD' if Sample == 1 else 'Population SD'}) ",f"= {result}",[]])
        else:
            session["hist"] = [[f"Standard deviation of {resolved} ({'Sample SD' if Sample == 1 else 'Population SD'}) ",f"= {result}",[]]]        
        return {"result": result}
    except:
        return {"result":""}

def therange(mlist):
    return round(max(mlist)-min(mlist),3)

@app.route('/range', methods = {"POST"})
def myrange():
    AllData = request.json
    if "csv" in AllData.keys():
        df = pd.read_csv(AllData["csv"])
        try:
            results = filter(df, AllData["column"], AllData)
            result = therange(results[0])
            sentence = [f"Range of {AllData['column']}",results[1],f"= {result}",[AllData["csv"]]]
            if "hist" in session.keys():
                session["hist"].append(sentence)
            else:
                session["hist"] = [sentence]               
            return {"result": result}
        except:
            return {"result":""}
    try:
        data = request.json["numbers"]
        if data == "":
            return {"result":""}
        data = data.split(",")
        resolved = []
        for i in range(len(data)):
            if data[i] != "":
                resolved.append(float(data[i].strip()))
        result = max(list(resolved))-min(list(resolved))
        if "hist" in session.keys():
            session["hist"].append([f"Range of {resolved} ",f"= {result}",[]])
        else:
            session["hist"] = [[f"Range of {resolved} ",f"= {result}",[]]]  
        return {"result":result}
    except:
        return {"result":""}

def mycibetter(mlist, percentage):
    return myci(np.mean(mlist), np.std(list(mlist), ddof= 1), len(mlist), percentage)

@app.route('/ci', methods = {"POST"})
def myciah():
    AllData = request.json
    if "csv" in AllData.keys():
        conlevel= 0.01 * float(request.json["conlevel2"])
        df = pd.read_csv(AllData["csv"])
        try:   
            results = filter(df, AllData["column"], AllData)
            result = mycibetter(results[0], conlevel)
            sentence = [f"Confidence Interval ({conlevel*100}%) of {AllData['column']}",results[1],f"= {result}",[AllData["csv"]]]
            if "hist" in session.keys():
                session["hist"].append(sentence)
            else:
                session["hist"] = [sentence]               
            return {"result": result} 
        except:
            return {"result":""}
    try:
        data = request.json["numbers"]
        conlevel= 0.01 * float(request.json["conlevel"])
        if data == "":
            return {"result":""}
        data = data.split(",")
        resolved = []
        for i in range(len(data)):
            if data[i] != "":
                resolved.append(float(data[i].strip())) 
        result = f"{mycibetter(resolved, conlevel)}"
        if "hist" in session.keys():
            session["hist"].append([f"Confidence Interval ({int(conlevel*100)}%) of {resolved} ",f"= {result}",[]])
        else:
            session["hist"] = [[f"Confidence Interval ({int(conlevel*100)}%) of {resolved} ",f"= {result}",[]]]        
        return {"result":result}
    except:
        return {"result":""}
    


def sigtest(mlist, mlist2, siglevel, G):
    alpha = siglevel
    #degrees of freedom is the least sample size - 1
    df_all = min(len(mlist),len(mlist2))-1
    #standard error for the two samples as averaged of the two
    SE_all = ((np.std(mlist, ddof=1)**2/len(mlist))+(np.std(mlist2, ddof=1)**2/len(mlist2)))**0.5
    #T score for the difference
    T = (np.mean(mlist)-np.mean(mlist2))/SE_all
    #the probability to the right is 1 - that value. Made it absolute if there is negative rather than creating one with (1 minus bla bla) and one without if it was negative
    if G == "2":
        p_value = 2*(1-(stats.t.cdf(np.abs(T),df_all)))
    elif G==">":
        p_value = 1 - stats.t.cdf(T,df_all)
    elif G=="<":
        p_value = stats.t.cdf(T,df_all)

    p_value = round(p_value,3)
    if p_value> alpha:
        res = "Do not reject the null hypothesis"
    else:
        res = "Reject the null hypothesis"

    g = round(((np.mean(mlist)-np.mean(mlist2))/(((np.std(mlist, ddof=1)**2)*(len(mlist)-1)+(np.std(mlist2, ddof=1)**2)*(len(mlist2)-1))/(len(mlist)+len(mlist2)-2))**0.5)*(1-(3/(4*(len(mlist)+len(mlist2))-9))),3)

    return [p_value, g, res]
@app.route('/sig', methods = {"POST"})
def mysig():
    AllData = request.json
    
    if "csv" in AllData.keys():

        try:
            df1 = pd.read_csv(AllData["csv"])
            df2 = pd.read_csv(AllData["csv2"])
            if AllData["filter"]==True:
                try:
                    comparison = float(AllData["comparison"].strip())
                except:
                    comparison = AllData["comparison"]
                match AllData["HowFilter"]:
                    case ">":
                        r1 = df1[AllData['filterBy']]>comparison
                    case "⋝":
                        r1 = df1[AllData["filterBy"]]>=comparison
                    case "=":
                        r1 = df1[AllData["filterBy"]]==comparison
                    case "<":
                        r1 = df1[AllData["filterBy"]]<comparison
                    case "⋜":
                        r1 = df1[AllData["filterBy"]]<=comparison
                    case "≠":
                        r1 = df1[AllData["filterBy"]]!=comparison
            
                data1 = df1[AllData["column"]][r1]
            else:
                data1 = df1[AllData["column"]]
            if AllData["filter"] == True:
                s1 = f"({AllData['filterBy']} {AllData['HowFilter']} {comparison})"
            else:
                s1 = "(No filter)"
            if AllData["filter2"]==True:
                try:
                    comparison2 = float(AllData["comparison2"].strip())
                except:
                    comparison2 = AllData["comparison2"]
                match AllData["HowFilter2"]:
                    case ">":
                        r2 = df2[AllData['filterBy2']]>comparison2
                    case "⋝":
                        r2 = df2[AllData["filterBy2"]]>=comparison2
                    case "=":
                        r2 = df2[AllData["filterBy2"]]==comparison2
                    case "<":
                        r2 = df2[AllData["filterBy2"]]<comparison2
                    case "⋜":
                        r2 = df2[AllData["filterBy2"]]<=comparison2
                    case "≠":
                        r2 = df2[AllData["filterBy2"]]!=comparison2
                data2 = df2[AllData["column2"]][r2]
            else:
                data2 = df2[AllData["column2"]]
            if AllData["filter2"] == True:
                s2 = f"({AllData['filterBy2']} {AllData['HowFilter2']} {comparison2})"
            else:
                s2 = "(No filter)"
            tails = AllData["tails"]
            result = sigtest(data1, data2,AllData["siglevel2"]*0.01, tails)
            if "hist" in session.keys():
                session["hist"].append([f"Difference of two means ",f"({'H1: Sample 1 ≠ Sample2' if tails == '2' else f'H1: Sample 1 {tails} Sample2'}, {AllData['siglevel2']}%) ",f"of {AllData['column']} {s1} ",f"& {AllData['column2']} {s2}: ",f" ",f"P-value = {result[0]}",f"Hedge's g = {result[1]}",f"Result: {result[2]}",[AllData["csv"],AllData["csv2"]]])
            else:
                session["hist"] = [[f"Difference of two means ",f"({'H1: Sample 1 ≠ Sample2' if tails == '2' else f'H1: Sample 1 {tails} Sample2'}, {AllData['siglevel2']}%) ",f"of {AllData['column']} {s1} ",f"& {AllData['column2']} {s2}: ",f" ",f"P-value = {result[0]}",f"Hedge's g = {result[1]}",f"Result: {result[2]}",[AllData["csv"],AllData["csv2"]]]]
            return {"result": result}
        except:
            return {"result":["","","The test was not done."]}
    else:
        try:
            data1, data2 = AllData["numbers1"], AllData["numbers2"]
            Siglevel= 0.01 * float(request.json["Siglevel"])
            if data1 == "" or data2 == "":
                return {"result": ["","", "The test was not done."]}
            data1 = data1.split(",")
            data2 = data2.split(",")
            resolved1 = []
            resolved2 = []
            for i in range(len(data1)):
                if data1[i] != "":
                    resolved1.append(float(data1[i].strip())) 
            for i in range(len(data2)):
                if data2[i] != "":
                    resolved2.append(float(data2[i].strip()))
            result = sigtest(resolved1, resolved2,Siglevel, AllData["tails"])
            tails = AllData["tails"]
            if "hist" in session.keys():
                session["hist"].append([f"Difference of two means",f"({'H1: Sample 1 ≠ Sample2' if AllData['tails'] == '2' else f'H1: Sample 1 {tails} Sample2'}, {int(Siglevel*100)}%) ",f"of {resolved1} & {resolved2}: ",f"P-value = {result[0]}",f"Hedge's g = {result[1]}",f"Result: {result[2]}",[]])
            else:
                session["hist"] = [[f"Difference of two means",f"({'H1: Sample 1 ≠ Sample2' if AllData['tails'] == '2' else f'H1: Sample 1 {tails} Sample2'}, {int(Siglevel*100)}%) ",f"of {resolved1} & {resolved2}: ",f"P-value = {result[0]}",f"Hedge's g = {result[1]}",f"Result: {result[2]}",[]]]                  
            return {"result":result}
        except:
            return {"result":["","", "The test was not done."]}

#getting the columns
@app.route("/getcolumns", methods=["POST"])
def getcolumns():
    try:
        df = pd.read_csv(str(request.json["csv"]))
        columns = list(df.columns)
        return {"columns": columns}
    except:
        return {"columns": ["Write a valid URL for CSV file"]} 

@app.route("/gethistory", methods = ["GET"])
def gethistory():
    if "hist" not in session.keys() or session.get("hist") == []:
        return {"result": ["No history"]}
    print(session["hist"])
    return {"result": session.get("hist")} 

@app.route("/clearhistory", methods=["POST"])
def clear():
    session.clear()
    return {"result": ["No History"]}


@app.route("/deleteitem", methods=["POST"])
def clearitem():
    del session["hist"][int(request.json["id"])] 
    return {"result": ["deleted successfully"]}
if __name__ == '__main__': 
    app.run(debug = True, port= 5000)