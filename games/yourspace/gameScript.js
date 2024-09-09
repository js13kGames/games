(()=>{
    let trendsLastRefresh = -TREND_REFRESH_TIME
function loop(t){
    window.requestAnimationFrame(t => {
        gainFollowers()
        dashboard.update()

        if(t - trendsLastRefresh > TREND_REFRESH_TIME){
            refreshTrends()
            trendsLastRefresh = t
        }
        loop(t)
    })
}
loop(0)
})()