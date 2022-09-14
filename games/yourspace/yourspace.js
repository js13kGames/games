const GOAL      = 8e9
const dashboard = new Dashboard()

function distribute(likes,followers, seconds, callbackDuring, callbackFinish){
    const N_INTERVALS   = 14
    const DISTRIBUTION  = [.001,.005,.017,.044,.092,.15,.191,.191,.15,.092,.044,.017,.005,.001]

    let currentInterval = 0
    let loop = setInterval(()=>{
        if(currentInterval < N_INTERVALS){
            let newFollowers = followers  * DISTRIBUTION[currentInterval]
            let newLikes = likes * DISTRIBUTION[currentInterval++]
            dashboard.likes += newLikes
            dashboard.followers += newFollowers
            callbackDuring(newLikes, newFollowers)
        } else {
            clearInterval(loop)
            callbackFinish()
        }
    }, 1000*seconds/N_INTERVALS)
}
function gainFollowers(){
    document.documentElement.style.setProperty('--progress', `${dashboard.progress}%`)
}
function toggleScreen(show, hide){
    show.style.display = 'block'
    hide.style.display = 'none'
}
function showScreen(screen){
    screenFeed.style.display = 'none'
    screenTrending.style.display = 'none'
    screenFollowers.style.display = 'none'
    screen.style.display = 'block' 
}
function shortNumber(number){
    return number.toLocaleString(undefined,SHORT_NUMBER_FORMAT)
}