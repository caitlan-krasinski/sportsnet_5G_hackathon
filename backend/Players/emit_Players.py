#!/usr/bin/env python
import pika
import sys
import json
import time
import datetime
import pandas as pd
jerseyName = {}
periodBegin = False
periodEnd = False

def parseUTC(utcfloat: float) -> datetime.datetime:
    return datetime.datetime.utcfromtimestamp(utcfloat)



def sendPlayers():
    time.sleep(3)
    players = pd.read_json('EntityRegistration.JSON')
    for i in range(len(players['EntityRegistration'][0]['Entities'])):
        if(players['EntityRegistration'][0]['Entities'][i]['EntityType'] == 'Player'):
            jerseyName[players['EntityRegistration'][0]['Entities'][i]['JerseyNum']] = players['EntityRegistration'][0]['Entities'][i]['NAbbrev']
    curTime = players.iloc[0, 1]
    curDt = parseUTC(curTime)
    msg = players.iloc[0].to_dict()
    packetTime = parseUTC(msg["PacketSendUTC"])
    delta = packetTime - curDt
    channel.basic_publish(exchange='', routing_key='players', body=str(msg))
    print(" [x] Sent %r" % msg["PacketSendUTC"])
    print("Waiting for %r seconds." % delta.total_seconds())


def sendScore():
    global periodBegin
    global periodEnd
    score = pd.read_json('Scoreboard.JSON')
    curTime = score.iloc[0, 1]
    curDt = parseUTC(curTime)
    teamA = 0
    teamB = 0
    penaltyHome = False
    penaltyVisit = False
    numHome = 0
    numVisit = 0
    index_jHome = 0
    index_jVisit = 0
    for i in range(len(score)):
        packetTime = parseUTC(score["PacketSendUTC"][i])
        delta = packetTime - curDt
        if(periodBegin != True and score['Scoreboard'][i]['ClockMinutes'] == 19 and score['Scoreboard'][i]['ClockSeconds'] <= 59):
            periodBegin = True
            periodEnd = False
            msg = "Period #" + str(score['Scoreboard'][i]['Period'])
            msg = msg + " has begun! "
            msg = msg + str(parseUTC(score['PacketSendUTC'][i]))
            channel.basic_publish(exchange='', routing_key='players', body=str(msg))
        if(score['Scoreboard'][i]['HomeScore'] != teamA):
            teamA = score['Scoreboard'][i]['HomeScore']
            msg = "Tampa Bay Lightning has scored! It is: TBL "
            msg = msg + str(teamA) + " - " + str(teamB) + " STA | "
            msg = msg + "Period #" + str(score['Scoreboard'][i]['Period']) + " | "
            msg = msg + str(score['Scoreboard'][i]['ClockMinutes']) + ":" + str(score['Scoreboard'][i]['ClockSeconds'])
            channel.basic_publish(exchange='', routing_key='players', body=str(msg))
            print(" [x] Sent %r" % score["PacketSendUTC"][i])
            print("Waiting for %r seconds." % delta.total_seconds())
        if(score['Scoreboard'][i]['VisitorScore'] != teamB):
            teamB = score['Scoreboard'][i]['VisitorScore']
            msg = "Dallas Stars has scored! It is: TBL "
            msg = msg + str(teamA) + " - " + str(teamB) + " STA | "
            msg = msg + "Period #" + str(score['Scoreboard'][i]['Period']) + " | "
            msg = msg + str(score['Scoreboard'][i]['ClockMinutes']) + ":" + str(score['Scoreboard'][i]['ClockSeconds'])
            channel.basic_publish(exchange='', routing_key='players', body=str(msg))
            print(" [x] Sent %r" % score["PacketSendUTC"][i])
            print("Waiting for %r seconds." % delta.total_seconds())
        if(periodEnd != True and score['Scoreboard'][i]['ClockMinutes'] == 0 and score['Scoreboard'][i]['ClockSeconds'] <= 1):
            periodBegin = False
            periodEnd = True
            msg = "Period #" + str(score['Scoreboard'][i]['Period'])
            msg = msg + " has ended! "
            msg = msg + str(parseUTC(score['PacketSendUTC'][i]))
            channel.basic_publish(exchange='', routing_key='players', body=str(msg))
        for j in range(len(score['Scoreboard'][i]['PowerPlayInfo']['HomePenaltyClocks'])):
            if(score['Scoreboard'][i]['PowerPlayInfo']['HomePenaltyClocks'][j]['JerseyNum'] != '00' and score['Scoreboard'][i]['PowerPlayInfo']['HomePenaltyClocks'][j]['JerseyNum'] != ''):
                if(penaltyHome == False):
                    index_jHome = j
                    penaltyHome = True
                    numHome = score['Scoreboard'][i]['PowerPlayInfo']['HomePenaltyClocks'][j]['JerseyNum']
                    msg = str(parseUTC(score['PacketSendUTC'][i])) + " " + jerseyName[score['Scoreboard'][i]['PowerPlayInfo']['HomePenaltyClocks'][j]['JerseyNum']] + " is on penalty!"
                    channel.basic_publish(exchange='', routing_key='players', body=str(msg))
            else:
                if(penaltyHome == True and numHome != 0 and (score['Scoreboard'][i]['PowerPlayInfo']['HomePenaltyClocks'][index_jHome]['JerseyNum'] == '00' or score['Scoreboard'][i]['PowerPlayInfo']['HomePenaltyClocks'][index_jHome]['JerseyNum'] == '')):
                    penaltyHome == False
                    msg = str(parseUTC(score['PacketSendUTC'][i])) + " " + jerseyName[numHome] + " penalty is over!"
                    channel.basic_publish(exchange='', routing_key='players', body=str(msg))
                    numHome = 0
        for j in range(len(score['Scoreboard'][i]['PowerPlayInfo']['VisitorPenaltyClocks'])):
            if(score['Scoreboard'][i]['PowerPlayInfo']['VisitorPenaltyClocks'][j]['JerseyNum'] != '00' and score['Scoreboard'][i]['PowerPlayInfo']['VisitorPenaltyClocks'][j]['JerseyNum'] != ''):
                if(penaltyVisit == False):
                    index_jVisit = j
                    penaltyVisit = True
                    numVisit = score['Scoreboard'][i]['PowerPlayInfo']['VisitorPenaltyClocks'][j]['JerseyNum']
                    msg = str(parseUTC(score['PacketSendUTC'][i])) + " " + jerseyName[score['Scoreboard'][i]['PowerPlayInfo']['VisitorPenaltyClocks'][j]['JerseyNum']] + " is on penalty!"
                    channel.basic_publish(exchange='', routing_key='players', body=str(msg))
            else:
                if(penaltyVisit == True and numVisit != 0 and (score['Scoreboard'][i]['PowerPlayInfo']['VisitorPenaltyClocks'][index_jVisit]['JerseyNum'] == '00' or score['Scoreboard'][i]['PowerPlayInfo']['VisitorPenaltyClocks'][index_jVisit]['JerseyNum'] == '')):
                    penaltyVisit == False
                    msg = str(parseUTC(score['PacketSendUTC'][i])) + " " + jerseyName[numVisit] + " penalty is over!"
                    channel.basic_publish(exchange='', routing_key='players', body=str(msg))
                    numVisit = 0
        time.sleep(.00005)
        # Wait for next packet
        # time.sleep(delta.total_seconds())
        # curDt = packetTime


connection = pika.BlockingConnection(
    pika.ConnectionParameters(host='localhost'))
channel = connection.channel()
channel.exchange_declare(exchange='logs', exchange_type='fanout')
sendPlayers()
sendScore()
