/** I don't know if this will work
	But I pray it does
*/

var hap = 5;
var emp = 5;
var adp = 5;
var rea = 5;
var term = 15;
var pop = 101230;
var repVal = 1;

	// Response Variables: These variables house the responses the system generates when presented a problem and forced to react 
	var hapResp;
	var empResp;
	var adpResp;
	var reaResp;
	
	//Resources Variables: These are variables that exist as systems designed to keep the conditions of the game space within winnable means
	var foodRes = 500000;
	var foodProd = 0.1;
	var energyRes = 500000;
	
	//This is the log variable for the game. This contains and carries the text of the game
	var resp = " ";
	var log= "<br>";

	//This is just stupid
	var eventGen=Math.floor((Math.random() * 2) + 1);

	//This is an Array containing the event functions. If you add a new event, add it to this arraylist
	var eventList= ['Hunger', 'Vac']

function onLoad(){
	refreshVar();
};
	
function refreshVar(){
	document.getElementById("hap").innerHTML = hap;
	document.getElementById("emp").innerHTML = emp;
	document.getElementById("adp").innerHTML = adp;
	document.getElementById("rea").innerHTML = rea;
	document.getElementById("term").innerHTML = term;
	foodRes= foodRes * (1 + foodProd);
	document.getElementById("foodResc").innerHTML = foodRes;
	document.getElementById("enerRes").innerHTML = energyRes;
	document.getElementById("pop").innerHTML = pop;
	repVal = 1;
	foodProd = 0.1;
	log = log + resp; 
	eventGen=Math.floor((Math.random() * 2) + 1);
}

function startGame(){
	var hap = 5;
	var emp = 5;
	var adp = 5;
	var rea = 5; 
	var pop = 101230;
	var repVal = 1;
	refreshVar();

};

function addHap(){
	if (hap < 20 && hap > 0){ 
		 if(term > 0){
		hap = (hap+ 1);
		term = (term - 1);
		document.getElementById("hap").innerHTML = hap;
		document.getElementById("term").innerHTML = term;
	};
};
};

function subHap(){
	if (hap < 20 && hap > 0){
		hap = (hap- 1);
		term = (term +  1);
		document.getElementById("hap").innerHTML = hap;
		document.getElementById("term").innerHTML = term;
	};
};

function addEmp(){
	if (emp < 20 && term > 0){
		emp = (emp+ 1);
		term = (term - 1);
		document.getElementById("emp").innerHTML = emp;
		document.getElementById("term").innerHTML = term;
	};
};

function subEmp(){
	if (emp < 20 && emp > 0){
		emp = (emp- 1);
		term = (term + 1);
		document.getElementById("emp").innerHTML = emp;
		document.getElementById("term").innerHTML = term;
	};
};


function addAdp(){
	if (adp < 20 && term > 0){
		adp = (adp+ 1);
		term = (term - 1);
		document.getElementById("adp").innerHTML = adp;
		document.getElementById("term").innerHTML = term;
	};
};

function subAdp(){
	if (adp < 20 && adp > 0){
		adp = (adp- 1);
		term = (term + 1);
		document.getElementById("adp").innerHTML = adp;
		document.getElementById("term").innerHTML = term;
	};
};

function addRea(){
	if (rea < 20 && term > 0){
		rea = (rea+ 1);
		term = (term - 1);
		document.getElementById("rea").innerHTML = rea;
		document.getElementById("term").innerHTML = term;
	};
};

function subRea(){
	if (rea < 20 && rea > 0){
		rea = (rea- 1);
		term = (term + 1);
		document.getElementById("rea").innerHTML = rea;
		document.getElementById("term").innerHTML = term;
	};
};


//Event Functions
function randEvent(){
		if (eventGen = 1){
			hungerFunc();
		}
		else vacFunc();
	};
	
//vacFunc is a function that produces the responses of the system towards a sudden breach in the ship's hull
function vacFunc(){
	prompt = "ALERT: Hull breach. Human losses impending.";
	if (hap < 3){
		hapResp = "In an effort to make repair easier, the Haptic System attempts to lock down the area. It does not, however, have the authority to do this. ";
		repVal = (repVal - 0.2);
	};
	if (hap >= 3 && hap < 5){
		hapResp = "The Haptic System manages to create manual locks on the doors surrounding the breach. It cannot, however, aid the humans in sealing the hull. ";
		repVal = (repVal - 0.125);
	};
	if (hap >= 5 && hap < 8){
		hapResp = "The Haptic System unlocks and activates several basic systems for human engineers to at least cardon off the section. The humans manage to make the best of it, though a few are lost before the breach is secured.";
		repVal = (repVal - 0.09);
	};
	if (hap >= 8 && hap < 10){
		hapResp = "The Haptic System unlocks the permissions for members of the bridge crew to open and close doors at their own discretion. The crew however, is not made aware of this alteration to their permissions immediately, resulting in a number of deaths. ";
		repVal = (repVal - 0.01);
	};
	if (hap >= 10 && hap < 13){
		hapResp = "The Haptic System expands entryways to the region affected, allowing humans to bring larger equipment into the room. This ends up creating a catastrophic, as the system is unable to determine which tunnels lead where. ";
		repVal = (repVal - 0.2);
	};
	if (hap >= 13 && hap < 17) {
		hapResp = "The Haptic System expands entryways in specific regions to enable human engineers and repairmen to get into the broken shaft. "
	};
	if (hap >= 17 && hap <=20){
		hapResp = "The Haptic System utilizes a system of tools and gives full door and portal command to Human emergency personnel. This prevents unnecessary death and further cements the benefits of humans and the System working together as a team. ";
		repVal = (repVal + 0.1);
	};
	if (emp < 3){
		empResp = "The Empathetic System manages to throw an error flag at the problem. Nobody really notices it until it sucks out an entire quadrant. ";
		repVal = (repVal - 0.2);
	};
	if (emp >= 3 && emp < 5){
		empResp = "The Empathetic System sets up several flags that alarm a minor bridge technician, who manages to convince the captain that something is wrong. Unfortunately, this warning comes too late for a number of the ship's occupants. ";
		repVal = (repVal - 0.125);
	};
	if (emp >= 5 && emp < 8){
		empResp = "The Empathetic System uses a series of alarms and updates to users with high permissions to inform of them of the breach. At first, the effect of this is minimal, but it ends up catching the eye of a few officials who direct humans away from the affected zone. "
		repVal = (repVal - 0.075);
	};
	if (emp >= 8 && emp < 10){
		empResp = "The Empathetic System manages to use visual cues to alert potential victims away from the affected regions surrounding the breach. "
		repVal = (repVal - 0.1);
	};
	if (emp >= 10 && emp < 13){
		empResp = "The Empathetic System tries to utilize visual and audio cues to ward people away from the affected zones. This is mildly affective, mostly because the humans were quite perplexed by the bizarre material the System was throwing in their direction. "
		repVal = (repVal - 0.075);
	};
	if (emp >= 13 && emp < 17) {
		empResp = "The Empathetic System uses electric shocks to force a commander to take a look at the systems map and see the breach. This requires an unusual amount of coddling on the Empathetic System's side, but the commanding officer is much quicker on the uptake when he discovers the cost of inaction. "
		repVal = (repVal -0.05);
	};
	if (emp >= 17 && emp <=20){
		empResp = "The Empathetic System immediately informs the human's commanding units of the breach, conveying the hole's location and size, allowing for human workers to show up at the best possible timing to prevent the hole from getting bigger. "
		repVal = repVal;
	};
	if (adp < 3){
		adpResp = "The Adapative System struggles to find a long term solution to the situation, and begins a five century program to develop a proper force-field for the ship. Nearly every sceientist it interacts with calls the plan 'crazy.' "
		repVal = (repVal - 0.2);
	};
	if (adp >= 3 && adp < 5){
		adpResp = "The Adaptive System tries to determine the cause of the system malfunction. Unfortunately, it has little information to go on due to its inability to manifest a physical form and place these sensors. "
		repVal = (repVal -0.19);
	};
	if (adp >= 5 && adp < 8){
		adpResp = "The Aadptive System implements a zoning plan to force humans in the future to build around the affectr regions. This would prevent future deaths, should the hole remain unfixed. "
		repVal = (repVal - 0.15);
	};
	if (adp >= 8 && adp < 10){
		adpResp = "The Aadaptive System figures out how to improve oxygen subsystems affected by the drain of the vacuum. In the future, the oxygen systems will be able to level out lost air throughout the sytem. "
		repVal = (repVal - 0.1);
	};
	if (adp >= 10 && adp < 13){
		adpResp = "The Adaptive System analyzes the scenario and the potential causes. It sends a series of instructions to people who develop more materials. "
		repVal = (repVal - 0.75);
	};
	if (adp >= 13 && adp < 17) {
		adpResp = "The Adaptive System provides new vitamins and minerals to the people that suffer from the deprivation of oxygen. " 
		repVal = (repVal - 0.5);
	};
	if (adp >= 17 && adp <=20){
		adpResp = "The Adaptive System does everything it can to aid human emergency agencies with future crises. "
		repVal = repVal;
	};
	if (rea < 3){
		repVal = (repVal -0.2);
		reaResp = "The Reactive System cannot react appropriately to the system. Instead, it throws cat videos at the people. "
	};
	if (rea >= 3 && rea < 5){
		reaResp = "The Reactive System explodes the lights from the region near the system. "
		repVal = (repVal - 0.175);
	};
	if (rea >= 5 && rea < 8){
		reaResp = "The Reactive System wigs out, exploding barrels and shuts off the vacuum section with rubble. This doesn't work, as the rubble ends up just expanding the role in the hull. "
		repVal = (repVal -0.15);
	};
	if (rea >= 8 && rea < 10){
		reaResp = "The Reactive System sets up a crazy system to circle people away from the vacuum system. "
		repVal = (repVal - 0.125);
	};
	if (rea >= 10 && rea < 13){
		reaResp = "The Reactive System sets up an electric fence about the affected region. "
		repVal = (repVal - 0.1);
	};
	if (rea >= 13 && rea < 17) {
		reaResp = "The Reactive System blocks the street that runs near the vacuum space. "
		repVal = (repVal - 0.75);
	};
	if (rea >= 17 && rea <=20){
		reaResp ="The Reactive System immediately slams down the doors surrounding the breach, sealing it till the humans are capable of dealing with the situation. "
		repVal = repVal
	};

	resp = (prompt + "<br>" + hapResp + "<br>" + empResp + "<br>" + adpResp + "<br>" + reaResp);

}; 

//hungerFunc is a function that produces the responses of the system towards a food shortage on the ship. 
function hungerFunc(){
	prompt = "ALERT: Food supplies have reached critical levels. Production will not meet the demand parameters of 880lbs per capita.";
	if (hap < 3){
		hapResp= "The Haptic System is incapable of creating new ways for the humans to obtain foods, citing a lack of power as the lead cause.";
		repVal = (repVal - 0.2);
		}
	if (hap >= 3 && hap < 8){
		hapResp= "The Haptic System beginnings setting the locks of the food stores to manual, making it easier for humans to access the food within. Unfortunately, this incites more thievery and forces the humans to become more violent in their interactions.";
		repVal = (repVal - 0.25);
		}
	if (hap >= 8 && hap< 10){
		hapResp = "The Haptic System unlocks several food stores, allowing humans to eat the food inside. ";
		repVal = (repVal - 0.15);
	};
	if (hap >= 10){
		hapResp = "The Haptic System creates an extra farm for the humans to create extra food. ";
		repVal = (repVal - 0.01);
	};
	if (hap > 10 && hap <= 15){
		hapResp = "The Haptic System creates an extra farming unit that humans can easily access to grow and process new crops. ";
	};
	if (hap > 15 && hap <= 20){
		hapResp = "The Haptic System takes a multi-layered approach, unlocking several storerooms and opening up an extra plot of farmland for the humans. ";
		repVal = (repVal + 0.2);
	};
	if (emp >=0 && emp < 2){
		empResp = "The Empathetic System tries to communicate the dire situation through a complex system of pulleys and levers the urgency of the situations, but only attracts the attention of specimens aged 2 to 6 years in age. ";
		repVal = (repVal - 0.2);
	};
	if (emp >= 2 && emp < 5){
		empResp = "The Empathetic System attempts to communicate the depths to which the crisis has gone. This only reaches a few very savvy individuals, but their pleas go unheard. "
		repVal = (repVal - 0.125);
	};
	if (emp >= 5 && emp <= 8){
		empResp = "The Empathetic System broadcasts a misleading message to many individual human's personal devices. These messages go ignored for the most part, but it arouses some interest and a number of the receivers alter their lifestyle accordingly. ";
		repVal = (repVal - 0.06);
	};
	if (emp > 8 && emp <= 10){
		empResp = "The Empathetic System begins to put visual advertisements for people to diet and fast, claiming that it is the 'will of the system.' It is not very effective. ";
		repVal = (repVal - 0.02);
	};
	if (emp >= 10 && emp <13) {
		empResp = "The Empathetic System attempts to suggest institute a euthanasia program for certain demographics, namely those unable to operate their own machinery. ";
		repVal = (repVal);
	};
	if (emp >= 13 && emp < 18) {
		empResp = "The Empathetic System successfully connects a group of like-minded individuals, and paves the way for them to broadcast awareness of the food shortage. "
	};
	if (adp < 10){
		adpResp = "The Adaptive System starts a hydro plant project that will complete in two decades that will maximize the productivity of certain farms. Unfortunately, it will not help the population now. ";
		repVal = (repVal - 0.2);
	};
	if (adp >= 10){
		adpResp = "The Adaptive System starts to diversify the seed and topsoil distribution so that the humans can maximize their farmland. ";
		repVal = (repVal + 0.2);
	};
	if (rea < 10){
		reaResp = "The Responsive System attempts to force a second round of farming. Unfortunately, the resulting crops produce half the food the previous germination had. This permanently damages the farming subsystems. ";
		repVal = (repVal);
	};
	if (rea >= 10){
		reaResp = "The Responsive System begins to water down the resulting food produced, which lowers the quality of life but manages to make the most of the food available. The results are so effective that there is more than enough to preserve the population's growth. ";
		repVal = (repVal + 0.3)

	};
};

//breakFunc takes the responses of the 

function endTurn(){	
	randEvent();
	pop = Math.round(pop * repVal);
	resp = (prompt + "<br>" + hapResp + "<br>" + empResp + "<br>" + adpResp + "<br>" + reaResp);

	if (pop < 2){ 
		document.getElementById("resp").innerHTML= (log + "<hr>" + resp + "<br>" + "You lose. Humans are incapable of breeding beyond this point.");
		document.getElementById("turnButton").setAttribute("disabled", "disabled");
		
	};
	if (pop > 2){
		resp = (resp + "<br>" + ("Humans continue to survive. "+ Math.round(pop) +" humans remain." + "<hr>"));
		document.getElementById("resp").innerHTML= (log + "<br>" + resp);
	};
	repVal= 1;
	refreshVar();
};

