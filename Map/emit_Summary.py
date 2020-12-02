#!/usr/bin/env python
import pika
import sys
import json
import time
import datetime
import pandas as pd


def parseUTC(utcfloat: float) -> datetime.datetime:
    return datetime.datetime.utcfromtimestamp(utcfloat)


def runMetaData():
    players = pd.read_json('LiveEventSummary.JSON')
    curTime = players.iloc[0, 1]
    curDt = parseUTC(curTime)
    for i in range(len(players)):
        msg = players.iloc[i].to_dict()
        packetTime = parseUTC(msg["PacketSendUTC"])
        delta = packetTime - curDt
        channel.basic_publish(
            exchange='', routing_key='players', body=str(msg))
        print(" [x] Sent %r" % msg["PacketSendUTC"])
        print("Waiting for %r seconds." % delta.total_seconds())
        # Wait for next packet
        time.sleep(delta.total_seconds())
        curDt = packetTime

    runMetaData()


filepath = "./LiveEventSummary.JSON"
connection = pika.BlockingConnection(
    pika.ConnectionParameters(host='localhost'))
channel = connection.channel()
channel.exchange_declare(exchange='logs', exchange_type='fanout')
runMetaData()
