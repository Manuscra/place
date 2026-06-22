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

my_conn = mysql.connector.connect(host="mysql-duss.alwaysdata.net", user="duss", passwd="system", db="duss_activites",port =3306)
my_cursor = my_conn.cursor()

def img(No_img):
	my_cursor.execute(f"SELECT * FROM Img WHERE(No_Img = '{No_img}');")
	my_result = my_cursor.fetchone()

	return my_result[1]

def lien(No_act):
	my_cursor.execute(f"SELECT * FROM Liens WHERE(No_dAct = '{No_act}');")
	my_result = my_cursor.fetchone()

	return my_result[2]

def typ(No_typ):
	my_cursor.execute(f"SELECT * FROM Type WHERE(No_Type = '{No_typ}');")
	my_result = my_cursor.fetchone()

	return my_result[1]

def det_list(No_act, No_List):
	my_cursor.execute(f"SELECT * FROM Listes WHERE(Act_liste = '{No_act}' AND Num_Liste_Act ='{No_List}');")
	rows = my_cursor.fetchall()
	tab=[]
	i=0
	for row in rows:
		my_cursor.execute(f"SELECT Reponse FROM Reponses WHERE(No_Rep = '{row[4]}');")
		my_result = my_cursor.fetchone()
		tab.append(my_result[0])

		#On en profite pour récuperer les etiquettes
		my_cursor.execute(f"SELECT * FROM Etiquettes WHERE(No_Liste ='{row[0]}');")
		resultat = my_cursor.fetchall()
		for resu in resultat:
			try:
				c= {}
				c["Rep_good"] = i
				c["X"] =resu[1]
				c["Y"] =resu[2]
				c["Liste_Num"] =row[3]
				Etiquette.setEtiqu(c)
				
			except:
				pass
		
		i+=1

	return tab

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

	a["Type_Act"]=typ(my_result[1])
	a["Act_Name"] =my_result[2]
		
	if (a["Type_Act"] == "quizz") :
		a["N_Img"] =img(my_result[3])
		a["Listes"] =list(No_act)
		a["Etiquettes"] = Etiquette.getEtiqu()

	else :
		a["Lnk_Act"] =lien(No_act)

	return a
#sortie = json.dumps(act(8), ensure_ascii=False, indent=4)
#print(sortie)

def actiNiv(No_Niv):
	my_cursor.execute(f"SELECT * FROM Attrib_Niv WHERE(No_dNiv = '{No_Niv}');")
	my_result = my_cursor.fetchall()
	tab=[]
	for row in my_result:
		my_cursor.execute(f"SELECT * FROM Attrib_Chap WHERE(No_dChap = '{row[1]}');")
		obtient= my_cursor.fetchall()
		for lign in obtient :
			#verifier dans la table act_attrib que l activite correspond au niveau
			my_cursor.execute(f"SELECT * FROM Act_Attrib WHERE(No_Niv_Attrib = '{No_Niv}' AND No_Act_Attrib= '{lign[2]}');")
			verif= my_cursor.fetchall()
			if verif:
				tab.append([row[1],lign[2]])
	return tab
#print(actiNiv(2))

def final(No_Niv):
	chapi=actiNiv(No_Niv)

	final=[]
	num_nom = chapi[0][0]
	activi=[]
	
	parchap={}
	my_cursor.execute(f"SELECT * FROM Chap WHERE(No_Chap = '{chapi[0][0]}');")
	name_chap = my_cursor.fetchone()
	parchap["Chap_Name"] = name_chap[1]

	for i in chapi: #Parcours des chapitres avec la liste des activites du niveau
		Etiquette.razEtiqu()
		
		if (num_nom !=i[0]):
			num_nom = i[0]
			
			parchap["Activites"] = activi
			activi=[]

			final.append(parchap)			
			parchap={}
			
			my_cursor.execute(f"SELECT * FROM Chap WHERE(No_Chap = '{i[0]}');")
			name_chap = my_cursor.fetchone()
			parchap["Chap_Name"] = name_chap[1]
		
		activi.append(act(i[1]))

	parchap["Activites"] = activi
	final.append(parchap)
	return final

if __name__ == "__main__":
	if argv[1] :
			niveau = argv[1]
			if (int(niveau) > 0) and (int(niveau) < 5) :
				sortie = json.dumps(final(niveau), ensure_ascii=False, indent=4)
				#print(sortie)
				if (int(niveau) == 1):
					file = open('/home/duss/www/qcm/tjyo/donnees.js', 'w')
				if (int(niveau) == 2):
					file = open('/home/duss/www/qcm/djor/donnees.js', 'w')
				if (int(niveau) == 3):
					file = open('/home/duss/www/qcm/rvbu/donnees.js', 'w')
				if (int(niveau) == 4):
					file = open('/home/duss/www/qcm/uspj/donnees.js', 'w')
				file.write('const chapitres = ')
				file.write(sortie)
				file.close()
	else :
		exit()
