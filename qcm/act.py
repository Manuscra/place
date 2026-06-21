#!/usr/bin/env python3

import mysql.connector
import json
from sys import argv

class Etiqu:
	def __init__(self):
		self.tabrep = []
	def setEtiqu(self,etik):
		self.tabrep.append(etik)
	def razEtiqu(self):
		self.tabrep = []
	def getEtiqu(self):
		return self.tabrep
Etiquette = Etiqu()

my_conn = mysql.connector.connect(host="", user="", passwd="", db="duss_activites",port =3306)
my_cursor = my_conn.cursor()

def img(No_img):
	my_cursor.execute(f"SELECT * FROM Img WHERE(No_Img = '{No_img}');")
	my_result = my_cursor.fetchone()

	return my_result[1]


def det_list(No_act, No_List):
	my_cursor.execute(f"SELECT * FROM Listes WHERE(Act_liste = '{No_act}' AND Num_Liste_Act ='{No_List}');")
	rows = my_cursor.fetchall()
	
	for row in rows:
		my_cursor.execute(f"SELECT Reponse FROM Reponses WHERE(No_Rep = '{row[4]}');")
		my_result = my_cursor.fetchone()
		
		#On en profite pour récuperer les etiquettes
		my_cursor.execute(f"SELECT * FROM Etiquettes WHERE(No_Liste ='{row[0]}');")
		resultat = my_cursor.fetchall()
		for resu in resultat:		
			try:
				c= {}
				c["Rep_good"] = my_result[0]
				c["No_etiq"] =resu[0]
				c["X"] =resu[1]
				c["Y"] =resu[2]
				c["Liste_Num"] =row[0]
				Etiquette.setEtiqu(c)
				
			except:
				pass
		

def list(No_act):
	my_cursor.execute(f"SELECT DISTINCT Num_Liste_Act FROM Listes WHERE(Act_liste = '{No_act}');")
	rows = my_cursor.fetchall()
	tab=[]
	for row in rows:
		b={}
		b["Num_Liste"] =row[0]
		b["Reponses"] = det_list(No_act, row[0] )
		tab.append(b)
	return tab

def act(No_act):
	a={}
	my_cursor.execute(f"SELECT * FROM Activite WHERE(No_Act = '{No_act}');")
	my_result = my_cursor.fetchone()

	a["Act_Name"] =my_result[2]
	a["N_Img"] =img(my_result[3])
	a["Listes"] =list(No_act)
	a["Etiquettes"] = Etiquette.getEtiqu()

	resultext =f"<div id='sh2'><img src='https://duss.alwaysdata.net/qcm/image.php?img={a['N_Img']}' id='chap_img' /></div>"

	for z in range(0,len(a["Etiquettes"])) :
		#print(a['Etiquettes'][z])
		resultext+=f'<input class="mydiv" id="{a["Etiquettes"][z]["No_etiq"]}" value="{a["Etiquettes"][z]["Rep_good"]}" onmousedown="mouse_down=true; whatId={a["Etiquettes"][z]["No_etiq"]};" style="left:{a["Etiquettes"][z]["X"]}px;top:{a["Etiquettes"][z]["Y"]}px;"/>'
	
	print(resultext)


if __name__ == "__main__":
	if argv[1] :
		act(int(argv[1]))
	else :
		exit()


