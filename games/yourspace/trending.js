const nTrends = 3
const TRENDS_CURRENT = [] 


function refreshTrends(){
    trendingList.textContent = ''
    for(let i = 0; i < nTrends; i++){
        let iTrend
        do{
            iTrend = (Math.random() * (TRENDING_TOPICS.length - 1)).toFixed(0)
        }while(iTrend == undefined || TRENDS_CURRENT.includes(iTrend))
        TRENDS_CURRENT.push(iTrend)

        const trendElem = document.createElement('div')
        trendElem.innerHTML = `
            <div class="trend">${TRENDING_TOPICS[iTrend]?.title}</div>
        `
        trendingList.appendChild(trendElem)
    }
}