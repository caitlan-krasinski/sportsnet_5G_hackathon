#!/usr/bin/env python
import pika
import sys
import json
import time
import datetime
import pandas as pd
queue_name = 'players'

connection = pika.BlockingConnection(
    pika.ConnectionParameters(host='localhost'))
channel = connection.channel()
channel.queue_declare(queue=queue_name)

print(' [*] Waiting for logs. To exit press CTRL+C')

# def parseUTC(utcfloat: float) -> datetime.datetime:
#     return datetime.datetime.utcfromtimestamp(utcfloat)


# def runMetaData():
#     players = pd.read_json('LiveEventSummary.JSON')
#     curTime = players.iloc[0, 1]
#     curDt = parseUTC(curTime)
#     for i in range(len(players)):
#         msg = players.iloc[i].to_dict()
#         packetTime = parseUTC(msg["PacketSendUTC"])
#         delta = packetTime - curDt
#         channel.basic_publish(
#             exchange='', routing_key='players', body=str(msg))
#         print(" [x] Sent %r" % msg["PacketSendUTC"])
#         print("Waiting for %r seconds." % delta.total_seconds())
#         # Wait for next packet
#         time.sleep(delta.total_seconds())
#         curDt = packetTime

#     runMetaData()

def callback(ch, method, properties, body):
    # print(" [x] %r" % body)
    my_json = body.decode('utf8')
    my_json = my_json.replace("{'", '{"')
    my_json = my_json.replace("'}", '"}')
    my_json = my_json.replace("',", '",')
    my_json = my_json.replace("':", '":')
    my_json = my_json.replace(" '", ' "')
    my_json = my_json.replace(" False", " false")
    my_json = my_json.replace(" True", " true")
    # my_json = my_json.replace("O\"Rourke", "O\'Rourke")
    tmp = json.loads(my_json)
    print('- ' * 20)
    # print(tmp)
    print(len(tmp['LiveEventSummary']['EntitySummaries']))
    for i in range(len(tmp['LiveEventSummary']['EntitySummaries'])):
        print(tmp['LiveEventSummary']['EntitySummaries'][i]['EntityId'])
    #     if(tmp['EntityRegistration']['Entities'][i]['EntityType'] == "Player"):
    #         print(tmp['EntityRegistration']['Entities'][i]['VisOrHome'],
    #               "  ", tmp['EntityRegistration']['Entities'][i]['JerseyNum'],
    #               "  ", tmp['EntityRegistration']['Entities'][i]['NAbbrev'],
    #               "  ", tmp['EntityRegistration']['Entities'][i]['PositionLongName'])


channel.basic_consume(
    queue=queue_name, on_message_callback=callback, auto_ack=True)
channel.start_consuming()
