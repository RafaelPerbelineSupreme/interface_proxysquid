# !/usr/bin/env python3

def getAllInterfaces():
    return os.listdir('/sys/class/net/')

os.system("sudo 520652065206")
os.system("sudo airmon-ng")
interface = getAllInterfaces()[3]
inter = 'sudo ifconfig {0} down && iwconfig {0} mode monitor && ifconfig {0} up'.format(interface)
os.system(inter)
dump = 'sudo airodump-ng {0}'.format(interface)
"\033[1mCtrl + C To Stop \033[0m"
time.sleep(3)
os.system(dump)
print(" ")
bssid = data.__getitem__('mac')