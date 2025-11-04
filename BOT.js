	// Novas variáveis para modo de pênaltis
	var countdownActive = false;
	var goalsHome = [];
	var goalsGuest = [];
	var playersTeamHome = [];
	var playersTeamGuest = [];
	var playersTeamEspec = [];
	var speedCoefficient = 3.5;  // Ajustado para ~3.5: Melhor calibrado para km/h reais no HaxBall (baseado em testes: chutes fracos ~15 km/h, fortes ~70 km/h)
	var ballSpeedHistory = [];  // Nova: Armazena histórico de velocidades para média móvel (suaviza picos)
	var maxHistoryLength = 10;  // Quantas medições guardar para a média
	var room = HBInit({
		roomName: "SESI-SJ", // Define nome da sala
		maxPlayers: 22, // Define número máximo de players na sala
		noPlayer: true, // Tira o Host da sala
		public: true, //Server aparece na lista pública
		password: "vicenzo", // Define uma senha
		geo: {"lat":-25.42778,"lon":-49.27306,"code":"br"} //Geolocalização da sala
		});
	var maxPlayersPerTeam = 2;
	var maxTotalPlayers = 4;
	var gameEndedByTime = false;
	var warningSent = false;
	     // Novas variáveis para overtime e avisos
    var warningSent30 = false;
    var warningSent10 = false;
    var isProrrogacao = false;  // Renomeado de isOvertime
	var currentMapLimits = { time: 6, goals: 5, prorrogacaoTime: 3, totalTime: 9 };  // Adicionado prorrogacaoTime

	/* ----- ESTÁDIOS ----- */
	/* ESTÁDIO 6X6 */
	var stadiumx6 = `{"name":"10vs10 fixed from HaxMaps","width":1200,"height":555,"spawnDistance":310,"bg":{"type":"hockey","width":1130,"height":490,"kickOffRadius":134,"cornerRadius":0},"vertexes":[{"x":-1129.1842739345,"y":492.68317626901,"bCoef":1,"cMask":["ball"],"trait":"ballArea"},{"x":-1129.1842739345,"y":135.27428250161,"bCoef":1,"cMask":["ball"],"trait":"ballArea"},{"x":-1129.1842739345,"y":-135.27428250161,"bCoef":1,"cMask":["ball"],"trait":"ballArea"},{"x":-1129.1842739345,"y":-492.68317626901,"bCoef":1,"cMask":["ball"],"trait":"ballArea"},{"x":1129.1842739345,"y":492.68317626901,"bCoef":1,"cMask":["ball"],"trait":"ballArea"},{"x":1129.1842739345,"y":135.27428250161,"bCoef":1,"cMask":["ball"],"trait":"ballArea"},{"x":1129.1842739345,"y":-135.27428250161,"bCoef":1,"cMask":["ball"],"trait":"ballArea"},{"x":1129.1842739345,"y":-492.68317626901,"bCoef":1,"cMask":["ball"],"trait":"ballArea"},{"x":0,"y":575.27168558578,"trait":"kickOffBarrier"},{"x":0,"y":135.27428250161,"trait":"kickOffBarrier"},{"x":0,"y":-135.27428250161,"trait":"line"},{"x":0,"y":-575.27168558578,"trait":"kickOffBarrier"},{"x":-1169.054588777,"y":-135.27428250161,"bCoef":0.1,"cMask":["ball"],"trait":"goalNet"},{"x":1169.054588777,"y":-135.27428250161,"bCoef":0.1,"cMask":["ball"],"trait":"goalNet"},{"x":-1169.054588777,"y":135.27428250161,"bCoef":0.1,"cMask":["ball"],"trait":"goalNet"},{"x":1169.054588777,"y":135.27428250161,"bCoef":0.1,"cMask":["ball"],"trait":"goalNet"},{"x":-1129.1842739345,"y":-385.88769008353,"trait":"line"},{"x":-814.49357464125,"y":-71.196990790319,"trait":"line"},{"x":1129.1842739345,"y":-385.88769008353,"trait":"line"},{"x":814.49357464125,"y":-71.196990790319,"trait":"line"},{"x":-1129.1842739345,"y":385.88769008353,"trait":"line"},{"x":-814.49357464125,"y":71.196990790319,"trait":"line"},{"x":1129.1842739345,"y":385.88769008353,"trait":"line"},{"x":814.49357464125,"y":71.196990790319,"trait":"line"},{"x":1129.1842739345,"y":492.68317626901,"bCoef":1,"trait":"ballArea"},{"x":1129.1842739345,"y":-492.68317626901,"bCoef":1,"trait":"ballArea"},{"x":0,"y":492.68317626901,"bCoef":0,"trait":"line"},{"x":0,"y":-492.68317626901,"bCoef":0,"trait":"line"},{"x":0,"y":135.27428250161,"trait":"kickOffBarrier"},{"x":0,"y":-135.27428250161,"trait":"kickOffBarrier"},{"x":1137.4952497526103,"y":-139.54610194903,"bCoef":1,"cMask":["ball"],"trait":"line"},{"x":1137.2343671729482,"y":-492.68317626901,"bCoef":1,"cMask":["ball"],"trait":"ballArea"},{"x":-1137.5873571806333,"y":-140.28149779837443,"bCoef":1,"cMask":["ball"],"trait":"line"},{"x":-1137.7418501694392,"y":-492.99857494362186,"bCoef":1,"cMask":["ball"],"trait":"ballArea"},{"x":-1137.134891150683,"y":140.08663985192078,"bCoef":1,"cMask":["ball"],"trait":"line"},{"x":-1137.3294847957238,"y":492.68317626901,"bCoef":1,"cMask":["ball"],"trait":"ballArea"},{"x":1137.2711067022117,"y":139.54610194903,"bCoef":1,"cMask":["ball"],"trait":"line"},{"x":1137.914199780342,"y":492.68317626901,"bCoef":1,"cMask":["ball"],"trait":"ballArea"}],"segments":[{"v0":0,"v1":1,"trait":"ballArea"},{"v0":2,"v1":3,"trait":"ballArea"},{"v0":4,"v1":5,"trait":"ballArea"},{"v0":6,"v1":7,"trait":"ballArea"},{"v0":8,"v1":9,"trait":"kickOffBarrier"},{"v0":9,"v1":10,"curve":180,"cGroup":["blueKO"],"trait":"kickOffBarrier"},{"v0":9,"v1":10,"curve":-180,"cGroup":["redKO"],"trait":"kickOffBarrier"},{"v0":10,"v1":11,"trait":"kickOffBarrier"},{"v0":2,"v1":12,"curve":-35,"vis":true,"color":"FFFFFF","bCoef":0.1,"cMask":["ball"],"trait":"goalNet","y":-95},{"v0":6,"v1":13,"curve":35,"vis":true,"color":"FFFFFF","bCoef":0.1,"cMask":["ball"],"trait":"goalNet","y":-95},{"v0":1,"v1":14,"curve":35,"vis":true,"color":"FFFFFF","bCoef":0.1,"cMask":["ball"],"trait":"goalNet","y":95},{"v0":5,"v1":15,"curve":-35,"vis":true,"color":"FFFFFF","bCoef":0.1,"cMask":["ball"],"trait":"goalNet","y":95},{"v0":12,"v1":14,"curve":-35,"vis":true,"color":"FFFFFF","bCoef":0.1,"cMask":["ball"],"trait":"goalNet","x":-821},{"v0":13,"v1":15,"curve":35,"vis":true,"color":"FFFFFF","bCoef":0.1,"cMask":["ball"],"trait":"goalNet","x":585},{"v0":16,"v1":17,"curve":90,"color":"FFFFFF","trait":"line"},{"v0":18,"v1":19,"curve":-90,"color":"FFFFFF","trait":"line"},{"v0":20,"v1":21,"curve":-90,"color":"FFFFFF","trait":"line"},{"v0":22,"v1":23,"curve":90,"color":"FFFFFF","trait":"line"},{"v0":17,"v1":21,"curve":0,"vis":true,"color":"FFFFFF","bCoef":0,"trait":"line","x":-600},{"v0":19,"v1":23,"curve":0,"vis":true,"color":"FFFFFF","bCoef":0,"trait":"line","x":572},{"v0":1,"v1":0,"vis":true,"color":"FFFFFF","bCoef":1,"cMask":["ball"],"trait":"ballArea","x":-665},{"v0":5,"v1":4,"vis":true,"color":"FFFFFF","bCoef":1,"cMask":["ball"],"trait":"ballArea","x":665},{"v0":2,"v1":3,"vis":true,"color":"FFFFFF","bCoef":1,"cMask":["ball"],"trait":"ballArea","x":-665},{"v0":6,"v1":7,"vis":true,"color":"FFFFFF","bCoef":1,"cMask":["ball"],"trait":"ballArea","x":665},{"v0":0,"v1":24,"vis":true,"color":"FFFFFF","bCoef":1,"trait":"ballArea","y":290},{"v0":3,"v1":25,"vis":true,"color":"FFFFFF","bCoef":1,"trait":"ballArea","y":-290},{"v0":26,"v1":27,"curve":0,"vis":true,"color":"FFFFFF","bCoef":0,"trait":"line"},{"v0":10,"v1":9,"curve":-180,"vis":true,"color":"FFFFFF","bCoef":0,"trait":"line"},{"v0":29,"v1":28,"curve":180,"vis":true,"color":"FFFFFF","bCoef":0,"trait":"line"},{"v0":2,"v1":1,"curve":0,"vis":true,"color":"FFFFFF","bCoef":0,"trait":"line"},{"v0":6,"v1":5,"curve":0,"vis":true,"color":"FFFFFF","bCoef":0,"trait":"line"},{"v0":30,"v1":31,"vis":false,"color":"FFFFFF","bCoef":1,"cMask":["ball"],"trait":"ballArea","x":614},{"v0":32,"v1":33,"vis":false,"color":"FFFFFF","bCoef":1,"cMask":["ball"],"trait":"ballArea","x":-614},{"v0":34,"v1":35,"vis":false,"color":"FFFFFF","bCoef":1,"cMask":["ball"],"trait":"ballArea","x":-614},{"v0":36,"v1":37,"vis":false,"color":"FFFFFF","bCoef":1,"cMask":["ball"],"trait":"ballArea","x":614}],"goals":[{"p0":[-1141.9997322767,-135.27428250161],"p1":[-1141.9997322767,135.27428250161],"team":"red"},{"p0":[1141.9997322767,135.27428250161],"p1":[1141.9997322767,-135.27428250161],"team":"blue"}],"discs":[{"radius":7.1196990790319,"pos":[-1129.1842739345,135.27428250161],"color":"FFFFFF","trait":"goalPost"},{"radius":7.1196990790319,"pos":[-1129.1842739345,-135.27428250161],"color":"FFFFFF","trait":"goalPost"},{"radius":7.1196990790319,"pos":[1129.1842739345,135.27428250161],"color":"FFFFFF","trait":"goalPost"},{"radius":7.1196990790319,"pos":[1129.1842739345,-135.27428250161],"color":"FFFFFF","trait":"goalPost"}],"planes":[{"normal":[0,1],"dist":-492.68317626901,"trait":"ballArea","_data":{"extremes":{"normal":[0,1],"dist":-492.68317626901,"canvas_rect":[-649.4031991713746,-310.65460858863594,649.4031991713746,310.65460858863594],"a":[-649.4031991713746,-492.68317626901],"b":[649.4031991713746,-492.68317626901]}}},{"normal":[0,-1],"dist":-492.68317626901,"trait":"ballArea","_data":{"extremes":{"normal":[0,-1],"dist":-492.68317626901,"canvas_rect":[-649.4031991713746,-310.65460858863594,649.4031991713746,310.65460858863594],"a":[-649.4031991713746,492.68317626901],"b":[649.4031991713746,492.68317626901]}}},{"normal":[0,1],"dist":-556.8959392658687,"bCoef":0.2,"cMask":["all"],"_data":{"extremes":{"normal":[0,1],"dist":-556.8959392658687,"canvas_rect":[-649.4031991713746,-310.65460858863594,649.4031991713746,310.65460858863594],"a":[-649.4031991713746,-556.8959392658687],"b":[649.4031991713746,-556.8959392658687]},"mirror":{}}},{"normal":[0,-1],"dist":-558.6050189191134,"bCoef":0.2,"cMask":["all"],"_data":{"extremes":{"normal":[0,-1],"dist":-558.6050189191134,"canvas_rect":[-649.4031991713746,-310.65460858863594,649.4031991713746,310.65460858863594],"a":[-649.4031991713746,558.6050189191134],"b":[649.4031991713746,558.6050189191134]},"mirror":{}}},{"normal":[1,0],"dist":-1202.1230824965019,"bCoef":0.2,"cMask":["all"],"_data":{"extremes":{"normal":[1,0],"dist":-1202.1230824965019,"canvas_rect":[-649.4031991713746,-310.65460858863594,649.4031991713746,310.65460858863594],"a":[-1202.1230824965019,-310.65460858863594],"b":[-1202.1230824965019,310.65460858863594]}}},{"normal":[-1,0],"dist":-1201.5860393194075,"bCoef":0.2,"cMask":["all"],"_data":{"extremes":{"normal":[-1,0],"dist":-1201.5860393194075,"canvas_rect":[-649.4031991713746,-310.65460858863594,649.4031991713746,310.65460858863594],"a":[1201.5860393194075,-310.65460858863594],"b":[1201.5860393194075,310.65460858863594]}}}],"traits":{"ballArea":{"vis":false,"bCoef":1,"cMask":["ball"]},"goalPost":{"radius":8,"invMass":0,"bCoef":1},"goalNet":{"vis":true,"bCoef":0.1,"cMask":["all"]},"kickOffBarrier":{"vis":false,"bCoef":0.1,"cGroup":["redKO","blueKO"],"cMask":["red","blue"]},"line":{"vis":true,"bCoef":0,"cMask":[""]},"arco":{"radius":2,"cMask":["n\/d"],"color":"cccccc"}},"playerPhysics":{"acceleration":0.14,"kickingAcceleration":0.1,"kickStrength":7,"radius":15,"bCoef":0.5,"invMass":0.5,"damping":0.96,"cGroup":["red","blue"],"gravity":[0,0],"kickingDamping":0.96,"kickback":0},"ballPhysics":{"radius":6.4,"color":"EAFF00","bCoef":0.5,"cMask":["all"],"damping":0.99,"invMass":1,"gravity":[0,0],"cGroup":["ball"]},"cameraWidth":0,"cameraHeight":0,"maxViewWidth":0,"cameraFollow":"ball","redSpawnPoints":[],"blueSpawnPoints":[],"canBeStored":true,"kickOffReset":"partial","joints":[]}`;


	/* ESTÁDIO 3X3 */
	var stadiumx3 = `{

		"name" : "Futsal x3 FAZo7",

		"width" : 620,

		"height" : 270,

		"spawnDistance" : 350,

		"bg" : { "type" : "hockey", "width" : 550, "height" : 240, "kickOffRadius" : 80, "cornerRadius" : 0 },

		"vertexes" : [
			/* 0 */ { "x" : 550, "y" : 240, "trait" : "ballArea" },
			/* 1 */ { "x" : 550, "y" : -240, "trait" : "ballArea" },
			
			/* 2 */ { "x" : 0, "y" : 270, "trait" : "kickOffBarrier" },
			/* 3 */ { "x" : 0, "y" : 80, "bCoef" : 0.15, "trait" : "kickOffBarrier", "color" : "F8F8F8", "vis" : true, "curve" : 180 },
			/* 4 */ { "x" : 0, "y" : -80, "bCoef" : 0.15, "trait" : "kickOffBarrier", "color" : "F8F8F8", "vis" : true, "curve" : 180 },
			/* 5 */ { "x" : 0, "y" : -270, "trait" : "kickOffBarrier" },
			
			/* 6 */ { "x" : -550, "y" : -80, "cMask" : ["red","blue","ball" ], "trait" : "goalNet", "curve" : 0, "color" : "F8F8F8", "pos" : [-700,-80 ] },
			/* 7 */ { "x" : -590, "y" : -80, "cMask" : ["red","blue","ball" ], "trait" : "goalNet", "curve" : 0, "color" : "F8F8F8", "pos" : [-700,-80 ] },
			/* 8 */ { "x" : -590, "y" : 80, "cMask" : ["red","blue","ball" ], "trait" : "goalNet", "curve" : 0, "color" : "F8F8F8", "pos" : [-700,80 ] },
			/* 9 */ { "x" : -550, "y" : 80, "cMask" : ["red","blue","ball" ], "trait" : "goalNet", "curve" : 0, "color" : "F8F8F8", "pos" : [-700,80 ] },
			/* 10 */ { "x" : 550, "y" : -80, "cMask" : ["red","blue","ball" ], "trait" : "goalNet", "curve" : 0, "color" : "F8F8F8", "pos" : [700,-80 ] },
			/* 11 */ { "x" : 590, "y" : -80, "cMask" : ["red","blue","ball" ], "trait" : "goalNet", "curve" : 0, "color" : "F8F8F8", "pos" : [700,-80 ] },
			/* 12 */ { "x" : 590, "y" : 80, "cMask" : ["red","blue","ball" ], "trait" : "goalNet", "curve" : 0, "color" : "F8F8F8", "pos" : [700,80 ] },
			/* 13 */ { "x" : 550, "y" : 80, "cMask" : ["red","blue","ball" ], "trait" : "goalNet", "curve" : 0, "color" : "F8F8F8", "pos" : [700,80 ] },
			
			/* 14 */ { "x" : -550, "y" : 80, "bCoef" : 1.15, "cMask" : ["ball" ], "trait" : "ballArea", "color" : "F8F8F8", "pos" : [-700,80 ] },
			/* 15 */ { "x" : -550, "y" : 240, "bCoef" : 1.15, "cMask" : ["ball" ], "trait" : "ballArea", "color" : "F8F8F8" },
			/* 16 */ { "x" : -550, "y" : -80, "bCoef" : 1.15, "cMask" : ["ball" ], "trait" : "ballArea", "color" : "F8F8F8", "pos" : [-700,-80 ] },
			/* 17 */ { "x" : -550, "y" : -240, "bCoef" : 1.15, "cMask" : ["ball" ], "trait" : "ballArea", "color" : "F8F8F8" },
			/* 18 */ { "x" : -550, "y" : 240, "bCoef" : 1, "cMask" : ["ball" ], "trait" : "ballArea" },
			/* 19 */ { "x" : 550, "y" : 240, "bCoef" : 1, "cMask" : ["ball" ], "trait" : "ballArea" },
			/* 20 */ { "x" : 550, "y" : 80, "bCoef" : 1.15, "cMask" : ["ball" ], "trait" : "ballArea", "pos" : [700,80 ] },
			/* 21 */ { "x" : 550, "y" : 240, "bCoef" : 1.15, "cMask" : ["ball" ], "trait" : "ballArea" },
			/* 22 */ { "x" : 550, "y" : -240, "bCoef" : 1.15, "cMask" : ["ball" ], "trait" : "ballArea", "color" : "F8F8F8" },
			/* 23 */ { "x" : 550, "y" : -80, "bCoef" : 1.15, "cMask" : ["ball" ], "trait" : "ballArea", "color" : "F8F8F8", "pos" : [700,-80 ] },
			/* 24 */ { "x" : 550, "y" : -240, "bCoef" : 0, "cMask" : ["ball" ], "trait" : "ballArea" },
			/* 25 */ { "x" : 550, "y" : -240, "bCoef" : 0, "cMask" : ["ball" ], "trait" : "ballArea" },
			/* 26 */ { "x" : -550, "y" : -240, "bCoef" : 1, "cMask" : ["ball" ], "trait" : "ballArea", "curve" : 0 },
			/* 27 */ { "x" : 550, "y" : -240, "bCoef" : 1, "cMask" : ["ball" ], "trait" : "ballArea", "curve" : 0 },
			
			/* 28 */ { "x" : 0, "y" : -240, "bCoef" : 0.1, "cMask" : ["red","blue" ], "cGroup" : ["redKO","blueKO" ], "trait" : "kickOffBarrier" },
			/* 29 */ { "x" : 0, "y" : -80, "bCoef" : 0.1, "cMask" : ["red","blue" ], "cGroup" : ["redKO","blueKO" ], "trait" : "kickOffBarrier" },
			/* 30 */ { "x" : 0, "y" : 80, "bCoef" : 0.1, "cMask" : ["red","blue" ], "cGroup" : ["redKO","blueKO" ], "trait" : "kickOffBarrier" },
			/* 31 */ { "x" : 0, "y" : 240, "bCoef" : 0.1, "cMask" : ["red","blue" ], "cGroup" : ["redKO","blueKO" ], "trait" : "kickOffBarrier" },
			/* 32 */ { "x" : 0, "y" : -80, "bCoef" : 0.1, "cMask" : ["red","blue" ], "trait" : "kickOffBarrier", "vis" : true, "color" : "F8F8F8" },
			/* 33 */ { "x" : 0, "y" : 80, "bCoef" : 0.1, "cMask" : ["red","blue" ], "trait" : "kickOffBarrier", "vis" : true, "color" : "F8F8F8" },
			/* 34 */ { "x" : 0, "y" : 80, "trait" : "kickOffBarrier", "color" : "F8F8F8", "vis" : true, "curve" : -180 },
			/* 35 */ { "x" : 0, "y" : -80, "trait" : "kickOffBarrier", "color" : "F8F8F8", "vis" : true, "curve" : -180 },
			/* 36 */ { "x" : 0, "y" : 80, "trait" : "kickOffBarrier", "color" : "F8F8F8", "vis" : true, "curve" : 0 },
			/* 37 */ { "x" : 0, "y" : -80, "trait" : "kickOffBarrier", "color" : "F8F8F8", "vis" : true, "curve" : 0 },
			
			/* 38 */ { "x" : -557.5, "y" : 80, "bCoef" : 1, "cMask" : ["ball" ], "trait" : "ballArea", "curve" : 0, "vis" : false, "pos" : [-700,80 ] },
			/* 39 */ { "x" : -557.5, "y" : 240, "bCoef" : 1, "cMask" : ["ball" ], "trait" : "ballArea", "curve" : 0, "vis" : false },
			/* 40 */ { "x" : -557.5, "y" : -240, "bCoef" : 1, "cMask" : ["ball" ], "trait" : "ballArea", "vis" : false, "curve" : 0 },
			/* 41 */ { "x" : -557.5, "y" : -80, "bCoef" : 1, "cMask" : ["ball" ], "trait" : "ballArea", "vis" : false, "curve" : 0, "pos" : [-700,-80 ] },
			/* 42 */ { "x" : 557.5, "y" : -240, "bCoef" : 1, "cMask" : ["ball" ], "trait" : "ballArea", "vis" : false, "curve" : 0 },
			/* 43 */ { "x" : 557.5, "y" : -80, "bCoef" : 1, "cMask" : ["ball" ], "trait" : "ballArea", "vis" : false, "curve" : 0, "pos" : [700,-80 ] },
			/* 44 */ { "x" : 557.5, "y" : 80, "bCoef" : 1, "cMask" : ["ball" ], "trait" : "ballArea", "curve" : 0, "vis" : false, "pos" : [700,80 ] },
			/* 45 */ { "x" : 557.5, "y" : 240, "bCoef" : 1, "cMask" : ["ball" ], "trait" : "ballArea", "curve" : 0, "vis" : false },
			
			/* 46 */ { "x" : 0, "y" : -80, "bCoef" : 0.1, "trait" : "line" },
			/* 47 */ { "x" : 0, "y" : 80, "bCoef" : 0.1, "trait" : "line" },
			/* 48 */ { "x" : -550, "y" : -80, "bCoef" : 0.1, "trait" : "line" },
			/* 49 */ { "x" : -550, "y" : 80, "bCoef" : 0.1, "trait" : "line" },
			/* 50 */ { "x" : 550, "y" : -80, "bCoef" : 0.1, "trait" : "line" },
			/* 51 */ { "x" : 550, "y" : 80, "bCoef" : 0.1, "trait" : "line" },
			/* 52 */ { "x" : -550, "y" : 200, "bCoef" : 0.1, "trait" : "line", "color" : "F8F8F8", "curve" : -90 },
			/* 53 */ { "x" : -390, "y" : 70, "bCoef" : 0.1, "trait" : "line", "color" : "F8F8F8", "curve" : 0 },
			/* 54 */ { "x" : -550, "y" : 226, "bCoef" : 0.1, "trait" : "line", "curve" : -90 },
			/* 55 */ { "x" : -536, "y" : 240, "bCoef" : 0.1, "trait" : "line", "curve" : -90 },
			/* 56 */ { "x" : -550, "y" : -200, "bCoef" : 0.1, "trait" : "line", "color" : "F8F8F8", "curve" : 90 },
			/* 57 */ { "x" : -390, "y" : -70, "bCoef" : 0.1, "trait" : "line", "color" : "F8F8F8", "curve" : 0 },
			/* 58 */ { "x" : -550, "y" : -226, "bCoef" : 0.1, "trait" : "line", "curve" : 90 },
			/* 59 */ { "x" : -536, "y" : -240, "bCoef" : 0.1, "trait" : "line", "curve" : 90 },
			/* 60 */ { "x" : -381, "y" : -240, "bCoef" : 0.1, "trait" : "line" },
			/* 61 */ { "x" : 550, "y" : -226, "bCoef" : 0.1, "trait" : "line", "curve" : -90 },
			/* 62 */ { "x" : 536, "y" : -240, "bCoef" : 0.1, "trait" : "line", "curve" : -90 },
			/* 63 */ { "x" : 550, "y" : 226, "bCoef" : 0.1, "trait" : "line", "curve" : 90 },
			/* 64 */ { "x" : 536, "y" : 240, "bCoef" : 0.1, "trait" : "line", "curve" : 90 },
			/* 65 */ { "x" : 550, "y" : 200, "bCoef" : 0.1, "trait" : "line", "color" : "F8F8F8", "curve" : 90 },
			/* 66 */ { "x" : 390, "y" : 70, "bCoef" : 0.1, "trait" : "line", "color" : "F8F8F8", "curve" : 90 },
			/* 67 */ { "x" : 550, "y" : -200, "bCoef" : 0.1, "trait" : "line", "color" : "F8F8F8", "curve" : -90 },
			/* 68 */ { "x" : 390, "y" : -70, "bCoef" : 0.1, "trait" : "line", "color" : "F8F8F8", "curve" : -90 },
			/* 69 */ { "x" : 390, "y" : 70, "bCoef" : 0.1, "trait" : "line", "color" : "F8F8F8", "curve" : 0 },
			/* 70 */ { "x" : 390, "y" : -70, "bCoef" : 0.1, "trait" : "line", "color" : "F8F8F8", "curve" : 0 },
			/* 71 */ { "x" : -375, "y" : 1, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
			/* 72 */ { "x" : -375, "y" : -1, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
			/* 73 */ { "x" : -375, "y" : 3, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
			/* 74 */ { "x" : -375, "y" : -3, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
			/* 75 */ { "x" : -375, "y" : -2, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
			/* 76 */ { "x" : -375, "y" : 2, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
			/* 77 */ { "x" : -375, "y" : -3.5, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
			/* 78 */ { "x" : -375, "y" : 3.5, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
			/* 79 */ { "x" : 375, "y" : 1, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
			/* 80 */ { "x" : 375, "y" : -1, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
			/* 81 */ { "x" : 375, "y" : 3, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
			/* 82 */ { "x" : 375, "y" : -3, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
			/* 83 */ { "x" : 375, "y" : -2, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
			/* 84 */ { "x" : 375, "y" : 2, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
			/* 85 */ { "x" : 375, "y" : -3.5, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
			/* 86 */ { "x" : 375, "y" : 3.5, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
			/* 87 */ { "x" : -277.5, "y" : 1, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
			/* 88 */ { "x" : -277.5, "y" : -1, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
			/* 89 */ { "x" : -277.5, "y" : 3, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
			/* 90 */ { "x" : -277.5, "y" : -3, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
			/* 91 */ { "x" : -277.5, "y" : -2, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
			/* 92 */ { "x" : -277.5, "y" : 2, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
			/* 93 */ { "x" : -277.5, "y" : -3.5, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
			/* 94 */ { "x" : -277.5, "y" : 3.5, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
			/* 95 */ { "x" : 277.5, "y" : 1, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
			/* 96 */ { "x" : 277.5, "y" : -1, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
			/* 97 */ { "x" : 277.5, "y" : 3, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
			/* 98 */ { "x" : 277.5, "y" : -3, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
			/* 99 */ { "x" : 277.5, "y" : -2, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
			/* 100 */ { "x" : 277.5, "y" : 2, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
			/* 101 */ { "x" : 277.5, "y" : -3.5, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
			/* 102 */ { "x" : 277.5, "y" : 3.5, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
			/* 103 */ { "x" : -240, "y" : 224, "bCoef" : 0.1, "trait" : "line" },
			/* 104 */ { "x" : -240, "y" : 256, "bCoef" : 0.1, "trait" : "line" },
			/* 105 */ { "x" : -120, "y" : 224, "bCoef" : 0.1, "trait" : "line" },
			/* 106 */ { "x" : -120, "y" : 256, "bCoef" : 0.1, "trait" : "line" },
			/* 107 */ { "x" : 240, "y" : 224, "bCoef" : 0.1, "trait" : "line" },
			/* 108 */ { "x" : 240, "y" : 256, "bCoef" : 0.1, "trait" : "line" },
			/* 109 */ { "x" : 120, "y" : 224, "bCoef" : 0.1, "trait" : "line" },
			/* 110 */ { "x" : 120, "y" : 256, "bCoef" : 0.1, "trait" : "line" },
			/* 111 */ { "x" : -381, "y" : 240, "bCoef" : 0.1, "trait" : "line" },
			/* 112 */ { "x" : -381, "y" : 256, "bCoef" : 0.1, "trait" : "line" },
			/* 113 */ { "x" : -556, "y" : 123, "bCoef" : 0.1, "trait" : "line" },
			/* 114 */ { "x" : -575, "y" : 123, "bCoef" : 0.1, "trait" : "line" },
			/* 115 */ { "x" : 556, "y" : 123, "bCoef" : 0.1, "trait" : "line" },
			/* 116 */ { "x" : 575, "y" : 123, "bCoef" : 0.1, "trait" : "line" },
			/* 117 */ { "x" : -556, "y" : -123, "bCoef" : 0.1, "trait" : "line" },
			/* 118 */ { "x" : -575, "y" : -123, "bCoef" : 0.1, "trait" : "line" },
			/* 119 */ { "x" : 556, "y" : -123, "bCoef" : 0.1, "trait" : "line" },
			/* 120 */ { "x" : 575, "y" : -123, "bCoef" : 0.1, "trait" : "line" },
			/* 121 */ { "x" : -381, "y" : -240, "bCoef" : 0.1, "trait" : "line" },
			/* 122 */ { "x" : -381, "y" : -256, "bCoef" : 0.1, "trait" : "line" },
			/* 123 */ { "x" : 381, "y" : 240, "bCoef" : 0.1, "trait" : "line" },
			/* 124 */ { "x" : 381, "y" : 256, "bCoef" : 0.1, "trait" : "line" },
			/* 125 */ { "x" : 381, "y" : -240, "bCoef" : 0.1, "trait" : "line" },
			/* 126 */ { "x" : 381, "y" : -256, "bCoef" : 0.1, "trait" : "line" }

		],

		"segments" : [
			{ "v0" : 6, "v1" : 7, "curve" : 0, "color" : "F8F8F8", "cMask" : ["red","blue","ball" ], "trait" : "goalNet", "pos" : [-700,-80 ], "y" : -80 },
			{ "v0" : 7, "v1" : 8, "color" : "F8F8F8", "cMask" : ["red","blue","ball" ], "trait" : "goalNet", "x" : -590 },
			{ "v0" : 8, "v1" : 9, "curve" : 0, "color" : "F8F8F8", "cMask" : ["red","blue","ball" ], "trait" : "goalNet", "pos" : [-700,80 ], "y" : 80 },
			{ "v0" : 10, "v1" : 11, "curve" : 0, "color" : "F8F8F8", "cMask" : ["red","blue","ball" ], "trait" : "goalNet", "pos" : [700,-80 ], "y" : -80 },
			{ "v0" : 11, "v1" : 12, "color" : "F8F8F8", "cMask" : ["red","blue","ball" ], "trait" : "goalNet", "x" : 590 },
			{ "v0" : 12, "v1" : 13, "curve" : 0, "color" : "F8F8F8", "cMask" : ["red","blue","ball" ], "trait" : "goalNet", "pos" : [700,80 ], "y" : 80 },
			
			{ "v0" : 2, "v1" : 3, "trait" : "kickOffBarrier" },
			{ "v0" : 3, "v1" : 4, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.15, "cGroup" : ["blueKO" ], "trait" : "kickOffBarrier" },
			{ "v0" : 3, "v1" : 4, "curve" : -180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.15, "cGroup" : ["redKO" ], "trait" : "kickOffBarrier" },
			{ "v0" : 4, "v1" : 5, "trait" : "kickOffBarrier" },
			
			{ "v0" : 14, "v1" : 15, "vis" : true, "color" : "F8F8F8", "bCoef" : 1.15, "cMask" : ["ball" ], "trait" : "ballArea", "x" : -550 },
			{ "v0" : 16, "v1" : 17, "vis" : true, "color" : "F8F8F8", "bCoef" : 1.15, "cMask" : ["ball" ], "trait" : "ballArea", "x" : -550 },
			{ "v0" : 18, "v1" : 19, "vis" : true, "color" : "F8F8F8", "bCoef" : 1, "cMask" : ["ball" ], "trait" : "ballArea", "y" : 240 },
			{ "v0" : 20, "v1" : 21, "vis" : true, "color" : "F8F8F8", "bCoef" : 1.15, "cMask" : ["ball" ], "trait" : "ballArea", "x" : 550 },
			{ "v0" : 22, "v1" : 23, "vis" : true, "color" : "F8F8F8", "bCoef" : 1.15, "cMask" : ["ball" ], "trait" : "ballArea", "x" : 550 },
			{ "v0" : 24, "v1" : 25, "vis" : true, "color" : "F8F8F8", "bCoef" : 0, "cMask" : ["ball" ], "trait" : "ballArea", "x" : 550, "y" : -240 },
			{ "v0" : 26, "v1" : 27, "curve" : 0, "vis" : true, "color" : "F8F8F8", "bCoef" : 1, "cMask" : ["ball" ], "trait" : "ballArea", "y" : -240 },
			
			{ "v0" : 28, "v1" : 29, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "cMask" : ["red","blue" ], "cGroup" : ["redKO","blueKO" ], "trait" : "kickOffBarrier" },
			{ "v0" : 30, "v1" : 31, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "cMask" : ["red","blue" ], "cGroup" : ["redKO","blueKO" ], "trait" : "kickOffBarrier" },
			
			{ "v0" : 38, "v1" : 39, "curve" : 0, "vis" : false, "color" : "F8F8F8", "bCoef" : 1, "cMask" : ["ball" ], "trait" : "ballArea", "x" : -557.5 },
			{ "v0" : 40, "v1" : 41, "curve" : 0, "vis" : false, "color" : "F8F8F8", "bCoef" : 1, "cMask" : ["ball" ], "trait" : "ballArea", "x" : -557.5 },
			{ "v0" : 42, "v1" : 43, "curve" : 0, "vis" : false, "color" : "F8F8F8", "bCoef" : 1, "cMask" : ["ball" ], "trait" : "ballArea", "x" : 557.5 },
			{ "v0" : 44, "v1" : 45, "curve" : 0, "vis" : false, "color" : "F8F8F8", "bCoef" : 1, "cMask" : ["ball" ], "trait" : "ballArea", "x" : 557.5 },
			
			{ "v0" : 46, "v1" : 47, "curve" : 0, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : 0 },
			{ "v0" : 48, "v1" : 49, "curve" : 0, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -550 },
			{ "v0" : 50, "v1" : 51, "curve" : 0, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : 550 },
			{ "v0" : 52, "v1" : 53, "curve" : -90, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line" },
			{ "v0" : 55, "v1" : 54, "curve" : -90, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line" },
			{ "v0" : 56, "v1" : 57, "curve" : 90, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line" },
			{ "v0" : 53, "v1" : 57, "curve" : 0, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line" },
			{ "v0" : 59, "v1" : 58, "curve" : 90, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line" },
			{ "v0" : 62, "v1" : 61, "curve" : -90, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line" },
			{ "v0" : 64, "v1" : 63, "curve" : 90, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line" },
			{ "v0" : 65, "v1" : 66, "curve" : 90, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line" },
			{ "v0" : 67, "v1" : 68, "curve" : -90, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line" },
			{ "v0" : 69, "v1" : 70, "curve" : 0, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : 390 },
			{ "v0" : 72, "v1" : 71, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -375 },
			{ "v0" : 71, "v1" : 72, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -375 },
			{ "v0" : 74, "v1" : 73, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -375 },
			{ "v0" : 73, "v1" : 74, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -375 },
			{ "v0" : 76, "v1" : 75, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -375 },
			{ "v0" : 75, "v1" : 76, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -375 },
			{ "v0" : 78, "v1" : 77, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -375 },
			{ "v0" : 77, "v1" : 78, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -375 },
			{ "v0" : 80, "v1" : 79, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : 375 },
			{ "v0" : 79, "v1" : 80, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : 375 },
			{ "v0" : 82, "v1" : 81, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : 375 },
			{ "v0" : 81, "v1" : 82, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : 375 },
			{ "v0" : 84, "v1" : 83, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : 375 },
			{ "v0" : 83, "v1" : 84, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : 375 },
			{ "v0" : 86, "v1" : 85, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : 375 },
			{ "v0" : 85, "v1" : 86, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : 375 },
			{ "v0" : 88, "v1" : 87, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -277.5 },
			{ "v0" : 87, "v1" : 88, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -277.5 },
			{ "v0" : 90, "v1" : 89, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -277.5 },
			{ "v0" : 89, "v1" : 90, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -277.5 },
			{ "v0" : 92, "v1" : 91, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -277.5 },
			{ "v0" : 91, "v1" : 92, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -277.5 },
			{ "v0" : 94, "v1" : 93, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -277.5 },
			{ "v0" : 93, "v1" : 94, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -277.5 },
			{ "v0" : 96, "v1" : 95, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : 277.5 },
			{ "v0" : 95, "v1" : 96, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : 277.5 },
			{ "v0" : 98, "v1" : 97, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : 277.5 },
			{ "v0" : 97, "v1" : 98, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : 277.5 },
			{ "v0" : 100, "v1" : 99, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : 277.5 },
			{ "v0" : 99, "v1" : 100, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : 277.5 },
			{ "v0" : 102, "v1" : 101, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : 277.5 },
			{ "v0" : 101, "v1" : 102, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : 277.5 },
			{ "v0" : 103, "v1" : 104, "curve" : 0, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -240 },
			{ "v0" : 105, "v1" : 106, "curve" : 0, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -120 },
			{ "v0" : 107, "v1" : 108, "curve" : 0, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : 240 },
			{ "v0" : 109, "v1" : 110, "curve" : 0, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : 120 },
			{ "v0" : 111, "v1" : 112, "curve" : 0, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -381 },
			{ "v0" : 113, "v1" : 114, "curve" : 0, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -240, "y" : 123 },
			{ "v0" : 115, "v1" : 116, "curve" : 0, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -240, "y" : 123 },
			{ "v0" : 117, "v1" : 118, "curve" : 0, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -240, "y" : -123 },
			{ "v0" : 119, "v1" : 120, "curve" : 0, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -240, "y" : -123 },
			{ "v0" : 121, "v1" : 122, "curve" : 0, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -381 },
			{ "v0" : 123, "v1" : 124, "curve" : 0, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : 381 },
			{ "v0" : 125, "v1" : 126, "curve" : 0, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : 381 }

		],

		"goals" : [
			{ "p0" : [-556.25,-80 ], "p1" : [-556.25,80 ], "team" : "red" },
			{ "p0" : [556.25,80 ], "p1" : [556.25,-80 ], "team" : "blue" }

		],

		"discs" : [
			{ "radius" : 5, "pos" : [-550,80 ], "color" : "6666CC", "trait" : "goalPost", "y" : 80 },
			{ "radius" : 5, "pos" : [-550,-80 ], "color" : "6666CC", "trait" : "goalPost", "y" : -80, "x" : -560 },
			{ "radius" : 5, "pos" : [550,80 ], "color" : "6666CC", "trait" : "goalPost", "y" : 80 },
			{ "radius" : 5, "pos" : [550,-80 ], "color" : "6666CC", "trait" : "goalPost", "y" : -80 },
			
			{ "radius" : 3, "invMass" : 0, "pos" : [-550,240 ], "color" : "FFCC00", "bCoef" : 0.1, "trait" : "line" },
			{ "radius" : 3, "invMass" : 0, "pos" : [-550,-240 ], "color" : "FFCC00", "bCoef" : 0.1, "trait" : "line" },
			{ "radius" : 3, "invMass" : 0, "pos" : [550,-240 ], "color" : "FFCC00", "bCoef" : 0.1, "trait" : "line" },
			{ "radius" : 3, "invMass" : 0, "pos" : [550,240 ], "color" : "FFCC00", "bCoef" : 0.1, "trait" : "line" }

		],

		"planes" : [
			{ "normal" : [0,1 ], "dist" : -240, "bCoef" : 1, "trait" : "ballArea", "vis" : false, "curve" : 0 },
			{ "normal" : [0,-1 ], "dist" : -240, "bCoef" : 1, "trait" : "ballArea" },
			
			{ "normal" : [0,1 ], "dist" : -270, "bCoef" : 0.1 },
			{ "normal" : [0,-1 ], "dist" : -270, "bCoef" : 0.1 },
			{ "normal" : [1,0 ], "dist" : -620, "bCoef" : 0.1 },
			{ "normal" : [-1,0 ], "dist" : -620, "bCoef" : 0.1 },
			
			{ "normal" : [1,0 ], "dist" : -620, "bCoef" : 0.1, "trait" : "ballArea", "vis" : false, "curve" : 0 },
			{ "normal" : [-1,0 ], "dist" : -620, "bCoef" : 0.1, "trait" : "ballArea", "vis" : false, "curve" : 0 }

		],

		"traits" : {
			"ballArea" : { "vis" : false, "bCoef" : 1, "cMask" : ["ball" ] },
			"goalPost" : { "radius" : 8, "invMass" : 0, "bCoef" : 0.5 },
			"goalNet" : { "vis" : true, "bCoef" : 0.1, "cMask" : ["ball" ] },
			"line" : { "vis" : true, "bCoef" : 0.1, "cMask" : ["" ] },
			"kickOffBarrier" : { "vis" : false, "bCoef" : 0.1, "cGroup" : ["redKO","blueKO" ], "cMask" : ["red","blue" ] }

		},

		"playerPhysics" : {
			"bCoef" : 0,
			"acceleration" : 0.11,
			"kickingAcceleration" : 0.083,
			"kickStrength" : 5

		},

		"ballPhysics" : {
			"radius" : 6.25,
			"bCoef" : 0.4,
			"invMass" : 1.5,
			"damping" : 0.99,
			"color" : "FFCC00"

		}
	}`

	/* ESTÁDIO 2X2 */
	var stadiumx2 = `{

		"name" : "Futsal x2 FAZo7",

		"width" : 420,

		"height" : 200,

		"spawnDistance" : 170,

		"bg" : { "type" : "hockey", "width" : 370, "height" : 170, "kickOffRadius" : 75, "cornerRadius" : 0 },

		"vertexes" : [
			/* 0 */ { "x" : -370, "y" : 170, "bCoef" : 1.25, "trait" : "line", "color" : "F8F8F8", "vis" : true },
			
			/* 1 */ { "x" : -370, "y" : 64, "bCoef" : 1.25, "trait" : "ballArea", "color" : "F8F8F8", "vis" : true },
			/* 2 */ { "x" : -370, "y" : -64, "bCoef" : 1.25, "trait" : "ballArea", "color" : "F8F8F8", "vis" : true },
			
			/* 3 */ { "x" : -370, "y" : -170, "bCoef" : 1.25, "trait" : "line", "color" : "F8F8F8", "vis" : true },
			/* 4 */ { "x" : 370, "y" : 170, "bCoef" : 1.25, "trait" : "line", "color" : "F8F8F8", "vis" : true },
			
			/* 5 */ { "x" : 370, "y" : 64, "bCoef" : 1.25, "trait" : "ballArea", "color" : "F8F8F8", "vis" : true },
			/* 6 */ { "x" : 370, "y" : -64, "bCoef" : 1.25, "trait" : "ballArea", "color" : "F8F8F8", "vis" : true },
			
			/* 7 */ { "x" : 370, "y" : -170, "bCoef" : 1.25, "trait" : "line", "color" : "F8F8F8", "vis" : true },
			
			/* 8 */ { "x" : 0, "y" : 170, "trait" : "kickOffBarrier", "vis" : false, "color" : "F8F8F8" },
			
			/* 9 */ { "x" : 0, "y" : 75, "trait" : "line", "vis" : true, "color" : "F8F8F8" },
			/* 10 */ { "x" : 0, "y" : -75, "trait" : "line", "vis" : true, "color" : "F8F8F8" },
			
			/* 11 */ { "x" : 0, "y" : -170, "trait" : "kickOffBarrier", "vis" : true, "color" : "F8F8F8" },
			
			/* 12 */ { "x" : -370, "y" : -64, "cMask" : ["red","blue","ball" ], "trait" : "goalNet", "curve" : 0, "color" : "F8F8F8" },
			/* 13 */ { "x" : -402.5, "y" : -64, "cMask" : ["red","blue","ball" ], "trait" : "goalNet", "curve" : 0, "color" : "F8F8F8" },
			/* 14 */ { "x" : -402.5, "y" : 64, "cMask" : ["red","blue","ball" ], "trait" : "goalNet", "curve" : 0, "color" : "F8F8F8" },
			/* 15 */ { "x" : -370, "y" : 64, "cMask" : ["red","blue","ball" ], "trait" : "goalNet", "curve" : 0, "color" : "F8F8F8" },
			/* 16 */ { "x" : 370, "y" : -64, "cMask" : ["red","blue","ball" ], "trait" : "goalNet", "curve" : 0, "color" : "6666FF" },
			/* 17 */ { "x" : 402.5, "y" : -64, "cMask" : ["red","blue","ball" ], "trait" : "goalNet", "curve" : 0, "color" : "F8F8F8" },
			/* 18 */ { "x" : 402.5, "y" : 64, "cMask" : ["red","blue","ball" ], "trait" : "goalNet", "curve" : 0, "color" : "F8F8F8" },
			/* 19 */ { "x" : 370, "y" : 64, "cMask" : ["red","blue","ball" ], "trait" : "goalNet", "curve" : 0, "color" : "6666FF" },
			
			/* 20 */ { "x" : 0, "y" : 200, "bCoef" : 0.1, "cMask" : ["red","blue" ], "cGroup" : ["redKO","blueKO" ], "trait" : "kickOffBarrier", "vis" : false },
			/* 21 */ { "x" : 0, "y" : -200, "bCoef" : 0.1, "cMask" : ["red","blue" ], "cGroup" : ["redKO","blueKO" ], "trait" : "kickOffBarrier" },
			
			/* 22 */ { "x" : -370, "y" : 64, "trait" : "line", "vis" : true, "color" : "F8F8F8" },
			/* 23 */ { "x" : -370, "y" : -64, "trait" : "line", "vis" : true, "color" : "F8F8F8" },
			/* 24 */ { "x" : 370, "y" : 64, "trait" : "line", "vis" : true, "color" : "F8F8F8" },
			/* 25 */ { "x" : 370, "y" : -64, "trait" : "line", "vis" : true, "color" : "F8F8F8" },
			/* 26 */ { "x" : -377.5, "y" : 170, "bCoef" : 1.25, "trait" : "line", "color" : "F8F8F8", "vis" : false },
			
			/* 27 */ { "x" : -377.5, "y" : 64, "bCoef" : 1.25, "trait" : "ballArea", "color" : "F8F8F8", "vis" : false },
			/* 28 */ { "x" : -377.5, "y" : -64, "bCoef" : 1.25, "trait" : "ballArea", "color" : "F8F8F8", "vis" : false },
			
			/* 29 */ { "x" : -377.5, "y" : -170, "bCoef" : 1.25, "trait" : "line", "color" : "F8F8F8", "vis" : false },
			/* 30 */ { "x" : -387.5, "y" : 170, "bCoef" : 0, "trait" : "line", "color" : "F8F8F8", "vis" : false },
			
			/* 31 */ { "x" : -387.5, "y" : 64, "bCoef" : 0, "trait" : "ballArea", "color" : "F8F8F8", "vis" : false },
			/* 32 */ { "x" : -387.5, "y" : -64, "bCoef" : 0, "trait" : "ballArea", "color" : "F8F8F8", "vis" : false },
			
			/* 33 */ { "x" : -387.5, "y" : -170, "bCoef" : 0, "trait" : "line", "color" : "F8F8F8", "vis" : false },
			/* 34 */ { "x" : 377.5, "y" : 170, "bCoef" : 1.25, "trait" : "line", "color" : "F8F8F8", "vis" : false },
			
			/* 35 */ { "x" : 377.5, "y" : 64, "bCoef" : 1.25, "trait" : "ballArea", "color" : "F8F8F8", "vis" : false },
			/* 36 */ { "x" : 377.5, "y" : -64, "bCoef" : 1.25, "trait" : "ballArea", "color" : "F8F8F8", "vis" : false },
			
			/* 37 */ { "x" : 377.5, "y" : -170, "bCoef" : 1.25, "trait" : "line", "color" : "F8F8F8", "vis" : false },
			/* 38 */ { "x" : 387.5, "y" : 170, "bCoef" : 0, "trait" : "line", "color" : "F8F8F8", "vis" : false },
			
			/* 39 */ { "x" : 387.5, "y" : 64, "bCoef" : 0, "trait" : "ballArea", "color" : "F8F8F8", "vis" : false },
			/* 40 */ { "x" : 387.5, "y" : -64, "bCoef" : 0, "trait" : "ballArea", "color" : "F8F8F8", "vis" : false },
			
			/* 41 */ { "x" : 387.5, "y" : -170, "bCoef" : 0, "trait" : "line", "color" : "F8F8F8", "vis" : false },
			/* 42 */ { "x" : -370, "y" : 156, "bCoef" : 0.1, "trait" : "line", "color" : "F8F8F8", "curve" : 90 },
			/* 43 */ { "x" : -356, "y" : 170, "bCoef" : 0.1, "trait" : "line", "color" : "F8F8F8", "curve" : 90 },
			/* 44 */ { "x" : -370, "y" : -156, "bCoef" : 0.1, "trait" : "line", "color" : "F8F8F8", "curve" : -90 },
			/* 45 */ { "x" : -356, "y" : -170, "bCoef" : 0.1, "trait" : "line", "color" : "F8F8F8", "curve" : -90 },
			/* 46 */ { "x" : 370, "y" : -156, "bCoef" : 0.1, "trait" : "line", "color" : "F8F8F8", "curve" : 90 },
			/* 47 */ { "x" : 356, "y" : -170, "bCoef" : 0.1, "trait" : "line", "color" : "F8F8F8", "curve" : 90 },
			/* 48 */ { "x" : 370, "y" : 156, "bCoef" : 0.1, "trait" : "line", "color" : "F8F8F8", "curve" : -90 },
			/* 49 */ { "x" : 356, "y" : 170, "bCoef" : 0.1, "trait" : "line", "color" : "F8F8F8", "curve" : -90 },
			/* 50 */ { "x" : -370, "y" : 126, "bCoef" : 0.5, "trait" : "line", "color" : "F8F8F8" },
			/* 51 */ { "x" : -370, "y" : -126, "bCoef" : 0.5, "trait" : "line", "color" : "F8F8F8" },
			/* 52 */ { "x" : -280, "y" : -40, "bCoef" : 0.5, "trait" : "line", "color" : "F8F8F8", "curve" : 0 },
			/* 53 */ { "x" : -280, "y" : 40, "bCoef" : 0.5, "trait" : "line", "color" : "F8F8F8", "curve" : 0 },
			/* 54 */ { "x" : -396, "y" : 96, "trait" : "line" },
			/* 55 */ { "x" : -376, "y" : 96, "trait" : "line" },
			/* 56 */ { "x" : -396, "y" : -96, "trait" : "line" },
			/* 57 */ { "x" : -376, "y" : -96, "trait" : "line" },
			/* 58 */ { "x" : 370, "y" : -126, "bCoef" : 0.5, "trait" : "line", "color" : "F8F8F8" },
			/* 59 */ { "x" : 370, "y" : 126, "bCoef" : 0.5, "trait" : "line", "color" : "F8F8F8" },
			/* 60 */ { "x" : 280, "y" : 40, "bCoef" : 0.5, "trait" : "line", "color" : "F8F8F8", "curve" : 0 },
			/* 61 */ { "x" : 280, "y" : -40, "bCoef" : 0.5, "trait" : "line", "color" : "F8F8F8", "curve" : 0 },
			/* 62 */ { "x" : 396, "y" : -96, "trait" : "line" },
			/* 63 */ { "x" : 376, "y" : -96, "trait" : "line" },
			/* 64 */ { "x" : 396, "y" : 96, "trait" : "line" },
			/* 65 */ { "x" : 376, "y" : 96, "trait" : "line" },
			/* 66 */ { "x" : -247.5, "y" : 1, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
			/* 67 */ { "x" : -247.5, "y" : -1, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
			/* 68 */ { "x" : -247.5, "y" : 3, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
			/* 69 */ { "x" : -247.5, "y" : -3, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
			/* 70 */ { "x" : -247.5, "y" : -2, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
			/* 71 */ { "x" : -247.5, "y" : 2, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
			/* 72 */ { "x" : -247.5, "y" : -3.5, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
			/* 73 */ { "x" : -247.5, "y" : 3.5, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
			/* 74 */ { "x" : -187.5, "y" : 1, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
			/* 75 */ { "x" : -187.5, "y" : -1, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
			/* 76 */ { "x" : -187.5, "y" : 3, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
			/* 77 */ { "x" : -187.5, "y" : -3, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
			/* 78 */ { "x" : -187.5, "y" : -2, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
			/* 79 */ { "x" : -187.5, "y" : 2, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
			/* 80 */ { "x" : -187.5, "y" : -3.5, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
			/* 81 */ { "x" : -187.5, "y" : 3.5, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
			/* 82 */ { "x" : 187.5, "y" : 1, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
			/* 83 */ { "x" : 187.5, "y" : -1, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
			/* 84 */ { "x" : 187.5, "y" : 3, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
			/* 85 */ { "x" : 187.5, "y" : -3, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
			/* 86 */ { "x" : 187.5, "y" : -2, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
			/* 87 */ { "x" : 187.5, "y" : 2, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
			/* 88 */ { "x" : 187.5, "y" : -3.5, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
			/* 89 */ { "x" : 187.5, "y" : 3.5, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
			/* 90 */ { "x" : 247.5, "y" : 1, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
			/* 91 */ { "x" : 247.5, "y" : -1, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
			/* 92 */ { "x" : 247.5, "y" : 3, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
			/* 93 */ { "x" : 247.5, "y" : -3, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
			/* 94 */ { "x" : 247.5, "y" : -2, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
			/* 95 */ { "x" : 247.5, "y" : 2, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
			/* 96 */ { "x" : 247.5, "y" : -3.5, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
			/* 97 */ { "x" : 247.5, "y" : 3.5, "bCoef" : 0.1, "trait" : "line", "curve" : 180 },
			/* 98 */ { "x" : -245, "y" : 170, "bCoef" : 0.5, "trait" : "line", "color" : "F8F8F8", "curve" : 0 },
			/* 99 */ { "x" : -245, "y" : 184, "bCoef" : 0.5, "trait" : "line", "color" : "F8F8F8", "curve" : 0 },
			/* 100 */ { "x" : -245, "y" : -170, "bCoef" : 0.5, "trait" : "line", "color" : "F8F8F8", "curve" : 0 },
			/* 101 */ { "x" : -245, "y" : -184, "bCoef" : 0.5, "trait" : "line", "color" : "F8F8F8", "curve" : 0 },
			/* 102 */ { "x" : 245, "y" : 170, "bCoef" : 0.5, "trait" : "line", "color" : "F8F8F8", "curve" : 0 },
			/* 103 */ { "x" : 245, "y" : 184, "bCoef" : 0.5, "trait" : "line", "color" : "F8F8F8", "curve" : 0 },
			/* 104 */ { "x" : 245, "y" : -170, "bCoef" : 0.5, "trait" : "line", "color" : "F8F8F8", "curve" : 0 },
			/* 105 */ { "x" : 245, "y" : -184, "bCoef" : 0.5, "trait" : "line", "color" : "F8F8F8", "curve" : 0 }

		],

		"segments" : [
			{ "v0" : 0, "v1" : 1, "vis" : true, "color" : "F8F8F8", "bCoef" : 1.25, "trait" : "ballArea" },
			{ "v0" : 2, "v1" : 3, "vis" : true, "color" : "F8F8F8", "bCoef" : 1.25, "trait" : "ballArea" },
			{ "v0" : 4, "v1" : 5, "vis" : true, "color" : "F8F8F8", "bCoef" : 1.25, "trait" : "ballArea" },
			{ "v0" : 6, "v1" : 7, "vis" : true, "color" : "F8F8F8", "bCoef" : 1.25, "trait" : "ballArea" },
			
			{ "v0" : 12, "v1" : 13, "curve" : 0, "color" : "F8F8F8", "cMask" : ["red","blue","ball" ], "trait" : "goalNet", "y" : -64 },
			{ "v0" : 13, "v1" : 14, "curve" : 0, "color" : "F8F8F8", "cMask" : ["red","blue","ball" ], "trait" : "goalNet", "x" : -402.5 },
			{ "v0" : 14, "v1" : 15, "curve" : 0, "color" : "F8F8F8", "cMask" : ["red","blue","ball" ], "trait" : "goalNet", "y" : 64 },
			{ "v0" : 16, "v1" : 17, "curve" : 0, "color" : "F8F8F8", "cMask" : ["red","blue","ball" ], "trait" : "goalNet", "y" : -64 },
			{ "v0" : 17, "v1" : 18, "curve" : 0, "color" : "F8F8F8", "cMask" : ["red","blue","ball" ], "trait" : "goalNet", "x" : 402.5 },
			{ "v0" : 18, "v1" : 19, "curve" : 0, "color" : "F8F8F8", "cMask" : ["red","blue","ball" ], "trait" : "goalNet", "y" : 64 },
			
			{ "v0" : 8, "v1" : 9, "vis" : true, "color" : "F8F8F8", "trait" : "kickOffBarrier" },
			{ "v0" : 9, "v1" : 10, "curve" : 180, "vis" : true, "color" : "F8F8F8", "cGroup" : ["blueKO" ], "trait" : "kickOffBarrier" },
			{ "v0" : 9, "v1" : 10, "curve" : -180, "vis" : true, "color" : "F8F8F8", "cGroup" : ["redKO" ], "trait" : "kickOffBarrier" },
			{ "v0" : 10, "v1" : 11, "vis" : true, "color" : "F8F8F8", "trait" : "kickOffBarrier" },
			
			{ "v0" : 4, "v1" : 0, "vis" : true, "color" : "F8F8F8", "bCoef" : 1.25, "cMask" : ["" ], "trait" : "line" },
			{ "v0" : 3, "v1" : 7, "vis" : true, "color" : "F8F8F8", "bCoef" : 1.25, "cMask" : ["" ], "trait" : "line" },
			{ "v0" : 10, "v1" : 9, "vis" : true, "color" : "F8F8F8", "bCoef" : 1.25, "trait" : "line" },
			
			{ "v0" : 8, "v1" : 20, "vis" : false, "color" : "F8F8F8", "bCoef" : 0.1, "cMask" : ["red","blue" ], "cGroup" : ["redKO","blueKO" ], "trait" : "kickOffBarrier", "x" : 0 },
			{ "v0" : 11, "v1" : 21, "vis" : false, "color" : "F8F8F8", "bCoef" : 0.1, "cMask" : ["red","blue" ], "cGroup" : ["redKO","blueKO" ], "trait" : "kickOffBarrier" },
			
			{ "v0" : 23, "v1" : 22, "vis" : true, "color" : "F8F8F8", "bCoef" : 1.25, "trait" : "line", "x" : -370 },
			{ "v0" : 25, "v1" : 24, "vis" : true, "color" : "F8F8F8", "bCoef" : 1.25, "trait" : "line", "x" : 370 },
			
			{ "v0" : 26, "v1" : 27, "vis" : false, "color" : "F8F8F8", "bCoef" : 1.25, "trait" : "ballArea", "x" : -377.5 },
			{ "v0" : 28, "v1" : 29, "vis" : false, "color" : "F8F8F8", "bCoef" : 1.25, "trait" : "ballArea", "x" : -377.5 },
			{ "v0" : 30, "v1" : 31, "vis" : false, "color" : "F8F8F8", "bCoef" : 0, "trait" : "ballArea", "x" : -387.5 },
			{ "v0" : 32, "v1" : 33, "vis" : false, "color" : "F8F8F8", "bCoef" : 0, "trait" : "ballArea", "x" : -387.5 },
			{ "v0" : 34, "v1" : 35, "vis" : false, "color" : "F8F8F8", "bCoef" : 1.25, "trait" : "ballArea", "x" : 377.5 },
			{ "v0" : 36, "v1" : 37, "vis" : false, "color" : "F8F8F8", "bCoef" : 1.25, "trait" : "ballArea", "x" : 377.5 },
			{ "v0" : 38, "v1" : 39, "vis" : false, "color" : "F8F8F8", "bCoef" : 0, "trait" : "ballArea", "x" : 387.5 },
			{ "v0" : 40, "v1" : 41, "vis" : false, "color" : "F8F8F8", "bCoef" : 0, "trait" : "ballArea", "x" : 387.5 },
			
			{ "v0" : 50, "v1" : 53, "curve" : -90, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line" },
			{ "v0" : 52, "v1" : 51, "curve" : -90, "vis" : true, "color" : "F8F8F8", "trait" : "line" },
			{ "v0" : 52, "v1" : 53, "curve" : 0, "vis" : true, "color" : "F8F8F8", "trait" : "line", "x" : -280 },
			{ "v0" : 54, "v1" : 55, "curve" : 0, "vis" : true, "color" : "F8F8F8", "trait" : "line", "y" : 96 },
			{ "v0" : 56, "v1" : 57, "curve" : 0, "vis" : true, "color" : "F8F8F8", "trait" : "line", "y" : -96 },
			{ "v0" : 58, "v1" : 61, "curve" : -90, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line" },
			{ "v0" : 60, "v1" : 59, "curve" : -90, "vis" : true, "color" : "F8F8F8", "trait" : "line" },
			{ "v0" : 60, "v1" : 61, "curve" : 0, "vis" : true, "color" : "F8F8F8", "trait" : "line", "x" : 280 },
			{ "v0" : 62, "v1" : 63, "curve" : 0, "vis" : true, "color" : "F8F8F8", "trait" : "line", "y" : 96 },
			{ "v0" : 64, "v1" : 65, "curve" : 0, "vis" : true, "color" : "F8F8F8", "trait" : "line", "y" : -96 },
			{ "v0" : 67, "v1" : 66, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -247.5 },
			{ "v0" : 66, "v1" : 67, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -247.5 },
			{ "v0" : 69, "v1" : 68, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -247.5 },
			{ "v0" : 68, "v1" : 69, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -247.5 },
			{ "v0" : 71, "v1" : 70, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -247.5 },
			{ "v0" : 70, "v1" : 71, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -247.5 },
			{ "v0" : 73, "v1" : 72, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -247.5 },
			{ "v0" : 72, "v1" : 73, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -247.5 },
			{ "v0" : 75, "v1" : 74, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -187.5 },
			{ "v0" : 74, "v1" : 75, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -187.5 },
			{ "v0" : 77, "v1" : 76, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -187.5 },
			{ "v0" : 76, "v1" : 77, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -187.5 },
			{ "v0" : 79, "v1" : 78, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -187.5 },
			{ "v0" : 78, "v1" : 79, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -187.5 },
			{ "v0" : 81, "v1" : 80, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -187.5 },
			{ "v0" : 80, "v1" : 81, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : -187.5 },
			{ "v0" : 83, "v1" : 82, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : 187.5 },
			{ "v0" : 82, "v1" : 83, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : 187.5 },
			{ "v0" : 85, "v1" : 84, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : 187.5 },
			{ "v0" : 84, "v1" : 85, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : 187.5 },
			{ "v0" : 87, "v1" : 86, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : 187.5 },
			{ "v0" : 86, "v1" : 87, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : 187.5 },
			{ "v0" : 89, "v1" : 88, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : 187.5 },
			{ "v0" : 88, "v1" : 89, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : 187.5 },
			{ "v0" : 91, "v1" : 90, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : 247.5 },
			{ "v0" : 90, "v1" : 91, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : 247.5 },
			{ "v0" : 93, "v1" : 92, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : 247.5 },
			{ "v0" : 92, "v1" : 93, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : 247.5 },
			{ "v0" : 95, "v1" : 94, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : 247.5 },
			{ "v0" : 94, "v1" : 95, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : 247.5 },
			{ "v0" : 97, "v1" : 96, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : 247.5 },
			{ "v0" : 96, "v1" : 97, "curve" : 180, "vis" : true, "color" : "F8F8F8", "bCoef" : 0.1, "trait" : "line", "x" : 247.5 },
			{ "v0" : 98, "v1" : 99, "curve" : 0, "vis" : true, "color" : "F8F8F8", "trait" : "line", "x" : -245 },
			{ "v0" : 100, "v1" : 101, "curve" : 0, "vis" : true, "color" : "F8F8F8", "trait" : "line", "x" : -245 },
			{ "v0" : 102, "v1" : 103, "curve" : 0, "vis" : true, "color" : "F8F8F8", "trait" : "line", "x" : 245 },
			{ "v0" : 104, "v1" : 105, "curve" : 0, "vis" : true, "color" : "F8F8F8", "trait" : "line", "x" : 245 }

		],

		"goals" : [
			{ "p0" : [-370,64 ], "p1" : [-370,-64 ], "team" : "red", "x" : -370 },
			{ "p0" : [370,64 ], "p1" : [370,-64 ], "team" : "blue", "x" : 370, "color" : "6666FF" }

		],

		"discs" : [
			{ "radius" : 5, "pos" : [-370,64 ], "color" : "FF6666", "trait" : "goalPost", "x" : -370 },
			{ "radius" : 5, "pos" : [-370,-64 ], "color" : "FF6666", "trait" : "goalPost", "x" : -370 },
			{ "radius" : 5, "pos" : [370,64 ], "color" : "6666FF", "trait" : "goalPost", "x" : 370 },
			{ "radius" : 5, "pos" : [370,-64 ], "color" : "6666FF", "trait" : "goalPost", "x" : 370 }

		],

		"planes" : [
			{ "normal" : [0,1 ], "dist" : -170, "trait" : "ballArea" },
			{ "normal" : [0,-1 ], "dist" : -170, "trait" : "ballArea" },
			
			{ "normal" : [0,1 ], "dist" : -200, "bCoef" : 0.1 },
			{ "normal" : [0,-1 ], "dist" : -200, "bCoef" : 0.1 },
			{ "normal" : [1,0 ], "dist" : -432.5, "bCoef" : 0.1 },
			{ "normal" : [-1,0 ], "dist" : -432.5, "bCoef" : 0.1 },
			{ "normal" : [1,0 ], "dist" : -420, "bCoef" : 0.1, "cMask" : ["ball" ] },
			{ "normal" : [-1,0 ], "dist" : -420, "bCoef" : 0.1, "cMask" : ["ball" ] }

		],

		"traits" : {
			"ballArea" : { "vis" : false, "bCoef" : 1, "cMask" : ["ball" ] },
			"goalPost" : { "radius" : 8, "invMass" : 0, "bCoef" : 0.5 },
			"goalNet" : { "vis" : true, "bCoef" : 0.1, "cMask" : ["ball" ] },
			"line" : { "vis" : true, "bCoef" : 0.1, "cMask" : ["" ] },
			"kickOffBarrier" : { "vis" : false, "bCoef" : 0.1, "cGroup" : ["redKO","blueKO" ], "cMask" : ["red","blue" ] }

		},

		"ballPhysics" : {
			"radius" : 6.25,
			"color" : "FFCC00",
			"invMass" : 1.5,
			"bCoef" : 0.4

		},

		"playerPhysics" : {
			"kickStrength" : 4.75,
			"acceleration" : 0.11,
			"kickingAcceleration" : 0.083,
			"bCoef" : 0

		}
	}`

	/* ----- VARIÁVEIS GLOBAIS ----- */

	var playerAuth = [];
	var authWhiteList = [];
	const Role = { PLAYER: 0, ADMIN: 1, MASTER: 2 };
	const Uniform = { COUNTRY: 0, CLUBLA: 1, CLUBEU: 2 };
	var point = [{ "x": 0, "y": 0 }, { "x": 0, "y": 0 }];
	var speedCoefficient = 100 / (5 * (0.99 ** 60 + 1));
	var ballSpeed;
	var lastPlayerKick = { id: 0, team: 0 };
	var penultPlayerKick;
	var undefeatedScore = 0;
	var players;
	var numberEachTeam;
	var announcementColor = 0xFFFAFA;

	var commands = {
    "ajuda": {
        "aliases": [],
        "roles": Role.PLAYER,
        "desc": `Esse comando mostra todos os outros comandos, e pode também explicar a função de cada comando. \nExemple: \'!help bb\' mostrará a função do comando \'bb\'.`,
        "function": helpCommand,
    },
    "rr": {
        "aliases": [],
        "roles": Role.ADMIN,
        "desc": `Esse comando reinicia o jogo.`,
        "function": restartCommand,
    },
    "bb": {
        "aliases": ["bye", "gn", "cya"],
        "roles": Role.PLAYER,
        "desc": `Esse comando te desconecta rapidamente.`,
        "function": leaveCommand,
    },
    "claim": {
        "aliases": [],
        "roles": Role.ADMIN,
        "desc": false,
        "function": adminCommand,
    },
    "pass": {
        "aliases": [],
        "roles": Role.ADMIN,
        "desc": `Esse comando reinicia o jogo.`,
        "function": passwordCommand,
    },
    "uniforme": {
        "aliases": [],
        "roles": Role.PLAYER,
        "desc": `Esse comando mostra os uniformes disponíveis para colocar no seu time.\nExemplo: \'!uniforme bah\' coloca o uniforme do bahia em seu time.`,
        "function": uniformCommand,
    },
    "reserva": {
        "aliases": [],
        "roles": Role.PLAYER,
        "desc": `Esse comando muda o uniforme do time para reserva.\nExemplo: \'!reserva\' coloca o uniforme reserva do seu time.`,
        "function": reserveCommand,
    },
    // Novos comandos para UX
    "status": {
        "aliases": ["placar", "tempo"],
        "roles": Role.PLAYER,
        "desc": `Mostra o placar atual e tempo restante.`,
        "function": function(player, message) {
            const scores = room.getScores();
            const minRestantes = Math.floor((currentMapLimits.totalTime * 60 - scores.time) / 60);
            room.sendAnnouncement(centerText(`📊 Placar: ${scores.red}-${scores.blue} | Tempo restante: ${minRestantes} min`), player.id, announcementColor, "bold", Notification.CHAT);
        }
    },
    "regras": {
        "aliases": ["rules"],
        "roles": Role.PLAYER,
        "desc": `Mostra as regras do jogo.`,
        "function": function(player, message) {
            room.sendAnnouncement(centerText(`📜 Regras: Jogue até ${currentMapLimits.goals} gols ou ${currentMapLimits.time} min. !`), player.id, announcementColor, "bold", Notification.CHAT);
        }
    }
};

	var uniforms = {
		/* SELEÇÕES */
		"ale": {
			"name": 'Alemanha',
			"type": Uniform.COUNTRY,
			"emoji": '⚫🔴🟡',
			"angle": 90,
			"textcolor": 0x000000,
			"color1": 0xFFFFFF,
			"color2": 0xFFFFFF,
			"color3": 0xFFFFFF,
			"angle2": 0,
			"textcolor2": 0xEC1E31,
			"color21": 0x232522,
			"color22": 0x232522,
			"color23": 0x232522,
			"goalColor": 0x000000,
		},
		"arg": {
			"name": 'Argentina',
			"type": Uniform.COUNTRY,
			"emoji": '🔵⚪🔵',
			"angle": 90,
			"textcolor": 0x1F374B,
			"color1": 0x75AADB,
			"color2": 0xFFFFFF,
			"color3": 0x75AADB,
			"angle2": 0,
			"textcolor2": 0x9F8334,
			"color21": 0x103A73,
			"color22": 0x103A73,
			"color23": 0x103A73,
			"goalColor": 0x87CEEB,
		},
		"bra": {
			"name": 'Brasil',
			"type": Uniform.COUNTRY,
			"emoji": '🟡🔵🟢',
			"angle": 360,
			"textcolor": 0x27965A,
			"color1": 0xDBB71B,
			"color2": 0xDBB71B,
			"color3": 0xDBB71B,
			"angle2": 0,
			"textcolor2": 0xDBB71B,
			"color21": 0x1C56B4,
			"color22": 0x1C56B4,
			"color23": 0x1C56B4,
			"goalColor": 0xFFFF00
		},
		"esp": {
			"name": 'Espanha',
			"type": Uniform.COUNTRY,
			"emoji": '🔴🟡🔴',
			"angle": 90,
			"textcolor": 0xFFFF00,
			"color1": 0xFF0000,
			"color2": 0xFF0000,
			"color3": 0xFF0000,
			"angle2": 0,
			"textcolor2": 0xE4524A,
			"color21": 0xEFEFEF,
			"color22": 0xEFEFEF,
			"color23": 0xEFEFEF,
			"goalColor": 0xFF0000
		},
		"por": {
			"name": 'Portugal',
			"type": Uniform.COUNTRY,
			"emoji": '🟢🔴🔴',
			"angle": 0,
			"textcolor": 0x289E1F,
			"color1": 0xFF0000,
			"color2": 0xFF0000,
			"color3": 0xFF0000,
			"angle2": 90,
			"textcolor2": 0x0F303D,
			"color21": 0x48776F,
			"color22": 0x73CFB6,
			"color23": 0x73CFB6,
			"goalColor": 0xFF0000
		},
		"ita": {
			"name": 'Italia',
			"type": Uniform.COUNTRY,
			"emoji": '🟢⚪🔴',
			"angle": 0,
			"textcolor": 0xFFFFFF,
			"color1": 0x3646A9,
			"color2": 0x3646A9,
			"color3": 0x3646A9,
			"angle2": 90,
			"textcolor2": 0xDFC396,
			"color21": 0x12282E,
			"color22": 0x17433B,
			"color23": 0x17433B,
			"goalColor": 0x3646A9
		},
		"uru": {
			"name": 'Uruguai',
			"type": Uniform.COUNTRY,
			"emoji": '⚪🔵⚪',
			"angle": 0,
			"textcolor": 0x212124,
			"color1": 0x66A5D4,
			"color2": 0x66A5D4,
			"color3": 0x66A5D4,
			"angle2": 0,
			"textcolor2": 0x6CA0CF,
			"color21": 0xE5E5E7,
			"color22": 0xE5E5E7,
			"color23": 0xE5E5E7,
			"goalColor": 0x66A5D4
		},
		"fra": {
			"name": 'França',
			"type": Uniform.COUNTRY,
			"emoji": '🔵⚪🔴',
			"angle": 90,
			"textcolor": 0xF5F9F6,
			"color1": 0x265ECF,
			"color2": 0x384355,
			"color3": 0x384355,
			"angle2": 0,
			"textcolor2": 0x3243B4,
			"color21": 0xF5F9F6,
			"color22": 0xF5F9F6,
			"color23": 0xF5F9F6,
			"goalColor": 0x265ECF
		},
		"ing": {
			"name": 'Inglaterra',
			"type": Uniform.COUNTRY,
			"emoji": '⚪🔴⚪',
			"angle": 0,
			"textcolor": 0x0549A0,
			"color1": 0xDEDFE4,
			"color2": 0xDEDFE4,
			"color3": 0xDEDFE4,
			"angle2": 0,
			"textcolor2": 0xE92715,
			"color21": 0x2858AB,
			"color22": 0x2858AB,
			"color23": 0x2858AB,
			"goalColor": 0xFFFFFF
		},
		"bel": {
			"name": 'Bélgica',
			"type": Uniform.COUNTRY,
			"emoji": '⚫🔴🟡',
			"angle": 0,
			"textcolor": 0xCA9144,
			"color1": 0xC4212A,
			"color2": 0xC4212A,
			"color3": 0xC4212A,
			"angle2": 0,
			"textcolor2": 0x37312B,
			"color21": 0xEFC02E,
			"color22": 0xEFC02E,
			"color23": 0xEFC02E,
			"goalColor": 0xC4212A
		},

		/* CLUBES LA */
		"bah": {
			"name": 'Bahia',
			"type": Uniform.CLUBLA,
			"emoji": '🔵⚪🔴',
			"angle": 0,
			"textcolor": 0xFFDD00,
			"color1": 0xD10125,
			"color2": 0xE3DFE4,
			"color3": 0x1C3E94,
			"angle2": 270,
			"textcolor2": 0xD10125,
			"color21": 0xE3DFE4,
			"color22": 0xE3DFE4,
			"color23": 0x1C3E94,
			"goalColor": 0xD10125
		},
		"vit": {
			"name": 'Vitória',
			"type": Uniform.CLUBLA,
			"emoji": '🔴⚫🔴',
			"angle": 90,
			"textcolor": 0xFFFFFF,
			"color1": 0xFF1D0D,
			"color2": 0x000000,
			"color3": 0x000000,
			"angle2": 90,
			"textcolor2": 0x000000,
			"color21": 0xFF1D0D,
			"color22": 0xFFFFFF,
			"color23": 0xFFFFFF,
			"goalColor": 0xFF1D0D 
		},
		"pal": {
			"name": 'Palmeiras',
			"type": Uniform.CLUBLA,
			"emoji": '🟢⚪🟢',
			"angle": 0,
			"textcolor": 0xE3E7EB,
			"color1": 0x224A40,
			"color2": 0x224A40,
			"color3": 0x224A40,
			"angle2": 0,
			"textcolor2": 0x004738,
			"color21": 0xF4F6FA,
			"color22": 0xF4F6FA,
			"color23": 0xF4F6FA,
			"goalColor": 0x224A40
		},
		"cor": {
			"name": 'Corinthians',
			"type": Uniform.CLUBLA,
			"emoji": '⚪⚫⚪',
			"angle": 0,
			"textcolor": 0x000000,
			"color1": 0xFFFFFF,
			"color2": 0xFFFFFF,
			"color3": 0xFFFFFF,
			"angle2": 0,
			"textcolor2": 0xFFFFFF,
			"color21": 0x000000,
			"color22": 0x000000,
			"color23": 0x000000,
			"goalColor": 0xFFFFFF
		},
		"san": {
			"name": 'Santos',
			"type": Uniform.CLUBLA,
			"emoji": '⚪⚫⚪',
			"angle": 0,
			"textcolor": 0xB69754,
			"color1": 0xFFFFFF,
			"color2": 0xFFFFFF,
			"color3": 0xFFFFFF,
			"angle2": 0,
			"textcolor2": 0xB69754,
			"color21": 0x000000,
			"color22": 0xFFFFFF,
			"color23": 0x000000,
			"goalColor": 0xFFFFFF
		},
		"sao": {
			"name": 'São Paulo',
			"type": Uniform.CLUBLA,
			"emoji": '🔴⚪⚫',
			"angle": 90,
			"textcolor": 0x000000,
			"color1": 0xFF0A0A,
			"color2": 0xFFFFFF,
			"color3": 0x000000,
			"angle2": 90,
			"textcolor2": 0xFFFFFF,
			"color21": 0xCE393B,
			"color22": 0xCE393B,
			"color23": 0xCE393B,
			"goalColor": 0xFF0A0A
		},
		"fla": {
			"name": 'Flamengo',
			"type": Uniform.CLUBLA,
			"emoji": '🔴⚫🔴',
			"angle": 90,
			"textcolor": 0xFCF1ED,
			"color1": 0xBA1719,
			"color2": 0x1A1613,
			"color3": 0xBA1719,
			"angle2": 90,
			"textcolor2": 0xBA1719,
			"color21": 0x1A1613,
			"color22": 0x1A1613,
			"color23": 0x1A1613,
			"goalColor": 0xBA1719 
		},
		"flu": {
			"name": 'Fluminense',
			"type": Uniform.CLUBLA,
			"emoji": '🔴⚪🟢',
			"angle": 0,
			"textcolor": 0xFCFAFF,
			"color1": 0x005C38,
			"color2": 0x9B030C,
			"color3": 0x005C38,
			"angle2": 0,
			"textcolor2": 0x920F2E,
			"color21": 0xE4DADB,
			"color22": 0xE4DADB,
			"color23": 0xE4DADB,
			"goalColor": 0x005C38
		},
		"vas": {
			"name": 'Vasco',
			"type": Uniform.CLUBLA,
			"emoji": '⚫⚪⚫',
			"angle": 135,
			"textcolor": 0xFF0000,
			"color1": 0xFFFFFF,
			"color2": 0x000000,
			"color3": 0xFFFFFF,
			"angle2": 135,
			"textcolor2": 0xFF0000,
			"color21": 0x000000,
			"color22": 0xFFFFFF,
			"color23": 0x000000,
			"goalColor": 0xFFFFFF
		},
		"bot": {
			"name": 'Botafogo',
			"type": Uniform.CLUBLA,
			"emoji": '⚫⚪⚫',
			"angle": 0,
			"textcolor": 0xFFFFFF,
			"color1": 0xFFFFFF,
			"color2": 0x000000,
			"color3": 0xFFFFFF,
			"angle2": 0,
			"textcolor2": 0xFFFFFF,
			"color21": 0x000000,
			"color22": 0x3C3A3F,
			"color23": 0x000000,
			"goalColor": 0xFFFFFF
		},
		"gre": {
			"name": 'Gremio',
			"type": Uniform.CLUBLA,
			"emoji": '🔵⚪⚫',
			"angle": 0,
			"textcolor": 0xFFFFFF,
			"color1": 0x75ACFF,
			"color2": 0x000000,
			"color3": 0x75ACFF,
			"angle2": 0,
			"textcolor2": 0x4A87B7,
			"color21": 0xFFFFFF,
			"color22": 0xFFFFFF,
			"color23": 0xFFFFFF,
			"goalColor": 0x75ACFF
		},
		"int": {
			"name": 'Internacional',
			"type": Uniform.CLUBLA,
			"emoji": '🔴⚪🔴',
			"angle": 0,
			"textcolor": 0xEBE5E0,
			"color1": 0xD3051F,
			"color2": 0xD3051F,
			"color3": 0xD3051F,
			"angle2": 0,
			"textcolor2": 0xE30222,
			"color21": 0xEBE5E0,
			"color22": 0xEBE5E0,
			"color23": 0xEBE5E0,
			"goalColor": 0xD3051F
		},
		"cru": {
			"name": 'Cruzeiro',
			"type": Uniform.CLUBLA,
			"emoji": '🔵⚪🔵',
			"angle": 0,
			"textcolor": 0xFFFFFF,
			"color1": 0x023286,
			"color2": 0x023286,
			"color3": 0x023286,
			"angle2": 0,
			"textcolor2": 0x101B51,
			"color21": 0xFFFFFF,
			"color22": 0xFFFFFF,
			"color23": 0xFFFFFF,
			"goalColor": 0x023286
		},
		"atl": {
			"name": 'Atlético-MG',
			"type": Uniform.CLUBLA,
			"emoji": '⚫⚪⚫',
			"angle": 0,
			"textcolor": 0xC91926,
			"color1": 0x000000,
			"color2": 0xFFFFFF,
			"color3": 0x000000,
			"angle2": 90,
			"textcolor2": 0xC91926,
			"color21": 0x000000,
			"color22": 0xFFFFFF,
			"color23": 0xFFFFFF,
			"goalColor": 0x000000
		},
		"spo": {
			"name": 'Sport',
			"type": Uniform.CLUBLA,
			"emoji": '⚫🔴⚫',
			"angle": 90,
			"textcolor": 0xBCAE46,
			"color1": 0xBE2B2D,
			"color2": 0x020906,
			"color3": 0xBE2B2D,
			"angle2": 90,
			"textcolor2": 0xB6A043,
			"color21": 0x111317,
			"color22": 0xE5E0E2,
			"color23": 0xE5E0E2,
			"goalColor": 0xBA1719 
		},
		"riv": {
			"name": 'River Plate',
			"type": Uniform.CLUBLA,
			"emoji": '🔴⚪🔴',
			"angle": 45,
			"textcolor": 0x000000,
			"color1": 0xFFFAFA,
			"color2": 0xFF0000,
			"color3": 0xFFFAFA,
			"angle2": 45,
			"textcolor2": 0xFFFFFF,
			"color21": 0xAF1D27,
			"color22": 0xEA382C,
			"color23": 0xAF1D27,
			"goalColor": 0xFFFFFF
		},
		"boc": {
			"name": 'Boca Juniors',
			"type": Uniform.CLUBLA,
			"emoji": '🔵🟡🔵',
			"angle": 90,
			"textcolor": 0xFFFFFF,
			"color1": 0x05009C,
			"color2": 0xE0B60D,
			"color3": 0x05009C,
			"angle2": 90,
			"textcolor2": 0xFFFFFF,
			"color21": 0xE0B60D,
			"color22": 0x05009C,
			"color23": 0xE0B60D,
			"goalColor": 0xFFFF00
		},
		/* CLUBES EU */
		"che": {
			"name": 'Chelsea',
			"type": Uniform.CLUBEU,
			"emoji": '🔵⚪🔵',
			"angle": 90,
			"textcolor": 0xFFFFFF,
			"color1": 0x0000CD,
			"color2": 0x0000CD,
			"color3": 0x0000CD,
			"goalColor": 0x023286
		},
		"rea": {
			"name": 'Real Madrid',
			"type": Uniform.CLUBEU,
			"emoji": '🔵🟡⚪',
			"angle": 0,
			"textcolor": 0xDAA520,
			"color1": 0xFFFAFA,
			"color2": 0xFFFAFA,
			"color3": 0xFFFAFA,
			"goalColor": 0xDAA520
		},
		"juv": {
			"name": 'Juventus',
			"type": Uniform.CLUBEU,
			"emoji": '⚪⚫⚪',
			"angle": 180,
			"textcolor": 0xDAA520,
			"color1": 0x000000,
			"color2": 0xFFFFFF,
			"color3": 0x000000,
			"goalColor": 0xFFFFFF
		},
		"bay": {
			"name": 'Bayern de Munique',
			"type": Uniform.CLUBEU,
			"emoji": '🔴🔵⚪',
			"angle": 30,
			"textcolor": 0xFFD700,
			"color1": 0xFF0000,
			"color2": 0xF20000,
			"color3": 0xFF0000,
			"goalColor": 0xFFFFFF
		},
		"bar": {
			"name": 'Barcelona',
			"type": Uniform.CLUBEU,
			"emoji": '🔴🔵🟡',
			"angle": 0,
			"textcolor": 0xFFD700,
			"color1": 0x00008B,
			"color2": 0x8B0000,
			"color3": 0x00008B,
			"goalColor": 0x8B0000
		},
		"psg": {
			"name": 'Paris Sant-Germain',
			"type": Uniform.CLUBEU,
			"emoji": '🔵🔴🔵',
			"angle": 180,
			"textcolor": 0xFFFFFF,
			"color1": 0x000080,
			"color2": 0xB22222,
			"color3": 0x000080,
			"goalColor": 0xB22222
		},
	}

	var possibleTeams = Object.keys(uniforms);  // Lista com todos os times (bah, vit, pal, etc.)

	function setRandomTeams() {
	    console.log("setRandomTeams: Iniciando...");
	    
	    var categories = [Uniform.CLUBEU, Uniform.CLUBLA, Uniform.COUNTRY];
	    var selectedCategory = categories[Math.floor(Math.random() * categories.length)];
	    var teamsInCategory = Object.keys(uniforms).filter(key => uniforms[key].type === selectedCategory);
	    
	    console.log("setRandomTeams: Categoria selecionada=" + selectedCategory + ", Times na categoria=" + teamsInCategory.length);
	    
	    if (teamsInCategory.length < 2) {
	        console.log("Erro: Não há times suficientes na categoria " + selectedCategory + ". Times disponíveis: " + teamsInCategory.join(", "));
	        return;
	    }
	    
	    shuffleArray(teamsInCategory);
	    var team1 = teamsInCategory[0];
	    var team2 = teamsInCategory[1];
	    
	    nameHome = uniforms[team1].name;
	    acronymHome = team1;
	    emojiHome = uniforms[team1].emoji;
	    nameGuest = uniforms[team2].name;
	    acronymGuest = team2;
	    emojiGuest = uniforms[team2].emoji;
	    
	    room.setTeamColors(1, uniforms[acronymHome].angle, uniforms[acronymHome].textcolor, [uniforms[acronymHome].color1, uniforms[acronymHome].color2, uniforms[acronymHome].color3]);
	    room.setTeamColors(2, uniforms[acronymGuest].angle, uniforms[acronymGuest].textcolor, [uniforms[acronymGuest].color1, uniforms[acronymGuest].color2, uniforms[acronymGuest].color3]);
	    
	    console.log("setRandomTeams executada com sucesso: " + nameHome + " vs " + nameGuest);
	}
	   

function updateStadium() {
    var players = room.getPlayerList();
    var playerCount = players.length;
    
    if (playerCount <= 4) {
        room.setCustomStadium(stadiumx2);
        maxPlayersPerTeam = 2;
        maxTotalPlayers = 4;
        currentMapLimits = { time: 3, goals: 3, prorrogacaoTime: 3, totalTime: 6 };  // Stadiumx2: 3+3=6 min
    } else if (playerCount <= 9) {
        room.setCustomStadium(stadiumx3);
        maxPlayersPerTeam = 3;
        maxTotalPlayers = 6;
        currentMapLimits = { time: 5, goals: 5, prorrogacaoTime: 3, totalTime: 8 };  // Stadiumx3: 5+3=8 min
    } else {
        room.setCustomStadium(stadiumx6);
        maxPlayersPerTeam = 6;
        maxTotalPlayers = Infinity;
        currentMapLimits = { time: 10, goals: 8, prorrogacaoTime: 3, totalTime: 13 };  // Stadiumx6: 10+3=13 min
    }
    
    room.setTimeLimit(currentMapLimits.totalTime);
    room.setScoreLimit(currentMapLimits.goals);
}


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

	function startGameIfNeeded() {
	    if (!room.getScores()) {  // Se não há jogo ativo
	        console.log("Iniciando jogo automaticamente...");
	        room.startGame();
	    }
	}

function assignTeams() {
    try {
        var players = room.getPlayerList();
        var activePlayers = players.filter(p => p.team === 1 || p.team === 2).length;
        var spectators = players.filter(p => p.team === 0);
        var team1Count = players.filter(p => p.team === 1).length;
        var team2Count = players.filter(p => p.team === 2).length;
        
        console.log("assignTeams: activePlayers=" + activePlayers + ", maxTotalPlayers=" + maxTotalPlayers + ", spectators=" + spectators.length + ", team1=" + team1Count + ", team2=" + team2Count);
        
        if (spectators.length > 0) {
            shuffleArray(spectators);
            for (let i = 0; i < spectators.length && activePlayers < maxTotalPlayers; i++) {
                if (team1Count < maxPlayersPerTeam && team1Count <= team2Count) {
                    room.setPlayerTeam(spectators[i].id, 1);
                    team1Count++;
                    activePlayers++;
                } else if (team2Count < maxPlayersPerTeam) {
                    room.setPlayerTeam(spectators[i].id, 2);
                    team2Count++;
                    activePlayers++;
                }
            }
        } else if (Math.abs(team1Count - team2Count) > 1) {
            shuffleArray(players.filter(p => p.team !== 0));
            var balancedPlayers = players.filter(p => p.team !== 0);
            var half = Math.floor(balancedPlayers.length / 2);
            for (let i = 0; i < balancedPlayers.length; i++) {
                if (i < half) {
                    room.setPlayerTeam(balancedPlayers[i].id, 1);
                } else {
                    room.setPlayerTeam(balancedPlayers[i].id, 2);
                }
            }
            room.sendAnnouncement(centerText(`⚖️ Times balanceados automaticamente!`), null, announcementColor, "normal", Notification.CHAT);
        }
        updateTeams();
        console.log("assignTeams: Redistribuição concluída.");
    } catch (e) {
        console.log("Erro em assignTeams: " + e);
    }
}
	   

	/* ----- CONFIGURAÇÕES DE ESTÁDIO E TIME INCIAL ----- */
	room.setCustomStadium(stadiumx2);
	setRandomTeams();
	room.setScoreLimit(5);
	room.setTimeLimit(6);

	room.setTeamColors(1, uniforms[acronymHome].angle, uniforms[acronymHome].textcolor, [uniforms[acronymHome].color1, uniforms[acronymHome].color2, uniforms[acronymHome].color3]);

	room.setTeamColors(2, uniforms[acronymGuest].angle, uniforms[acronymGuest].textcolor, [uniforms[acronymGuest].color1, uniforms[acronymGuest].color2, uniforms[acronymGuest].color3]);

	/* ----- FUNÇÕES PRIMÁRIAS ----- */

room.onGameStart = function () {
    console.log("onGameStart: Iniciando partida...");
    updateStadium();
    if (!nameHome || !nameGuest) {
        setRandomTeams();
    }
    assignTeams();
    startGameIfNeeded();
    
    // Fala inicial animada
    room.sendAnnouncement(centerText(`🎉 E COMEÇA O JOGO ENTRE ${emojiHome} ${nameHome} E ${nameGuest} ${emojiGuest} 🔔`), null, announcementColor, "bold", Notification.CHAT);
    
    room.sendAnnouncement(centerText(`🥅🥅 PARTIDA INICIANDO 🥅🥅`), null, announcementColor, "bold", Notification.CHAT);
    room.sendAnnouncement(centerText(`${emojiHome} ${nameHome} X ${nameGuest} ${emojiGuest}`), null, announcementColor, "bold", 0);
    
    if (undefeatedScore !== 0) {
        room.sendAnnouncement(centerText(`     📢 ${nameHome} está invicto 📢`), null, announcementColor, "bold", 0);
        room.sendAnnouncement(centerText(`     📢 Sequência de ${undefeatedScore} jogo(s) 📢`), null, announcementColor, "bold", 0);
    }
    
    Hposs = 0;
    Gposs = 0;
}

room.onPlayerJoin = function (player) {
    room.sendAnnouncement(centerText(`[PV] Bem-Vindo ${player.name}! 🎉`), player.id, announcementColor, "bold", Notification.CHAT);
    room.sendAnnouncement(centerText(`[PV] Regras: Jogue até ${currentMapLimits.goals} gols ou ${currentMapLimits.time} min. Prorrogação se empatar!`), player.id, announcementColor, "bold", 0);
    room.sendAnnouncement(centerText(`[PV] Comandos: !ajuda, !status, !regras, !uniforme, !reserva. Divirta-se! ⚽`), player.id, announcementColor, "bold", 0);
    updateAdmins();
    updateStadium();
    var players = room.getPlayerList();
    if (players.length < 7) {
        numberEachTeam = parseInt(players.length / 2);
    } else {
        numberEachTeam = 3;
    }
}
	   

	room.onPlayerLeave = function (player) {
	    updateAdmins();
	    updateStadium();  // Adicione esta linha
	    var players = room.getPlayerList();
	    if (players.length < 7) {
	        numberEachTeam = parseInt(players.length / 2);
	    } else {
	        numberEachTeam = 3;
	    }
	}

	room.onPlayerChat = function (player, message) {
		let msgArray = message.split(/ +/);
		if (msgArray[0][0] === '!') {
			let command = getCommand(msgArray[0].slice(1).toLowerCase());
			if (command !== false) commands[command].function(player, message);
			return false;
		}
	}

	room.onPlayerBallKick = function (player) {
	    if (player.id !== lastPlayerKick.id || player.team !== lastPlayerKick.team) {
	        penultPlayerKick = lastPlayerKick;
	        lastPlayerKick = player;
	    }
	    // Adicione: Incrementa posse imediatamente no chute/toque para maior fidelidade
	    if (player.team == 1) Hposs++;
	    else if (player.team == 2) Gposs++;
	}

room.onGameTick = function () {
    try {
        getStats();
        
        const scores = room.getScores();
        const timeLimitSeconds = currentMapLimits.totalTime * 60;
        const prorrogacaoStart = currentMapLimits.time * 60;
        const warningTime30 = 30;
        const warningTime10 = 10;
        
        // Status a cada 1 min
        if (scores.time % 60 === 0 && scores.time > 0) {
            const minRestantes = Math.floor((timeLimitSeconds - scores.time) / 60);
            room.sendAnnouncement(centerText(`⏰ Tempo restante: ${minRestantes} min | Placar: ${scores.red}-${scores.blue}`), null, announcementColor, "normal", Notification.CHAT);
        }
        
        // Avisos antecipados (30s e 10s)
        if (scores.time >= (timeLimitSeconds - warningTime30) && scores.time < timeLimitSeconds && !warningSent30) {
            warningSent30 = true;
            if (scores.red === scores.blue) {
                room.sendAnnouncement(centerText(`⚠️ EMPATE IMINENTE! Fim em 30 segundos...`), null, announcementColor, "bold", Notification.CHAT);
            } else {
                const diff = Math.abs(scores.red - scores.blue);
                const winningTeam = scores.red > scores.blue ? nameHome : nameGuest;
                room.sendAnnouncement(centerText(`⚠️ ${winningTeam} está ganhando por ${diff}! Fim em 30 segundos...`), null, announcementColor, "bold", Notification.CHAT);
            }
        }
        if (scores.time >= (timeLimitSeconds - warningTime10) && scores.time < timeLimitSeconds && !warningSent10) {
            warningSent10 = true;
            if (scores.red === scores.blue) {
                room.sendAnnouncement(centerText(`⚠️ EMPATE IMINENTE! Fim em 10 segundos...`), null, announcementColor, "bold", Notification.CHAT);
            } else {
                const diff = Math.abs(scores.red - scores.blue);
                const winningTeam = scores.red > scores.blue ? nameHome : nameGuest;
                room.sendAnnouncement(centerText(`⚠️ ${winningTeam} está ganhando por ${diff}! Fim em 10 segundos...`), null, announcementColor, "bold", Notification.CHAT);
            }
        }
        
        // Contagem regressiva (sempre no fim, independente do placar)
        if (scores.time >= (timeLimitSeconds - 3) && scores.time < timeLimitSeconds && !countdownActive) {
            countdownActive = true;
            for (let i = 3; i > 0; i--) {
                setTimeout(() => {
                    room.sendAnnouncement(centerText(`⏰ ${i}...`), null, announcementColor, "bold", Notification.CHAT);
                }, (3 - i) * 1000);
            }
        }
        
        // Início da prorrogação (sempre aos X min, independente do placar)
        if (scores.time >= prorrogacaoStart && scores.time < timeLimitSeconds && !isProrrogacao) {
            isProrrogacao = true;
            room.sendAnnouncement(centerText(`⏰ PRORROGAÇÃO - ${currentMapLimits.prorrogacaoTime} min`), null, announcementColor, "bold", Notification.CHAT);
        }
        
        // Fim total: Reinicia se empatado
        if (scores.time >= timeLimitSeconds && scores.red === scores.blue && !gameEndedByTime) {
            gameEndedByTime = true;
            room.stopGame();
            room.sendAnnouncement(centerText(`⏰ PRORROGAÇÃO ESGOTADA! EMPATE - Reiniciando com novos times...`), null, announcementColor, "bold", Notification.CHAT);
            updateTeams();
            setTimeout(() => {
                setRandomTeams();
                assignTeams();
                updateStadium();
                room.startGame();
            }, 5000);
        }
    } catch (e) {
        console.log("Erro em onGameTick: " + e);
    }
};

     

room.onGameStop = function (byPlayer) {
    if (gameEndedByTime) {
        gameEndedByTime = false;
        warningSent30 = false;
        warningSent10 = false;
        countdownActive = false;
        isProrrogacao = false;  // Atualizado
    }
};

room.onTeamGoal = function (team) {
    try {
        const goalTime = getTime();
        const scores = room.getScores();
        
        var goalColor = announcementColor;
        if (lastPlayerKick.team === team) {
            goalColor = uniforms[acronymHome].goalColor || announcementColor;
            if (team === 2) goalColor = uniforms[acronymGuest].goalColor || announcementColor;
        } else {
            goalColor = uniforms[acronymHome].goalColor || announcementColor;
            if (team === 2) goalColor = uniforms[acronymGuest].goalColor || announcementColor;
        }
        
        if (lastPlayerKick.team === team) {
            room.sendAnnouncement(centerText(`💥 GOOOOOL!!! Autor: ${lastPlayerKick.name} - Velocidade: ${ballSpeed.toFixed()}km/h 💥`), null, goalColor, "bold", 0);
            if (penultPlayerKick.team === team) {
                room.sendAnnouncement(centerText(`🤝 Assistência: ${penultPlayerKick.name}`), null, goalColor, "bold", 0);
            }
        } else {
            room.sendAnnouncement(centerText(`🤦‍♂️ GOOOOOL CONTRA!! Autor: ${lastPlayerKick.name} - Velocidade: ${ballSpeed.toFixed()}km/h`), null, goalColor, "bold", 0);
        }
        
        if (lastPlayerKick.team === team) {
            if (team === 1) goalsHome.push(`${lastPlayerKick.name}  ${goalTime}`);
            else goalsGuest.push(`${lastPlayerKick.name}  ${goalTime}`);
        } else {
            if (team === 1) goalsHome.push(`${lastPlayerKick.name} (C)  ${goalTime}`);
            else goalsGuest.push(`${lastPlayerKick.name} (C)  ${goalTime}`);
        }
    } catch (e) {
        console.log("Erro em onTeamGoal: " + e);
    }
}
	   
	   

room.onTeamVictory = function () {
    try {
        console.log("onTeamVictory: Iniciando...");
        updateStadium();
        
        const scores = room.getScores();
        
        var totalPoss = Hposs + Gposs;
        if (totalPoss > 0) {
            Hposs = Hposs / totalPoss;
            Gposs = 1 - Hposs;
        } else {
            Hposs = 0.5;
            Gposs = 0.5;
        }
        Hposs = Math.max(0.1, Math.min(0.9, Hposs));
        Gposs = 1 - Hposs;
        
        room.sendAnnouncement(centerText(`🏆 FIM DE PARTIDA 🏆`), null, announcementColor, "bold", Notification.CHAT);
        room.sendAnnouncement(centerText(`${emojiHome} ${nameHome} ${scores.red} - ${scores.blue} ${nameGuest} ${emojiGuest}`), null, 0x0000FF, "bold", 0);
        room.sendAnnouncement(centerText(`${emojiHome} ` + (Hposs * 100).toFixed(1) + `% Posse ` + (Gposs * 100).toFixed(1) + `% ${emojiGuest}`), null, announcementColor, "bold", 0);
        
        for (var i = 0; i < currentMapLimits.goals; i++) {
            room.sendAnnouncement(docketFormat(goalsHome[i], goalsGuest[i]), null, announcementColor, "bold", 0);
        }
        
        if (scores.red == scores.blue) {
            // Empate: Prorrogação já tratada em onGameTick
        } else if (scores.red > scores.blue) {
            console.log("onTeamVictory: Time 1 venceu.");
            setTimeout(function () {
                for (var i = 0; i < playersTeamGuest.length; i++) {
                    room.setPlayerTeam(playersTeamGuest[i].id, 0);
                }
                updateTeams();
            }, 6000);
            
            setTimeout(function () {
                console.log("onTeamVictory: Chamando setRandomTeams()...");
                setRandomTeams();
                assignTeams();
                updateStadium();
                room.startGame();
            }, 9000);
            
            undefeatedScore++;
            
        } else {
            console.log("onTeamVictory: Time 2 venceu.");
            setTimeout(function () {
                for (var i = 0; i < playersTeamHome.length; i++) {
                    room.setPlayerTeam(playersTeamHome[i].id, 0);
                }
                updateTeams();
            }, 6000);
            
            setTimeout(function () {
                console.log("onTeamVictory: Chamando setRandomTeams()...");
                setRandomTeams();
                assignTeams();
                updateStadium();
                room.startGame();
            }, 9000);
            
            undefeatedScore = 0;
            undefeatedScore++;
        }
        
        setTimeout(function () { 
            lastPlayerKick = { id: 0, team: 0 };
            penultPlayerKick = undefined;
            goalsHome = [];
            goalsGuest = [];
        }, 8000);
        
    } catch (e) {
        console.log("Erro em onTeamVictory: " + e);
    }
}
	   
	/* ----- FUNÇÕES AUXILIARES ----- */
     

	function getCommand(commandStr) {
		if (commands.hasOwnProperty(commandStr)) return commandStr;
		for (const [key, value] of Object.entries(commands)) {
			for (let i = 0; i < value.aliases.length; i++) {
				if (value.aliases[i] === commandStr) return key;
			}
		}
		return false;
	}

	function updateAdmins() {
		var players = room.getPlayerList();
		if (players.length == 0) return;
		if (players.find((player) => player.admin) != null) return;
		room.setPlayerAdmin(players[0].id, true);
	}

	function centerText(string) {
	    var space;
	    space = parseInt((80 - string.length) * 0.8, 10);
	    space = Math.max(0, space);  // Adicione esta linha: evita valores negativos
	    return ' '.repeat(space) + string + ' '.repeat(space);
	}

	function docketFormat(string1, string2) {
		if (string1 !== undefined && string2 === undefined) {
			var space = 53 - (string1.length) * 0.8;
			return ' '.repeat(space) + string1
		} else if (string2 !== undefined && string1 === undefined) {
			return ' '.repeat(77) + string2
		} else if (string2 !== undefined && string1 !== undefined) {
			var space = 16 - (string1.length + 10 + string2.length)
			return ' '.repeat(12) + centerText(string1 + ' '.repeat(10) + string2)
		} else if (string1 === undefined && string2 === undefined) {
			return ''
		}
	}

function updateTeams() {
    var players = room.getPlayerList();
    playersTeamHome = players.filter(player => player.team === 1);
    playersTeamGuest = players.filter(player => player.team === 2);
    playersTeamEspec = players.filter(player => player.team === 0);
    console.log("updateTeams: Home=" + playersTeamHome.length + ", Guest=" + playersTeamGuest.length);  // Log para depurar
}

	function getTime() {
		const scores = room.getScores();
		var min = parseInt(scores.time / 60);
		var sec = parseInt(scores.time) - min * 60;
		return `[${min}' ${sec}"]`
	}





	function getStats() {
	    const ballPosition = room.getBallPosition();
	    point[1] = point[0];
	    point[0] = ballPosition;
	    var instantSpeed = pointDistance(point[0], point[1]) * speedCoefficient;
	    
	    // Adiciona à história e calcula média móvel para suavizar
	    ballSpeedHistory.push(instantSpeed);
	    if (ballSpeedHistory.length > maxHistoryLength) ballSpeedHistory.shift();  // Mantém apenas as últimas medições
	    var averageSpeed = ballSpeedHistory.reduce((a, b) => a + b, 0) / ballSpeedHistory.length;
	    
	    ballSpeed = Math.round(Math.max(0, Math.min(100, averageSpeed)));  // Limita entre 0-100 km/h para fidelidade
	    
	    // Posse (mantida como antes)
	    if (lastPlayerKick.team == 1) Hposs++;
	    else if (lastPlayerKick.team == 2) Gposs++;
	}

	function pointDistance(p1, p2) {
		var d1 = p1.x - p2.x;
		var d2 = p1.y - p2.y;
		return Math.sqrt(d1 * d1 + d2 * d2);
	}

	function instantRestart() {
		room.stopGame();
		setTimeout(() => { 
			room.startGame();
			lastPlayerKick = { id: 0, team: 0 };
			penultPlayerKick = undefined;
			goalsHome = [];
			goalsGuest = []; 
		}, 10);

	}

	function getCommand(commandStr) {
		if (commands.hasOwnProperty(commandStr)) return commandStr;
		for (const [key, value] of Object.entries(commands)) {
			for (let i = 0; i < value.aliases.length; i++) {
				if (value.aliases[i] === commandStr) return key;
			}
		}
		return false;
	}

	function getUniform(uniformStr) {
		if (uniforms.hasOwnProperty(uniformStr)) return uniformStr;
		for (const [key, value] of Object.entries(uniforms)) {
			for (let i = 0; i < value.aliases.length; i++) {
				if (value.aliases[i] === uniformStr) return key;
			}
		}
		return false;
	}

	function changeUniforme() {
		var a = nameHome;
		nameHome = nameGuest;
		nameGuest = a;

		var b = acronymHome;
		acronymHome = acronymGuest;
		acronymGuest = b;

		var c = emojiHome;
		emojiHome = emojiGuest;
		emojiGuest = c;

		room.setTeamColors(1, uniforms[acronymHome].angle, uniforms[acronymHome].textcolor, [uniforms[acronymHome].color1, uniforms[acronymHome].color2, uniforms[acronymHome].color3]);
		
		room.setTeamColors(2, uniforms[acronymGuest].angle, uniforms[acronymGuest].textcolor, [uniforms[acronymGuest].color1, uniforms[acronymGuest].color2, uniforms[acronymGuest].color3]);
	}

	/* ----- FUNÇÕES DOS COMANDOS ----- */

	function restartCommand(player, message) {
		if (player.admin) instantRestart();
	}

	function passwordCommand(player, message) {
		if (player.admin) {
			msgArray = message.split(/ +/).slice(1);
			if (msgArray.length === 0) {
				room.setPassword(null);
			}
			if (msgArray.length >= 1) {
				room.setPassword(`${msgArray[0]}`);
			}
		}
	}

	function leaveCommand(player, message) {
		room.kickPlayer(player.id, "Tchau !", false);
	}

	function adminCommand(player, message) {
		msgArray = message.split(/ +/).slice(1);
		if (parseInt(msgArray[0]) === adminPassword) {
			room.setPlayerAdmin(player.id, true);
			authWhiteList.push(playerAuth[player.id]);
			room.sendAnnouncement(`${player.name} agora é o mestre da sala !`, null, announcementColor, "bold", Notification.CHAT);
		}
	}

	function helpCommand(player, message) {
		msgArray = message.split(/ +/).slice(1);
		if (msgArray.length === 0) {
			var commandString = "[PV] LISTA DE COMANDOS DO SERVER"
			commandString += "\nComandos de Players:";
			for (const [key, value] of Object.entries(commands)) {
				if (value.desc && value.roles === Role.PLAYER) commandString += ` !${key},`;
			}
			commandString = commandString.substring(0, commandString.length - 1) + ".";
			if (player.admin) {
				commandString += `\nComandos de Administradores :`;
				for (const [key, value] of Object.entries(commands)) {
					if (value.desc && value.roles === Role.ADMIN) commandString += ` !${key},`;
				}
			}

			if (commandString.slice(commandString.length - 1) === ":") commandString += ` None,`;
			commandString = commandString.substring(0, commandString.length - 1) + ".";
			if (commandString.slice(commandString.length - 1) === ":") commandString += ` None,`;
			commandString = commandString.substring(0, commandString.length - 1) + ".";
			commandString += "\n\nPara obter informações sobre um comando em específico, digite '\'!ajuda <nome do comando>\'.";
			room.sendAnnouncement(commandString, player.id, announcementColor, "bold", Notification.CHAT);
		}
		else if (msgArray.length >= 1) {
			var commandName = getCommand(msgArray[0].toLowerCase());
			if (commandName !== false && commands[commandName].desc !== false) room.sendAnnouncement(`[PV] Comando \'${commandName}\' :\n${commands[commandName].desc}`, player.id, statsColor, "bold", Notification.CHAT);
			else room.sendAnnouncement(`[PV] Esse comando não existe. Para olhar a lista de comandos digite \'!ajuda\'`, player.id, announcementColor, "bold", Notification.CHAT);
		}
	}

	function uniformCommand(player, message) {
		msgArray = message.split(/ +/).slice(1);
		if (msgArray.length === 0) {
			var uniformString = "[PV] Seleções :";
			for (const [key, value] of Object.entries(uniforms)) {
				if (value.type === Uniform.COUNTRY) uniformString += `\n${value.name}: !uniforme ${key}`;
			}
			uniformString += `\n`
			room.sendAnnouncement(uniformString, player.id, announcementColor, "bold", Notification.CHAT);
			uniformString2 = `[PV] Clubes Sul-americanos :`;
			for (const [key, value] of Object.entries(uniforms)) {
				if (value.type === Uniform.CLUBLA) uniformString2 += `\n${value.name}: !uniforme ${key}`;
			}
			uniformString2 += `\n`
			room.sendAnnouncement(uniformString2, player.id, announcementColor, "bold", Notification.CHAT);
			uniformString3 = `[PV] Clubes Europeus :`;
			for (const [key, value] of Object.entries(uniforms)) {
				if (value.type === Uniform.CLUBEU) uniformString3 += `\n${value.name}: !uniforme ${key}`;
			}
			uniformString3 += `\n`
			room.sendAnnouncement(uniformString3, player.id, announcementColor, "bold", Notification.CHAT);
			room.sendAnnouncement("Para escolher um uniforme para seu time digite '\'!uniforme <nome do time>\'.", player.id, announcementColor, "bold", Notification.CHAT);
		}
		else if (msgArray.length >= 1) {
			var uniformName = getUniform(msgArray[0].toLowerCase());
			if (uniformName !== false && uniforms[uniformName].name !== false) {
				room.sendAnnouncement(`[PV] O uniforme do \'${uniforms[uniformName].name}\' foi colocado em seu time.`, player.id, announcementColor, "bold", Notification.CHAT);

				room.setTeamColors(player.team, uniforms[uniformName].angle, uniforms[uniformName].textcolor, [uniforms[uniformName].color1, uniforms[uniformName].color2, uniforms[uniformName].color3]);

				if (player.team == 1) {
					nameHome = uniforms[uniformName].name;
					acronymHome = uniformName;
					emojiHome = uniforms[uniformName].emoji;
				} else if (player.team == 2) {
					nameGuest = uniforms[uniformName].name;
					acronymGuest = uniformName;
					emojiGuest = uniforms[uniformName].emoji;
				}
			} else {
				room.sendAnnouncement(`[PV] Esse uniforme não existe, digite \'!uniforme\' para ver todos os disponíveis`, player.id, announcementColor, "bold", Notification.CHAT);
			}
		}
	}

	function reserveCommand(player) {

		if (player.team === 1 && nameHome !== 'Mandante') {
			room.setTeamColors(player.team, uniforms[acronymHome].angle2, uniforms[acronymHome].textcolor2, [uniforms[acronymHome].color21, uniforms[acronymHome].color22, uniforms[acronymHome].color23]);
		} else if (player.team === 1 && nameHome === 'Mandante') {
			room.sendAnnouncement(`[PV] Seu time ainda não tem um uniforme, digite !uniforme e veja as possibilidades.`, player.id, announcementColor, "bold", Notification.CHAT);
		}

		if (player.team === 2 && nameGuest !== 'Visitante') {
			room.setTeamColors(player.team, uniforms[acronymGuest].angle2, uniforms[acronymGuest].textcolor2, [uniforms[acronymGuest].color21, uniforms[acronymGuest].color22, uniforms[acronymGuest].color23]);
		} else if (player.team === 2 && nameGuest === 'Visitante') {
			room.sendAnnouncement(`[PV] Seu time ainda não tem um uniforme, digite !uniforme e veja as possibilidades.`, player.id, announcementColor, "bold", Notification.CHAT);
		}
	}