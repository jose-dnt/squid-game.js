const prompt = require("prompt-sync")({sigint: true})

let language = "EN-US"

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function generateDebt() {

    const min = 10000
    const max = 10000000

    let randomNumber = `${10 ** randomIntFromInterval(Math.log10(min), Math.log10(max))}`

    let debt;
    if (Math.log10(randomNumber) === 7) {
        let firstDigit = randomIntFromInterval(1, 9)
        if (firstDigit === 1)
            debt = max
        else
            debt = parseInt(`${randomIntFromInterval(1, 9)}${randomIntFromInterval(1, 9)}${randomNumber.substring(3)}`)
    } else
        debt = parseInt(`${randomIntFromInterval(1, 9)}${randomIntFromInterval(1, 9)}${randomNumber.substring(2)}`)

    return debt

    // if (debt >= 1000000)
    //     debt = `R$${debt / 1000000}m`
    // else
    //     debt = `R$${debt / 1000}k`

}

function generateDesperation(debt) {

    const minDebt = 10000
    const maxDebt = 10000000

    let normalizedDebt = (debt - minDebt) / (maxDebt - minDebt)

    let desperation = parseFloat((0.5 + normalizedDebt * 1.5).toFixed(1))

    return desperation

}

function generateQuirk() {

    let quirks = ["paranoia", "psychopathy"]

    let quirk = "none"

    let randomNumber = randomIntFromInterval(0, quirks.length - 1)

    if (Math.random() < 0.025)
        quirk = quirks[randomNumber]

    return quirk

}

class Player {

    constructor(number) {
        this.number = number
    }

    gender = Math.random < 0.5 ? "male" : "female"
    isAlive = true;
    debt = generateDebt();
    desperation = generateDesperation(this.debt)

    fitness = randomIntFromInterval(50, 150) / 100
    strength = randomIntFromInterval(50, 150) / 100
    intellect = randomIntFromInterval(50, 150) / 100

    quirk = generateQuirk()

    bravery = this.quirk === "paranoia" ? 0.5 : this.quirk === "psychopathy" ? 1.5 : randomIntFromInterval(50, 150) / 100
    charisma = this.quirk === "paranoia" ? 0.5 : this.quirk === "psychopathy" ? 1.5 : randomIntFromInterval(50, 150) / 100
    hostility = this.quirk === "paranoia" || this.quirk === "psychopathy" ? 1.5 : randomIntFromInterval(50, 150) / 100
    empathy = this.quirk === "paranoia" || this.quirk === "psychopathy" ? 0 : randomIntFromInterval(50, 150) / 100
    loyalty = this.quirk === "paranoia" || this.quirk === "psychopathy" ? 0 : randomIntFromInterval(50, 150) / 100
    trust = this.quirk === "paranoia" || this.quirk === "psychopathy" ? 0 : randomIntFromInterval(50, 150) / 100

    kill() {
        this.isAlive = false
    }

}

function generatePlayers(amount) {

    let players = []

    for (let i = 1; i <= amount; i++) {
        players[i - 1] = new Player(i)
    }

    return players

}

// function showDeaths(deadPlayers) {

//     console.log("---------------------------------DEATHS---------------------------------\n")

//     for (let i = 0; i < deadPlayers.length; i++) {

//         const player = deadPlayers[i].player
//         const round = deadPlayers[i].roundKilled
//         const cause = deadPlayers[i].cause

//         if (cause === "moved")
//             console.log(`Player ${player.number} was eliminated in round ${round}`)
//         else
//             console.log(`Player ${player.number} was eliminated for not reaching the finish line in time`)
//     }

//     console.log("\n------------------------------------------------------------------------")

// }

function redLightGreenLight(players) {

    const totalDistance = 100
    let timeLeft = 300
    let canMove = true
    let moveTimer = 6
    let round = 1

    let playersData = []
    let deaths = []

    function checkLineRecursively(player) {

        let line = []

        let playerBehind;

        do {
            playerBehind = playersData[player.number].personBehind
            if (playerBehind)
                player = playerBehind
        } while (playerBehind)

        line.unshift(player)

        let playerInFront;

        do {
            playerInFront = playersData[player.number].personInFront
            if (playerInFront) {
                player = playerInFront
                line.unshift(player)
            }
        } while (playerInFront)

        return line

    }

    function checkAvailableLines(player) {

        for (let i = 0; i < players.length; i++) {

            let otherPlayer = players[i]

            if (otherPlayer === player || !otherPlayer.isAlive || playersData[otherPlayer.number].hasFinished) continue

            let line = checkLineRecursively(otherPlayer)
 
            if (line.length > 1 && !line.includes(player))
                return true

        }

        return false

    }

    for (let i = 0; i < players.length; i++) {
        let player = players[i]
        if (!player.isAlive) continue
        playersData[player.number] = { walkSpeed: player.fitness / 10 + 0.6, distanceTraveled: 0, hasFinished: false, pushCooldown: 0, personInFront: false, personBehind: false }
    }

    console.log(language === "EN-US" ? "\n----------------------GREEN LIGHT!----------------------\n" : "\n---------------------------------------------------------\n")

    for (timeLeft; timeLeft > 0; timeLeft--) {

        if (canMove && moveTimer > 0)
            moveTimer--
        else if (!canMove && moveTimer < 6)
            moveTimer++
        else if (moveTimer === 0) {
            canMove = false
            console.log(language === "EN-US" ? "\n-----------------------RED LIGHT!-----------------------\n" : "\n-----------------BATATINHA FRITA, 1 2 3!-----------------\n")
        } else if (moveTimer === 6) {
            prompt(language === "EN-US" ? "\n(Press Enter to continue!) " : "\n(Pressione Enter para continuar!) ")
            console.clear()
            canMove = true
            console.log(language === "EN-US" ? "\n----------------------GREEN LIGHT!----------------------\n" : "\n---------------------------------------------------------\n")
            round++
        }

        for (let i = 0; i < players.length; i++) {

            let player = players[i]
            let playerData = playersData[player.number]

            if (playerData.hasFinished || !player.isAlive)
                continue

            if (playerData.personInFront) {

                if (!playerData.personInFront.isAlive) {
                    console.log(language === "EN-US" ? `Since player ${playerData.personInFront.number} was eliminated, player ${player.number} isn't hiding behind anyone!` : `Já que o jogador ${playerData.personInFront.number} foi eliminado, o jogador ${player.number} não está mais se escondendo atrás de ninguém!`)
                    playersData[playerData.personInFront.number].personBehind = false
                    playerData.personInFront = false
                } else if (playerData.distanceTraveled >= totalDistance - 20) {
                    console.log(language === "EN-US" ? `Player ${player.number} has stopped hiding behind player ${playerData.personInFront.number}` : `O jogador ${player.number} não está mais se escondendo atrás do jogador ${playerData.personInFront.number}!`)
                    playersData[playerData.personInFront.number].personBehind = false
                    playerData.personInFront = false
                }

            }

            if (playerData.personBehind) {
                if (!playerData.personBehind.isAlive) {
                    playersData[playerData.personBehind.number].personInFront = false
                    playerData.personBehind = false
                }
            }

            if (!canMove) {
                if (Math.random() < 0.5 / 100 && !playerData.personInFront) {
                    player.kill()
                    deaths.push({ player: player, roundKilled: round, cause: "moved" })
                    console.log(language === "EN-US" ? `Player ${player.number} was eliminated!` : `O jogador ${player.number} foi eliminado!`)
                } else if ((player.desperation + player.hostility - player.empathy) / 6 > 0.5 && playerData.pushCooldown === 0 && playerData.distanceTraveled < totalDistance - 20) {
                    if (Math.random() < 1 / 100) {

                        let playerLine = checkLineRecursively(player)

                        let playerPushed;

                        do {
                            playerPushed = players[randomIntFromInterval(0, players.length - 1)]
                            if (!playerLine.includes(playerPushed)){
                                playerPushed = checkLineRecursively(playerPushed)[checkLineRecursively(playerPushed).length-1]
                            }else if (playerLine.indexOf(player) > 0) {
                                playerPushed = playersData[player.number].personInFront
                            }
                        } while (playerPushed === player || !playerPushed.isAlive || playersData[playerPushed.number].hasFinished || ((playerLine.indexOf(player) === 0) && (playerLine.includes(playerPushed) && playerLine.indexOf(playerPushed) > playerLine.indexOf(player))) || (playerLine.indexOf(player) > 0 && (!playerLine.includes(playerPushed) || playerLine.indexOf(playerPushed) > playerLine.indexOf(player))))
                    
                        let pushedLine = checkLineRecursively(playerPushed)

                        for (let i = pushedLine.indexOf(playerPushed); i >= 0; i--) {
                            playerPushed = pushedLine[i]
                            playerPushed.kill()
                            deaths.push({ player: playerPushed, roundKilled: round, cause: "pushed" })
                            console.log(language === "EN-US" ? `Player ${playerPushed.number} was eliminated! (Pushed by player ${player.number})` : `O jogador ${playerPushed.number} foi eliminado! (Empurrado pelo jogador ${player.number})`)
                        }
                        playerData.pushCooldown = 6
                    }
                }
            } else {
                playerData.distanceTraveled += playerData.personInFront && playerData.walkSpeed > playersData[playerData.personInFront.number].walkSpeed ? playersData[playerData.personInFront.number].walkSpeed : playerData.walkSpeed
                if (playerData.distanceTraveled >= totalDistance) {
                    playerData.hasFinished = true
                    console.log(language === "EN-US" ? `Player ${player.number} has cleared the game! (Time left: ${timeLeft})` : `O jogador ${player.number} concluiu o jogo! (Tempo restante: ${timeLeft})`)
                }
                if ((player.desperation + player.intellect) / 6 > 0.5 && !playerData.personInFront && playerData.distanceTraveled < totalDistance - 20) {
                    if (Math.random() < 1 / 100) {

                        let playerLine = checkLineRecursively(player)

                        let playerToHideBehind;
                        let joinLine = Math.random() < 1/4 && checkAvailableLines(player) ? true : false;
                        do {
                            playerToHideBehind = players[randomIntFromInterval(0, players.length - 1)]
                            playerToHideBehind = checkLineRecursively(playerToHideBehind)[checkLineRecursively(playerToHideBehind).length-1]
                        } while (playerToHideBehind === player || playerLine.includes(playerToHideBehind) || !playerToHideBehind.isAlive || playersData[playerToHideBehind.number].hasFinished || (joinLine && checkLineRecursively(playerToHideBehind).length < 2))
                        playerData.personInFront = playerToHideBehind
                        playersData[playerToHideBehind.number].personBehind = player
                        console.log(language === "EN-US" ? `Player ${player.number} is hiding behind player ${playerToHideBehind.number}!` : `O jogador ${player.number} está se escondendo atrás do ${playerToHideBehind.number}!`)
                    }
                }
            }

            if (playerData.pushCooldown > 0) {
                playerData.pushCooldown--
            }
        }
    }

    console.log(language === "EN-US" ? "\n-----------------------RED LIGHT!-----------------------\n" : "\n-----------------BATATINHA FRITA, 1 2 3!-----------------\n")

    for (let i = 0; i < players.length; i++) {
        let player = players[i]
        if (!player.isAlive)
            continue
        if (playersData[player.number].distanceTraveled < totalDistance) {
            player.kill()
            deaths.push({ player: player, roundKilled: null, cause: "time" })
            console.log(language === "EN-US" ? `Player ${player.number} was eliminated for not clearing the game in time!` : `O jogador ${player.number} foi eliminado por não concluir o jogo a tempo!`)
        }
    }

}

// function getDeathPercentage(players) {

//     let deadPlayers = 0

//     for (let i = 0; i < players.length; i++) {
//         let player = players[i]
//         if (!player.isAlive)
//             deadPlayers++
//     }

//     return parseInt((deadPlayers / players.length) * 100)

// }

do {
    console.clear()
    language = prompt("Choose your language/Escolha seu idioma (EN-US/PT-BR): ").toUpperCase()
} while (language !== "EN-US" && language !== "PT-BR")

console.clear()

let amount;
do {
    console.clear()
    amount = parseInt(prompt(language === "EN-US" ? "Choose the initial amount of players: " : "Escolha a quantidade inicial de jogadores: "))
} while (isNaN(amount) || amount <= 0)

console.clear()

let playerList = generatePlayers(amount)

redLightGreenLight(playerList)

// console.log(`\n${getDeathPercentage(playerList)}% of players were eliminated!`)