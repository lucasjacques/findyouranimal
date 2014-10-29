/* Copyright 2014 Lucas Jacques
 * This file is part of FindYourAnimal.
 * FindYourAnimal is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * FindYourAnimal is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License    along with FindYourAnimal.  
 * If not, see <http://www.gnu.org/licenses/>.
 */

var animals = new Array();
var quests = new Array();
var atual = new Quest();

var userInterface, text1, btnOk, btnYes, btnNo;

window.onload = load_default();

function do_start() {
	atual = quests[1];
	userInterface.style.width = "150px";
	txt1.textContent = atual.txt;
	btnOk.style.display = "none";
	btnYes.style.display = "block";
	btnNo.style.display = "block";
}

function load_default() {
	userInterface = document.getElementById("userInterface");
	text1 = document.getElementById("text1");
	btnOk = document.getElementById("btnOk");
	btnYes = document.getElementById("btnYes");
	btnNo = document.getElementById("btnNo");

	var defaultAnimals = ["whale", "fish", "snake"];
	var defaultQuestions = ["Does this animal live in the earth?", "Does this animal live in the water?"];
	
	//loading default animals (leaves of the tree structure)
	for (var i = 0; i <= defaultAnimals.length - 1; i++) {
		animals[i] = new Animal(defaultAnimals[i]);
	};

	/*loading default questions (nodes of the tree structure) and linking them to their
	 *respective leaves 
	 */
	//reptil
	quests[0] = new Quest(defaultQuestions[0], animals[2], undefined); 
	animals[2].questParent = quests[0];
	animals[2].yesOrNo = true;

	//mamifero
	quests[1] =  new Quest(defaultQuestions[1], animals[0], quests[0]); 
	animals[0].questParent = quests[1];
	animals[0].yesOrNo = true;

}

function do_yes() {
	//quest
	if(!atual.hasOwnProperty('animalName')) {
		atual = atual.yesResult;

		//visual
		txt1.textContent = atual.txt;
	}

	//animal
	else {

		//visual
		txt1.textContent = "Hooray! I got it! Lets play again?";
		document.getElementById("btnAgain").style.display = "block";
		btnYes.style.display = "none";
		btnNo.style.display = "none";
	};
}

function do_no() {
	//quest
	if(!atual.hasOwnProperty('animalName')) {
		switch(typeof atual.noResult) {
			case 'object':
			atual = atual.noResult;

			//visual
			txt1.textContent = atual.txt;
			break;

			case 'undefined':

			//visual
			txt1.textContent = "I couldn't find your animal. What animal did you think?";
			btnYes.style.display = "none";
			btnNo.style.display = "none";
			document.getElementById("animName").style.display = "block";
			document.getElementById("btnReady").style.display = "block";
			break;
		}
	}

	//animal
	else {

		
		//visual
		txt1.textContent = "I couldn't find your animal. What animal did you think?";
		btnYes.style.display = "none";
		btnNo.style.display = "none";
		document.getElementById("animName").style.display = "block";
		document.getElementById("textDiff").textContent = "Difference from a " + atual.animalName + ": ";
		document.getElementById("animDiff").style.display = "block";
		document.getElementById("btnReady").style.display = "block";
	}
}

function do_again() {
	//visual
	userInterface.style.width = "100px";
	txt1.textContent = "Think in an animal and I'll try to guess it";
	document.getElementById("btnAgain").style.display = "none";
	btnOk.style.display = "block";
}

function do_ready() {

	//exception
	if(document.getElementById("inpName").value === "" || (document.getElementById("inpDiff").value === "" && atual.hasOwnProperty('animalName'))) {
		alert("Please fill all the blank fields so I can add this new animal");
	}

	else {

		//quest
		if(!atual.hasOwnProperty('animalName')) {
			animalTmp = new Animal(document.getElementById("inpName").value);
			animalTmp.yesOrNo = false;
			animalTmp.questParent = atual;
			atual.noResult = animalTmp;
			animals.push(animalTmp);
		}

		//animal
		else {
			animalTmp = new Animal(document.getElementById("inpName").value);
			animalTmp.yesOrNo = true;
			questTmp = new Quest("Does "+ document.getElementById("inpDiff").value + "?", undefined, undefined);
			animalTmp.questParent = questTmp;
			questTmp.yesResult = animalTmp;
			if(atual.yesOrNo) {
				console.log("yes");
				atual.questParent.yesResult = questTmp;
			}
			else {
				console.log("no");
				atual.questParent.noResult = questTmp;
			console.log(questTmp);
			}
			atual.yesOrNo = false;
			questTmp.noResult = atual;
			atual.questParent = questTmp;


			//adding in the arrays just to save data in a local var;
			animals.push(animalTmp);
			quests.push(questTmp);
			
		}

		//visual
		document.getElementById("inpDiff").value = "";
		document.getElementById("inpName").value = "";
		document.getElementById("animName").style.display = "none";
		document.getElementById("animDiff").style.display = "none";
		document.getElementById("btnReady").style.display = "none";
		do_again();
	}

}

//"Classes"
function Quest(txt, yesResult, noResult) {
	this.txt = txt;
	this.yesResult = yesResult;
	this.noResult = noResult;
}

function Animal(animalName) {
	this.txt = "Is this animal a " + animalName + "?";
	this.animalName = animalName;
	this.questParent = new Quest();
	this.yesOrNo;
}